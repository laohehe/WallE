// pages/more/more.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_list: null,
    //加载提示
    hidden: false,
  },
  //获取当前用户的收藏信息
  getData:function(){
    var that = this;
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/oneGetCollected',
      data:{
        openid:app.globalData.openid,
      },
      success:function(res){
        that.setData({
          content_list : res.data
        })
        for(var i =0;i<res.data.length;i++)
        {
          if(res.data[i].category == 0)
          {
            app.globalData.collectedPhotoList.push(res.data[i])
          }
        }
        that.setData({
          hidden: true,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getData();
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
    this.getData();  
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