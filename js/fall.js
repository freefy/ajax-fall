var oLi = document.getElementsByTagName('li'),
    num = 1,
    flag =true,
    initWidth = 290;
    
function getData(){
    // 加锁，上次ajax请求完成后才能请求下一次
    if(flag){
        flag = false;
        ajax('GET','./getPics.php',addDom,'cpage='+ num,true);
        num ++;
    }
}
getData();
//回调函数
function addDom(data){
    var dataList = JSON.parse(data);
    // 若当前取得的信息不为空，就执行操作；为空就不执行；
    if(dataList.length>0){
    // 每次添加dom结构都要找到最短的，所以在forEach内部
        dataList.forEach(function(ele,index){
            var minIndex = minList(oLi),
                oItem = document.createElement('div'),
                oImg = new Image(),
                oP = document.createElement('p');
                oItem.className = 'item';
                oImg.src = ele.preview;
                // 图片异步加载，图片未加载时高度小，或导致最短不一样
                oP.innerText = ele.title;
                // 在实际页面图片的高度（原来的宽高比一定）预先加载图片的额高度
                oImg.height = ele.height*initWidth/ele.width  ;
                // 加载失败的图片有一个默认的border
                oImg.onerror = function(){
                    this.style.width = '292px';
                    oImg.height = ele.height* initWidth/ele.width  ;
                    this.style.margin='-1px';
                }
                oItem.appendChild(oImg);
                oItem.appendChild(oP);
                oLi[minIndex].appendChild(oItem);
        })
        
        flag = true;
    }
}
//获取数组中高度最小的索引值
function minList(dom){
    var index = 0,
        minH = dom[0].offsetHeight,
        len = dom.length;
        for(var i = 1; i < len;i ++){
            if(dom[i].offsetHeight < minH){
                index = i;
                minH = dom[i].offsetHeight;
            }
        }
        return index; 
}

function getScrollOffset(){
    if(window.pageXOffset){           
        return{
            x:window.pageXOffset,
            y:window.pageYOffset
        }
    }
    return {
        x:document.documentElement.scrollLeft||document.body.scrollLeft,
        y:document.documentElement.scrollTop||document.body.scrollTop
        
    }
}
function getClient (){
    if(window.innerHeight){
        return{
            w:window.innerWidth,
            h:window.innerHeight
        }
    }
    //标准模式
    if(document.compatMode=='CSS1Compat'){
        return{
            w:document.documentElement.clientWidth,
            h:document.documentElement.clientHeight
        }
    }
    else{
        return{
            w:document.body.clientWidth,
            h:document.body.clientHeight
        }
    }
}

window.onscroll =  throttle(show,500);
function throttle(func, wait) {
    var timer = null;
    var _this = this;
    return function () {
        if (!timer) {
            timer = setTimeout(function () {
                func.apply(_this,arguments);
                timer = null;
            }, wait);
        }
    }
}
function show() {
    var scrollHeight = getScrollOffset().y//滚动条纵轴滚动距离
    var clientHeight = getClient().h//可视区高度
    var pageHeight = oLi[minList(oLi)].offsetHeight;//元素高度（文档高度）
    if(scrollHeight + clientHeight > pageHeight) {
        getData();//获取ajax数据
    }
}



