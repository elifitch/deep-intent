(function() {
  'use strict';

  /* global define, module */

  // Public API
  var DeepIntent = {
    init: init
  };

  // Public API implementation
  function init(selector, opts) {
    var options = opts || {};
    var targets = document.getElementsByClassName(selector);
    var tweetAttr = options.tweetAttr || 'data-tweet';
    var IOSAllowWebIntent = options.IOSWebIntent || true;
    var webIntent = 'http://twitter.com/share?text=';
    var appIntent = 'twitter://post?message=';
    var tweet;
    var el;

    if(targets.length === 0) {
      console.error('No links with the specified class exist. Please choose another selector');
      return;
    }

    if(_isIOS()) {
      for(var i = 0, l = targets.length; i < l; i++) {
        (function() {
          //closure to create scope for each item in loop
          var el = targets[i];
          var tweet = el.getAttribute(tweetAttr);
          _tweetCheck(el, tweet);
          el.setAttribute('href', webIntent + encodeURIComponent(tweet));

          el.addEventListener('click', function(e) {
            e.preventDefault();
            _IOSClick(tweet, appIntent, webIntent, e);
          }, false);
        })();
      }
    } else {
      for(var j = 0, x = targets.length; j < x; j++) {
        el = targets[j];
        tweet = el.getAttribute(tweetAttr);
        _tweetCheck(el, tweet);
        el.setAttribute('href', webIntent + encodeURIComponent(tweet));
      }
    }
  }

  // Private functionality
  function _isIOS() {
    return navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
  }

  function _IOSClick(tweet, appIntent, webIntent, IOSAllowWebIntent) {
    // using an iframe to open the twitter app prevents
    // an annoying 'invalid url' error if app not installed
    // h/t http://stackoverflow.com/questions/19701708/how-to-prevent-ios-safari-alert-when-trying-to-open-non-installed-native-app
    var webIntentTimer;
    var iframe = document.createElement('iframe');
    var now = new Date().valueOf();
    iframe.style.display = 'none';
    iframe.src = appIntent + encodeURIComponent(tweet);
    document.body.appendChild(iframe);

    console.log(webIntent + encodeURIComponent(tweet));

    if(IOSAllowWebIntent) {
      webIntentTimer = setTimeout(function() {
        if(new Date().valueOf() - now >= 200) {
          window.location.href = webIntent + encodeURIComponent(tweet);
        }
      }, 200);

      document.addEventListener('visibilitychange', function visibilityHandler() {
        _twitterAppCheck(webIntentTimer, visibilityHandler);
      }, false);
    }
  }

  function _tweetCheck(el, tweet) {
    if(tweet === null) {
      console.warn(el.outerHTML + ' does not have have a tweet attribute');
    }
  }

  function _twitterAppCheck(webIntentTimer, visibilityHandler) {
    // if the browser hides itself, then twitter has opened
    // and we can kill the web intent timer
    if(document.visibilityState === 'hidden') {
      clearTimeout(webIntentTimer);
      document.removeEventListener('visibilitychange', visibilityHandler, false);
    }
  }

  // Browserify/req.js support, or attach to window
  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
      // AMD. Register as an anonymous module.
      define(function() {
          return DeepIntent;
      });
  } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = DeepIntent;
  } else {
      window.DeepIntent = DeepIntent;
  }
})();