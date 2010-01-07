/* See https://developer.mozilla.org/en/Querying_Places */
var history = Components.classes["@mozilla.org/browser/nav-history-service;1"]
              .getService(Components.interfaces.nsINavHistoryService);

/* Query options are the same across all queries, so we can define
   them globally */
var options = history.getNewQueryOptions();
options.queryType = 0;   // search history
options.sortingMode = 4; // last visit descending
options.maxResults = 10;
	
CmdUtils.CreateCommand({
  names: "open",
  icon: "chrome://browser/skin/places/query.png",
  description: "Works like the awesomebar (Firefox's URL bar)",
  arguments: [{role: "object", nountype: noun_arb_text, label: "query"}],
  preview: function(pblock, arguments) {
    var query = history.getNewQuery();
    query.searchTerms = arguments.object.text;

    var result = history.executeQuery(query, options);
    var root = result.root;
    root.containerOpen = true;

    var count = root.childCount;
    pblock.innerHTML = "Results (" + count + ")<br/> <ul>";

    var msg = '<li><a href="${url}" title="${url}" style="text-decoration:none">${title}<br/><small>&nbsp;&nbsp;${url}</small></a></li>';

    for (var i = 0; i < count; i++) {
      var node = root.getChild(i);
      pblock.innerHTML += CmdUtils.renderTemplate(
          msg, {url: node.uri, title: node.title});
    }
    root.containerOpen = false;

    pblock.innerHTML += "</ul>";
  }
});
