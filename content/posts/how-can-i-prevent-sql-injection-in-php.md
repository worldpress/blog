---
title: 在 PHP 中如何预防 SQL 注入
date: 2015-12-21 13:22:28
tags:
  - PHP
  - SQL
categories:
  - 技术文章
---
> 翻译自 Stack Overflow: [How can I prevent SQL-injection in PHP?](http://stackoverflow.com/questions/60174/how-can-i-prevent-sql-injection-in-php) 中的高票答案

## Question
如果用户输入的数据没有经过修正，那么应用将会很容易受到 SQL 注入攻击，像下面的这个例子一样：
``` php
$unsafe_variable = $_POST['user_input'];

mysql_query("INSERT INTO `table` (`column`) VALUES ('$unsafe_variable')");
```
<!--more-->

上面的例子，会因为用户输入像 `value'); DROP TABLE table;--` 这样的数据，使得 SQL 语句变成：
```
INSERT INTO `table` (`column`) VALUES('value'); DROP TABLE table;--')
```

应该如何去预防这样的事情发生？

## Answer
**使用预处理语句以及参数化查询来预防 SQL 注入**

在发送到数据库前，对每一个参数进行解析。这种处理方式是不可能受到攻击者恶意 SQL 注入的。

有两种基本操作可以选择，来达到这个目的：

- 使用 PDO(PHP Data Objects)：支持所有的主流数据库
``` php
$stmt = $pdo->prepare('SELECT * FROM employees WHERE name = :name');

$stmt->execute(array('name' => $name));

foreach ($stmt as $row) {
    // do something with $row
}
```

- 使用 MySQLi：支持 MySQL 数据库
``` php
$stmt = $dbConnection->prepare('SELECT * FROM employees WHERE name = ?');
$stmt->bind_param('s', $name);

$stmt->execute();

$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    // do something with $row
}
```
如果连接到 MySQL 之外的数据库，有其他的驱动可以选择，例如 `PostgreSQL` 可以使用 `pg_prepare()` 和 `pg_execute()`。PDO 是一个比较普遍的选择，因为它可以兼容更多的数据库。

**正确的建立连接**
注意，当使用PDO访问MySQL数据库时，默认不使用预处理语句。要解决这个问题，需要禁用预处理语句的模拟 `ATTR_EMULATE_PREPARES` 。

> **PDO::ATTR_EMULATE_PREPARES:**
> 启用或禁用预处理语句的模拟。 有些驱动不支持或有限度地支持本地预处理。使用此设置强制PDO总是模拟预处理语句（如果为 TRUE ），或试着使用本地预处理语句（如果为 FALSE）。如果驱动不能成功预处理当前查询，它将总是回到模拟预处理语句上。 需要 bool 类型。

一个正确建立 PDO 连接的例子：
``` php
$dbConnection = new PDO('mysql:dbname=dbtest;host=127.0.0.1;charset=utf8', 'user', 'pass');

$dbConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
```

在上面的例子中错误模式并不是必要的，但建议添加它。这样脚本就不会因为一个致命错误而报错停止，让开发人员有机会去捕捉抛出的异常并进行处理。

第一个 `setAttribute()` 是告诉 PDO 禁用预处理语句的模拟，使用真正准备好的预处理语句。这确保语句与值不会在 PHP 解析之前就发送到 MySQL。尽管你可以在选项中设置字符集的构造函数，但是要注意，PHP版本 < 5.3.6，默认无视 DSN 的字符参数。

**额外说明**
SQL 语句会通过预处理解析以及数据库的编译。通过指定参数(例如 ? 或者 :name 之类的参数)，告诉数据库引擎那些是你想要过滤的。当执行语句时，预处理过的语句将会结合参数去执行。

最重要的是，参数值结合编译的语句之后，它不是一个 SQL 字符串。SQL 注入是通过恶意字符串创建 SQL 发送到数据库的一种攻击。所以分开发送实际的 SQL 参数，可以降低被注入的风险，避免造成一些不希望看到的结果。任何发送的参数，将会在使用预处理之后被当做是字符串。

在上面的例子中，如果变量 `$name` 的值是 `'Sarah'; DELETE FROM employees`，那么结果将会是查找字符串 `"'Sarah'; DELETE FROM employees"`，而且也将不会得到一个空表。（即是后面的 `DELETE FROM employees` 将被当成字符串，而不是当做 SQL 语句去执行）

> 使用预处理语句的另一个好处是，如果你在同一个会话中多次执行相同的语句，语句只会被解析和编译一次，在速度上也有一点提升。

下面是一个使用 PDO 来插入数据的例子：
``` php
$preparedStatement = $db->prepare('INSERT INTO table (column) VALUES (:column)');

$preparedStatement->execute(array('column' => $unsafeValue));
```

**动态查询**
动态查询依旧可以使用预处理语句去进行，对用某些不能参数化的数据，可以使用白名单来限制可能的值。例如：
``` php
// Value whitelist
  // $dir can only be 'DESC' or 'ASC'
$dir = !empty($direction) ? 'DESC' : 'ASC';
```

总之，对于用户输入的所有数据都应该在发送到数据库查询之前进行预处理，以此来过滤那些不安全的参数。使得不会因为被 SQL 注入攻击而产生意想不到的结果。

