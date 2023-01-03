window.addEventListener('load',function(){

    //获取元素
    let ul = document.querySelector('ul')
    let circles = document.querySelector('ol')
    let box = document.querySelector('.box');

    //自定轮播
    let w = box.clientWidth;
    let index = 0;
    ul.timer = setInterval(function(){
        index++;
        let translate = -index*w;
        ul.style.transition = 'all .3s';
        ul.style.transform = 'translateX('+ translate +'px)';
        ul.addEventListener('transitionend',function(){

            //过度完之后操作


            if(index >= 3){
                index = 0;
                ul.style.transition = 'none'
                ul.style.transform = 'translateX(0px)';
            }
            else if(index<0){
                index = 2;
                let translate = -index*w;
                ul.style.transition = 'none'
                ul.style.transform = 'translateX('+ translate +'px)';
            }

            //小圆点跟随图片变化效果
            
            circles.querySelector('.current').classList.remove('current');
            
            circles.children[index].classList.add('current');
        })
    },2000)


    //手指滑动效果
    let xStart = 0;
    let xMove = 0;
    ul.addEventListener('touchstart',function(e){
        clearInterval(ul.timer);
        xStart = e.targetTouches[0].pageX;
    })
    ul.addEventListener('touchmove',function(e){
        xMove = e.targetTouches[0].pageX - xStart;
        let translate = - index*w + xMove;
        ul.style.transition = 'none';
        ul.style.transform = 'translateX('+translate+'px)';
    })
    ul.addEventListener('touchend',function(){
        //如果滑动距离超过50像素，播放下一张或上一张
        if(Math.abs(xMove)>50){
            if(xMove>0){
                index--;
            }
            else{
                index++;
            }
            let translate = -index*w;
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX('+translate+'px)';
        }
        else{
            let translate = -index*w;
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX('+translate+'px)';
        }
        clearInterval(ul.timer);
        ul.timer = setInterval(function(){
            index++;
            let translate = -index*w;
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX('+ translate +'px)';
            ul.addEventListener('transitionend',function(){
                if(index >= 3){
                    index = 0;
                    ul.style.transition = 'none'
                    ul.style.transform = 'translateX(0px)';
                }
            })
        },2000)
    })



})

