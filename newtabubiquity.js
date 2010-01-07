var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
         .getService(Components.interfaces.nsIWindowMediator);
var tabbrowser = wm.getMostRecentWindow("navigator:browser").getBrowser();


/* When opening a new blank tab, open the Ubiquity window */
function onDelayedTabOpen() {
  if (tabbrowser.currentURI.spec == "about:blank") {
    wm.getMostRecentWindow("navigator:browser").window.gUbiquity.openWindow();
  }
}
tabbrowser.addEventListener('TabOpen',
  function(event) { setTimeout(onDelayedTabOpen, 0); }, true);


/* Close Ubiquity when closing a tab */
function onTabClose(event) {
  wm.getMostRecentWindow("navigator:browser").window.gUbiquity.closeWindow();
}
tabbrowser.addEventListener('TabClose', onTabClose, true);
