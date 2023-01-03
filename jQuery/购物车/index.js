$(function(){
    $('.all').change(function(){
        sumPrice();
        if($(this).find('input').prop('checked')==true){
            $('.good').find('input').prop('checked',true)
            $('.all').find('input').prop('checked',true)
        }
        else{
            $('.good').find('input').prop('checked',false)
            $('.all').find('input').prop('checked',false)
        }
    })
    $('.good').change(function(){
        sumPrice();
        if($('.good').find('input:checked').length==3){
            $('.all').find('input').prop('checked',true)
        }
        else{
            $('.all').find('input').prop('checked',false)
        }
    })
    $('.add').click(function(){
        let newNum = Number($(this).siblings('.num').attr('index'))+1;
        console.log(newNum);
        $(this).siblings('.num').attr('index',newNum);
        $(this).siblings('.num').val(newNum);
        $(this).parent().siblings('.sum').text('￥'+Number(($('.price').attr('price'))*newNum).toFixed(2));
        $(this).parent().siblings('.sum').attr('sum',Number(($('.price').attr('price'))*newNum).toFixed(2));
    })
    $('.reduce').click(function(){
        if($(this).siblings('.num').attr('index')==1){
            alert('商品数量不能小于1');
            return;
        }
        let newNum = Number($(this).siblings('.num').attr('index'))-1;
        $(this).siblings('.num').attr('index',newNum);
        $(this).siblings('.num').val(newNum);
        $(this).parent().siblings('.sum').text('￥'+Number(($('.price').attr('price'))*newNum).toFixed(2));
        $(this).parent().siblings('.sum').attr('sum',Number(($('.price').attr('price'))*newNum).toFixed(2));
    })
    $('.remove').click(function(){
        $(this).parent().hide();
    })
    let sumPrice = function(){
        let sum = 0;
        sum = sum + Number($('.good').find('input:checked').parent().siblings('.sum').attr('sum'))
        console.log(sum);
    }
})