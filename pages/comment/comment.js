// pages/comment/comment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTyep:null,
    currentItem_id:null,
    length: 0,
    //输入框内容
    comment:null,
  },
  getData:function(options){
    var that = this;
    this.currentType = options.type;
    this.currentItem_id = options.item_id;
    this.setData({
      currentTitle : that.currentTitle,
    })
  },
  //监听字数变化
  textChange:function(e){
    var len = parseInt(e.detail.value.length);
    this.setData({
      length:len,
    })
    this.comment = e.detail.value;
  },
  //监听输入框变化
  bindTextAreaBlur:function(e){
    this.setData({
      comment:e.detail.value
    })
    this.comment = e.detail.value;
  },
  //提交评论
  comnSubmit:function(e){
    var that = this;
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/oneComment',
      data:{
        methodType:'add',
        openid:app.globalData.openid,
        category:that.currentType,
        item_id:that.currentItem_id,
        date: app.globalData.currentDate,
        comment: that.comment,
      },
      success:function(){
        that.setData({
          comment:'',
          length:0,
        })
       wx.showModal({
         content: '评论成功',
         confirmText:'返回上层',
         cancelText:'继续评论',
         success:function(e){
           if(e.confirm){
             wx.navigateBack({
             })
           }
         }
       })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options);
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