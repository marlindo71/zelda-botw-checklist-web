const list = document.querySelector('.todoss');
const headerButtons = document.querySelector('.header-buttons');
const inputButton = document.getElementById('file-load');
const loginButton = document.getElementById('loginButton');
const hideCompletedButton = document.getElementById('hideCompleted');


var firebaseConfig = {
    apiKey: "AIzaSyAv0ezDkgE3oe9AkrJELuwOUc_XjwYIvm4",
    authDomain: "zelda-botw-checklist.firebaseapp.com",
    databaseURL: "https://zelda-botw-checklist.firebaseio.com",
    projectId: "zelda-botw-checklist",
    storageBucket: "zelda-botw-checklist.appspot.com",
    messagingSenderId: "248731649524",
    appId: "1:248731649524:web:88bf9c7ea0682c001f65a1",
    measurementId: "G-6FMHLKDWH6"
};


const getQuests = async () => {
    const response = await fetch('quests.json');
    const data = await response.json();

    return data;

};

const generateGroupHeader = (region, total, completed) => {

    let perc = Math.round(completed / total * 100)

    let template = `
       <div class="card m-3">
          <ul class="list-group todos mx-auto text-light">
            <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" style="width: ${perc}%" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${total}">
                    <li class="list-group-item text-center p-0 border-0 li-header">${region} - (${completed}/${total}) - ${perc}%</li>
                </div>
            </div>

    `;

    return template;

};

const generateLi = (item, item_id, value) => {

    let valueClass;
    let valueClassIcon;
    let display_type = "d-flex"

    if (value == 0) {
        valueClass = "li-unchecked";
        valueClassIcon = "fa-square text-danger";
    } else {
        valueClass = "li-checked";
        valueClassIcon = "fa-check-square text-success";
        if (zeldaBotwChecklist.hideComplete) display_type = "d-none"

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
            <li class="list-group-item ${display_type} ${valueClass} li-items p-0" id="${item_id}">
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
        this.isAnonymous = true;
        this.userData = {};
        this.headerData = {};
        this.hideComplete = false;
    }
    loadUserData(data) {
        for (const key in data) {
            this.userData[key] = {
                "Quest_Name": data[key]['Quest_Name'],
                "Quest_Name": data[key]['Quest_Name'],
                "value": 0
            }
        }
    }
    loadQuestData(data) {
        for (const name in data) {

            let questType = data[name].Quest_Type
            let region = data[name].Region

            //Criar os tipos de Quest
            if (!this.headerData.hasOwnProperty(questType)) {
                this.headerData[questType] = {}
            }

            let questTyoeObject = this.headerData[questType]

            //Criar as Regiões
            if (!questTyoeObject.hasOwnProperty(region)) {
                questTyoeObject[region] = {
                    "Completed": 0,
                    "Total": 0,
                    "Quests": []
                };

            };

            questTyoeObject[region]['Quests'].push(data[name])
            questTyoeObject[region]['Total'] += 1;
        }
    }
    getPageHTML(questType) {
        let questDatas = this.headerData[questType]

        let html = ''
        let html_page = ''

        for (const region in questDatas) {

            let total = this.headerData[questType][region]['Total'];
            let completed = 0;
            //            let completed = this.headerData[questType][region]['Completed'];
            html = ""
            //            html = generateGroupHeader(region, total, completed)
            questDatas[region]['Quests'].forEach(quest => {
                let questText = `${quest['Quest_Name']} | ${quest['Location']}`;
                let questID = quest['Properties']['Hash_Value_Int32'];
                let questValue = this.userData[questID]['value'];
                completed += questValue;
                html += generateLi(questText, questID, questValue)
            });
            html += generateGroupFooter()

            html = generateGroupHeader(region, total, completed) + html

            html_page += html

        }


        return html_page;
    }
    toggleValue(questID) {
        if (this.userData[questID].value == 0) {
            this.userData[questID].value = 1;
        } else {
            this.userData[questID].value = 0;
        }
        if (this.isAnonymous) {
            window.localStorage.setItem('userData', JSON.stringify(zeldaBotwChecklist.userData));
        } else {
            const userUid = firebase.auth().currentUser.uid
            const db = firebase.firestore();
            db.collection('users').doc(userUid).update({
                [`userData.${questID}.value`]: this.userData[questID].value
            }).then(function () {
                console.log("Salvo");
            })

        };
    }
    checkValidSavegame() {
        return true;
    }
    preload() {

    }
    load() {
        tempFile.fileName = 'game_data.sav';

        for (const questType in this.headerData) {
            for (const region in this.headerData[questType]) {

                this.headerData[questType][region]['Completed'] = 0;

                this.headerData[questType][region]['Quests'].forEach(quest => {
                    let offset = parseInt(quest.Properties.Offset) + 4
                    let value = tempFile.readU32(offset)
                    let hash_id = quest.Properties.Hash_Value_Int32
                    this.userData[hash_id].value = value;
                    if (value) this.headerData[questType][region]['Completed'] += 1;
                })
            }
        }
        if (this.isAnonymous) {
            window.localStorage.setItem('userData', JSON.stringify(zeldaBotwChecklist.userData));
        } else {
            const userUid = firebase.auth().currentUser.uid
            const db = firebase.firestore();
            db.collection('users').doc(userUid).set({
                userData: zeldaBotwChecklist.userData
            });

        }

        let btnActive = headerButtons.querySelector('.active').id.replace('_', ' ')
        list.innerHTML = this.getPageHTML(btnActive)

    }
};

