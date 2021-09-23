# 6.频道管理

## 6.1 渲染频道管理的 DOM 结构

> 基于 Vant 提供的 [Popup 弹出层](https://vant-contrib.gitee.io/vant/#/zh-CN/popup)组件，可以方便地实现频道管理的弹出层效果

### 6.1.1 初步渲染频道管理的 DOM 结构

1. 在`/src/views/Home/Home.vue` 组件中，在频道管理的小图标下面，基于 `<van-popup>` 渲染出频道管理的弹出层：

```vue
<!-- 频道管理的小图标 -->
<van-icon name="plus" size="16" class="plus" @click="show = true" />

<!-- 频道管理的弹出层 -->
<van-popup v-model="show">内容</van-popup>
```

2. 在 `Home.vue` 组件的 `data` 中定义布尔值 `show`，用来控制弹出层的显示与隐藏：

```js
data() {
  return {
    // 省略其它数据项...

    // 控制频道管理弹出层的展示与隐藏
    show: false
  }
}
```

3. 在点击频道管理的小图标时，将 `show` 设置为 `true`，从而展示出频道管理的弹出层：

```vue
<!-- 频道管理的小图标 -->
<van-icon name="plus" size="16" class="plus" @click="show = true" />
```

4. 为 `<van-popup>` 组件绑定 `:close-on-click-overlay="false"` 属性，从而防止点击遮罩层时，弹出层自动关闭的效果：

```vue
<!-- 频道管理的弹出层 -->
<van-popup v-model="show" :close-on-click-overlay="false">内容</van-popup>
```

### 6.1.2 实现频道管理的基础布局

## 6.2 动态计算更多频道的列表数据

### 6.2.1 请求所有频道的列表数据

### 6.2.2 动态计算更多频道的数据

## 6.3 实现新增频道的功能

### 6.3.1 初步实现新增频道的功能

### 6.3.2 将频道数据存储到数据库

### 6.3.3 提示用户更新成功

## 6.4 实现删除频道的功能

### 6.4.1 控制删除的状态

### 6.4.2 渲染删除的图标

### 6.4.3 实现删除的功能

### 6.4.4 优化删除的功能

## 6.5 弹出层关闭时重置编辑的状态

## 6.6 实现频道的点击联动效果

## 6.7 分支的合并与提交
