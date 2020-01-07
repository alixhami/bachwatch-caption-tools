
const pageUrl = document.URL;
let captionSelector;
let videoSelector;
const config = { attributes: false, childList: true, subtree: true, characterData: true };;

console.log(pageUrl);
if (pageUrl.includes('tubitv.com')) {
    captionSelector = "#captionsComponent";
    videoSelector = "video#videoPlayerComponent";
} else if (pageUrl.includes('hulu.com')) {
    captionSelector = "div.closed-caption-outband";
    videoSelector = "video.video-player.content-video-player";
} else if (pageUrl.includes('amazon.com')) {
    captionSelector = "span.timedTextWindow > span.timedTextBackground";
    videoSelector = "div.scalingVideoContainer video";
} else if (pageUrl.includes('netflix.com')) {
    captionSelector = "div.player-timedtext";
    videoSelector = "video"

}

let captionNode;
let videoNode;


const observer = new MutationObserver(() => {
    videoNode = document.querySelector(videoSelector);
    result = chrome.runtime.sendMessage({
        "msg": "newCaption",
        "from": "content",
        "timestamp": videoNode.currentTime,
        "caption": captionNode.innerText
    }, () => {
        console.log(videoNode.currentTime);
        console.log(captionNode.innerText);
    });
});

chrome.runtime.onMessage.addListener(
    (request, sender) => {
        if (request.from === "popup" && request.msg === "recordTranscript") {
            captionNode = document.querySelector(captionSelector);
            observer.observe(captionNode, config);
            console.log("listening for changes");


        } else if (request.from === "popup" && request.msg === "stopTranscript") {
            observer.disconnect();
            console.log("disconnected");
        }
    }
);