const zeldaBotwChecklist = new ZeldaBotwChecklist();

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loginButton.lastChild.data = user.email;
        zeldaBotwChecklist.isAnonymous = false;
        const db = firebase.firestore();

        db.collection('users').doc(user.uid).get().then((doc) => {

            if (doc.exists) {
                console.log("Document data:", doc.data().userData);
                zeldaBotwChecklist.userData = doc.data().userData;
                list.innerHTML = zeldaBotwChecklist.getPageHTML('Side Quest')
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                console.log('Novo usuário. Adicionando no firestore')

                if (zeldaBotwChecklist.userData) {
                    db.collection('users').doc(user.uid).set({
                        userData: zeldaBotwChecklist.userData
                    });
                }
            }
        })
    }
});


const login = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token.
        let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        if (user) loginButton.lastChild.data = user.email;
    });
};

const logout = () => {

    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        loginButton.lastChild.data = "Sign in with Google";
    }).catch(function (error) {

        // An error happened.
    });

};

getQuests().then(data => {
    //Retorna um objeto separado por quests
    zeldaBotwChecklist.loadQuestData(data)
    let localUserData = window.localStorage.getItem('userData')
    if (localUserData) {
        zeldaBotwChecklist.userData = JSON.parse(localUserData)
    } else {
        zeldaBotwChecklist.loadUserData(data)
        window.localStorage.setItem('userData', JSON.stringify(zeldaBotwChecklist.userData));
    }

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

    if ((e.target.tagName == 'INPUT' && el.classList.contains('li-checked') == e.target.checked) || e.target.tagName == 'SPAN') {

    } else {

        el_icon = el.querySelector('i');
        const headerPB = el.parentNode.querySelector('.progress-bar')
        let completed = Number(headerPB.getAttribute("aria-valuenow"))
        const total = Number(headerPB.getAttribute("aria-valuemax"))



        if (el.classList.contains('li-unchecked')) {
            el.classList.remove('li-unchecked')
            el.classList.add('li-checked')

            el_icon.classList.remove('fa-square', 'text-danger')
            el_icon.classList.add('fa-check-square', 'text-success')

            completed += 1;

            if (zeldaBotwChecklist.hideComplete) {

                setTimeout(() => {
                    el.classList.remove('d-flex')
                    el.classList.add('d-none')
                }, 200);
            }




        } else if (el.classList.contains('li-checked')) {
            el.classList.remove('li-checked')
            el.classList.add('li-unchecked')

            el_icon.classList.remove('fa-check-square', 'text-success')
            el_icon.classList.add('fa-square', 'text-danger')

            completed -= 1;
        }

        headerPB.setAttribute("aria-valuenow", completed)
        const perc = Math.round(completed / total * 100)
        //    console.log(headerPB.style.width)
        headerPB.style.width = `${perc}%`;

        console.log(completed, total)

        zeldaBotwChecklist.toggleValue(el.id)

    }
})

headerButtons.addEventListener('click', e => {
    if (e.target.classList.contains('btn')) {
        let btnId = e.target.id.replace('_', ' ')
        list.innerHTML = zeldaBotwChecklist.getPageHTML(btnId)
        $(".btn-group").button("toggle");
    }
})

inputButton.addEventListener('change', function () {
    loadSavegameFromInput(this);
}, false)

loginButton.addEventListener('click', e => {

    if (!firebase.auth().currentUser) {
        login();
    } else {
        logout();
    }

    console.log(e.target)
}, false)

hideCompletedButton.addEventListener('click', e => {
    zeldaBotwChecklist.hideComplete = e.target.checked;
    let btnActive = headerButtons.querySelector('.active').id.replace('_', ' ')
    list.innerHTML = zeldaBotwChecklist.getPageHTML(btnActive)

}, false)