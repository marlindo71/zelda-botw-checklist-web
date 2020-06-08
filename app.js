//const addForm = document.querySelector('.add');
const list = document.querySelector('.todoss');

const generateTemplate = todo => {
  
    const html = `
        <li class="d-flex li-unchecked li-items">
          <div class="px-1 li-div-btn">
              <input class="li-input.btn" type="checkbox" id="todo" name="todo" value="todo">
          </div>
          <span class="pl-1">${todo}</span>
        </li>
    `;
    
    list.innerHTML += html;
};


const getQuests = async () => {
    const response =  await fetch('quests.json');
    const data = await response.json();
    
    return data;

};


const transformData = data => {
    filtrado = {}

    for(const name in data) {     
        
        
        let questType = data[name].Quest_Type
        let region = data[name].Region
        
        //Criar os tipos de Quest
        if(!filtrado.hasOwnProperty(questType)){
            filtrado[questType] = {}
        }
        
        questTyoeObject = filtrado[questType]
        
        //Criar as Regiões
        if(!questTyoeObject.hasOwnProperty(region)){
           questTyoeObject[region] = [];
        };
        
        questTyoeObject[region].push(data[name])
        
    }
    
    return filtrado
};


const generateGroupHeader = region => {
    
    let template = `
       <div class="col-auto p-2">
          <ul class="list-group todos mx-auto text-light">
            <li class="list-group-item text-center p-0">${region}</li>
    `;
    
    return template;
    
};

const generateLi = item => {
  
    let template = `
            <li class="list-group-item d-flex li-unchecked li-items p-0">
                <div class="px-1 li-div-btn">
                    <input class="li-input.btn" type="checkbox" id="todo" name="todo" value="todo">
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

const generatePage = data => {
    shrine_quests = data['Side Quest']
    
    console.log(shrine_quests)
    
    let html = ''
    let html_page = ''
    
    for(const region in shrine_quests){
        
        console.log(region)
        
        html = generateGroupHeader(region) 
        
        shrine_quests[region].forEach(quest => {
            questText = `${quest['Quest_Name']} | ${quest['Location']}`;
            html += generateLi(questText)
        });
        
        html += generateGroupFooter()
        
        html_page += html
        
    }
    
//    let html = generateGroupHeader('Lanaruy Region')
//    html += generateLi('Dahsdkja | sdkjhfsdf')
//    html += generateLi('Dahsdkja | sdkjhfsdf')
//    html += generateGroupFooter()
    
    list.innerHTML = html_page;
    
    console.log(html_page)
    
};

getQuests().then(data => {
    //Retorna um objeto separado por quests
    questData = transformData(data)
    generatePage(questData)
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