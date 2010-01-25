jetpack.future.import("menu");

function expandURL(node) {
    node = $(node);
    $.get('http://api.longurl.org/v2/expand', {
              url: node.attr("href"),
              format: 'json'
          },
          function(result, textStatus) {
              var res = JSON.parse(result);
              if (res["long-url"] === undefined) {
                  return;
              }
              /* In case the short URLs appear as <a href="$url">$url</a>,
               * e.g. on Twitter */
              if (node.html() == node.attr("href")) {
                  node.html(res["long-url"]);
              }
              node.attr("href", res["long-url"]);
          });
}

function attachLinkEventHandler(event) {
    var links = $(jetpack.tabs.focused.contentDocument)
        .find("a[href]:not(.jetpack-expandurl-bound')");
    links.bind("mousedown.jetpack-expandurl", function(event) {
                   if (event.which != 1) {
                       return;
                   }
                   console.log("mousedown " + event.which);
                   var doexpand = true;
                   $(this).bind("mouseup.jetpack-expandurl", function(event) {
                                    doexpand = false;
                                });
                   setTimeout(function() {
                                  if (doexpand) {
                                      expandURL(this);
                                  }
                              }, 100);
                   $(this).unbind(".jetpack-expandurl");
               });
    links.addClass("jetpack-expandurl-bound");
}


function register() {
    /* Create the context menu item for links */
    jetpack.menu.context.page.on("a[href]").add( function(target)({
        label: "Expand URL",
        command: function() {expandURL(target.node);}
    }));

    /* Register event handler for links */
    jetpack.tabs.onReady(attachLinkEventHandler);
    jetpack.tabs.onFocus(attachLinkEventHandler);
}
register();
