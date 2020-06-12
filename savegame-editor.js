/*
	savegame-editor.js v20190411
	A library that lets you create easily a savegame editor. Made with vanilla JS.

	by Marc Robledo 2016-2019
	http://www.marcrobledo.com/license
*/

/* LIBRARIES */
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
        this.marcFile._u8array = new Uint8Array(this.result), this.marcFile._dataView = new DataView(this.result), b && b.call()
    }, !1), this._fileReader.readAsArrayBuffer(a);
    else if (0 < a) {
        var d = new ArrayBuffer(a);
        this._u8array = new Uint8Array(d), this._dataView = new DataView(d), b && b.call()
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


/* savegame load/save */
var tempFile,hasBeenLoaded=false;

function _tempFileLoadFunction(){
	if(zeldaBotwChecklist.checkValidSavegame()){
//		hide('dragzone');

		if(zeldaBotwChecklist.preload && !hasBeenLoaded){
			zeldaBotwChecklist.preload();
			hasBeenLoaded=true;
		}
		zeldaBotwChecklist.load();
//		show('the-editor');
//		show('toolbar');
	}else{
//		MarcDialogs.alert('Invalid savegame file');
	}
}

function loadSavegameFromInput(input){
	tempFile = new MarcFile(input.files[0], _tempFileLoadFunction);
}