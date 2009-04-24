var Cookie = {
  get: function(name){
    var nameEQ = escape(name) + "=", ca = document.cookie.split(';');
    for (var i = 0, c; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  set: function(name, value, expires){
    var date = new Date();
    if (typeof expires == 'undefined') {
      var date = new Date();
      date.setTime(date.getTime()+(365*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    } else expires = '';
    var cookieString = escape(name) + "=" + escape(value) + "; expires=" + expires;
    console.log(cookieString);
    document.cookie = cookieString;
  },
  removeCookie: function (key) {
    this.set(key, '', true);
  },
  hasCookie: function( name ){
    return document.cookie.indexOf(escape(name)) > -1;
  }
};


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