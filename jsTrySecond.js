(function(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.send(null);
const main = document.querySelector('.main')


xhr.onload = function(){
    if(xhr.readyState === 4 && xhr.status == 200){
        loadSuccess();
    }else{
        main.innerHTML = `<div>${'資料載入錯誤!'}</div>`
    }
;}


function loadSuccess(){
    const dataStr = JSON.parse(xhr.responseText);
    const data = dataStr.result.records
    
        //組DOM元素
    const playLocation = document.querySelector('.playLocation');
    const list = document.querySelector(".list");
    const footer = document.querySelector('.footer');
    const len = data.length;
    
    
    //更新下拉選單
    (function () {
        let ary = [];
            for (let i = 0; i < len; i++) {
                ary.push(data[i].Zone);
        }
        let noRepeatAry = Array.from(new Set(ary));
        let lenn = noRepeatAry.length;
        let str = "";
        let optionStrr = '<option value="' + 'nature' + '">' + '--請選擇行政區--' + '</option>';
            for (let i = 0; i < lenn; i++) {
                let content = '<option value="' + noRepeatAry[i] + '">' + noRepeatAry[i] + '</option>';
                    str += content
        }
        playLocation.innerHTML = optionStrr + str;
    })();
    
    
    
    
    //寫出change表單事件
    
    playLocation.addEventListener('change', changeMain, false);
    // playLocation.addEventListener('change',addBtn,false);
    
    
    const addAllBtn=()=>{
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
        let select = e.target.value ;
        console.log(select);
        let str = '';
        let ary = data.filter(items=>{return items.Zone === select});
        console.log(ary,'ccnow')
        function getFirstPageShowsItemNum(){
            if(ary.length>6){
                return 6 ;
            }else{
                return ary.length
            }
        }
        //顯示6筆在第1頁
            for(i=0;i<getFirstPageShowsItemNum();i++){ //不懂變數為function執行完結果要不要加括號
                let content = `
                <div class="list-box">
                        <img src=${ary[i].Picture1}>
                            <h2 class="list-box-title">${ary[i].Name}</h2>
                                <li class="list-box-sub">${ary[i].Tel}</li>
                                <li class="list-box-sub">${ary[i].Add}</li>
                                <li class="list-box-sub">${ary[i].Opentime}</li>
                    </div>
                                `              
                str += content;
            }
            list.innerHTML = str ;   
            let aryLen = ary.length;
            let btnNum = aryLen / 6 ;
            let anotherStr = '' ;
                for (let i=0;i<btnNum;i++){
                    let content = `
                                    <a href='#' class='btn' data-num=${i+1}>${i+1}</a>
                                `
                                anotherStr += content ;                
                }
                    footer.innerHTML = anotherStr ;
                    checkBtn();
        
        
    }
    
    function btnChange(page){
        let locValue = document.querySelector('.playLocation').value
        if(locValue !== 'nature'){
            selectedBtnChange(page);
        }else{
            unselectedBtnChange(page);
        }
    }


    //根據按鈕變換表單中顯示內容(未限制地區)
    const unselectedBtnChange=(page)=>{
        page.preventDefault();
        let pageNum = page.target.dataset.num;//現在滑鼠點到第幾頁
        console.log(pageNum,'checknow');
        let str = '' ;
        let items = 6 ;//每頁顯示6個
        let dataStart = (pageNum-1) * items ;//從第幾筆資料開始
        let dataStartLen = pageNum*items ;
            if(dataStart===96){
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
    //根據按鈕變換表單中顯示內容(限制地區)
    function selectedBtnChange(page){
        page.preventDefault();
        let selected = document.querySelector('.playLocation').value ;
        let selectedAry = [] ;
        data.forEach(items => {
            if(items.Zone === selected){
                selectedAry.push(items);
            }
        });
        let pageNum = page.target.dataset.num ;
        console.log(selectedAry);
    //每頁顯示6筆
        let str = '' ;
        let finalNum = selectedAry.length % 6 ;
        for(i=(pageNum-1)*6;i<(pageNum-1)*6+finalNum;i++){
            let content =`
                    <div class="list-box">
                            <img src=${selectedAry[i].Picture1}>
                                <h2 class="list-box-title">${selectedAry[i].Name}</h2>
                                    <li class="list-box-sub">${selectedAry[i].Tel}</li>
                                    <li class="list-box-sub">${selectedAry[i].Add}</li>
                                    <li class="list-box-sub">${selectedAry[i].Opentime}</li>
                    </div>
                                    `
            str += content ;
            console.log(selectedAry[i].Picture1);
        }//函數有bug
        list.innerHTML = str ;
    }



    //未按頁碼時顯示前6個景點在網頁上
    (function (){
        let str = '';
        let ary = data.slice(0,6);
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
                for(i=0;i<allBtnNum;i++){
                    btn[i].addEventListener('click',btnChange,false);//記得回來改呼叫函數
            }        
            return
    };
    checkBtn();
}
})();




