/*         API:http://tingapi.ting.baidu.com/v1/restserver/ting
            参数：
                格式：method=baidu.ting.billboard.billList&type=1&size=10&offset=0

                method：请求方式
                type：
                    1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,
                    22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
                size：10 //返回条目数量
                offset：0 //获取偏移

            播放：
                格式：method=baidu.ting.song.playAAC&songid=877578
                参数：songid = 877578 //歌曲id
            下载:
                例：method=baidu.ting.song.downWeb&songid=877578&bit=24&_t=1393123213

                参数： songid = 877578//歌曲id

                    bit = 24, 64, 128, 192, 256, 320 ,flac//码率

                    _t = 1450215999,, //时间戳


            原文链接：http://www.jianshu.com/p/a6718b11fdf1
            
                */

document.addEventListener('DOMContentLoaded', function() {
    var $footer = $("#footer");
    var k_content = $('.k_content');
    var m_content = $('.m_content');
    var $search = $('.d_search');
    var mc_content=$('.mc_content');
    var K_btn = document.querySelectorAll('.kus');

    var btnPlay = document.querySelector('.p_btn');
    var p_btn = btnPlay.querySelectorAll('span');

    var eProgress = $('.m_footer progress');
    var i = 0;
    var pImg = $('.p_icon').find('img');

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
            play(setsong[0].tId);
        })

    }

    // 一开始呈现的是新歌榜歌曲
    hot(1, 30);
    // scrolls(1);
    // 歌榜切换
    K_btn[0].onclick = function() {
        hot(1, 30);
        k_content.css({ background: '#fff' });
        // scrolls(1)
    }
    K_btn[1].onclick = function() {
        hot(22, 30);
        k_content.css({ background: '#850' });
        // scrolls(22)

    }
    K_btn[2].onclick = function() {
        hot(25, 30);
        k_content.css({ background: '#088' });
        // scrolls(25)
    }
    K_btn[3].onclick = function() {
        hot(24, 30);
        k_content.css({ background: '#38b' });
        // scrolls(24)
    }

    function hot(a, n) {
        // 利用百度音乐api制作音乐网站
        $.ajax({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data: {
                method: 'baidu.ting.billboard.billList',
                type: a,
                size: n,
                offset: 0
            },
            dataType: 'jsonp',
            success: function(res) {
                // console.log(res);
                var $ul = $('<ul/>').addClass('list');
                $.each(res.song_list, function(idx, song) {
                    var $li = $('<li/>').attr({ 'data-id': song.song_id });
                    var $div1 = $('<div/>').addClass('left').appendTo($li);
                    var $div2 = $('<div/>').addClass('rank').html(song.rank).appendTo($div1);
                    var $div3 = $('<div/>').addClass('info inPlay').html(' <div><span>' + song.title + '</span><span class="icon-q icon-sq"></span></div>' + '<span class="txt">' + song.author + '</span>').appendTo($div1);
                    var $div4 = $('<div/>').addClass('download').html('<span id="add" class="glyphicon glyphicon-plus"></span><span class="down glyphicon glyphicon-arrow-down"></span>').appendTo($li);

                    $li.appendTo($ul);
                });

                $(k_content).empty();
                $ul.appendTo(k_content);
            }

        });
    }

    var mixmenu = $('.mixmenu');
    var menu = $('.menu');

    var p_tltie = $('.title').find('span');

    // 菜单按钮&列表
    mixmenu.on('singleTap', function() {
            menu.toggle();
        })
        // 列表的删除歌曲(全部删除)
    menu.on('singleTap', '.delete', function() {
        $('.menu .list').empty();
        $('.num').html(0);

        setsong = [];
        i = 0;
        localStorage.setItem('setsong', JSON.stringify(setsong));
    })

    // 播放歌曲
    var player = new Audio();
    m_content.on('singleTap', '.inPlay', function() {

        var song_id = $(this).closest('li').attr('data-id'); //$(this).data('id');
        play(song_id);

    })


    function play(song_id) {

        // 发送jsonp请求，得到歌曲信息
        $.ajax({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data: {
                method: 'baidu.ting.song.playAAC',
                songid: song_id
            },
            dataType: 'jsonp',
            success: function(res) {
                // console.log(res);

                pImg.attr({ src: res.songinfo.pic_small });
                p_tltie.html(res.songinfo.album_title);
                p_tltie.siblings().html(res.songinfo.author);

                // console.log(res.songinfo.pic_small);
                // 利用audio标签实现音乐播放
                player.src = res.bitrate.file_link;
                player.play();
            }
        })
        lry(song_id);
     // 图片旋转效果
        $('.m_footer img')[0].classList.add('playing');

        // 播放状态
        p_btn[0].className = 'glyphicon glyphicon-pause';
    }

    p_btn[0].onclick = function() {
        //如果当前处于暂停状态，就播放
        if (player.paused) {
            player.play();
            this.className = 'glyphicon glyphicon-pause';
        } else {
            player.pause();
            this.className = 'glyphicon glyphicon-play';
        }
    }
    var a = 0;
    // 下一首
    p_btn[1].onclick = function() {
            nextPlay();
        }
        // 播放结束后
    player.onended = function() {
            p_btn[0].className = 'glyphicon glyphicon-play';
            nextPlay();
        }
        // 循环列表播放
    function nextPlay() {
        a++;
        if (i <= 1) {
            return;
        } else {
            if (a <= i) {
                var pli = $('.menu .list').find('li').eq(-i + a);
                var song_id = pli.attr('data-id'); //$(this).data('id');
                play(song_id);
            } else {
                a = 0;
                return;
            }

        }
    }

    // 添加歌曲到列表
    k_content.on('singleTap', '#add', function() {
        var prostring = {};
        i++;
        var tLi = $(this).closest('li');
        var info = tLi.find('.info').clone();
        var tId = tLi.attr('data-id');

        var $li = $('<li/>').attr({ 'data-id': tId });
        var $div1 = $('<div/>').addClass('left').appendTo($li);

        // var $div2 = $('<div/>').addClass('rank').html(i).appendTo($div1);
        $div1.append(info);
        var $div4 = $('<div/>').addClass('remove download glyphicon glyphicon-trash').appendTo($li);
        $('.menu .list').append($li);
        $('.num').html(i);
        // 设置数据
        prostring.i = i;
        prostring.tId = tId;
        prostring.song = tLi.find('.info').first().first().html();
        setsong.push(prostring);
        localStorage.setItem('setsong', JSON.stringify(setsong));
    })
     k_content.on('singleTap', '.down', function() {
         var tLi = $(this).closest('li');
        var tId = tLi.attr('data-id');
        // 下载
        down(tId,24,'1430215999')
     })
  



    // 歌曲列表随机点播
    $('.menu .list').on('singleTap', '.inPlay', function() {
        var song_id = $(this).closest('li').attr('data-id'); //$(this).data('id');
        play(song_id);
     
        
    })

    // 列表中单曲的删除
    $('.menu .list').on('singleTap', '.remove', function() {
        this.closest('li').remove(this.closest('li'));
        i--;
        $('.num').html(i);
        var index = $(this).index() - 1;
        console.log(index);
        setsong.splice(index, 1);
        localStorage.setItem('setsong', JSON.stringify(setsong));
    })


    // 点击播放的歌曲，跳转到歌词
    $footer.on('singleTap', '.title', function() {
        $('.r_code')[0].classList.add('active');
        // $("#c_footer").css({ display: 'block' })
        // $("#footer").css({ display: 'none' });
    })
    var m_left = $('.boxLeft');
    var m_logo = $(".m_logo");
    var mm_cont = $('.mm_cont');
    var startx, endx;

    // 单击图标出菜单
    m_logo.on('singleTap', function() {
            // console.log('a')
            m_left[0].classList.add('show');

        })
        // 向右滑出菜单
    var startX, endX;
    document.addEventListener('touchstart', function(e) {
        // console.log(e);
        startX = e.changedTouches[0].pageX;
    });

    document.addEventListener('touchmove', function(e) {
        // console.log(e);
        endX = e.changedTouches[0].pageX;
        disX = endX - startX;
        if (disX > 0) {
            if (disX > 80) {
                m_left[0].classList.add('show');
                e.preventDefault();
            }
        } else {
            m_left[0].classList.remove('show');
            e.preventDefault();
        }
    });

    //滑到底部后加载更多歌曲
    function scrolls(m) {
        document.addEventListener('scroll', function(e) {
            var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrolltop > 500) {
                hot(m, 50);
                e.preventDefault();
            } else {
                return;
            }
        });
    }



    // 点击右侧菜单的返回按钮返回
    $('.turn').on('singleTap', function() {
        $('.r_code')[0].classList.remove('active');
        // $("#c_footer").css({ display: 'none' })
        // $("#footer").css({ display: 'block' });
    })


    var p_title = $(".p_title");


    // 歌词
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
                // console.log(res);
                p_title.html(res.title);
            
                mc_content.html(res.lrcContent.replace(/\[/g, '').replace(/\d/g, '').replace(/\]/g, '').replace(/\:/g, '').replace(/\./g, ''));
            //     
            }
        })
    }
    // 搜索歌曲
    var s_content = $(".s_content");
    $(".search").on('singleTap', function() {
        $search[0].classList.add('active');
    })

    $search.find('input')[0].addEventListener('blur', function() {
        $search[0].classList.remove('active');
        if (this.value != '') {
            search(this.value);

            this.value = '';
        }

    })


    function search(word) {
        // 发送jsonp请求，得到歌曲信息
        $.ajax({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data: {
                method: 'baidu.ting.search.catalogSug',
                query: word
            },
            dataType: 'jsonp',
            success: function(res) {
                s_content[0].classList.add('active');
                console.log(res);

                var $ul = $('<ul/>').addClass('list');
                $.each(res.song, function(idx, song) {
                    var $li = $('<li/>').attr({ 'data-id': song.songid });
                    var $div1 = $('<div/>').addClass('left').appendTo($li);
                    var $div2 = $('<div/>').addClass('rank').html(idx + 1).appendTo($div1);
                    var $div3 = $('<div/>').addClass('info inPlay').html(' <div><span>' + song.songname + '</span><span class="icon-q icon-sq"></span></div>' + '<span class="txt">' + song.artistname + '</span>').appendTo($div1);
                    var $div4 = $('<div/>').addClass('download').html('<span id="add" class="glyphicon glyphicon-plus"></span><span class="down glyphicon glyphicon-arrow-down"></span>').appendTo($li);

                    $li.appendTo($ul);
                });
                s_content.empty();
                $ul.appendTo(s_content);
            }
        })
    }
    // 听、看、唱点击后返回主页
    $('.ting').on('singleTap', function() {
        s_content[0].classList.remove('active');
    })
    $('.see').on('singleTap', function() {
        s_content[0].classList.remove('active');
    })
    $('.ktv').on('singleTap', function() {
        s_content[0].classList.remove('active');
    })

    // 进度条
    var strx, enx;
    eProgress.on('touchstart', function(e) {
        strx = e.changedTouches[0].pageX;
        console.log(strx)
        player.currentTime = ((strx - 88) / this.offsetWidth) * player.duration;
    })


    player.ontimeupdate = function() {
        updateTime();
    }

    function updateTime() {
        // 时间
        // 剩余总时间
        var leftTime = player.duration - player.currentTime;

        // 剩余多少分
        var minLeft = parseInt(leftTime / 60);
        var secLeft = parseInt(leftTime % 60);
        $('.time').html('-' + minLeft + ':' + (secLeft < 10 ? '0' : '') + secLeft);

        // 进度条
        eProgress[0].value = player.currentTime / player.duration * 100;
    }

    // method=baidu.ting.song.downWeb&songid=877578&bit=24&_t=1393123213
    function down(a,n,t) {
        $.ajax({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting',
            data: {
                method: 'baidu.ting.song.downWeb',
                songid: a,
                bit: n,
                _t: t
            },
            dataType: 'jsonp',
            success: function(res) {
                console.log(res)
            }
        })
    }
  
});
