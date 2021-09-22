# 5.反馈操作

## 5.1 展示反馈的动作画板

> 基于 Vant 的 [ActionSheet 动作面板](https://vant-contrib.gitee.io/vant/#/zh-CN/action-sheet)组件，可以方便的渲染出反馈操作对应的区域

1. 在 `/src/components/ArtItem/` 目录下的 `ArtItem.vue` 组件中，声明动作面板对应的 DOM 结构：

```vue
<!-- 文章的信息 -->
<van-cell></van-cell>

<!-- 反馈的动作面板 -->
<van-action-sheet v-model="show" cancel-text="取消" :closeable="false">
  <div class="content">内容</div>
</van-action-sheet>
```

2. 在 `ArtItem.vue` 组件的 `data` 中声明布尔值 show，用来控制动作面板的显示与隐藏：

```js
data() {
  return {
    // 是否展示反馈面板
    show: false
  }
}
```

3. 在点击 `ArtItem.vue` 组件中的“关闭按钮”时，展示反馈的动作面板：

```vue
<!-- 关闭按钮 -->
<!-- 通过 .stop 事件修饰符，阻止点击事件的冒泡 -->
<van-icon name="cross" @click.stop="show = true" />
```

## 5.2 渲染一级反馈面板的结构

> 基于 Vant 的 [Cell 单元格](https://vant-contrib.gitee.io/vant/#/zh-CN/cell)组件，可以快速渲染出一级反馈面板的可选项

1. 在 `ArtItem.vue` 组件的反馈动作面板中，声明如下的**一级反馈面板**可选项：

```vue
<!-- 反馈的动作面板 -->
<van-action-sheet v-model="show" cancel-text="取消" :closeable="false">
  <!-- 第一级反馈面板 -->
  <div>
    <van-cell title="aaa" clickable class="center-title" />
    <van-cell title="aaa" clickable class="center-title" />
    <van-cell title="aaa" clickable class="center-title" />
  </div>
</van-action-sheet>
```

2. 在 `ArtItem.vue` 组件的 `<style>` 节点下，声明 `center-title` 类名：

```css
.center-title {
  text-align: center;
}
```

3. 在 `ArtItem.vue` 组件的 `data` 中声明如下的 `actions` 可选项数组：

```js
data() {
  return {
    // 第一个面板的可选项列表
    actions: [
      { name: '不感兴趣' },
      { name: '反馈垃圾内容' },
      { name: '拉黑作者' }
    ]
  }
}
```

4. 基于 `v-for` 指令，循环渲染一级反馈面板的可选项列表：

```vue
<!-- 反馈的动作面板 -->
<van-action-sheet v-model="show" cancel-text="取消" :closeable="false">
  <!-- 第一级反馈面板 -->
  <div>
    <!-- 循环渲染可选项 -->
    <van-cell :title="item.name" clickable class="center-title" v-for="item in actions" :key="item.name" />
  </div>
</van-action-sheet>
```

## 5.3 点击一级选项

1. 为一级选项绑定名为 `onCellClick` 的点击事件处理函数，同时把当前选项的 `name` 作为参数，传递给事件处理函数：

```vue
<!-- 一级选项 -->
<van-cell :title="item.name" clickable class="center-title" v-for="item in actions" :key="item.name" @click="onCellClick(item.name)" />
```

2. 在 `ArtItem.vue` 组件的 `methods` 节点下，声明 `onCellClick` 方法如下：

```js
methods: {
  // 一级选项的点击事件处理函数
  onCellClick(name) {
    if (name === '不感兴趣') {
      console.log('不感兴趣')
      this.show = false

    } else if (name === '拉黑作者') {
      console.log('拉黑作者')
      this.show = false

    } else if (name === '反馈垃圾内容') {
      // TODO：展示二级反馈面板
    }
  }
}
```
