/*

 API:http://tingapi.ting.baidu.com/v1/restserver/ting
 歌词：
           例：method=baidu.ting.song.lry&songid=877578

参数：songid = 877578 //歌曲id

                */

document.addEventListener('DOMContentLoaded', function() {
    var mixmenu = $('.mixmenu');
    var menu = $('.menu');
    var m_content =$('.m_content');
    var p_title=$(".p_title");
    var turn=$('.turn');
    // 菜单按钮&列表
    mixmenu.on('singleTap', function() {
        menu.toggle();
    })
    var lcy = localStorage.getItem('lcy');
    lcy = lcy ? JSON.parse(lcy) : [];
    if (lcy != []) {
        lry(lcy);
    }
// console.log(lcy)
    function lry(song_id) {

        // 发送jsonp请求，得到歌曲信息
        $.ajax({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data: {
                method: 'baidu.ting.song.lry',
                songid: song_id
            },
            dataType: 'jsonp',
            success: function(res) {
                console.log(res);
                p_title.html(res.title);
               m_content.html(res.lrcContent);
            }
        })
    }


    // 获取数据
    var setsong = localStorage.getItem('setsong');

    setsong = setsong ? JSON.parse(setsong) : [];
    // 如果存在添加给列表，再次进入后有列表
    if (setsong != []) {
        $.each(setsong, function(idx, item) {
            i = item.i;
            var $li = $('<li/>').attr({ 'data-id': item.tId });
            var $div1 = $('<div/>').addClass('left').appendTo($li);

            // var $div2 = $('<div/>').addClass('rank').html(idx + 1).appendTo($div1);
            var $div3 = $('<div/>').addClass('info inPlay').html(item.song).appendTo($div1);

            var $div4 = $('<div/>').addClass('download remove glyphicon glyphicon-trash').appendTo($li);
            $('.menu .list').append($li);
            $('.num').html(i);
            // 如果列表有歌曲，已进入页面就播放第一首歌
        })

    }
      // var turn=$('.turn');
	turn.on('singleTap',function(){
		window.open('music.html','_self')
	})
});
