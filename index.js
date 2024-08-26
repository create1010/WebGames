$(document).ready(function () {
    let $body = $('body');
    let $score = $('#score');
    let $basicSpeed = 150;
    let downspeed = 3;
    let max_downspeed = 15;
    let level = 0;
    let hit_range = 20;
    let $music = document.getElementById('bgMusic');
    let timer;
    let speedUp;
    score = 0;
    score_add = 1.1;
    //固定初始音量
    $music.volume = 0.1;

    //左鍵
    function left_click() {
        let x = parseInt($('#play1').css('left'));
        if (x > 10) {
            $('#play1').css('left', x - 100 + "px")
        }
    }
    $('body').click(left_click);
    //右鍵
    function right_click(e) {
        e.preventDefault()
        let x = parseInt($('#play1').css('left'));
        if (x < 210)
            $('#play1').css('left', x + 100 + "px")
    }
    $('body').contextmenu(right_click);
    //障礙物生成
    function createObstacle() {
        let Location = [10, 110, 210];
        for (let i = 0; i < 2; i++) {
            $('.stage').append("<div class='Role obstacle'></div>");
            let $obstacle = $('.stage').find('.obstacle:last');
            $obstacle.data('level', level)
            let getRandom = Math.floor(Math.random() * Location.length);
            let LocationX = Location.splice(getRandom, 1)[0];  //起始位置
            $obstacle.css('left', LocationX + 'px');
            $obstacle.css('top', -($obstacle.height()) + 'px');
        }
    }

    //遊戲結束
    function gameover(e) {
        //角色禁止移動
        $('body').unbind('click');
        $('body').unbind('contextmenu');
        //清除計時器
        clearInterval(timer);
        clearInterval(speedUp);
        $music.pause();
        $music.currentTime = 0;
        $music.volume = 0.1;
        $('.stage').append("<div id='end'>遊戲結束</div>");
        $('#end').css({
            'background': "black",
            'opacity': '.7',
            'width': '100%',
            'height': '100%',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'color': '#f00',
            'font-weight': 'bold',
            'font-size': '36px'
        })
        $('#end').click(function () {
            $('#end').unbind('click');
            //清除提示頁面
            $('#end').remove();
            //清空敵人
            $('.stage').find('.obstacle').remove();
            restart();
        })
    }
    //重新開始
    function restart() {
        downspeed = 3;
        level = 0;
        score = 0;
        score_add = 1.1
        //初始化音樂
        $body.click(function () {
            $music.play();
        });

        //初始化怪物位置
        $('#play1').css({ 'left': ($('.stage').width() - $('#play1').width()) / 2 + "px", 'top': $('.stage').height() - $('#play1').height() });
        //重建敵人
        createObstacle();
        //重設計時器
        timer = setInterval(timer_func, 1000 / 60);
        speedUp = setInterval(speedUp_func, 1000)
        //角色移動
        $('body').off('click').on('click',left_click);
        $('body').off('contextmenu').on('contextmenu',right_click);
    }
    restart();

    //計時器
    function timer_func() {
        $('.stage').find('.obstacle').each(function () {
            let down = parseInt($(this).css('top'));
            if (down > $basicSpeed && $(this).data('level') == level) {
                level += 1;
                createObstacle();
            }
            let px = parseInt($('.play1').css('left')) + $('.play1').width() / 2;
            let py = parseInt($('.play1').css('top')) + $('.play1').height() / 2;
            let ex = parseInt($(this).css('left')) + $(this).width() / 2;
            let ey = parseInt($(this).css('top')) + $(this).height() / 2;
            let Sensing = Math.sqrt(Math.pow(px - ex, 2) + Math.pow(py - ey, 2))
            if (hit_range * 2 > Sensing) {
                controlStop = false
                clearInterval(timer);
                gameover();
            }

            if (down > $('.stage').height()) {
                $(this).remove();
                return;
            }
            $(this).css('top', down + downspeed + 'px')
            score += score_add
            score = parseInt(score)
            $score.html(score)
        })
    }
    //每秒增加落下速度
    function speedUp_func() {
        if (downspeed >= max_downspeed) {
            downspeed = max_downspeed;
            clearInterval(speedUp);
        }
        downspeed += 0.5
        score_add *= 2
    }

})