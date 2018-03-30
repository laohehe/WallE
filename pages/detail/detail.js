// pages/detail/detail.js
var app = getApp();
var WxParse = require("../../lib/wxParse/wxParse.js");
var isReady = false;
var audioCitx = null;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //收藏和评论参数
    collectionStatus: false,
    collectionNum: 0,
    commentNum: 0,
    //当前文章种类
    currentType: null,
    //当前文章item_id
    currentItem_id: null,
    //评论列表
    comnListLogic: null,
    //页面加载提示
    hidden: false,
    //是否是音乐界面
    isMusic: false,
    //当前音乐的播放进度
    currentMicTime: null,
    //当前播放的音乐信息
    currentCover: null,
    currentSrc: null,
    currentTitle: null,
    currentAuthor: null,
  },
  //预览图片
  previewImg:function(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.imgurl],
    })
  },
  //分享函数
  onShareAppMessage: function (res) {
    wx.showModal({
      content: '当前仅支持小程序级别的分享o(╥﹏╥)o',
      confirmText: '好的',
      success: function (e) {
        if (e.confirm) {
          return {
            title: 'Walle阅读',
            path: '/pages/index/index',
            success: function () {
              //转发成功
            }
          }
        }
      }
    })
  },
  //取消收藏
  cancelCollect: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/oneCollect',
      data: {
        method: 'cancel',
        openid: app.globalData.openid,
        date: app.globalData.currentDate,
        category: that.currentType,
        item_id: that.currentItem_id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          collectionStatus: false,
          collectionNum: that.data.collectionNum - 1,
        })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 1000,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //收藏文章
  collect: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/oneCollect',
      data: {
        method: 'add',
        openid: app.globalData.openid,
        date: app.globalData.currentDate,
        category: that.currentType,
        item_id: that.currentItem_id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          collectionStatus: true,
          collectionNum: that.data.collectionNum + 1,
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1000,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //评论
  comment: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../comment/comment?type=' + that.currentType + '&item_id=' + that.currentItem_id,
    })
  },
  //点赞评论
  comnStar: function (e) {
    var that = this;
    //console.log(e);
    //根据当前用户的openid 和comnid 进行点赞评论 功能
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/oneComment',
      data: {
        methodType: 'starComn',
        openid: app.globalData.openid,
        comnId: e.currentTarget.dataset.comnid,
      },
      success: function (res) {
        that.commentListLogic[e.currentTarget.dataset.index].starnum++ ,
          that.commentListLogic[e.currentTarget.dataset.index].isStar = true;
        that.setData({
          commentListView: that.commentListLogic,
        })
      }
    })
  },
  MusicStart: function (e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    var that = this
    that.setData({
      progress: progress
    })
    that.currentMicTime = e.detail.currentTime
    //console.log('音乐播放进度为：'+progress+'%')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options);
  },

  getData: function (options) {
    var that = this;
    this.currentType = options.category;
    this.currentItem_id = options.item_id;
    if (options.category == 0 && options.from == "index") {
      that.setData({
        category: options.category,
        photoDetail: app.globalData.date_photo
      })
      that.setData({
        hidden: true,
      })
    } else if (options.category == 0 && options.from == "collect") {
      for (var i = 0; i < app.globalData.collectedPhotoList.length; i++) {
        if (app.globalData.collectedPhotoList[i].item_id == options.item_id) {
          that.setData({
            category: options.category,
            photoDetail: app.globalData.collectedPhotoList[i]
          })
          //更改当前全局变量的日期
          app.globalData.currentDate = util.formatDate(new Date(app.globalData.collectedPhotoList[i].post_date));
        }
      }
      that.setData({
        hidden: true,
      })
    } else {
      //获取文章详细信息
      wx.request({
        url: 'https://www.laohehe.cn/WebApi/one?type=' + options.category + '&item_id=' + options.item_id,
        success: function (res) {
          //更改当前全局变量的日期
          if (options.from == "collect") {
            switch (options.category) {
              case 1:
                app.globalData.currentDate = util.formatDate(new Date(res.data.data.hp_makettime))
                break;
              case 2:
                app.globalData.currentDate = util.formatDate(new Date(res.data.data.maketime))
                break;
              case 3:
                app.globalData.currentDate = util.formatDate(new Date(res.data.data.question_makettime))
                break;
              case 4:
                app.globalData.currentDate = util.formatDate(new Date(res.data.data.maketime))
                break;
              case 5:
                app.globalData.currentDate = util.formatDate(new Date(res.data.data.input_date))
                break;
            }
          }
          that.setData({
            category: options.category,
            oneDetail: res.data.data,
          })
          //连载的情况
          if (options.category == 2) {
            that.setData({
              hp_content: WxParse.wxParse('hp_content', 'html', res.data.data.content, that, 5)
            })
          } else if (options.category == 3) {
            //问答
            that.setData({
              question_content: WxParse.wxParse('question_content', 'html', res.data.data.question_content, that, 5),
              answer_content: WxParse.wxParse('answer_content', 'html', res.data.data.answer_content, that, 5)
            })
          } else if (options.category == 4) {
            //音乐
            that.isMusic = true;
            that.setData({
              listen_file: res.data.listen_file,
              story: WxParse.wxParse('story', 'html', res.data.data.story, that, 5)
            })
            that.currentCover = res.data.data.cover;
            that.currentSrc = res.data.listen_file;
            that.currentTitle = res.data.data.title;
            that.currentAuthor = res.data.data.author.user_name;
            if (wx.getBackgroundAudioManager().src == that.currentSrc) {
              that.currentMicTime = wx.getBackgroundAudioManager().currentTime;
              wx.createAudioContext('WallEAudio').seek(that.currentMicTime);
              wx.getBackgroundAudioManager().stop();
              wx.createAudioContext('WallEAudio').play();
            }
          } else if (options.category == 5) {
            //影视
            that.setData({
              content: WxParse.wxParse('content', 'html', res.data.data.data[0].content, that, 5),
              movieDetail: res.data.data.data[0]
            })
          } else {
            that.setData({
              hp_content: WxParse.wxParse('hp_content', 'html', res.data.data.hp_content, that, 5)
            })
          }
          that.setData({
            hidden: true,
          })
        }
      })
    }
    //获取文章点赞数和评论信息
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/getInfoOfArticle',
      data: {
        openid: app.globalData.openid,
        date: app.globalData.currentDate,
        category: that.currentType,
        item_id: that.currentItem_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          collectionNum: res.data.collectionNum,
          collectionStatus: res.data.isCollected,
          commentNum: res.data.commentNum,
        })
      }
    })
    //获取评论信息
    wx.request({
      url: 'https://www.laohehe.cn/WebApi/oneComment',
      data: {
        methodType: 'getComnByDate',
        category: that.currentType,
        item_id: that.currentItem_id,
        date: app.globalData.currentDate,
      },
      success: function (res) {
        that.commentListLogic = res.data;
        that.setData({
          commentListView: that.commentListLogic,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log('detail-onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log('detail-onShow')
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
    var that = this;
    if (that.isMusic && that.currentMicTime > 0) {
      wx.showModal({
        content: '是否进入后台播放？',
        confirmText: '是',
        cancelText: '否',
        success: function (e) {
          if (e.confirm) {
            //console.log(that.currentMicTime)
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            backgroundAudioManager.title = that.currentTitle
            backgroundAudioManager.epname = that.currentTitle
            backgroundAudioManager.singer = that.currentAuthor
            backgroundAudioManager.coverImgUrl = that.currentCover
            backgroundAudioManager.src = that.currentSrc//设置了src 之后会自动播放
            backgroundAudioManager.startTime = that.currentMicTime
          }
        }
      })
    }
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

})