//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data:{
    id_today:null,
    content_list:null,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
    swiperCurrent: 0,
    //加载提示
    hidden:false,
  },
  //获取用户信息
  myGetUserInfo: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://www.laohehe.cn/WebApi/oneLogin?',
            data: {
              code: res.code
            },
            success: function (res) {
              app.globalData.openid = res.data;
            }
          })
        } else {
          console.log('获取登录态失败!' + res.errMsg)
        }
      }
    })
    if (app.globalData.userInfo == null) {
      wx.getUserInfo({
        withCredentials: false,//是否带上登录态信息
        lang: '',
        success: function (res) {
          app.globalData.userInfo = res.userInfo;
          wx.request({
            url: 'https://www.laohehe.cn/WebApi/oneGetUserInfo',
            data:{
              openid: app.globalData.openid,
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
            },
            success: function(e){},
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function(){
    //当前日期
    var current_date = util.formatDate(new Date());
    this.setData({
      current_date: current_date,
      date: current_date//默认用户选定的日期为当前日期
    });
    this.getData();
    wx.stopPullDownRefresh()
  },
  //返回今日
  backToToday:function(){
    this.getData();
    this.setData({
      date: util.formatDate(new Date())
    });
  },
  //图片点击事件
  imgClick: function(){
    //console.log(this.data.swiperCurrent);
    var currentImg = this.data.swiperCurrent;
    wx.navigateTo({
      url: '../detail/detail?category=' + app.globalData.content_list[currentImg].category + '&item_id=' + app.globalData.content_list[currentImg].item_id + '&from=index',
    })
  },
  //swiperChange
  swiperChange: function(e){
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  onLoad: function () {
    this.myGetUserInfo();
    //当前日期
    var current_date = util.formatDate(new Date());
    this.setData({
      current_date:current_date,
      date: current_date//默认用户选定的日期为当前日期
    });
    this.getData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  getData:function(){
    var that = this; 
    app.globalData.currentDate = util.formatDate(new Date());
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/one?type=onelist',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let id_today = res.data.data[0];
        wx.request({
          url: 'https://www.laohehe.cn/WebApi/one?type=idlist&idlist=' + id_today,
          success: function (result) {
            app.globalData.date_photo = result.data.data.content_list[0];
            app.globalData.content_list = result.data.data.content_list;
            that.setData({
              content_list:result.data.data.content_list,
              imgUrls: [
                result.data.data.content_list[0].img_url,
                result.data.data.content_list[1].img_url,
                result.data.data.content_list[2].img_url,
                result.data.data.content_list[3].img_url
              ]
            })
            that.setData({
              hidden: true,
            })
          }
        })
      }
    })
  },
  bindDateChange: function(e){
    var that = this;
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/one?type=datelist&date=' + 
      e.detail.value,
      header: {
        'content-type': 'application/json'
      },
      success: function(result) {
        app.globalData.date_photo = result.data.data.content_list[0];
        app.globalData.content_list = result.data.data.content_list;
        that.setData({
          content_list: result.data.data.content_list,
          date: e.detail.value,
          imgUrls: [
            result.data.data.content_list[0].img_url,
            result.data.data.content_list[1].img_url,
            result.data.data.content_list[2].img_url,
            result.data.data.content_list[3].img_url
          ]
        })
      }
    })
    app.globalData.currentDate = e.detail.value;
  }
})

