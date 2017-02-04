$(function(){

    var globallist;
    loadpage()

    function loadpage(){

        chrome.storage.sync.get('groupsites',function(limits){
            globallist = limits.groupsites;
            show_tags(limits.groupsites);
        });
    }

    $('#save').click(function(){
        if($('#newtag').val().length > 0 ){
            chrome.storage.sync.get('groupsites',function(limits){
                if(!('groupsites' in limits))
                    limits.groupsites = {}
                limits.groupsites[$('#newtag').val()] = [];
                updatedata(limits.groupsites,function(){$('#newtag').val('')})
                    // on update
            });
        }
    })

    $('body').on('click', '.del', function() {
        if(window.confirm('Are you sure you want to delete this URL?')){
            parentelem = $(this).parent()[0].className
            globallist[$(this).parent().parent()[0].id].splice(parseInt(parentelem.slice(5)),1)
            updatedata(globallist)
        }
    });

    $('body').on('click', '.open', function() {
        var that = $(this).parent().parent()[0].id
        $.each(globallist[that],function(k,v){
            chrome.tabs.create({url:Object.values(v)[0]}, function(){})
        })
    });

    $('body').on('click', '.deltag', function() {
        if(window.confirm('Are you sure you want to delete this tag and all its URLs ?')){
            var that = $(this).parent().parent()[0].id
            delete globallist[that]
            updatedata(globallist)
        }
    });

    $('body').on('click', '.edit', function() {
        var parent = $(this).parent();
        var val_id = parent.parent()[0].id;
        parentelem = parent[0].className
        var cls = parseInt(parentelem.slice(5))
        var elem = globallist[val_id][cls]
        parent.empty();
        parent.append('<input class="edittitle"> <input class="editurl"> <button class="editsave btn btn-sm btn-info right"> SAVE </button> ')
        $('.edittitle')[0].value = Object.keys(elem)[0]
        $('.editurl')[0].value = Object.values(elem)[0]


    });

    $('body').on('click','.editsave',function(){
        var elem = $(this).parent()
        var tag = elem.parent()[0].id
        var cls = elem[0].className
        var index = parseInt(cls.slice(5))
        var obj = globallist[tag][index]
        var newtitle = elem.find('.edittitle')[0].value
        var newvalue = elem.find('.editurl')[0].value
        if(newtitle != Object.keys(obj)[0]){
            var newdata ={}
            newdata[newtitle]=newvalue
            globallist[tag].splice(index,1)
            globallist[tag].push(newdata)
        }else{
            obj[Object.keys(obj)[0]] = newvalue;
        }
        updatedata(globallist,function(){loadpage();})
    })

    $('#delall').click(function(){
        chrome.storage.sync.remove('groupsites');
        loadpage()
    })

    $('#searchtag').on('keyup',function(e){
        if(e.which == 27)
            $('#searchtag').val('')
        if(globallist != undefined)
            show_tags(globallist,$('#searchtag').val())
    })

    function updatedata(data,callback){
        chrome.storage.sync.set({'groupsites':data}, function(){
            loadpage()
            if(callback != undefined)
                callback()
        });
    }

    function show_tags(obj,param=''){
        $('#extags').empty()
        $.each(obj,function(key,val){
            if(param != undefined)
                if(!key.includes(param))
                    return true
            $('#extags').append('<div id='+key+' class="block"> <h3>'+key +'    &nbsp;&nbsp; <button class="deltag btn btn-danger btn-sm right"> Delete this tag its URLs</button> <button class="open btn btn-default btn-sm right" > Open all in new tabs </button>')
            $('#'+key).append('</br>')
            $.each(val,function(uk,uv){
                $('#'+key).append('<li class="iurl '+uk +'""><a target="_blank" href='+Object.values(uv)[0]+ ' >' +Object.keys(uv)[0]+ '</a>' +' &nbsp;&nbsp; <button class="del right btn btn-danger btn-sm"'+'>Delete</button> <button class="edit right btn btn-default btn-sm"> Edit </button>')
            })
            $('#extags').append('</br>')
            $('#extags').append('</br>')
        })
    }

});