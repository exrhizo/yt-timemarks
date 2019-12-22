function displayTimemarks(){
  var all_ul = $.parseHTML("<ul></ul>");
  
  getTimemarks(function(timemarks) {
    channels = treeifyTimemarks(timemarks);
    console.log(channels);

    for (let [channel_url, videos] of channels) {
      var channel_li = null;
      var channel_ul = null;
      for (let [video_id, timemarks] of videos) {
        var video_li = null;
        var video_ul = null;
        for (var i = 0; i < timemarks.length; i++) {
          var tm = timemarks[i];
          if (channel_ul === null) {
            channel_li = $.parseHTML(`<li><a href="${tm.channel_url}">${tm.channel_title}</a></li>`);
            channel_ul = $.parseHTML(`<ul></ul>`);
          }
          if (video_ul === null) {
            video_li = $.parseHTML(`<li><a href="${tm.video_url}">${tm.title}</a></li>`)
            video_ul = $.parseHTML(`<ul></ul>`);
          }
          $(video_ul).append(`<li><a href="${tm.url}">${tm.timestamp}</a> **${tm.comment_name}** ${tm.comment}</li>`);
        }
        $(video_li).append(video_ul);
        $(channel_ul).append(video_li);
        video_ul = null;
      }
      $(channel_li).append(channel_ul);
      $(all_ul).append(channel_li);
      channel_ul = null;
    }

    var timemarks_div = $("#timemarks");
    timemarks_div.html('');
    timemarks_div.append(all_ul);
  });

  displayCaptureKeys();
}

function displayCaptureKeys() {
  chrome.storage.sync.get(["capture", "capture_note"], function(items) {
    var capture = items["capture"];
    var capture_note = items["capture_note"];
    $("input#capture")[0].value = capture;
    $("input#capture_note")[0].value = capture_note;
  });
}

$("a#update_shortcuts").on("click", () => {
  var capture = $("input#capture")[0].value;
  var capture_note = $("input#capture_note")[0].value;
  storeShortcuts(capture, capture_note);
});

$("a#default_shortcuts").on("click", () => {
  $("input#capture")[0].value = DEFAULT_STORAGE.capture;
  $("input#capture_note")[0].value = DEFAULT_STORAGE.capture_note;
  storeShortcuts(DEFAULT_STORAGE.capture, DEFAULT_STORAGE.capture_note);

});

$("a#clear").on("click", () => {
  if (confirm("Are you sure you want to clear?")) {
    resetStorage(displayTimemarks);
  }
});

$("a#reload").on("click", displayTimemarks);

displayTimemarks();
