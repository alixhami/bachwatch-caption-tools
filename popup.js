let recordButton = document.getElementById("record");
let downloadButton = document.getElementById("download");

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.from === "content" && request.msg === "newCaption") {
        let newCaption = {};
        newCaption[request.timestamp] = request.caption;
        chrome.storage.local.set(newCaption, () => {
            console.log("stored new caption!");
        })
    }
});

const downloadData = () => {
    chrome.storage.local.get(null, function (items) {
        const result = JSON.stringify(items);
        const url = 'data:application/json;base64,' + btoa(result);
        chrome.downloads.download({
            url: url,
            filename: 'captionTranscript.json'
        });
    });
}
recordButton.onclick = () => {
    console.log("recording!")
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { "from": "popup", "msg": "recordTranscript" }
        )
    })
}

downloadButton.onclick = () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { "from": "popup", "msg": "stopTranscript" }
        )
        downloadData();
        chrome.storage.local.clear(function () {
            console.log("All clear! Ready to record captions");
        });
    })
}

