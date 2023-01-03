window.addEventListener('load',function(){
    let ipt = this.document.querySelector('input');
    let rows = this.document.querySelector('table');
    let btn1 = this.document.querySelector('.btn');
    let over = this.document.querySelectorAll('.over');
    let del = this.document.querySelectorAll('.del');
    let tb = this.document.querySelector('tbody')
    let index = 1;
    btn1.addEventListener('click',function(){
        if(ipt.value == ''){
            alert('你什么也没输入！！');
            return;
        }
        let ntr = document.createElement('tr');
        let fir = document.createElement('td');
        let sec = document.createElement('td');
        let tir = document.createElement('td');
        fir.className = 'fir';
        fir.innerHTML = index+1;
        index++;
        sec.className = 'sec';
        sec.innerHTML = ipt.value;
        ipt.value = '';
        tir.className = 'tir';
        tir.innerHTML = 
        `
        <button class="over iconfont">&#xeaf1;</button>
        <button class="del iconfont">&#xe621;</button>
        `;
        ntr.appendChild(fir);
        ntr.appendChild(sec);
        ntr.appendChild(tir);
        tb.appendChild(ntr);
        over = window.document.querySelectorAll('.over');
        del = window.document.querySelectorAll('.del');
        addFun();
        numCorrect();
    })
    let addFun = function(){
        for(let i=0;i<over.length;i++){
            over[i].addEventListener('click',function(){
                this.disabled = true;
                this.innerHTML = '-';
                this.style.background = 'pink';
                let name = tb.children[i].children[1].innerHTML;
                tb.children[i].children[1].style.textDecoration='line-through';
                alert(`您已经完成了任务:${name}`);
            })
            del[i].addEventListener('click',function(){
                index--;
                tb.removeChild(this.parentNode.parentNode);
                numCorrect();
            })
        }
    }
    let numCorrect = function(){
        for(let i=0;i<over.length;i++){
            over[i].parentNode.parentNode.children[0].innerHTML = i+1;
        }
    }
})