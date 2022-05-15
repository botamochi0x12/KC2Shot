
document.addEventListener("DOMContentLoaded", function(event) {
    var select = document.getElementById('imageFormatSelection');

    select.add(new Option('png', 'png'));
    select.add(new Option('jpeg', 'jpeg'));

    select.onchange = function() {
        var selectedItem = this.options[ this.selectedIndex ];
        setCurrentFormat(selectedItem.value);
    };
    
    getCurrentFormat((current) => selectFormat(current));
    
    var selector = document.getElementById('imageNamingPrefix');

    selector.add(new Option('KanColle2nd', 'KanColle2nd-'));

    selector.onchange = function() {
        var selectedItem = this.options[ this.selectedIndex ];
        setCurrentPrefix(selectedItem.value);
    };
    
    getCurrentNamingPrefix((current) => selectNamingPrefix(current));
});

function selectFormat(value) {
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
    chrome.storage.sync.get("imageFormatSelection", function(items) {
        if(!items.imageFormatSelection)
        {
            setCurrentFormat('png');
            items.imageFormatSelection = 'png';
        }

        callback(items.imageFormatSelection);
    });
}

function setCurrentFormat(value) {
    chrome.storage.sync.set({"imageFormatSelection": value}, null);
}


function selectNamingPrefix(value) {
    var select = document.getElementById('imageNamingPrefix');

    for (let index = 0; index < select.length; index++) {
        if(select.options[index].value === value)
        {
            select.selectedIndex = index;
            break;
        }
    }
}

function getCurrentNamingPrefix(callback) {
    chrome.storage.sync.get("imageNamingPrefix", function(items) {
        if(!items.imageNamingPrefix)
        {
            setCurrentNamingPrefix('KanColle2nd');
            items.imageNamingPrefix = 'KanColle2nd-';
        }

        callback(items.imageNamingPrefix);
    });
}

function setCurrentNamingPrefix(value) {
    chrome.storage.sync.set({"imageNamingPrefix": value}, null);
}
