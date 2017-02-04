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
        if($.isEmptyObject(limits.groupsites))
            $('#error').text('Click here to add a new tag to save this website');
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

})