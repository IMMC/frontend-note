# mvvm mvc mvp

为了解决图形界面应用程序复杂性管理问题而产生的应用架构模式。我们一般把视图层称为 view, 数据层称为 modal

## mvc

经典 mvc 模式，view 层对用户的操作，交给 controller 层处理，controller 层对数据进行处理，以及决定对 modal 如何进行处理。 modal 层通过观察者模式通知 view 层更新数据。

1. 通过 controller 层，把渲染逻辑和业务逻辑分离，controller 层处理业务
2. 观察者模式， modal 层可以通知 view 层进行更新

## mvp

mvp 模式在 mvc 模式下进行了改良。把 controller 层替换为了 Presenter 层。mvp 模式下，view 层依然把操作控制逻辑交给 Presenter 层处理。Presenter 层负责对 modal 层的更新操作。modal 层更新后，通过
观察者模式通知 Presenter 层。这里的区别在于，view 层不再监听 modal 层的变化。而是交由 Presenter 层处理。此时需要 view 层为 Presenter 层提供一套操作 view 的接口。Presenter 层在收到更新后，通过 view 层提供的接口，来更新 view。

mvp 模式的好处在于，操作控制逻辑完全交由 Presenter 层处理，这样 view 层可以不依赖特定的 modal, 只要提供操作 api 就可以实现组件的复用。

mvp 模式存在 Presenter 层臃肿的问题，因为无论是 view -> modal 的操作，还是 modal -> view 层的更新，都需要在一个地方完成

## mvvm

mvvm 模式是对 mvp 模式的改良，把 Presenter 层 替换成 view modal 层。这里的 view modal 层就是实现我们常说的数据双向绑定。把 view 和 modal 层的相互作用采用数据绑定的形式自动完成。
