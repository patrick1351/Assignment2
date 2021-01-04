$(document).ready(function(){

    function newGradient() {
        var c1 = {
              r: Math.floor(255),
              g: Math.floor(35+Math.random()*220),
              b: Math.floor(Math.random()*255)
            };
            var c2 = {
              r: Math.floor(255),
              g: Math.floor(35+Math.random()*220),
              b: Math.floor(Math.random()*255)
            };
        c1.rgb = 'rgb('+c1.r+','+c1.g+','+c1.b+')';
        c2.rgb = 'rgb('+c2.r+','+c2.g+','+c2.b+')';
        return 'radial-gradient(at top left, '+c1.rgb+', '+c2.rgb+')';
      }
      
    function rollBg() {
        $('body').css('background', newGradient());
    }
    rollBg();
   
    var google_api_key = "AIzaSyBkatIeGCQxmAuC_YKY3aKy4Vd-ug5Z04E";
    var url = "https://www.googleapis.com/youtube/v3/search";
    var searchresultNumber = 0;
    

    $("#songSearchButton").on("click", function(e) {
            e.preventDefault();
            rollBg();
            var songName = $("#songSearch").val();
            var parameter = {
                part: 'snippet',
                key: google_api_key,
                maxResults: 20,
                q: songName,
                videoCategoryId: 10,
                type: "video",
                // type: video,
            }
            console.log($("#songSearch").val());
            console.log(parameter);
            getSong(searchresultNumber, parameter)
    })

    $(document).on("click", "#returnButton", function(e) {
        e.preventDefault();
        $("#searchResultDisplay").css("display", "none");
        $("#searchbar").css("display", "block");
    })

    $(document).on("click", "#nextButton", function(e) {
        e.preventDefault();
        console.log(searchresultNumber)
        searchresultNumber = searchresultNumber + 1;
        if (searchresultNumber > 20){
            var searchresultNumber = 0;
        }
        console.log(searchresultNumber)
        getSong(searchresultNumber, parameter)
    })

    function getSong(searchresultNumber, parameter) {
        console.log("Running getSong")
        console.log(searchresultNumber)
        $.getJSON(url, parameter, function(data){
            console.log(data)
            var videoName = data.items[searchresultNumber].snippet.title;
            var videoThumbnail = data.items[searchresultNumber].snippet.thumbnails.high.url;
            var videoChannel = data.items[searchresultNumber].snippet.channelTitle;
            var videoLinkID = data.items[searchresultNumber].id.videoId;
            var videoPublishedDate = data.items[searchresultNumber].snippet.publishedAt;
            searchResultVid(videoName, videoThumbnail, videoChannel, videoLinkID, videoPublishedDate);
        })
    }

    function searchResultVid(videoName, videoThumbnail, videoChannel, videoLinkID, videoPublishedDate) {
        $("#searchbar").css("display", "none");
        $("#searchResultDisplay").css("display", "block");
        $("#searchResult").html(`
        <div class="col-md-5 videoimg"><img src=${videoThumbnail} alt="Thumbnail"  class="img-fluid img-thumbnail"></div>
        <div class="col-md-7 d-flex align-items-start flex-column">
            <div class="row">
                <h1>${videoName}</h1>
            </div>
            <div class="row">
                <h2>Channel: ${videoChannel}<h2>
            </div>
            <div class="row">
              <h2>Published: ${videoPublishedDate}<h2>
            </div>
            <div class="row mt-auto">
              <div class="col-md-3">
                  <a href="https://www.youtube.com/watch?v=${videoLinkID}"><button class="btn btn-primary btn-lg" id="songSearchButton">Search</button></a>
              </div>
              <div class="col-md-3">
                  <button class="btn btn-primary btn-lg" id="returnButton">Return</button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-primary btn-lg" id="nextButton">Next</button>
              </div>
          </div>
        </div>
        `)
    }
})

