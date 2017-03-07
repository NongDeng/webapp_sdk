//index.js
const polyv = require('../../utils/polyv.js');

Page({
  data: {
    video:{}
  },
  onLoad: function () {

    var that = this;
    var vid = "d81a899efa04137592e4670e45d18819_d";
    
    /*获取视频数据*/
    polyv.getVideo(vid, function(videoInfo){
      
      that.setData({
        video:{
          src:videoInfo.src[0]
        }

      });
    });

  }


})
