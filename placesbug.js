const Ci = Components.interfaces;
const Cc = Components.classes;
const Cr = Components.results;
const Cu = Components.utils;

/* makeURI isn't available in JetPacks */
var iosvc = Cc["@mozilla.org/network/io-service;1"]
            .getService(Ci.nsIIOService);
function makeURI(spec) {
    return iosvc.newURI(spec, null, null);
}


/* Returns a single history entry for a given URI */
function getInfoFromHistory(aURI) {
    var history = Cc["@mozilla.org/browser/nav-history-service;1"]
                    .getService(Ci.nsINavHistoryService);

    var options = history.getNewQueryOptions();
    options.queryType = Ci.nsINavHistoryQueryOptions.QUERY_TYPE_HISTORY;
    options.maxResults = 1;

    var query = history.getNewQuery();
    query.uri = aURI;

    var result = history.executeQuery(query, options);
    result.root.containerOpen = true;

    if (!result.root.childCount) {
      return null;
    }
    return result.root.getChild(0);
}


/* Updates the statusbar gadget with the favicon URL from Places */
function faviconUpdater(doc) {
    return function() {
        var uri = makeURI(jetpack.tabs.focused.url);
        var info = getInfoFromHistory(uri);
        var text = 'null';
        if (info) {
            text = info.icon;
        }
        $(doc).find("#jetpackfavicon").text(text);
    };
}

/* Updates the statusbar gadget with the favicon URL from Places,
   except that it's smarter about URIs containing anchors */
function faviconUpdater2(doc) {
    return function() {
        var uri = makeURI(jetpack.tabs.focused.url);
        var info = getInfoFromHistory(uri);

        /* New: If search is unsuccesful, strip URL of anchor and try again. */
        let anchor = uri.path.indexOf('#');
        if ((!info || !info.icon) && (anchor != -1)) {
            let anchoruri = uri.clone();
            anchoruri.path = anchoruri.path.substr(0, anchor);
            let anchorinfo = getInfoFromHistory(anchoruri);
            if (anchorinfo) {
                info = anchorinfo;
            }
        }

        var text = 'null';
        if (info) {
            text = info.icon;
        }
        $(doc).find("#jetpackfavicon").text(text);
    };
}

jetpack.statusBar.append({  
  html: '<span id="jetpackfavicon"></span>',
  width: 500,
  onReady: function(doc){
      var updater = faviconUpdater(doc);
      //var updater = faviconUpdater2(doc);
      jetpack.tabs.onFocus(updater);
      jetpack.tabs.onReady(updater);
      updater();
  }
});
