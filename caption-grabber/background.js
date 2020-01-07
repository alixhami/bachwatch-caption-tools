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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("got msg");
    if (request.from === "content" && request.msg === "newCaption") {
        let newCaption = {};
        newCaption[request.timestamp.toString()] = request.caption;
        chrome.storage.local.set(newCaption, () => {
            console.log(newCaption);
        })
    }
});

const downloadData = () => {
    chrome.storage.local.get(null, function (items) {
        const result = JSON.stringify(items);
        const url = 'data:application/json;base64,' + btoa(result);
        chrome.downloads.download({
            url: url,
            filename: 'captionTranscript.json',
            saveAs: true
        });
    });
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.from === "popup" && request.msg === "downloadTranscript") {
        downloadData();
        chrome.storage.local.clear(function () {
            console.log("All clear! Ready to record captions");
        });
    }
});
