# eslint

## 介绍

eslint 代码检测工具，让代码符合代码规范。
基于[Espree](https://github.com/eslint/espree) 解析代码，根据 ast 来处理代码

## 配置文件

eslint 支持以下类型的配置文件:

1. js 文件
2. cjs 文件
3. yaml 文件
4. json 文件
5. .eslintrc 文件 ，可以使用 json 或者 yaml 语法 （eslint 官方不推荐）
6. package.json 使用 eslintConfig 字段

eslint 的规则是可以级联的，当目录下包含特定的 eslint 配置文件时，会优先使用当前目录下的 eslint 规则。以处理一个大项目不同的子项目的规则冲突。
可以通过 "root": true 来告诉 eslint 不需要向下继续寻找规则了。

## 配置字段解析

### parserOptions

解析选项，配置 js 解析选项。

```javascript
    {
        "parserOptions": {
            // es的版本 ， note: 不会自动启用ES6全局变量。类似 set , map
            "ecmaVersion": 6,
            // 模块化时，需要配置为 module
            "sourceType": "module",
            "ecmaFeatures": {
                "jsx": true
            }
        },
    }
```

### parser

配置 eslint 的词法解析器，默认使用[Espree](https://github.com/eslint/espree)。使用其他解析器。 常见 elsint 支持解析器：

1. [esprima](https://github.com/jquery/esprima)
2. [babel-eslint](https://github.com/babel/babel-eslint) eslint 默认解析器只能支持到最新的 es 标准， 而一些实验性的， 处于 stage 阶段的 以及
   ts , flow 等不能被解析。babel-eslint 把最终的 AST 被转换为 ESLint 可以理解的符合 ESTree 的结构。
3. [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint#readme)

### Processor

有一些插件会提供处理器，处理器会提取其他类型文件里的 js 交给 eslint 处理。

```javascript
    {
        "plugins": ["a-plugin"],
        "overrides": [
            {
                "files": ["*.md"],
                "processor": "a-plugin/markdown"
            }
        ]
    }
```

### overrides

覆盖 eslint 配置。对特定目录下文件采用特点规则。 例如，禁止 md 文件下的 js 文件的严格模式

```javascript
    {
        "overrides": [
            {
                "files": ["**/*.md/*.js"],
                "rules": {
                    "strict": "off"
                }
            }
        ]
    }
```

### env

配置代码可能所需要的运行环境，不同环境下 有不同的全局变量。

```javascript
{
    "env": {
        "browser": true,
        "node": true
    }
}
```

### globals

代码中可能遇到 引用全局变量，通过 globals 配置. 可以配置为 writable， readonly 或者 off 关闭。
例如以下规则. var1 全局变量可以进行写操作。 var2 只读。 var3 不可使用。

```javascript
{
    "globals": {
        "var1": "writable",
        "var2": "readonly",
        "var3": "off",
    }
}
```

### plugins

eslint 插件。ESLint 的扩展， 实现未在 ESLint 核心中实现的规则。

### extends

通过 extends 字段 引入其他已经配置好的 eslint 配置。 值可以是字符串 或者是数组。常见 eslint 扩展：

1. (airbnb)[https://github.com/airbnb/javascript]

### rules

eslint 本身包含大量配置。允许通过 rules 字段怕来控制规则. 0 --> off, 1 --> warn, 2 ---> error. 如果该规则 提供其他配置参数， 可通过数组传递

```javascript
    {
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

### Inline Comments

通过注释形式标明文件的处理规则

## prettier

prettier 是代码美化工具，同样会对代码做格式化处理。这可能会与 eslint 的规则产生冲突. 通过引入 (eslint-config-prettier)[https://github.com/prettier/eslint-config-prettier]
可以解决冲突问题

```javascript
    {
        "extends": [
            "some-other-config-you-use",
            "prettier"
        ]
    }
```
