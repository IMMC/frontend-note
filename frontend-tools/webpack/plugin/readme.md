# webpack plugin

webpack plugin 通过 webpack 暴露 webpack 构建过程的各个阶段的 hooks，开发人员可以将自己的行为引入 webpack 的构建过程。

## compiler

compiler 对象，每次 webpack 启动的构建实例，会在实例化的过程中，调用相应的 hooks.

### 关键 hooks

1. entryOption webpack 处理 options 结束后调用
2. run 开始进入编译阶段
3. compile 开始编译，在实例化 compilation 之前
4. compilation compilation 建立完成开始调用
5. emit 在构建完成，输出编译后的资源之前开始调用
6. done 整个编译流程完成时候调用

## compilation

compiler 每次开始一次编译时，会创建 compilation 对象。 compilation 实例上可以访问所有的编译资源和模块。对模块进行 hash, 优化， chunk。

### 关键 hooks

1. buildModule 在构建一个 module 时触发
2. optimizeModules 在优化模块时触发，plugin 可以在这一阶段对 module 进行优化
3. optimizeChunks 对 chunk 进行优化
4. processAssets 对 chunk 后的资源进行操作

## 简单 plugin

```javascript
class HelloWorldPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Hello World Plugin', (
      stats /* stats is passed as an argument when done hook is tapped.  */
    ) => {
      console.log('Hello World!');
    });
  }
}
```

## 实现在每一个文件前都加上 banner 标识

```javascript
class BannerPlugin {
  // 只接受 options 是字符串的形式
  constructor(options) {
    this.bannerText = options;
  }

  apply(compiler) {
    const banner = this.bannerText;

    compiler.hooks.compilation.tap('myBanner', compilation => {
      compilation.hooks.optimizeChunksAssets.tap('bannerPlugin', chunks => {
        for (const chunk of chunks) {
          for (const file of chunk.files) {
            // 外部函数  ConcatSource， 拼接文件内容
            compilation.updateAsset(file, old => new ConcatSource(banner, '\n', old));
          }
        }
      });
    });
  }
}
```

## Tapable

webpack 使用了 tapable 来做编译生命周期 hooks 的管理。类似于 eventEmit, 事件发布和订阅.

通过 tapable 把 webpack 的流程和实现分离开来，可以看做 webpack 其实是一大堆 plugin 在运行。
