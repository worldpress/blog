---
title: Redux 源码解析
date: 2017-07-04 17:44:24
tags:
  - Redux
  - React
categories:
  - 思考总结
---

## 三大原则
- 单一数据源（store）
- state 只可读（只能通过 Reducer 生成新 State）
- 使用纯函数执行修改（Reducer 必须为纯函数，无副作用）

<!--more-->

## 单向数据流
- `dispatch` 触发 action 传递数据，但应该尽量减少传递的数据
- 如果有 middleware，在 action 发起之后，到达 reducer 之前执行
- 到达 reducer 之后，根据 action type 返回新 state

## 源码解析
Redux 提供的 API 主要有：
- `createStore`: 创建 store 以及提供相关操作
- `combineReducers`: 合并不同的 reducer 函数
- `applyMiddleware`: 添加 Redux 中间件
- `bindActionCreators`: bind action 到组件中

### createStore
`createStore` 用来创建 Redux store，用于存放所有的 state。

通过 `const store = createStore(reducer, initialState)` 创建 store，只能通过 dispatch action 的方式来改变 state。同时提供了 `getState`，`subscribe` 等方法。

```js
export default function createStore(reducer, preloadedState, enhancer) {
  // ...

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  // ...

  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

当使用 `createStore` 方法时，`dispatch` 了名为 `@@redux/INIT` 的 action。表示已经初始化了 store。

`dispatch` 方法的实现：
```js
  function dispatch(action) {
    // ...

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }
```

`currentState = currentReducer(currentState, action)` 执行 action 对应的 reducer 操作产生新的 state，如果有监听函数的话，按顺序触发监听函数。

监听函数由 `subscribe` 方法添加，`subscribe` 方法的返回一个 `unsubscribe` 函数，用来取消监听。

`subscribe` 方法的具体实现:
```js
function subscribe(listener) {
  if (typeof listener !== 'function') {
    throw new Error('Expected listener to be a function.')
  }

  let isSubscribed = true

  ensureCanMutateNextListeners()
  nextListeners.push(listener)

  return function unsubscribe() {
    if (!isSubscribed) {
      return
    }

    isSubscribed = false

    ensureCanMutateNextListeners()
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
  }
}
```

实际上 `subscribe` 仅是在 `nextListeners` 中添加想要执行的监听函数，并返回了用于删除该函数的 `unsubscribe` 方法


### combineReducers
`combineReducers` 用于合并不同的 reducer 函数，返回唯一的一个 reducer 函数供 `createStore` 使用

```js
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

	// ...

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  // ...

  return function combination(state = {}, action) {
    // ...

    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
	  // ...
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
```

首先处理传入的 reducer 对象（包含不同的 reducer 函数），得到键值为 function 类型的对象 `finalReducers` 与一个包含其键的数组 `finalReducerKeys`。

`combineReducers` 返回一个 `reducers` 函数用于处理 action，循环所有的 reducers 传入 action 进行处理，当 state 不变时，返回原来的 state

### applyMiddleware
`applyMiddleware` 的作用是添加中间件并执行中间件，主要是通过 `compose` 函数将所有的中间件串起来

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

重点是 `funcs.reduce((a, b) => (...args) => a(b(...args)))` ，通过函数式编程中常见的 `f(g(args))` 形式串起来，返回一个函数，函数由内到外执行传入之前传入的函数数组，函数的参数将会传递到第一个执行的函数中。

简单的例子：
```js
var f1 = function(a) {
	console.log('f1: '+ a)
	return a * 10
}

var f2 = function(a) {
	console.log('f2: ' + a)
	return a + 1
}
const funcs = [f1, f2]

const func = funcs.reduce((a, b) => (...args) => a(b(...args)))
func(1)
```
![compose](https://ahonn-me.oss-cn-beijing.aliyuncs.com/images/6vttf.jpg)

在 applyMiddleware 中 `dispatch = compose(...chain)(store.dispatch)`，即传入 compose 返回的函数的参数为 store 原来的 dispatch 函数。

也就是说，添加了中间件后，执行 dispatch 函数将会首先依次执行传入的中间件, 最后再执行原先的 `store.dispatch`

关于 Redux midddleware 有篇文章写得很不错：[compose and middleware 源码分析](https://github.com/asd0102433/blog/issues/1)

### bindActionCreators
`bindActionCreators` 方法说白了就是把 action creators 转成拥有同名 keys 的对象，并使用 dispatch 将对象包裹起来，从而能够直接调用函数 dispatch action

```js
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  // ...

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```

这部分得源码很简单，只是简单的判断 actionCreators，是对象的话就返回一个键值为绑定了 dispatch 的函数的对象

### 思考总结
很久之前就学会了 Redux 的『使用』，但是却不明白到底是什么实现的，只知道应该那样使用。

阅读了源码之后对 Redux 整个流程更加清晰，有利于之后的使用。也更加理解 Redux 单向数据流的这种思想，虽然使用上更加繁琐，但是如果数据复杂起来，这种单向数据流的管理方式还是利大于弊的。

**参考链接**
- [Redux 中文文档](http://cn.redux.js.org/index.html)
- [compose and middleware 源码分析](https://github.com/asd0102433/blog/issues/1)
