# flex 指南

> 原文地址 [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## 背景

Flexbox 布局模式旨在提供一种更高效的布局形式，对容器内的元素自动对齐和分配空间，即使大小是未知或者是动态的。 （这就是为什么被叫做 flex）.

flex 布局的主要想法是使得容器可以调整包含元素的宽高属性，以便于更好的填充可用的空间（主要用于适应各种显示设备和屏幕尺寸）。Flex 容器会扩展项目以填充可用的可用空间，或收缩它们以防止溢出。

最重要的是，与常规布局相反，flexbox 布局与方向无关。尽管这些样式对于页面效果很好，但是它们缺乏灵活性（没有双关语）来支持大型或复杂的应用程序（尤其是在方向更改，调整大小，拉伸，缩小等方面）。

注意： Flexbox 布局最适合应用程序的组件和小规模布局，而 Grid 布局则用于较大规模的布局。

## 基础和术语

由于 flexbox 是一个完整的模块，而不是单个属性，因此它涉及很多事情，包括其整个属性集。其中一些属性要放在容器上（父元素，被称为 flex container）。 一些则要放在子元素上（被称为 flex item)。

如果常规的布局是基于 块级元素 和 行内元素的流式布局， 那 flex 布局就是基于 flex 流方向 的布局。请查看规范中的该图，解释 flex 布局背后的主要思想。

