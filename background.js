var menuItem = {
    "id": "close_tab",
    "title": "Set a timer to close this tab",
    "contexts": ["all"]
};

var mainmenu = chrome.contextMenus.create(menuItem);

var onemin = {
    "id": "one_min",
    "title": "Close in 1 minute",
    "parentId": mainmenu,
    "contexts": ["all"]
}

var fivemin = {
    "id": "five_min",
    "title": "Close in 5 minute",
    "parentId": mainmenu,
    "contexts": ["all"]
}


chrome.contextMenus.create(onemin);
chrome.contextMenus.create(fivemin);


chrome.contextMenus.onClicked.addListener(function(clickData){
    var tabid = clickData.menuItemId;
    if (tabid == "close_tab" || tabid == "one_min" || tabid == "five_min"){

        var tab = {};
        var totaltime

        switch(tabid){
            case "one_min":
                totaltime = 60000;
                break;
            case "five_min":
                totaltime = 300000;
                break;
            default:
                totaltime = 30000
        }


        chrome.tabs.query({'highlighted': true},function(tb) {
                tab.id = tb[0].id;
                tab.title = tb[0].title;
                set_timer(tab.id,tab.title,totaltime);
        });        
       

    }
});

function set_timer(id, pagename, totaltime){

    var timeout = setTimeout(function(){
        chrome.tabs.remove(id, function() { });
        chrome.browserAction.setBadgeText({"text": ""});
        sec = 0;
        clearInterval(fsec);
    },totaltime);

    title = "Your timer has started";
    message = "you have "+totaltime/1000+" seconds left";
    notification(title,message);

    var sec = totaltime/1000;

    var fsec = setInterval(function(){
        sec -= 5;
        chrome.browserAction.setBadgeText({"text": sec.toString()});
    },5000);

    var half = setInterval(function() {
        clearInterval(half);
        title = "You have utilized 50% of your time!";
        message = "You have "+(totaltime/2)/1000+" seconds left on "+pagename;
        notification(title, message);
    }, totaltime/2);
    
}

function notification(title, message){
    
    var notifOptions = {
            type: "basic",
            iconUrl: "sitetag48.png",
            title: title,
            message: message
    };
    chrome.notifications.create('timernotif', notifOptions);

}