
var polyvVodPlayer = {
	version:20170307,
	jsonHost:"https://router.polyv.net/secure/",
	/*是否预览模式*/
	isPreviewMode:false,
	videoId:"",
	/*获取videojson数据*/
	getVideo:function(vid,callback, ts, sign){
		this.loadJson(vid, callback, ts, sign);
	},
	getPreviewVideo:function(vid,callback, ts, sign){
		this.isPreviewMode = true;
		this.loadJson(vid, callback, ts, sign);
	},
	loadJson:function(vid, callback, ts, sign){

		var data = {
			timeoutflow:false,
			outflow:false
		};

		if(vid==""){
			data = {
				error:"vid不能为空"
			}
			callback(data);
			return;
		}

		var that = this;
		that.videoId = vid;
		that.ts = ts;
		that.sign = sign;
		
		wx.request({
			url: that.jsonHost + vid + ".js",
			method: 'GET',
			success: function(res){

				if(res.data.timeoutflow == "true"){
					/*过期*/
					data.timeoutflow = true;

				}else if(res.data.outflow == "true"){
					/*没流量*/
					data.outflow = true;
				}else{
					data.poster = res.data.first_image;
	        		data.title = res.data.title;
	        		data.teaser_url = res.data.teaser_url;
			        data.catatree = res.data.catatree;
			        data.adMatter = res.data.adMatter;
			        data.ratio = res.data.ratio;

			        data.poster = that.proxy(data.poster);
			        data.teaser_url = that.proxy(data.teaser_url);
			        data.adMatter = that.proxy(data.adMatter, "matterurl");
			        if(res.data.seed == 1){
			        	data.src = that.proxy(res.data.hls);
			        }else{
			          	data.src = that.proxy(res.data.mp4);
			        }


				}

				callback(data);

			},
			fail:function(res){

				data = {
					error:"视频数据获取失败"
				};

				callback(data);
			}
		});

	},
	proxy:function(data, name){
		var that = this;
		if(data.length==0){
			return "";
		}

		//字符串做路由
		if(typeof data == "string" ){
			return this.proxyUrl(data);
		}else
		{
			//json 做路由
			if(arguments[1]){

				for(var i = 0, len = data.length; i < len; i++){
					for(var key in data[i]){
						if(key == name){
							data[i][key] = this.proxyUrl(data[i][key]);
						}
					}
				}

			}else
			{
				//数组拆分做路由
				for(var i = 0, len = data.length; i < len; i++){
					if(this.isPreviewMode){
						var vpid = this.videoId.substring(0, 32);
						data[i] = data[i].replace(vpid, "p_" + vpid);
					}
					if(that.ts && that.sign){
						if(data[i].indexOf("?")>-1){
							data[i] = data[i] + "&ts=" + that.ts + "&sign=" + that.sign;
						}else
						{
							data[i] = data[i] + "?ts=" + that.ts + "&sign=" + that.sign;
						}
					}
					data[i] = this.proxyUrl(data[i]);
				}
			}

			return data;

			
		}

		return "";
	},
	/*除了hls.videocc.net,其他域名需要router.polyv.net转发*/
	proxyUrl:function(url){
		if(url == ""){
			return url;
		}

		url = url.replace(/.*?:\/\//g,"");
  		return "https://router.polyv.net/proxy/"+url;
	}
}

function getVideo(vid,callback,ts,sign){
	polyvVodPlayer.getVideo(vid,callback,ts,sign);
}

function getPreviewVideo(vid,callback,ts,sign){
	polyvVodPlayer.getPreviewVideo(vid,callback,ts,sign);
}

module.exports = {
	getVideo:getVideo,
	getPreviewVideo:getPreviewVideo
}