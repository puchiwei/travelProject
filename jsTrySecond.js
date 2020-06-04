var xhr = new XMLHttpRequest();
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send(null)

xhr.onload = function(){
    console.log(xhr.readyState);
    var dataStr = JSON.parse(xhr.responseText);
    var data = dataStr.result.records
    console.log(data,'yoyo');

    //組DOM元素
let playLocation = document.querySelector('.playLocation');
let list = document.querySelector(".list");
let footer = document.querySelector('.footer');
let len = data.length;



//更新下拉選單
(function () {
    let ary = [];
        for (let i = 0; i < len; i++) {
            ary.push(data[i].Zone);
    }
    let noRepeatAry = Array.from(new Set(ary));
    let lenn = noRepeatAry.length;
    let str = "";
    let optionStrr = '<option value="' + 'nature' + '">' + '--請新增行政區--' + '</option>';
        for (let i = 0; i < lenn; i++) {
            let content = '<option value="' + noRepeatAry[i] + '">' + noRepeatAry[i] + '</option>';
                str += content
    }
    playLocation.innerHTML = optionStrr + str;
})();




//寫出change表單事件

playLocation.addEventListener('change', changeMain, false);
playLocation.addEventListener('change',addBtn,false);


let addAllBtn=()=>{
    let btnNum = len/6 ;
    let str = '';
        for(i=0;i<btnNum;i++){
            let content = `
                            <a href='#' class='btn' data-num=${i+1}>${i+1}</a>
                        `
                str += content ;
                
        }
        
            footer.innerHTML = str ;
        }
addAllBtn();

//透過改變表單挑選符合條件的景點
function changeMain(e) {
    let select = e.target.value;
    let str = '';
    let ary = data.filter(items=>{return items.Zone == select});
    ary.forEach(items => {
        let content =  
        `
     <div class="list-box">
             <img src=${items.Picture1}>
                 <h2 class="list-box-title">${items.Name}</h2>
                     <li class="list-box-sub">${items.Tel}</li>
                     <li class="list-box-sub">${items.Add}</li>
                     <li class="list-box-sub">${items.Opentime}</li> 
         </div>
    `
    str += content ;
    });
    
    //     for (let i = 0; i < len; i++) {
    //         if (select == data[i].Zone) {
    // let content = `
    // <div class="list-box">
    //         <img src=${data[i].Picture1}>
    //             <h2 class="list-box-title">${data[i].Name}</h2>
    //                 <li class="list-box-sub">${data[i].Tel}</li>
    //                 <li class="list-box-sub">${data[i].Add}</li>
    //                 <li class="list-box-sub">${data[i].Opentime}</li>
                
    //     </div>
    //                 `      
    //         str += content;
    //             ary.push(data[i].Name) ;//符合地區條件的所有景點之陣列
                    
    //     }
    // }
        list.innerHTML = str;
            return ary     
}

//選單更新時，動態更新按鈕數量
function addBtn(place){
    let aryLen= changeMain(place).length;
    let btnNum = aryLen / 6 ;
    let str = ''
        for (let i=0;i<btnNum;i++){
            let content = `
                            <a href='#' class='btn' data-num=${i+1}>${i+1}</a>
                        `
                str += content ;                
        }
            footer.innerHTML = str ;
            checkBtn();
};

//根據按鈕變換表單中顯示內容(未限制地區)
var btnChange=(page)=>{
    page.preventDefault();
    let pageNum = page.target.dataset.num;//現在滑鼠點到第幾頁
    
    let str = '' ;
    let items = 6 ;//每頁顯示6個
    let dataStart = (pageNum-1) * items ;//從第幾筆資料開始
    let dataStartLen = pageNum*items ;
        if(dataStart==96){
            for(let i=dataStart;i<len;i++){   //ex:i從54開始 執行到i=60             
                let content = `
                <div class="list-box">
                        <img src=${data[i].Picture1}>
                            <h2 class="list-box-title">${data[i].Name}</h2>
                                <li class="list-box-sub">${data[i].Tel}</li>
                                <li class="list-box-sub">${data[i].Add}</li>
                                <li class="list-box-sub">${data[i].Opentime}</li>
                    </div>
                                `              
                str += content;
            }
            list.innerHTML = str ;  
            }
        else{
            for(let i=dataStart;i<dataStartLen;i++){
                let content =`
                <div class="list-box">
                        <img src=${data[i].Picture1}>
                            <h2 class="list-box-title">${data[i].Name}</h2>
                                <li class="list-box-sub">${data[i].Tel}</li>
                                <li class="list-box-sub">${data[i].Add}</li>
                                <li class="list-box-sub">${data[i].Opentime}</li>
                            
                    </div>
                                `      
                str += content;
        }
        list.innerHTML = str ;        
    }   
}
//未按頁碼時顯示前6個景點在網頁上
(function (){
    let str = '';
    let ary = data.slice(0,5);
    //得出隨不同function而有不同結果的ary，再來利用foreach打包成另一個函式
    ary.forEach(items => {
        let content =  
            `
            <div class="list-box">
                <img src=${items.Picture1}>
                 <h2 class="list-box-title">${items.Name}</h2>
                     <li class="list-box-sub">${items.Tel}</li>
                     <li class="list-box-sub">${items.Add}</li>
                     <li class="list-box-sub">${items.Opentime}</li> 
            </div>
            `
    str += content ;
    });
    list.innerHTML = str ; 
})();

//新增按鈕事件
function checkBtn (){
    let btn = document.querySelectorAll('.btn');
    let allBtnNum = btn.length ;
        console.log('btn陣列測試',btn);
            for(i=0;i<allBtnNum;i++){
                btn[i].addEventListener('click',btnChange);
        }        
        return
};
checkBtn();

//組DOM字串閉包
function addDomHandler(){
    ary.forEach(items => {
        let content =  
            `
            <div class="list-box">
                <img src=${items.Picture1}>
                 <h2 class="list-box-title">${items.Name}</h2>
                     <li class="list-box-sub">${items.Tel}</li>
                     <li class="list-box-sub">${items.Add}</li>
                     <li class="list-box-sub">${items.Opentime}</li> 
            </div>
            `
    str += content ;
    });

    function closure(){
        return str
    }
    return closure
}
}

