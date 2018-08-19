
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    // タブの原点から艦これゲーム画面までのオフセットを返す
    if(msg.command && (msg.command == 'offsetRequest')) {
        var game_frame = document.getElementById("game_frame");
        var rect = game_frame.getBoundingClientRect();
    
        // 艦これゲーム画面が描画されるcanvasまでのマージン。
        var topMargin = 16;
        var topOffset = rect.top + topMargin;

        // ピクセル単位で切り抜くので切り上げる。
        var leftOffset = Math.round(rect.left);

        sendResponse({ offset: { top: topOffset, left: leftOffset } });
    }
});
