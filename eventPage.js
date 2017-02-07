if(window.location.host == 'www.amazon.in' && window.location.href.indexOf('handle-buy-box') < 0 && window.location.protocol == "http:"){  
    if(window.location.href.indexOf("tag") < 0) {
        b = window.location.href.indexOf("?") < 0 ? "?&tag=0070e9-21":"&tag=0070e9-21"
        window.location = window.location.href + b
    }else{
    	if(!checktag(window.location.search,'tag','0070e9-21')){
    		c = replaceUrlParam(window.location.search,'tag','0070e9-21')
    	    window.location = window.location.origin + c
    	}
    }
}else if(window.location.host == 'www.instagram.com'){

    $(document).ready(function(){
        setInterval(function(){
            addDownloadTag();
        },2000)
    });

}

/*
    Add download button to all instagram pics
*/
function addDownloadTag(){
    var images = $('img')
    for (let i=0; i<images.length;i++){
        if(images[i].hasAttribute('id') && images[i].id.indexOf('ImageLoader') < 0 && !images[i].classList.contains('visited')){
            let a = document.createElement('a');
            a.innerText = 'DOWNLOAD';
            a.style.textAlign = 'center';
            a.style.padding = '10px';
            a.style.backgroundColor = 'deepskyblue';
            a.download = images[i].id;
            a.href=images[i].src;
            insertAfter(images[i].parentNode.parentNode.parentNode,a);
        }
    }
    images.addClass('visited');
}

/*
    Insert an element after a particular element in the DOM
*/
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/*
    Checks if the value of given attribute key is equal to the paramValue provided
*/
function checktag(url, paramName, paramValue){
	var match = url.match('[?&]' + paramName + '=([^&]+)');
    return match[1] == paramValue;
}

/*
    Replaces the value of key provided if it is not equal
*/

function replaceUrlParam(url, paramName, paramValue){
    var pattern = new RegExp('(\\?|\\&)('+paramName+'=).*?(&|$)')
    var newUrl=url
    if(url.search(pattern)>=0){
        newUrl = url.replace(pattern,'$1$2' + paramValue + '$3');
    }
    else{
        newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue
    }
    return newUrl
}