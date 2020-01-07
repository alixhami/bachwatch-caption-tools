let recordButton = document.getElementById("record");
let downloadButton = document.getElementById("download");



recordButton.onclick = () => {
    recordButton.disabled = true;
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
    recordButton.disabled = false;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { "from": "popup", "msg": "stopTranscript" }
        )
    })
    chrome.runtime.sendMessage({ "from": "popup", "msg": "downloadTranscript" });
}

