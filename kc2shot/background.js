// 艦これタブのスクリーンショットを撮って、ゲーム画面部分を切り抜いて画像ファイルとしてダウンロードする。

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.captureVisibleTab(null, {format:"png"}, (base64Data) => {

        chrome.tabs.sendMessage(tab.id, { command: 'offsetRequest' }, (msg) => {
            if(!msg.offset) return;

            crop(base64Data, msg.offset, (cropped) => {
                var blob = base64toBlob(cropped);
                var fileName = generateFileNameWithoutExtension() + '.jpg';
        
                // blobデータをa要素を使ってダウンロード
                saveBlob(blob, fileName);
            });
        });
    });
  });


var croppingCanvas = undefined;
let kcWidth = 1200;
let kcHeight = 720;

// 艦これゲーム画面部分を切り抜く
function crop(base64DataUrl, offset, callback) {
    if(!croppingCanvas) croppingCanvas = document.createElement('canvas');

    croppingCanvas.width = kcWidth;
    croppingCanvas.height = kcHeight;

    var image = new Image();
    image.onload = function() {
        croppingCanvas.getContext('2d').drawImage(image,
            offset.left, offset.top, kcWidth, kcHeight,
            0, 0, kcWidth, kcHeight);

        var croppedDataUrl = croppingCanvas.toDataURL("image/jpeg");

        callback(croppedDataUrl);
    };

    image.src = base64DataUrl;
}


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
