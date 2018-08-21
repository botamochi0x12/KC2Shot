// 艦これのiFrameで動くcontent script

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if(msg.command && (msg.command == 'takeScreenshot')) {
        console.log(msg.command);
        window.requestAnimationFrame((timestamp) => {
            
            var imageType = msg.format === 'jpeg' ? 'image/jpeg' : 'image/png';

            // 艦これのゲーム画面が描画されるcanvas
            var canvas = document.getElementsByTagName("canvas")[0];
            var base64 = canvas.toDataURL(imageType);
        
            // スクリーンショット連写できるように、ダウンロードリンクの生成はbackground.jsに任せる。
            chrome.runtime.sendMessage({ type: 'screenshotResult', data: base64, format: msg.format }, null);
        });
    }
});
