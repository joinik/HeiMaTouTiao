<template>
  <div class="home">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="../../assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="1.22666667rem">
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <article-list :channel-id="item.id"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小
    图标-->
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <van-popup v-model="show" :close-on-click-overlay="false">
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon name="cross" size="14" color="white" @click="show = false" />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '完成' : '编辑' }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in userChannel" :key="item.id">
                <!-- 用户的频道 Item 项 -->
                <div class="channel-item van-hairline--surround" @click="removeUserChannel(item)">
                  {{ item.name }}
                  <van-badge color="transparent" class="cross-badge" v-if="isDel">
                    <template #content>
                      <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="12" />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannels" :key="item.id">
                <div
                  class="channel-item van-hairline--surround"
                  @click="addChannel(item)"
                >{{ item.name }}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入ArticleList组件
import ArticleList from '@/components/ArticleList/ArticleList.vue'
// 按需导入 API 接口
import { getUserChannelAPI, getAllChannelAPI, updateUserChannelAPI } from '@/API/homeAPI'
export default {
  name: 'Home',
  components: {
    ArticleList
  },
  data () {
    return {
      // 标签页激活项的索引
      active: 0,
      // 用户的频道列表数组
      userChannel: [],
      // 控制频道管理弹出层的展示与隐藏
      show: false,
      // 所有的频道列表数据
      allChannel: [],
      isDel: false
    }
  },
  computed: {
    // 更多频道的数据
    moreChannels () {
      // 1. 对数组进行 filter 过滤，返回的是符合条件的新数组
      return this.allChannel.filter(item => {
        // 判断当前循环项，是否在 “我的频道” 列表之中
        const index = this.userChannel.findIndex(x => x.id === item.id)
        // 如果不在，则 return true，表示需要把这一项存储到返回的新数组之中
        if (index === -1) return true
      })
    }
  },
  methods: {
    async initUserChannel () {
      // 1. 调用 API 接口
      const { data: res } = await getUserChannelAPI()
      // console.log(res)
      // 2. 判断请求是否成功
      if (res.message === 'OK') {
        // 3. 为用户的频道列表赋值
        this.userChannel = res.data.channels
      }
    },

    // 获取所有频道的列表数据
    async initAllChannel () {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        // 将请求到的数据，转存到 allChannel 中
        this.allChannel = res.data.channels
      }
    },

    // 更新用户频道
    async updateUserChannel () {
      // 遍历用户频道  对每一个对象进行操作
      const channels = this.userChannel.filter(item => item.name !== '推荐').map((item, index) => {
        return {
          id: item.id,
          seq: index + 1
        }
      })

      // 看 channels = {id:  seq:}
      // console.log(channels)
      // console.log('用户频道', this.userChannel)

      const { data: res } = await updateUserChannelAPI(channels)

      if (res.message === 'OK') {
        // console.log(res)
        this.$notify({ type: 'success', message: '更新成功', duration: 1000 })
      }
    },

    // 添加频道
    addChannel (item) {
      this.userChannel.push(item)
      // 定义一个方法 专门用于 更新用户频道
      this.updateUserChannel()
    },

    // 移除 用户的 频道
    removeUserChannel (item) {
      if (this.isDel) {
        this.userChannel = this.userChannel.filter(x => x.id !== item.id)
        // 定义一个方法 专门用于 更新用户频道
        this.updateUserChannel()
      }
    }
  },
  created () {
    // 请求用户的频道列表数据
    this.initUserChannel()

    // 请求所有的频道列表数据
    this.initAllChannel()
  },
  beforeRouteLeave (to, from, next) {
    console.log('触发了 Home 组件的 beforeRouteLeave')
    from.meta.top = window.scrollY
    next()
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-top: 46px;
  padding-bottom: 50px;
}

.home .van-nav-bar {
  background-color: #007bff;
}

/* log样式 */
.home .logo {
  height: 80%;
}

/* 为 tabs 容器设置右 padding */
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}

/* .// 频道管理小图标的定位 */
.home .plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>
