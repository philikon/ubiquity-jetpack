var istwitter = new RegExp("^http://twitter.com");

function moreTweets() {
    if (!istwitter.test(jetpack.tabs.focused.url)) {
        return;
    }
    var document = jetpack.tabs.focused.contentDocument;
    var results_update = $(document).find('#results_update');

    /* simulate a click */
    results_update.each(
        function() {
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(
                'click',
                true,                        // canBubble
                true,                        // cancelable
                document.defaultView,        // view (e.g. window)
                1,                           // click count
                0, 0, 0, 0,                  // coordinates
                false, false, false, false,  // key modifiers
                0,                           // button
                null);                       // target
            this.dispatchEvent(evt);
        });
}

jetpack.tabs.onFocus(moreTweets);
