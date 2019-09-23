<template>
  <div id="product">
    <morecolor></morecolor>
    <div class="content">
      <div class="wow zoomIn" :data-wow-delay="timerFunc(index)"
        v-for="(item,index) in list" :key='index'>
        <productitem :item.sync="item"></productitem>
      </div>
    </div>
  </div>
</template>

<script>
import morecolor from "src/components/morecolor/morecolor";
import productitem from "src/components/productitem/productitem";
import { WOW } from "wowjs";
import "animate.css";
export default {
  name: "product",
  components: {
    morecolor,
    productitem
  },
  data() {
    return {
      list: [
        {
          url: require("./images/opendoor.jpg"),
          name: "二兔开门（微信）",
          remark:
            "二兔开门，真的很神。<br /> 主要涵盖手机开门，蓝牙，邀请家人，管理员审核等功能（大概90多个页面），软件发出指令给中间件，中间件反馈开门成功或者失败反馈给软件"
        },
        {
          url: require("./images/zfb.png"),
          name: "二兔开门（ 支付宝）",
          remark:
            "二兔开门，真的很神。<br />支付宝版本的二兔开门，主要涵盖手机开门，邀请家人，管理员审核等功能（大概30个页面）"
        },
        {
          url: require("./images/act.jpg"),
          name: "二兔活动",
          remark:
            "开门有礼，多开多得。<br /> 主要对接二兔开门，通过🥕的虚拟货币来计量，可以参与九宫格抽奖，兑换获取等优惠活动"
        },
        {
          url: require("./images/iot.jpg"),
          name: "二兔物联+",
          remark:
            "二兔智能硬件物联平台<br /> 主要是家用门磁的绑定微信，家用门磁异常（用人进屋或者长时间未关门类型）报警，可定位门磁位置，分享家人第一时间也可以查看门磁状态及开关记录"
        },
        {
          url: require("./images/vistor.jpg"),
          name: "有客来访",
          remark:
            "访客登记就用有客来访<br /> 主要是访客功能，邀请访问和接受访问，反向扫码功能（在电梯出示二维码，电梯直达某层电梯），同时过期提醒功能"
        },
        {
          url: require("./images/sass.png"),
          name: "二兔物联管理平台",
          remark:
            "智能化平台<br /> 主要涵盖 动态菜单，组织和权限分配，部门管理，用户统计，开门统计，各种设备配置参数及检测，运营功能，报修功能，社区创建，社区管理员等诸多功能"
        },
        {
          url: require("./images/website.png"),
          name: "桑田智能官网",
          remark:
            "地址：<a href='http://www.doshine.com/' target='_blank'>http://www.doshine.com/</a>（PC浏览）<br /> 主要介绍公司这几年从事的产品及设备介绍，产品介绍，解决方案，以及招聘广告等板块"
        },
        {
          url: require("./images/tangdou.png"),
          name: "糖豆手机壳",
          remark:
            "空闲时间做的一个电商小程序，参与二次全新改版迭代，主导项目进行"
        },
        {
          url: require("./images/halobear.png"),
          name: "幻熊科技官网",
          remark:
            "地址：<a href='https://www.halobear.com/' target='_blank'>https://www.halobear.com/</a>（PC／移动浏览）<br /> 纯手写的响应式布局，该网站介绍了礼成，北极熊，智能一体机，行业活动等产品介绍"
        },
        {
          url: require("./images/fengshang.png"),
          name: "风尚婚礼人",
          remark:
            "主要介绍婚礼朋友圈，发单抢单，预约档期，人气榜单，团队的合作等功能"
        },
        {
          url: require("./images/booking.png"),
          name: "订货节",
          remark:
            "地址：<a href='https://cang.halobear.com/html/props/home' target='_blank'>传送门</a>（移动浏览） 主要介绍礼成各种舞台场景道具出租及购买，发货相关事宜"
        },
        {
          url: require("./images/wedding-webstite.png"),
          name: "幻熊·婚嫁云官网",
          remark:
            "地址：<a href='https://miniapp.halobear.cn/' target='_blank'>https://miniapp.halobear.cn/</a>（移动浏览）<br/>主要介绍小程序系列婚礼策划，婚纱摄影，四大金刚，婚宴酒店等诸多小程序及购买服务功能"
        },
        {
          url: require("./images/wfc2017.png"),
          name: "wfc2017峰会（西安举办）",
          remark:
            "地址：<a href='http://wfc2017.halobear.com/user/forum' target='_blank'>点击我</a>（移动浏览）<br/>主要介绍峰会日程，选座购票，金熊奖，产业博览，图片直播等功能。PS：2018年(H5)，2019年(小程序：幻熊科技)的模版和2017年基本一样"
        },
        {
          url: require("./images/yitiji.jpg"),
          name: "一体机",
          remark:
            "类似银行叫号设备，无法浏览，只能在一体机设备浏览。主要浏览礼成各类套餐价格，道具介绍，下单功能"
        },
        {
          url: require("./images/cry.png"),
          name: "后台管理项目",
          remark:
            "由于前公司服务器更换等原因，项目已无法登录，这样大大小大小的后台管理系统做了差不多20多个，技术栈：angular 1.x"
        },
        {
          url: require("./images/cry.png"),
          name: "H5项目",
          remark:
            "由于前公司服务器更换等原因，项目已无法登录，大大小小的活动项目有20多个，基本一个活动对应一个后台，技术栈： vue2.0。PS：很多项目都是H5一份对应小程序一份"
        },
        {
          url: require("./images/licheng.png"),
          name: "礼成App",
          remark:
            "主要介绍酒店，商家套餐，以及成熟的案例展示，对应的H5的版本已失效"
        },
        {
          url: require("./images/aien.png"),
          name: "艾恩婚礼",
          remark: "主要介绍案例，场地，活动，预约等功能，以展示型为主的小程序"
        }
      ]
    };
  },
  methods: {
    wowInit() {
      let wow = new WOW({
        live: false
      });
      wow.init();
    },
    timerFunc(index) {
      return `${100 * index}ms`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.wowInit();
    });
  }
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/common.scss";

#product {
  padding-bottom: 100px;
  background: $color-bg;
}
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
}
</style>
