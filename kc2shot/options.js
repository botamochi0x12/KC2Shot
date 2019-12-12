
document.addEventListener("DOMContentLoaded", function(event) {
    var select = document.getElementById('imageFormatSelection');

    select.add(new Option('png', 'png'));
    select.add(new Option('jpeg', 'jpeg'));

    select.onchange = function() {
        var selectedItem = this.options[ this.selectedIndex ];
        setCurrentFormat(selectedItem.value);
    };

    getCurrentFormat((current) => selectValue(current));
});

function selectValue(value) {
    var select = document.getElementById('imageFormatSelection');

    for (let index = 0; index < select.length; index++) {
        if(select.options[index].value === value)
        {
            select.selectedIndex = index;
            break;
        }
    }
}

function getCurrentFormat(callback) {
    chrome.storage.sync.get("imageFormat", function(items) {
        if(!items.imageFormat)
        {
            setCurrentFormat('png');
            items.imageFormat = 'png';
        }

        callback(items.imageFormat);
    });
}

function setCurrentFormat(value) {
    chrome.storage.sync.set({"imageFormat": value}, null);
}
