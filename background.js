chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'hulu.com/watch' },
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'tubitv.com/tv-shows/' },
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'amazon.com/gp/video/detail/' },
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'netflix.com/watch/' },
                    })

                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});