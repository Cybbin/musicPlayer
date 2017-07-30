// JavaScript Document
var cyb = {
	player : null,
	playbtn : null,
	pausebtn : null,
	diskrotate : null,
	disk : null,
	needle : null,
	currentIndex : 0,
	currentTime : null,
	currentSong : null,
	processBar : null,
	processBtn : null,
	processCur : null,
	processRdy : null,
	processBtnState : 0,
	originX : 0,
	$playlist : null,
	playlist : null,
	listContent : null,
	flag : null,
	playboard : null,
	$loop:null,
	$loopflag:null,
//	lyric:null,
};
cyb.init = function(){
	cyb.initData();
	cyb.initList();
	cyb.initProcessBar();
	cyb.updateSong();
	cyb.addListener();
	cyb.setInterval();
};
cyb.initData = function(){
	cyb.player = $('#player').get(0);
	cyb.playbtn = $('#control .play');
	cyb.pausebtn = $('#control .pause');
	cyb.diskrotate = $('.disk-cover-animation');
	cyb.disk = $('#disk');
	cyb.needle = $('#needle');
	cyb.currentTime = $('#totalTime');
	cyb.processBar = $('#process-bar');
	cyb.processBtn = $('#processBtn');
	cyb.processCur = $('#processCur');
	cyb.processRdy = $('#rdy');
	cyb.playlist = $('#playlist');
	cyb.listContent = $('#list-Content');
	cyb.currentSong = cyb.$playlist[cyb.currentIndex];
	cyb.flag = true;
	cyb.playboard = $('.play-board');
	cyb.$loop = $('.loop');
	cyb.$loopflag=true;
//	cyb.lyric=$('#lyric');
};
cyb.initList = function () {
	$('#playlistCount').html(cyb.$playlist.length);
	var $li;
	$.each(cyb.$playlist,function(i,item){
		$li = $('<li>').html(item.name).append($('<span>').html('<br>  ————	 ' + formatArtists(item.artists)));
		$li.click(function(){
			if(cyb.currentIndex!=i){
				cyb.moveTo(i);
			}
		});
		cyb.listContent.append($li);
	});
};
cyb.showList = function(){
	if(cyb.flag){
		cyb.playlist.animate(
			{
				opacity: '1',
				right:'0px'
			},500);
		cyb.flag=false;
	}else{
		cyb.playlist.animate(
			{
				opacity:'0',
				right:'-400px'
			},500);
		cyb.flag=true;
	}
	event.stopPropagation();
};
cyb.addListener = function(){
	cyb.player.addEventListener('canplay',1);
	cyb.player.addEventListener('ended',function(){
		cyb.next();
	});
};
cyb.playboardclick = function(){
	if(!cyb.flag){
		cyb.playlist.animate(
			{
				opacity:'0',
				right:'-400px'
			},500);
		cyb.flag=true;
	}
};
cyb.moveTo = function(i){
	cyb.currentIndex=i;
	cyb.updateSong();
	event.stopPropagation();
};
cyb.loop = function(){
	if(cyb.$loopflag){
		cyb.player.loop=true;
		cyb.$loop.show();
		cyb.$loopflag=false;
	}else{
		cyb.player.loop=false;
		cyb.$loop.hide();
		cyb.$loopflag=true;
	}
	event.stopPropagation();
};
cyb.play = function(){
	cyb.diskrotate.css("animation-play-state","running");
	cyb.playbtn.hide();
	cyb.pausebtn.show();
	cyb.moveNeedle(true);
	cyb.player.play();
	event.stopPropagation();
};
cyb.pause = function(){
	cyb.diskrotate.css("animation-play-state","paused");
	cyb.playbtn.show();
	cyb.pausebtn.hide();
	cyb.moveNeedle(false);
	cyb.player.pause();
	event.stopPropagation();
};
cyb.next = function(){
	cyb.currentIndex++;
	if(cyb.currentIndex>=cyb.$playlist.length){
		cyb.currentIndex=0;
	}
	cyb.updateSong();
	cyb.player.play();
	event.stopPropagation();
};
cyb.pre = function(){
	cyb.currentIndex--;
	if(cyb.currentIndex<0){
		cyb.currentIndex=cyb.$playlist.length-1;
	}
	cyb.updateSong();
	cyb.player.play();
	event.stopPropagation();
};
cyb.updateSong = function(){
	cyb.listContent.children('li.active').removeClass('active').children('div.song-play').remove();
	cyb.listContent.children('li').eq(cyb.currentIndex).addClass('active')
		.prepend($('<div>').addClass('song-play'));
	cyb.currentSong = cyb.$playlist[cyb.currentIndex];
	cyb.player.src=cyb.currentSong.mp3Url;
	$('.bg').css('background-image','url('+cyb.currentSong.album.picUrl+')');
	$('#disk .album').attr('src',''+cyb.currentSong.album.picUrl+'');
	cyb.diskrotate.css("animation-play-state","running");
	cyb.moveNeedle(true);
	cyb.updateMusicInfo();
//	cyb.updateLyric();
	cyb.playbtn.hide();
	cyb.pausebtn.show();
	cyb.player.play();
};
cyb.updateMusicInfo = function(){
	$('#song').text(cyb.currentSong.name);
	$('#singer').text(formatArtists(cyb.currentSong.artists));
};
//cyb.updateLyric = function(){
//	var url = "lyric/lyric"+(cyb.currentIndex+1)+".json";
//	$.ajax({
//		url:url,
//		type:"get",
//		dataType:"json",
//		success:function(data){
//			var lyric = data.lyric;
//			lyric=parseLyric(lyric);
//			var html='';
//			for (var i = 0, l = lyric.length; i < l; i++) {
//			    html+='<p id='+i+'>'+lyric[i][1]+'</p>';
//			};
//			cyb.lyric.css('margin-top','100px');
//			cyb.lyric.html(html);
//			var top = [];
//			top[0]='100';
//			for (var i = 0; i < lyric.length; i++) {
//				top[i+1]=top[i]-($('p#'+i).height()+18);
//			}
//			cyb.player.ontimeupdate = function(e) {
//				for (var i = 0; i < lyric.length; i++) {
//			    	if (this.currentTime > lyric[i][0]-0.5) {
//			    		$('p').css('color',"#fff");
//			    		$('p#'+i).css('color',"#a6e22d");
//			            cyb.lyric.css({'margin-top':top[i+1]+'px','transition-duration':'0.8s'});
//			            continue;
//			    	};
//			    };
//			};
//		},
//		error:function(){
//		}
//	});
//}
cyb.moveNeedle = function(flag){
	if(flag){
		cyb.needle.removeClass('pause-needle').addClass('resume-needle');
	}else{
		cyb.needle.removeClass('resume-needle').addClass('pause-needle');
	}
};
cyb.setInterval = function(){
	cyb.updateProcess();
	setInterval(cyb.updateProcess,1000);
};
cyb.updateProcess = function(){
	var currentTime = cyb.player.currentTime,
		duration  = cyb.player.duration,
		buffer = cyb.player.buffered,
		bufferTime = buffer.length > 0 ? buffer.end(buffer.length-1) : 0;
	cyb.processRdy.width(bufferTime/duration*100+'%');
	cyb.processCur.width(currentTime / duration * 100 + '%');
	$('#totalTime').text(validateTime(duration / 60) + ":" + validateTime(duration % 60));
	$("#currentTime").text(validateTime(currentTime / 60) + ":" + validateTime(currentTime % 60));
};
cyb.initProcessBar = function(){
	var moveFun = function (e) {
            var duration = cyb.player.duration,
                e = e.originalEvent,
                totalWidth = cyb.processBar.width(), percent, moveX, newWidth;
            e.preventDefault();
			if(cyb.processBtnState){
            	moveX = (e.clientX || e.touches[0].clientX) - cyb.originX;
            	newWidth = cyb.processCur.width() + moveX;
				if (newWidth <= totalWidth || newWidth > 0) {
            		percent = newWidth / totalWidth;
            		cyb.processCur.width(newWidth);
            		$("#currentTime").text(validateTime(percent * duration / 60) + ":" + validateTime(percent * 			duration % 60));
            	}
			}
            cyb.originX = (e.clientX || e.touches[0].clientX);
        },
        startFun = function (e) {
            e = e.originalEvent;
			cyb.processBtnState=1;
            cyb.originX = (e.clientX || e.touches[0].clientX);
        },
        endFun = function () {
			if(cyb.processBtnState){
       			cyb.player.currentTime = cyb.processCur.width() / cyb.processBar.width() * cyb.player.duration;
				cyb.processBtnState=0;
            	cyb.updateProcess();
			}
        },
		changeFun = function(e){
			e = e.originalEvent;
			var current = (e.clientX || e.touches[0].clientX),
				duration = cyb.player.duration,
				totalWidth = cyb.processBar.width(),
				temp = cyb.processBtn.offset().left,
				precent,moveX,newWidth;
			moveX=current-temp; 
			newWidth = moveX + cyb.processCur.width()-10;
			precent = newWidth/totalWidth;
			cyb.processCur.width(newWidth);
			cyb.player.currentTime=(precent*duration);
			cyb.updateProcess();
		}
	cyb.processBtn.on('mousedown touchstart', startFun);
    $("body").on('mouseup touchend', endFun);
    $("#process").on('mousemove touchmove', moveFun);
	cyb.processBar.on('click',changeFun);
};
function validateTime(number) {
    var value = (number > 10 ? number + '' : '0' + number).substring(0, 2);
    return isNaN(value) ? '00' : value;
}
function formatArtists(artists) {
    var names = [];
    $.each(artists, function (i, item) {
        names.push(item.name);
    });
    return names.join(',');
}
//function parseLyric(lyric){
//	var lines = lyric.split('\n'),
//		pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g,
//		result = [];
//	while (!pattern.test(lines[0])&&lines.length!=0) {    
//		lines = lines.slice(1);    
//	}
//	if(lines.length==0)return "kong";
//	lines.forEach(function(v,i,a) {
//			var index = v.indexOf(']');
//	        var time = v.slice(1,index),
//	            value = v.slice(index+1);
//	        if(value.length==0)return;
//	        var t = time.split(':');
//	        result.push([parseInt(t[0])*60+parseFloat(t[1]),value]);
//	});
//	result.sort(function(a, b) {
//      return a[0] - b[0];
//  });
//  return result;
//}
$(document).ready(function() {  
	document.onmousedown= function(){return false;};
	var url = 'json/playlist1.json';
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
        	console.log(data);
            cyb.$playlist = data.result.tracks;
            cyb.init();
        },
        error: function (msg) {
            console.log(msg);
        }
    });
});