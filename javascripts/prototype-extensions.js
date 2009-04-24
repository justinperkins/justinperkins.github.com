function setCookie(name,value,expires,path,theDomain,secure){ 
  value = escape(value);
  var theCookie = name + "=" + value + 
  ((expires)    ? "; expires=" + expires.toGMTString() : "") + 
  ((path)       ? "; path="    + path   : "") + 
  ((theDomain)  ? "; domain="  + theDomain : "") + 
  ((secure)     ? "; secure"            : ""); 
  document.cookie = theCookie;
} 
 
function getCookie(name){
  var search = name + "=" 
  if (document.cookie.length > 0) { // if there are any cookies 
    var offset = document.cookie.indexOf(search) 
    if (offset != -1) { // if cookie exists 
      offset += search.length 
      // set index of beginning of value 
      var end = document.cookie.indexOf(";", offset) 
      // set index of end of cookie value 
      if (end == -1) end = document.cookie.length 
      return unescape(document.cookie.substring(offset, end)) 
    } 
  } 
} 

function delCookie(name,path,domain){
  if (getCookie(name)) document.cookie = name + "=" +
    ((path)   ? ";path="   + path   : "") +
    ((domain) ? ";domain=" + domain : "") +
    ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}

(function(){
  var id = 0, head = $$('head')[0], global = this;
  global.getJSON = function(url, callback) {
    var script = document.createElement('script'), token = '__jsonp' + id;
    
    // callback should be a global function
    global[token] = callback;
    
    // url should have "?" parameter which is to be replaced with a global callback name
    script.src = url.replace(/\?(&|$)/, '__jsonp' + id + '$1');
    
    // clean up on load: remove script tag, null script variable and delete global callback function
    script.onload = function() {
      script.remove();
      script = null;
      delete global[token];
    };
    head.appendChild(script);
    
    // callback name should be unique
    id++;
  }
})();