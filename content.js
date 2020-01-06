
const pageUrl = document.URL;
let captionSelector;
let timeSelector;

console.log(pageUrl);
if (pageUrl.includes('netflix.com')) {
    captionSelector = "div.player-timedtext > div.player-timedtext-text-container";
    timeSelector = "time.time__remaining-time"
} else if (pageUrl.includes('hulu.com')) {
    captionSelector = "div.closed-caption-outband > div.caption-text-box > p";
    timeSelector = "span.controls__time-elapsed";
} else if (pageUrl.includes('amazon.com')) {
    captionSelector = "span.timedTextWindow > span.timedTextBackground";
    timeSelector = "div.infoBar.flexRow div.left div.time";
} else if (pageUrl.includes('tubitv.com')) {
    captionSelector = "#captionsComponent";
    timeSelector = "div._1AATa span:first-child";
}

let captionNode;
let timeNode;
const config = { attributes: true, childList: true, subtree: true };

const observer = new MutationObserver(() => {
    chrome.runtime.sendMessage({
        "msg": "newCaption",
        "from": "content",
        "timestamp": timeNode.innerText,
        "caption": captionNode.innerText
    });
});

chrome.runtime.onMessage.addListener(
    (request, sender) => {
        if (request.from === "popup" && request.msg === "recordTranscript") {
            captionNode = document.querySelector(captionSelector);
            timeNode = document.querySelector(timeSelector);
            observer.observe(captionNode, config);
            console.log("listening for changes");

        } else if (request.from === "popup" && request.msg === "stopTranscript") {
            observer.disconnect();
            console.log("disconnected");
        }
    }
);





