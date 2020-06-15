const list = document.querySelector('.todoss');
const headerButtons = document.querySelector('.header-buttons');
const inputButton = document.getElementById('file-load');
const loginButton = document.getElementById('loginButton');

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

const generateLi = (item, item_id, value) => {
        
        let valueClass;
        let valueClassIcon;
    
        if(value == 0){
            valueClass = "li-unchecked";
            valueClassIcon = "fa-square text-danger";
        } else {
            valueClass = "li-checked";
            valueClassIcon = "fa-check-square text-success";
        }
    
//        let template = `
//            <li class="list-group-item d-flex ${valueClass} li-items p-0" id="${item_id}">
//                <div class="li-div-btn">
//                       <label class="custom-checkbox">
//      <input type="checkbox" value="checkbox1">
//      <span></span>
//    </label>
//                </div>
//                <span class="pl-1 pr-1">${item}</span>
//            </li>
//    `;
    
        let template = `
            <li class="list-group-item d-flex ${valueClass} li-items p-0" id="${item_id}">
                <div class="li-div-btn">
                    <i class="far icon-center ${valueClassIcon}"></i>
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
//        console.log("Criou classe")
    }
    loadUserData(data) {
        this.userData = data;
        for(const key in this.userData) {
            this.userData[key]['value'] = 0;
        }
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
                let questID = quest['Properties']['Hash_Value_Int32'];
                let questValue = quest['value'];
                html += generateLi(questText,questID,questValue)
            });

            html += generateGroupFooter()

            html_page += html

        }
        return html_page;  
    }
    toggleValue(questID) {
        if(this.userData[questID].value == 0) {
            this.userData[questID].value = 1;
        } else {
            this.userData[questID].value = 0;
        }
    }
    loadSaveGameData() {
        for(const key in this.userData) {
            let offset = parseInt(this.userData[key].Properties.Offset) + 4
//            console.log(offset)
//            console.log(tempFile)
            console.log("Load1")
            console.log(tempFile.readU32(24))
        }
        
    }
    checkValidSavegame() {
        return true;
    }
    preload() {
        
    }
    load() {
        tempFile.fileName='game_data.sav';
        for(const key in this.userData) {
            let offset = parseInt(this.userData[key].Properties.Offset) + 4
            this.userData[key].value = tempFile.readU32(offset)
        }
        let btnActive = headerButtons.querySelector('.active').id.replace('_',' ')
        list.innerHTML = this.getPageHTML(btnActive)
    }
};

const zeldaBotwChecklist = new ZeldaBotwChecklist();

const login = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token.
        let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        console.log("login: ", user )
    });
};

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
    
    if((e.target.tagName == 'INPUT' && el.classList.contains('li-checked') == e.target.checked) || e.target.tagName == 'SPAN'){
        
    } else {
        
    el_icon = el.querySelector('i');
       
    if(el.classList.contains('li-unchecked')){
        el.classList.remove('li-unchecked')
        el.classList.add('li-checked')

        el_icon.classList.remove('fa-square','text-danger')
        el_icon.classList.add('fa-check-square','text-success')           
        
    }else if(el.classList.contains('li-checked')) {
        el.classList.remove('li-checked')
        el.classList.add('li-unchecked')
        
        el_icon.classList.remove('fa-check-square','text-success')
        el_icon.classList.add('fa-square','text-danger') 

    
    }
    
    zeldaBotwChecklist.toggleValue(el.id)
        
}
})

headerButtons.addEventListener('click', e => {
    if(e.target.classList.contains('btn')){
        let btnId = e.target.id.replace('_',' ')
        list.innerHTML = zeldaBotwChecklist.getPageHTML(btnId)
        $(".btn-group").button("toggle");
    }
})

inputButton.addEventListener('change',function(){
//    console.log(this.files[0])
    loadSavegameFromInput(this);
    
//    zeldaBotwChecklist.loadSaveGameData()
//    zeldaBotwChecklist.loadSaveGameData();
//    console.log(tempFile)
//    console.log(tempFile.readU32(24))
}, false)

loginButton.addEventListener('click', e => {
login();
}, false)