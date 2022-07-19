// 艦これタブのスクリーンショットを撮って、ゲーム画面部分を切り抜いて画像ファイルとしてダウンロードする。

// Crhome拡張のアイコンがクリックされた時の処理。
chrome.action.onClicked.addListener((tab) => {
    // 保存形式を設定から読み込んで、艦これタブにスクショ撮影リクエストを送る。
    chrome.storage.sync.get("imageFormat", (items) => {
        chrome.tabs.sendMessage(tab.id, { command: 'takeScreenshot', format: items.imageFormat }, null);
    });
});

// 艦これタブで撮影されたスクショデータを受け取ってファイルに保存する。
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    console.log(msg);
    
    if(!msg.type || msg.type !== 'screenshotResult') return;

    var extension = msg.format === 'jpeg' ? '.jpg' : '.png';

    var fileName = generateFileNameWithoutExtension() + extension;

    // 艦これのcanvasから生成した画像データ(Data URLs)をファイルとしてダウンロードする。
    // [Data URLs - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
    chrome.downloads.download({
        url: msg.data,
        filename: fileName
    })
});


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
