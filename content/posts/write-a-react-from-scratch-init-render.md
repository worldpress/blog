---
title: React 初始化渲染
date: 2017-06-08
tags:
  - React
  - 从零开始
categories:
  - 思考总结
---

该文章将阅读 React 初始化渲染相关的代码，并实现一个简单的将 JSX 渲染到页面的功能。（不包括组件生命周期与事件处理相关部分）

<!--more-->

## 源码解析：渲染过程

### JSX 解析

我们知道在 React 组件`render()` 返回的是 JSX，而 JSX 将会被 babel 转换。JSX 将被转换为 `React.createElement(type, config, children)`的形式。

```js
// App.js
// 转换前
Class App extends Component {
    render() {
        return <h1 id='title'>Hello World<h1>
    }
}

// 转换后
var App = React.createClass({
    render() {
        return React.createElement('h1', {
            id: 'title'
        }, 'hello world')
    }
})
```

`React.createElement()` 的实现位于 [/src/isomorphic/classic/element/ReactElement.js](https://github.com/facebook/react/blob/15-stable/src/isomorphic/classic/element/ReactElement.js#L183)

这里的 `React.createElement()`是用来生成虚拟 DOM 元素，该函数对组件的属性，事件，子组件等进行了处理，并返回值为一个 `ReactElement` 对象（单纯的 JavaScript 对象，仅包括 type, props, key, ref 等属性）。

这恰好说明了 JSX 中的 `<h1 id='title'>hello world</h1>`实际上是 JavaScript 对象，而不是我们通常写的 HTML 标签。

### 渲染到页面

单单声明了组件而没有渲染到页面上我们是看不见的（废话），所以我们需要使用 `ReactDOM.render()`将其渲染到页面指定位置上。

```js
// index.html
<html>
    // ...
    <body>
        <div id='root'></div>
    </body>
</html>


// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'

ReactDOM.render(<App />, document.getElementById('root'))
```

`ReactDOM.render()` 的实现位于[ ](https://github.com/facebook/react/blob/master/src/renderers/dom/stack/client/ReactMount.js#L581)[/src/renderers/dom/client/ReactMount.js](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/client/ReactMount.js)

`ReactDOM.render()` 函数将会根据 `ReactElement` 的类型生成相对应的`ReactComponent` 实例，并调用其 `mountComponent()`函数进行组件加载（返回 HTML片段），递归加载所有组件后，通过 [setInnerHTML](https://github.com/facebook/react/blob/b1768b5a48d1f82e4ef4150e0036c5f846d3758a/src/renderers/dom/shared/setInnerHTML.js) 将 HTML 渲染到页面上。

判断需要生成那种 `ReactComponent`实例根据 `ReactElement` 对象的 type 属性来决定。对应 HTML 标签的 type 一般为字符串，而自定义的组件则是大写字母开头的组件函数（自定义组件需要 import，而 HTML 标签不需要）。

#### 生成 **ReactComponent**

React 中生成对应的 `ReactComponent`实例由 `instantiateReactComponent()`完成，其实现位于 [/src/renderers/shared/stack/reconciler/instantiateReactComponent.js](https://github.com/facebook/react/blob/15-stable/src/renderers/shared/stack/reconciler/instantiateReactComponent.js)

`ReactComponent` 分为 3 种：

* `ReactEmptyComponent`:  空组件（ReactElement 的 type 属性为 null 或 false 的组件），在浏览器中返回 `ReactDOMEmptyComponent`。

* `ReactHostComponent`: 原生组件（ReactElement 为string，number 或 ReactElement 的 type 属性为 string 的组件）。

  * `createInternalComponent()`：该函数用于创建原生组件，在浏览器中返回 `ReactDOMComponent`。

  * `createInstanceForText()` : 该函数用于创建纯文本组件，在浏览器中返回 `ReactDOMTextComponent`。

* `ReactCompositeComponent`: 自定义组件（ReactElement 的 type 属性为 function）

可以发现 React 与平台解耦，使用 `ReactEmptyComponent` 与 `ReactHostComponent`。而这两种组件会根据平台的不同生成不同的组件对象，在浏览器中则为 `ReactDOMEmptyComponent`、`ReactDOMComponent` 与 `ReactDOMTextComponent`。

它们通过 [/src/renderers/dom/stack/client/ReactDOMStackInjection.js](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/stack/client/ReactDOMStackInjection.js) 进行注入。

（ [/src/renderers ](https://github.com/facebook/react/tree/15-stable/src/renderers)路径下包含各个平台上不同的 ReactComponent 实现，包括 react-art/react-dom/react-native。）

## 从零开始：实现初始化渲染

### 设置 babel

首先我们需要了解 babel 如何转换 JSX：[React JSX transform](https://babeljs.io/docs/plugins/transform-react-jsx/)。

babel 可以通过`transform-react-jsx`插件来设置解析 JSX 之后调用的函数，默认解析为调用 `React.createElement()`。所以这就是为什么虽然在 JSX 代码中没有使用到 React，却仍然需要导入它。

通过配置 `transform-react-jsx`插件的 `pragma`选项可以修改解析后调用的函数。

```js
// 修改解析为调用 dom() 函数
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "dom" // 默认 pragma 为 React.createElement
    }]
  ]
}
```

babel 将会把 JSX 中的标签名作为第一个参数，把 JSX 中的标签属性作为第二个参数，将标签内容作为剩余的参数。传递这些参数给 `pragma` 选项设置的函数。

**PS: 为了方便起见，我们使用默认的解析为 React.createElement\(\)**

### 实现 createElement

`createElement()`接受至少 2 个参数：元素类型 type（字符串表示原生元素，函数表示自定义元素），元素设置 config。其他参数视为元素的子元素 children。并且该函数返回的是一个 `ReactElement` 对象，属性包括 type, props, key, ref。

```js
// element.js
class ReactElement {
    constructor(type, props, key, ref) {
        this.type = type
        this.props = props
        this.key = key
        this.ref = ref
    }
}

export function createElement(type, config, ...children)｛
    // ...
    return new ReactElement(type, props, key, ref)
｝
```

然后需要导出 `createElement`，才能够通过 `React.createElement()` 的方式调用。

```js
// index.js
import { createElement } from './element'

const React = {
    createElement,
}

export default React
```

`ReactElement`需要 props, key 与 ref 参数，这三个参数将通过处理 config 与 children 得到。

我们将从 config 中获取 key 与 ref（若它们存在的话），并且根据 config 得到 props \(去除一些不必要的属性\)，同时将 children 添加到 props 当中。

```js
export function createElement(type, config, ...children) {
  let props = {}
  let key = null
  let ref = null

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref
    // 当 key 为数字时，将 key 转换为字符串
    key = config.key === undefined ? null : '' + config.key

    for (let propsName in config) {
      // 剔除一些不需要的属性（key, ref, __self, __source）
      if (RESERVED_PROPS.hasOwnProperty(propsName)) {
        continue
      }

      if (config.hasOwnProperty(propsName)) {
        props[propsName] = config[propsName]
      }
    }

    props.children = children
  }

  return new ReactElement(type, props, key, ref)
}
```

除此之外，添加对 `defaultProps` 的支持。`defaultProps` 的使用方式如下：

```js
// App.js
class App extends Component {
}

App.defaultProps = {
    name: "ahonn"
}
```

当传入 App 组件的 props 中不包含 name 时，设置默认的 name 为 "ahonn"。具体实现：当 ReactElement 的 type 属性为组件函数且包含 defaultProps 时遍历 props，若 props 中不包含  defaultProps 中的属性时，设置默认的 props。

```js
export function createElement(type, config, ...children) {
    // ...
    if (type && type.defaultProps) {
        let defaultProps = type.defaultProps
        for (let propsName in defaultProps) {
            if (props[propsName] === undefined) {
                props[propsName] = defaultProps[propsName]
            }
        }
    }
}
```

目前为止完成了将 JSX 解析为函数调用（这部分由 babel 完成），调用 `React.createElement()` 生成 `ReactElement` 对象。

接下来将实现 `instantiateReactComponent()`，通过 ReactELemnt 生成相对应的 `ReactComponent` 实例。

### 实现工厂方法 instantiateReactComponent

`instantiateReactComponent(element)`接受一个参数 element，该参数可以是 ReactElement 对象，string，number，false 或者 null。

我们将只考虑 Web 端，而不像 React 一样使用适配器模式进行解耦。

ReactElement 生成相应 ReactComponent 实例的规则：

* element 为 null 或 false 时，生成 ReactDOMEmptyComponent 对象实例

* element 为 string 或者 number 时，生成 ReactDOMTextComponent 对象实例

* element 为 object

  * element.type 为 string 时，生成 ReactDOMComponent 对象实例

  * element.type 为 function（组件函数）时，生成 ReactCompositeComponent 对象实例

```js
// virtual-dom.js
export function instantiateReactComponent(element) {
  let instance = null
  if (element === null || element === false) {
    instance = new ReactDOMEmptyComponent()
  }

  if (typeof element === 'string' || typeof element === 'number') {
    instance = new ReactDOMTextComponent(element)
  }

  if (typeof element === 'object') {
    let type = element.type
    if (typeof type === 'string') {
      instance = new ReactDomComponent(element)
    } else if (typeof type === 'function'){
      instance = new ReactCompositeComponent(element)
    }
  }
  return instance
}
```

### 实现 ReactComponent

现在，我们需要有不同的 `ReactComponent` 类以供 `instantiateReactComponent()`使用。同时需要实现每个类的 `mountComponent()` 方法来返回对应的 HTML 片段。

**ReactDOMEmptyComponent**

`ReactDOMEmptyComponent` 表示空组件， `mountComponent()` 方法返回空字符串。

```js
class ReactDOMEmptyComponent {
  constructor() {
    this._element = null
  }

  mountComponent() {
    return ''
  }
}
```

**ReactDOMTextComponent**

ReactDOMTextComponent 表示 DOM 文本组件，`mountComponent()`方法返回对应的字符串。

```js
class ReactDOMTextComponent {
  constructor(text) {
    this._element = text
    this._stringText = '' + text
    this._rootID = 0
  }

  mountComponent(rootID) {
    this._rootID = rootID
    return this._stringText
  }
}
```

**ReactDOMComponent**

ReactDOMComponent 表示原生组件，即浏览器支持的标签（div, p, h1, etc.）。`mountConponent()` 方法返回对应的 HTML 字符串。

```js
class ReactDomComponent {
  constructor(element) {
    let tag = element.type

    this._element = element
    this._tag = tag.toLowerCase()
    this._rootID = 0
  }

  mountComponent(rootID) {
    this._rootID = rootID
    if (typeof this._element.type !== 'string') {
      throw new Error('DOMComponent\'s Element.type must be string')
    }

    let ret = `<${this._tag} `
    let props = this._element.props
    for (var propsName in props) {
      if (propsName === 'children') {
        continue
      }
      let propsValue = props[propsName]
      ret += `${propsName}=${propsValue}`
    }
    ret += '>'

    let tagContent = ''
    if (props.children) {
      tagContent = this._mountChildren(props.children)
    }
    ret += tagContent
    ret += `</${this._tag}>`
    return ret
  }
}
```

`ReactDOMComponent` 的 `mountComponent()`方法会相对复杂一点。具体实现思路是，通过 `ReactElement` 的 type 与 props 属性拼接对应的 HTML 标签。处理 props 的时候需要跳过 children 属性，因为需要将子组件放在当前组件中。

当存在子组件（children）时，调用 `_mountChildren(children)`将组件转换为对应的 HTML 片段。具体过程是遍历 children，转换为 `ReactComponent` 并调用其 `mountComponent()` 方法。

```js
_mountChildren(children) {
  let result = ''
  for (let index in children) {
    const child = children[index]
    const childrenComponent = instantiateReactComponent(child)
    result += childrenComponent.mountComponent(index)
  }
  return result
}
```

**ReactCompositeComponent**

ReactCompositeComponent 表示自定义的组件，`mountComponent()`方法将根据提供的组件函数（element.type）实例化，并调用该组件的 `render()`方法返回 `ReactElement` 对象。再通过`instantiateReactComponent()` 生成对应的 `ReactComponent`，最后执行该 `ReactComponent` 的`mountComponent()`方法。

```js
class ReactCompositeComponent {
  constructor(element) {
    this._element = element
    this._rootId = 0
  }

  mountComponent(rootID) {
    this._rootId = rootID
    if (typeof this._element.type !== 'function') {
      throw new Error('CompositeComponent\'s Element.type must be function')
    }

    const Component = this._element.type
    const props = this._element.props
    const instance = new Component(props)

    const renderedElement = instance.render()
    const renderedComponent = instantiateReactComponent(renderedElement)
    const renderedResult = renderedComponent.mountComponent(rootID)
    return renderedResult
  }
}
```

通过 ReactCompositeComponent 将之前的 ReactComponent 联系起来，并递归调用 `mountComponent`方法得到一段 HTML。最后 `render()`通过 node.innerHTML 将 HTML 字符串填到页面上对应的容器中。

### 实现 render

最后将之前的实现串起来，利用 innerHTML 将组件渲染到页面上。

```js
export function render(element, container) {
  const rootID = 0
  const mainComponent = instantiateReactComponent(element)
  const containerContent = mainComponent.mountComponent(rootID)

  container.innerHTML = containerContent
}
```

到这里就基本上简单的实现了 React 中将组件渲染到页面上的部分。可以通过一个简单的例子验证一下。

```js
// index.js
import React from './tiny-react'
import ReactDOM from './tiny-react'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

// App.js

import React, { Component } from './tiny-react'

class App extends Component {
  render() {
    return (
      <div>
        <span>It is Work!</span>
      </div>
    )
  }
}

export default App
```

页面上将显示 It is Work!

## 后记

虽然没有涉及到组件更新与组件生命周期，通过阅读 React 的源码基本上也对初始化渲染的过程有了一定的了解，希望对你有所帮助。

在此感谢 [preact](https://github.com/developit/preact), [react-lite](https://github.com/Lucifier129/react-lite), [react-tiny](https://github.com/CodeFalling/react-tiny) 等项目，它们为本文提供了很大帮助。

文中的所有代码均于 [tiny-react init-render](https://github.com/ahonn/tiny-react/tree/init-render) ，感谢阅读。

