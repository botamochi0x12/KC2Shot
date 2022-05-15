// 艦これタブのスクリーンショットを撮って、ゲーム画面部分を切り抜いて画像ファイルとしてダウンロードする。

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.storage.sync.get(["imageFormatSelection", "imageFileNamePrefix"], (items) => {
        chrome.tabs.sendMessage(tab.id, { 
            command: 'takeScreenshot', 
            format: items.imageFormatSelection,
            namingPrefix: items.imageFileNamePrefix },
            null);
    });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    console.log(msg);
    
    if(!msg.type || msg.type !== 'screenshotResult') return;

    var extension = msg.format === 'jpeg' ? '.jpg' : '.png';

    // 艦これのcanvasから生成した画像データ
    var blob = base64toBlob(msg.data);
    var fileName = generateFileNameWithoutExtension() + extension;

    // blobデータをa要素を使ってダウンロード
    saveBlob(blob, fileName);
});

// Base64 DataURLをBlobデータに変換
// [Data URLs - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
function base64toBlob(base64) {
    var tmp = base64.split(',');
    
    var data = atob(tmp[1]);
    var mime = tmp[0].split(':')[1].split(';')[0];

    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }

    var blob = new Blob([buf], { type: mime });
    return blob;
}

// 画像のダウンロード
function saveBlob(blob, fileName) {
    var url = (window.URL || window.webkitURL);
    var dataUrl = url.createObjectURL(blob);

    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = dataUrl;
    a.download = fileName;

    a.dispatchEvent(event);
}

function generateFileNameWithoutExtension() {
    var now = new Date(Date.now());
    var timestamp = formatDate(now, 'YYYYMMDD-hhmmssSSS');
    var fileName = 'KanColle2nd-' + timestamp;
    return fileName;
}

function formatDate(date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
};
