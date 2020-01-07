let recordButton = document.getElementById("record");
let downloadButton = document.getElementById("download");


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

