const list = document.querySelector('.todoss');
const headerButtons = document.querySelector('.header-buttons');
const inputButton = document.getElementById('file-load');

let tempFile,hasBeenLoaded=false;

/* MODDED VERSION OF MarcFile.js v20181020 - Marc Robledo 2014-2018 - http://www.marcrobledo.com/license */
function MarcFile(a, b) {
    "object" == typeof a && a.files && (a = a.files[0]);
    var c = !1;
    if ("object" == typeof a && a.name && a.size) {
        if ("function" != typeof window.FileReader) throw new Error("Incompatible Browser");
        c = !0, this.fileName = a.name, this.fileType = a.type, this.fileSize = a.size
    } else if ("number" == typeof a) this.fileName = "file.bin", this.fileType = "application/octet-stream", this.fileSize = a;
    else throw new Error("Invalid source");
    if (this.littleEndian = !1, c) this._fileReader = new FileReader, this._fileReader.marcFile = this, this._fileReader.addEventListener("load", function () {
        this.marcFile._u8array = new Uint8Array(this.result), this.marcFile._dataView = new DataView(this.result), b && b
    }, !1), this._fileReader.readAsArrayBuffer(a);
    else if (0 < a) {
        var d = new ArrayBuffer(a);
        this._u8array = new Uint8Array(d), this._dataView = new DataView(d), b && b
    }
}
MarcFile.prototype.IS_MACHINE_LITTLE_ENDIAN = function () {
    var a = new ArrayBuffer(2);
    return new DataView(a).setInt16(0, 256, !0), 256 === new Int16Array(a)[0]
}(), MarcFile.prototype.save = function () {
    var a;
    try {
        a = new Blob([this._u8array], {
            type: this.fileType
        })
    } catch (c) {
        if (window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder, "InvalidStateError" === c.name && window.BlobBuilder) {
            var b = new BlobBuilder;
            b.append(this._u8array.buffer), a = b.getBlob(this.fileType)
        } else {
            throw new Error("Incompatible Browser")
        }
    }
    saveAs(a, this.fileName)
}, MarcFile.prototype.readU8 = function (a) {
    return this._u8array[a]
}, MarcFile.prototype.readU16 = function (a) {
    return this.littleEndian ? this._u8array[a] + (this._u8array[a + 1] << 8) >>> 0 : (this._u8array[a] << 8) + this._u8array[a + 1] >>> 0
}, MarcFile.prototype.readU24 = function (a) {
    return this.littleEndian ? this._u8array[a] + (this._u8array[a + 1] << 8) + (this._u8array[a + 2] << 16) >>> 0 : (this._u8array[a] << 16) + (this._u8array[a + 1] << 8) + this._u8array[a + 2] >>> 0
}, MarcFile.prototype.readU32 = function (a) {
    return this.littleEndian ? this._u8array[a] + (this._u8array[a + 1] << 8) + (this._u8array[a + 2] << 16) + (this._u8array[a + 3] << 24) >>> 0 : (this._u8array[a] << 24) + (this._u8array[a + 1] << 16) + (this._u8array[a + 2] << 8) + this._u8array[a + 3] >>> 0
}, MarcFile.prototype.readS8 = function (a) {
    return this._dataView.getInt8(a, this.littleEndian)
}, MarcFile.prototype.readS16 = function (a) {
    return this._dataView.getInt16(a, this.littleEndian)
}, MarcFile.prototype.readS32 = function (a) {
    return this._dataView.getInt32(a, this.littleEndian)
}, MarcFile.prototype.readF32 = function (a) {
    return this._dataView.getFloat32(a, this.littleEndian)
}, MarcFile.prototype.readF64 = function (a) {
    return this._dataView.getFloat64(a, this.littleEndian)
}, MarcFile.prototype.readBytes = function (a, b) {
    for (var c = Array(b), d = 0; d < b; d++) c[d] = this._u8array[a + d];
    return c
}, MarcFile.prototype.readString = function (a, b) {
    for (var c = "", d = 0; d < b && a + d < this.fileSize && 0 < this._u8array[a + d]; d++) c += String.fromCharCode(this._u8array[a + d]);
    return c
}, MarcFile.prototype.writeU8 = function (a, b) {
    this._u8array[a] = b
}, MarcFile.prototype.writeU16 = function (a, b) {
    this.littleEndian ? (this._u8array[a] = 255 & b, this._u8array[a + 1] = b >> 8) : (this._u8array[a] = b >> 8, this._u8array[a + 1] = 255 & b)
}, MarcFile.prototype.writeU24 = function (a, b) {
    this.littleEndian ? (this._u8array[a] = 255 & b, this._u8array[a + 1] = (65280 & b) >> 8, this._u8array[a + 2] = (16711680 & b) >> 16) : (this._u8array[a] = (16711680 & b) >> 16, this._u8array[a + 1] = (65280 & b) >> 8, this._u8array[a + 2] = 255 & b)
}, MarcFile.prototype.writeU32 = function (a, b) {
    this.littleEndian ? (this._u8array[a] = 255 & b, this._u8array[a + 1] = (65280 & b) >> 8, this._u8array[a + 2] = (16711680 & b) >> 16, this._u8array[a + 3] = (4278190080 & b) >> 24) : (this._u8array[a] = (4278190080 & b) >> 24, this._u8array[a + 1] = (16711680 & b) >> 16, this._u8array[a + 2] = (65280 & b) >> 8, this._u8array[a + 3] = 255 & b)
}, MarcFile.prototype.writeS8 = function (a, b) {
    this._dataView.setInt8(a, b, this.littleEndian)
}, MarcFile.prototype.writeS16 = function (a, b) {
    this._dataView.setInt16(a, b, this.littleEndian)
}, MarcFile.prototype.writeS32 = function (a, b) {
    this._dataView.setInt32(a, b, this.littleEndian)
}, MarcFile.prototype.writeF32 = function (a, b) {
    this._dataView.setFloat32(a, b, this.littleEndian)
}, MarcFile.prototype.writeF64 = function (a, b) {
    this._dataView.setFloat64(a, b, this.littleEndian)
}, MarcFile.prototype.writeBytes = function (b, c) {
    for (var a = 0; a < c.length; a++) this._u8array[b + a] = c[a]
}, MarcFile.prototype.writeString = function (a, b, c) {
    c = c || b.length;
    for (var d = 0; d < b.length && d < c; d++) this._u8array[a + d] = b.charCodeAt(d);
    for (; d < c; d++) this._u8array[a + d] = 0
};
/* implement U16 string in MarcFile (PROVISIONAL!) */
MarcFile.prototype.readU16String = function (pos, maxLength) {
    var cs = new Array(maxLength);
    var str = '';
    for (var i = 0; i < maxLength && this.readU16(pos + i * 2) != 0; i++)
        str += String.fromCharCode(this.readU16(pos + i * 2));
    //cs[i]=this.readU16(pos+i*2);
    return str
}
MarcFile.prototype.writeU16String = function (pos, maxLength, str) {
    for (var i = 0; i < str.length && i < maxLength - 1; i++)
        this.writeU16(pos + i * 2, str.charCodeAt(i));
    for (; i < maxLength; i++)
        this.writeU16(pos + i * 2, 0)
}

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
        }
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



function loadSavegameFromInput(input){
	tempFile=new MarcFile(input.files[0], true);
    hasBeenLoaded = true;
    console.log(tempFile);
    console.log(tempFile.readU32(24))
//    console.log(tempFile.readU32(24))
//    console.log(tempFile.readU32(24))
}

inputButton.addEventListener('change',function(){
    console.log(this.files[0])
    loadSavegameFromInput(this);
    zeldaBotwChecklist.loadSaveGameData();
    console.log(tempFile)
//    console.log(tempFile.readU32(24))
}, false)