# webpack plugin

webpack plugin 通过 webpack 暴露 webpack 构建过程的各个阶段的 hooks，开发人员可以将自己的行为引入 webpack 的构建过程。

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