![flex 布局](https://css-tricks.com/wp-content/uploads/2018/11/00-basic-terminology.svg)

flex item 将沿主轴（从主轴起点到主轴结束）或交叉轴（从十字起点到十字轴结束）排放布局。

- 主轴 - flex 容器的主轴是 flex item 排列布局的轴。注意，它并不一定是水平方向的，可以通过 flex-direction 控制。
- main start | main end - flex item 从 main start 到 main end 放在容器中。
- main size flex 元素的宽和高，flex 元素的 main size 主要属性的是 width 和 height
- 交叉轴 垂直于主轴的轴称为交叉轴。其方向取决于主轴方向。
- cross-start | cross-end

## flex 容器的属性

### display

定义一个 flex 容器， 是 Inline 还是 block 取决于定义的值。为它的直接子元素提供一个弹性上下文。

```css
.container {
  display: flex; /* or inline-flex */
}
```

注意， css columns 布局属性，对 flex 容器不会生效。

### flex-direction

![flex direction](https://css-tricks.com/wp-content/uploads/2018/10/flex-direction.svg)

定义了 flex item 在容器中排列的主轴方向。Flexbox 是单向布局概念。可以想象为 flex item 主要以水平或者是垂直的方向布局排列。

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- row（默认）：在 ltr 时 从左到右；在 rtr 时从右到左 （css 属性 direction: rtl； 控制方向）
- row-reverse : 与 row 相反
- column: 和 row 类似，从上到下排列
- column-reverse: 和 column 相反，从底至顶排列

### flex-wrap

![flex wrap](https://css-tricks.com/wp-content/uploads/2018/10/flex-wrap.svg)

默认情况下, flex item 会被尝试在一排放下。 可以通过 flex-wrap 修改这个行为。

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

- nowrap: 默认值， 所有的 flex item 将会尝试在一行放下。
- wrap: flex item 将会从上到下多行排列开。
- wrap-reverse: flex item 将会从下到上多行排列开

### flex-flow

这是 flex-direction 和 flex-wrap 属性的简写。它们共同定义了 flex 容器的主轴和交叉轴。默认值为 row nowrap。`flex-flow: flex-direction flex-wrap|initial|inherit;`

```css
.container {
  flex-flow: row-reverse wrap;
}
```

### justify-content

![justify-content](https://css-tricks.com/wp-content/uploads/2018/10/justify-content.svg)

定义主轴上元素的对齐方式。当一行中的所有 flex item 都不是弹性改变或已达到最大大小时，它可以帮助分配剩余的剩余可用空间。当 flex item 超出一行是，它还能对 flex item 施加一些控制。

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly |
    start | end | left | right ... + safe | unsafe;
}
```

- flex-start: 默认值。元素将对于 flex-direction 定义的方向起始位置对齐。
- flex-end: 元素将对于 flex-direction 定义的方向结束位置对齐。
- start
- right
- left
- end
- center: 元素沿着主轴居中
- space-between： 元素在主轴上平均分配， 第一元素在起始位置， 最后一个元素在结束位置
- space-around: 元素在主轴上均匀分布，元素和元素之间的距离相同。第一个元素到开始位置的距离以及最后一个元素到结束位置的距离等于元素与元素之间距离的 1/2.
- space-evenly: 任意的间距都完全相同

请注意，浏览器对这些值的支持是不同的。在一些 edge 的版本上 `space-between` 没有得到支持。chrome 不支持 start/end/left/right。 最安全的值是 flex-start，flex-end 和 center。

### align-items

![align-items](https://css-tricks.com/wp-content/uploads/2018/10/align-items.svg)

align-items 定义了 flex-item 在交叉着上的定位方式。可以把它看成 `justify-content` 的交叉轴版本。

```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline | first baseline | last baseline
    | start | end | self-start | self-end + ... safe | unsafe;
}
```

- stretch: 拉伸去填充 flex 容器。 受宽度和高度限制
- flex-start / start / self-start: 从交叉轴的起始位置开始。 他们之前的区别在于 `flex-direction` 或者 `write-module` 的规则
- flex-end / end / self-end: 从交叉轴结束位置开始
- center： 在交叉轴上居中
- baseline: 根据基线对齐

### align-content

[align-content](https://css-tricks.com/wp-content/uploads/2018/10/align-content.svg)

当在交叉轴上还有剩余空间时，align-content 可以定义如何布局。和主轴的 justify-content 处理类似。

注意： 当只有一行时，这个属性无效

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | space-evenly |
    stretch | start | end | baseline | first baseline | last baseline + ... safe | unsafe;
}
```

## flex-item

### order

![flex-item](https://css-tricks.com/wp-content/uploads/2018/10/order.svg)

默认情况下, flex-item 将按默认顺序排列。order 属性可以控制 flex-item 出现的顺序。

```css
.item {
  order: 5; /* default is 0 */
}
```

### flex-grow

![flex-grow](https://css-tricks.com/wp-content/uploads/2018/10/flex-grow.svg)

flex-grow 使得 flex-item 在必要时可以增长。他可以设置为比例的无单位值。决定了 flex item 在 flex 容器中占用多少可用空间。
如果所有 flex item 的 flex-grow 都设置为 1，则 flex 容器中的剩余空间将平均分配给所有子项。如果其中一个子元素的值为 2，则剩余空间将占其他子元素的两倍（或者至少会尝试）。

```css
.item {
  flex-grow: 4; /* default 0 */
}
```

负数是无效的。

### flex-shrink

在必要时候缩小 flex-item 。

```css
.item {
  flex-shrink: 3; /* default 1 */
}
```

### flex-basis

定义了元素在分配剩余空间之前默认的大小。 它可以是长度（例如 20％，5rem 等）或关键字。auto 关键字的意思是“看看我的 width 或 height 属性”。 content 值表示根据 flex item 的内容来展示（此关键字尚未得到很好的支持，因此很难测试，也很难知道其兄弟值的表现 max-content，min-content 和 fit-content。）。

```css
.item {
  flex-basis: | auto; /* default auto */
}
```

如果设置为 0，则不会考虑内容周围的多余空间。如果设置为 auto，则多余的空间将根据其 flex-grow 值进行分配。

注意： 如果同时为元素设置了 flex-basis（非 auto）和 width（或 flex-direction：column 的高度），则 flex-basis 具有优先权。

## flex

flex 是 flex-grow, flex-shrink, flex-basis 的缩写。 默认值是 0 1 auto。 第二个和第三个参数（flex-shrink 和 flex-basis）是可选的。

```css
.item {
  flex: none | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
}
```
