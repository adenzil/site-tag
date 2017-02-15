$(function(){
	
	var url;
    var title;

    $('#savepage').prop('disabled',true)

	chrome.tabs.query({'highlighted':true}, function(tab){
		tab = tab[0]
		url = tab.url
        title = tab.title
		$('#title').text(tab.title)
	})

    chrome.storage.sync.get('groupsites',function(limits){
        $.each(limits.groupsites,function(key,val){
            $('#optags').append($('<option>',{
            	value: key,
            	text: key
            }))
        })
        if($.isEmptyObject(limits.groupsites)){
            // $('.tagdata').hide();
            $('#error').show();
        }
        else
            $('#savepage').prop('disabled',false);
    });

    $('#error').click(function(){
        chrome.runtime.openOptionsPage(function(){})
    })

    $('#savepage').click(function(){
    	var tag = $('#optags').val()
    	chrome.storage.sync.get('groupsites',function(limits){
            var obj = {}
            obj[title] = url
            limits.groupsites[tag].push(obj)
            chrome.storage.sync.set({'groupsites':limits.groupsites}, function(){
                window.close()
            });
        });
    })

    $('#screenshot').click(function(){
        chrome.tabs.captureVisibleTab(null,null,function(url){
            download(url,'screenshot.jpg');
            delete url;
        })
    })

    $('#optionspage').click(function(){
        chrome.runtime.openOptionsPage(function(){})
    })

    $('#close').on('click',function(){

        var minutes = $('#minutes').val();
        var seconds = $('#seconds').val();

        if(minutes == parseInt(minutes, 10) || seconds == parseInt(seconds, 10)){

            var totaltime = 0;

            if(minutes)
                totaltime += minutes*60*1000;

            if(seconds)
                totaltime += seconds*1000;

            chrome.tabs.query({'highlighted': true},function(tab) {
                chrome.runtime.sendMessage({timer:{'id':tab[0].id, 'title': tab[0].title, 'url':tab[0].url, 'totaltime':totaltime, 'permanent':$('#alwaysclose').is(':checked')}}, function(response) {
                    $('#minutes').val('');
                    $('#seconds').val('');
                    window.close();
                });
            });        

        }else{
            $('#minutes').attr("placeholder",'enter valid numbers');
            $('#seconds').attr("placeholder",'enter valid numbers');
        }

    })

})