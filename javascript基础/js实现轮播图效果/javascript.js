window.addEventListener('load',function(){

    //获取元素
    let box = document.querySelector('.box');
    let left = document.querySelector('.left');
    let right = document.querySelector('.right');
    let ul = document.querySelector('.ul');
    let circle = document.querySelector('.circle');

    //动画效果
    let animate = function(obj,target,callback){
        obj.timer_a = setInterval(function(){
            if(obj.offsetLeft == target){
                clearInterval(obj.timer_a);
                    if(callback){
                    callback();
            }
        }
        let step = (target - obj.offsetLeft)/10;
        step = step>0?Math.ceil(step):Math.floor(step);
        obj.style.left = obj.offsetLeft + step + 'px';
    },15)
    }

    //两侧按钮，鼠标悬浮显示，鼠标离开隐藏
    box.addEventListener('mouseover',function(){
        left.style.display = 'block';
        right.style.display = 'block';
    })
    box.addEventListener('mouseout',function(){
        left.style.display = 'none';
        right.style.display = 'none';
    })

    //根据图片数量动态生成底部小圆圈
    let num = ul.children.length;
    for(let i=0;i<num;i++){
        let li = document.createElement('li');
        circle.appendChild(li);
    }

    //默认最开始位于第一张图片
    let current = 0;
    circle.children[current].style.backgroundColor = 'white';
    //自动轮播
    function auto(){
        if(ul.timer_a){
            clearInterval(ul.timer_a);
        }
        for(let i=0;i<num;i++){
            circle.children[i].style.backgroundColor = '';
        }
        current = current + 1;
        if(current>3){
            current = 0;
        }
        circle.children[current].style.backgroundColor = 'white';
        let steps = ul.offsetLeft - 300
        if(steps<-900){
            steps = 0;
        }
        animate(ul,steps);
    }
    ul.timer_s = this.setInterval(auto,5000);

    //点击小圆圈，转至指定图片
    for(let i=0;i<num;i++){
        circle.children[i].addEventListener('click',function(){
            clearInterval(ul.timer_s);
            ul.timer_s = setInterval(auto,5000);
            current = i;
            for(j=0;j<num;j++){
                clearInterval(ul.timer_a);
                circle.children[j].style.backgroundColor = '';
            }
            circle.children[i].style.backgroundColor = 'white';
            animate(ul,(-i)*300)
        })
    }
    let flag = true;
    //点击两侧按钮left和right，相应的移动图片,底部圆圈相应改变
    //右边按钮
    function right_s(){
        if(flag == true){
        flag = false;
        clearInterval(ul.timer_s);
        ul.timer_s = setInterval(auto,5000);
        for(let i=0;i<num;i++){
            circle.children[i].style.backgroundColor = '';
        }
        current = current + 1;
        if(current>3){
            current = 0;
        }
        circle.children[current].style.backgroundColor = 'white';
        clearInterval(ul.timer_a);
        let steps = ul.offsetLeft - 300
        if(steps<-900){
            steps = 0;
        }
        animate(ul,steps,function(){
            flag = true;
        });
        }
    }
    right.addEventListener('click',right_s);



    //左边按钮
    function left_s(){
        if(flag == true){
        flag = false;
        clearInterval(ul.timer_s);
        ul.timer_s = setInterval(auto,5000);
        for(let i=0;i<num;i++){
            circle.children[i].style.backgroundColor = '';
        }
        current = current - 1;
        if(current<0){
            current = 3;
        }
        circle.children[current].style.backgroundColor = 'white';
        clearInterval(ul.timer_a);
        let steps = ul.offsetLeft + 300
        if(steps>0){
            steps = -900;
        }
        animate(ul,steps,function(){
            flag = true;
        });
        }
    }
    left.addEventListener('click',left_s);


})