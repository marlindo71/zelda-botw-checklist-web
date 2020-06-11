const list = document.querySelector('.todoss');
const headerButtons = document.querySelector('.header-buttons');

const getQuests = async () => {
    const response =  await fetch('quests.json');
    const data = await response.json();
    
    return data;

};

const generateGroupHeader = region => {
    
    let template = `
       <div class="card">
          <ul class="list-group todos mx-auto text-light">
            <li class="list-group-item text-center p-0">${region}</li>
    `;
    
    return template;
    
};

const generateLi = item => {
  
//    let template = `
//            <li class="list-group-item d-flex li-unchecked li-items p-0">
//                <div class="px-1 li-div-btn">
//                    <input class="li-input.btn" type="checkbox" id="todo" name="todo" value="todo">
//                </div>
//                <span class="pl-1 pr-1">${item}</span>
//            </li>
//    `;

        let template = `
            <li class="list-group-item d-flex li-unchecked li-items p-0">
                <div class="li-div-btn">
                       <label class="custom-checkbox">
      <input type="checkbox" value="checkbox1">
      <span></span>
    </label>
                </div>
                <span class="pl-1 pr-1">${item}</span>
            </li>
    `;
    
    
    return template;
    
};

const generateGroupFooter = item => {
  
    let template = `
            </ul>
        </div>
    `;
    
    return template;
    
};

class ZeldaBotwChecklist {
    constructor() {
        this.userData = {};
        this.questData = {};
        console.log("Criou classe")
    }
    loadUserData(data) {
        this.userData = data;
    }
    loadQuestData(data) {
        for(const name in data) {     

            let questType = data[name].Quest_Type
            let region = data[name].Region

            //Criar os tipos de Quest
            if(!this.questData.hasOwnProperty(questType)){
                this.questData[questType] = {}
            }

            let questTyoeObject = this.questData[questType]

            //Criar as Regiões
            if(!questTyoeObject.hasOwnProperty(region)){
               questTyoeObject[region] = [];
            };

            questTyoeObject[region].push(data[name])

        }    
    }
    getPageHTML(questType) {
        let questDatas = this.questData[questType]

        let html = ''
        let html_page = ''

        for(const region in questDatas){

            html = generateGroupHeader(region) 

            questDatas[region].forEach(quest => {
                let questText = `${quest['Quest_Name']} | ${quest['Location']}`;
                html += generateLi(questText)
            });

            html += generateGroupFooter()

            html_page += html

        }
        return html_page;  
    }
};

const zeldaBotwChecklist = new ZeldaBotwChecklist();

getQuests().then(data => {
    //Retorna um objeto separado por quests
    zeldaBotwChecklist.loadUserData(data)
    zeldaBotwChecklist.loadQuestData(data)
    list.innerHTML = zeldaBotwChecklist.getPageHTML('Side Quest')
});

list.addEventListener('mousedown', function (event) {
  if (event.detail > 1 && event.target.tagName != 'SPAN') {
    event.preventDefault();
    // of course, you still do not know what you prevent here...
    // You could also check event.ctrlKey/event.shiftKey/event.altKey
    // to not prevent something useful.
  }
}, false);

list.addEventListener('click', e => {
    
    let el = e.target
    // walk up the tree until we find a LI item
    while (el && !el.classList.contains('li-items')) {
        el = el.parentNode
    }
    
    console.log(e.target.tagName)
    if((e.target.tagName == 'INPUT' && el.classList.contains('li-checked') == e.target.checked) || e.target.tagName == 'SPAN'){
        
    } else {
        
    
       
    if(el.classList.contains('li-unchecked')){
        el.classList.remove('li-unchecked')
        el.classList.add('li-checked')
    }else {
        el.classList.remove('li-checked')
        el.classList.add('li-unchecked')        
    }

    if(e.target.tagName !== 'INPUT'){
        el.querySelector('input').click()
    }
        
        
}
})

headerButtons.addEventListener('click', e => {
    if(e.target.classList.contains('btn')){
        console.log(e.target)
        let btnId = e.target.id.replace('_',' ')
        console.log(btnId)
        list.innerHTML = zeldaBotwChecklist.getPageHTML(btnId)
        $(".btn-group").button("toggle");
    }
})

