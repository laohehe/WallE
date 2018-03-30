// pages/me/me.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },
  //预览微博二维码
  previewQR:function(e){
    wx.previewImage({
      urls: ['https://www.laohehe.cn/images/weiboMe.png'],
    })
  },
  //获取用户信息
  myGetUserInfo: function () {
    var that = this;
    if (app.globalData.userInfo!=null) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      wx.getUserInfo({
        withCredentials: false,//是否带上登录态信息
        lang: '',
        success: function (res) {
          app.globalData.userInfo = res.userInfo;
          that.setData({
            userInfo: res.userInfo
          })
          //console.log(res);
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果还没有执行登录操作
    if (app.globalData.userInfo == null) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: 'https://www.laohehe.cn/WebApi/oneLogin',
              data: {
                code: res.code
              },
              success: function (res) {
                app.globalData.openid = res.data;
                //console.log(app.globalData.openid);
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
    this.myGetUserInfo();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})