jetpack.future.import("menu");

function expandURL(node) {
    $.get('http://api.longurl.org/v2/expand', {
              url: node.href,
              format: 'json'
          },
          function(result, textStatus) {
              var res = JSON.parse(result);
              if (res["long-url"] === undefined) {
                  return;
              }
              /* In case the short URLs appear as <a href="$url">$url</a>,
               * e.g. on Twitter */
              if ($(node).html() == node.href) {
                  $(node).html(res["long-url"]);
              }
              $(node).attr("href", res["long-url"]);
          });
}


function createMenuItem() {
    jetpack.menu.context.page.on("a[href]").add( function(target)({
        label: "Expand URL",
        command: function() {expandURL(target.node);}
    }));
}
createMenuItem();
