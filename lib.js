function timestampToT(timestamp) {
  return timestamp;
}

function youTubeTimeUrl(timemark) {
  return "https://www.youtube.com/watch?v=" + timemark["id"] + "&t=" + timemark["timestamp"];
}

function youTubeVideoUrl(timemark) {
  return "https://www.youtube.com/watch?v=" + timemark["id"];
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function storeShortcuts(capture, capture_note) {
  chrome.storage.sync.set({
    capture: capture,
    capture_note: capture_note
  });
}

function storeTimemark(timemark) {
  console.log(timemark);
  chrome.storage.sync.get("timemarks", function(items) {
    timemarks = items["timemarks"] || [];
    console.log(timemarks);
    timemarks.push(timemark)
    chrome.storage.sync.set({timemarks: timemarks});
  });
}

function getTimemarks(callback) {
  chrome.storage.sync.get("timemarks", function(items){
    timemarks = items["timemarks"] || [];

    for (var i = 0; i < timemarks.length; i++) {
      timemarks[i]["url"] = youTubeTimeUrl(timemarks[i]);
      timemarks[i]["video_url"] = youTubeVideoUrl(timemarks[i]);
    }

    callback(timemarks);
  });
}

function treeifyTimemarks(timemarks) {
  var channels = new Map();

  for (var i = 0; i < timemarks.length; i++) {
    var tm = timemarks[i];
    if (channels.has(tm.channel_url)) {
      var videos = channels.get(tm.channel_url);
      if (videos.has(tm.id)) {
        var video = videos.get(tm.id);
        video.push(tm);
        video.sort((a, b) => (a.timestamp > b.timestamp)? 1 : -1);
      } else {
        videos.set(tm.id, [tm]);
      }
    } else {
      var videos = new Map();
      videos.set(tm.id, [tm]);
      channels.set(tm.channel_url, videos);
    }
  }
  return channels;
}

DEFAULT_STORAGE = {
  timemarks: [],
  capture: "KeyB",
  capture_note: "KeyV"
};

function resetStorage(callback) {
  chrome.storage.sync.clear();
  chrome.storage.sync.set(DEFAULT_STORAGE, () => {
    callback();
  });
}


function withCapture(callback) {
  chrome.storage.sync.get(["capture", "capture_note"], function(items) {
    var capture = items["capture"];
    var capture_note = items["capture_note"];

    callback((evt) => {
      console.log(`GOT evt. ${evt.code} ${capture} ${capture_note}`);
      evt = evt || window.event;
      is_capture = evt.code === capture;
      is_capture_note = evt.code === capture_note;

      if (!is_capture && !is_capture_note) {
        return;
      }

      console.log(`YT Timemark - Got code: ${evt.code}.`);

      var video = $("video")[0];
      if (!video) {
        return;
      }
      var timestamp = video.currentTime;

      var comment_name = "TK";
      var comment = "";
      if (is_capture_note) {
        var response = prompt("Timemark comment:", "name - comment") || "";
        var parts = response.split("-").concat([""]);
        comment_name = parts[0].trim();
        comment = parts[1].trim();
      }

      var title = document.title.replace(" - YouTube", "");
      var url = new URL(window.location.href);
      var id = url.searchParams.get("v");

      var channel_link = $(".ytd-channel-name a")[0];
      var channel_title = channel_link.text;
      var channel_url = channel_link.href;

      storeTimemark({
        channel_title: channel_title,
        channel_url: channel_url,
        title: title,
        id: id,
        timestamp: timestamp,
        comment_name: comment_name,
        comment: comment
      });
    });
  });
}

