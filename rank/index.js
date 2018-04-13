// 引入rem插件
require("./src/js/flexible.debug.js")
require("./src/js/flexible_css.debug.js")

// 引入css文件
require("./src/css/index.css")

// 引入jquery库
var $ = require("./src/js/jquery.min.js")
// 获取数据
function getData(val){

	var data = val ? {type:Number(val)} : {type:1};
	var type = val ? Number(val) : 1;
	var url = "/apis/v1/rank/star_rank";
	$.ajax({
	    url:url,
	    dataType:"json",
	    async:true,
	    contentType: "application/json",
	    data:JSON.stringify(data),
	    type:"POST",
	    success:function(req){
	    	if(req.code == 0){
	    		var past = req.data.past;
	    		var starList = req.data.star_list;
	    		var other = req.data.other;
	    		setPast(past,type);
	    		setList(starList,other);
	    		setTitle(past,type);
	    		setSearch(type);
	    		setfirstBar(other.top_charm_percent,other.top_love_percent);
	    	}
	    }
	});
}
// 选项卡切换
function setTab(){
	var tab = $('.tab');
	$('a',tab).click(function(){
		var  e = $(this);
		if(e.attr('class').indexOf('click') > -1){
			return;
		}
		e.addClass('click').siblings().removeClass("click");
		getData(e.attr('data-value'));
	})
}

// 设置冠军信息
function setPast(past,type){
	var banner = $('.banner');
	var loveAvatar = $('.love-avatar');
	var charmAvatar = $('.charm-avatar');
	if(past.img){
		$('.past-info',banner).css('display','block');
		$('.past-img',banner).attr('src',past.img);
	}
	$('.past-name',banner).html(past.star_name);

	$('.love-avatar img',banner).attr('src',past.love_avatar);
	$('.charm-avatar img',banner).attr('src',past.charm_avatar);
	if(type == 1){
		$('.love-avatar',banner).show();
		$('.charm-avatar',banner).show();
		$('.past-date',banner).html('<p>'+past.year+'年第'+past.wm+'周</p><p>('+past.now_time+')</p>');
	}

	if(type == 2){
		$('.love-avatar',banner).hide();
		$('.charm-avatar',banner).hide();
		$('.past-date',banner).html('<p>'+past.now_time+'</p>');
	}
}

// 设置搜索框
function setSearch(type){
	if(type == 1){
		$('.search').show();
	}
	if(type == 2){
		$('.search').hide();
	}
}

// 设置标题
function setTitle(data,type){
	if(type == 1){
		$('.title .t-l').html('本周实时<em>('+data.now_time+')</em>');
	}
	if(type == 2){
		$('.title .t-l').html('本月<em>('+data.now_time+')</em>');
	}
}

// 设置列表数据
function setList(data,other){
	var _array = new Array();
	$.each(data,function(k,v){
		var rankIdClass = 'rank-id';
		var nameClass = 'name';
		var scoreClass = 'score';
		var rankOther = '';
		var avatarIcon = '<div class="no-img"></div>';
		if(v.rank==1){
			rankIdClass = 'rank-id rank-first rank-first-icon';
			nameClass = 'name rank-first';
			scoreClass = 'score rank-first';
			avatarIcon = '<img src="'+require("./src/img/huangguan@2x.png")+'">';
			rankOther =
					'<div class="rank-other">\
						<div class="top-love-value">\
							<div class="text">爱慕值:'+other.top_love_value+'</div>\
							<div class="bar">\
								<div class="bar-c"></div>\
							</div>\
						</div>\
						<div class="top-charm-value">\
							<div class="text">魅力值:'+other.top_charm_value+'</div>\
							<div class="bar">\
								<div class="bar-c"></div>\
							</div>\
						</div>\
					</div>';
		}
		if(v.rank==2){
			rankIdClass = 'rank-id rank-second rank-second-icon';
			nameClass = 'name rank-second';
			scoreClass = 'score rank-second';
			avatarIcon = '<img src="'+require("./src/img/huangguan2@2x.png")+'">';
		}
		if(v.rank==3){
			rankIdClass = 'rank-id rank-third rank-third-icon';
			nameClass = 'name rank-third';
			scoreClass = 'score rank-third';
			avatarIcon = '<img src="'+require("./src/img/huangguan3@2x.png")+'">';
		}
		_array.push(
			'<li>\
				<div class="'+rankIdClass+'">'+v.rank+'</div>\
				<div class="avatar-icon">\
					'+avatarIcon+'\
					<div class="avatar">\
						<img src="'+v.avatar+'" alt="">\
					</div>\
				</div>\
				<div class="rank-content">\
					<div class="rank-info">\
						<div class="'+nameClass+'">'+v.name+'</div>\
						<div class="'+scoreClass+'">'+v.score+'分</div>\
					</div>\
					<div class="btn openApp">打榜</div>\
					'+rankOther+'\
				</div>\
			</li>'
		)
	})
	$('.list-rank ul').html(_array.join(''));
	setOpenApp();
}
// 设置第一名进度条
function setfirstBar(top_charm_percent,top_love_percent){
	var charmBar = $('.top-charm-value .bar').width() / 100 * top_charm_percent;
	var loveBar = $('.top-love-value .bar').width() /100 * top_love_percent;

	$('.top-charm-value .bar-c').width(charmBar);
	$('.top-love-value .bar-c').width(loveBar);

}

// 设置唤醒判断
function setOpenApp(){

	$('.openApp').unbind('click').click(function(){

		if (/android/i.test(navigator.userAgent)) {// 安卓判定

			if (/MicroMessenger/.test(navigator.userAgent)) { //微信浏览器判定
				window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.morefans.app&android_schema=mfsapp://hitlist/glamourlist/1';
        		return;
        	}

			var reloadUrl = 'http://www.morefans.com.cn/';
            window.location.href = 'mfsapp://hitlist/glamourlist/1';
            setTimeout(function () {
                    window.location.href = reloadUrl // 附加一个特殊参数，用来标识这次刷新不要再调用myapp:// 了
            }, 500);
        }
        if (/iPhone/.test(navigator.userAgent)) {// ios判定
        	location.href = 'https://morefans.com.cn?scheme=hitlist/glamourlist/1';
    	}

	})
}

$(document).ready(function(){
	setTab();
	setOpenApp();
	getData();
})



