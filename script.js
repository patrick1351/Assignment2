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
    var songName = "";
    let searchResultNumber = 0;
    let youtubeJson;
    var parameter = {
        part: 'snippet',
        key: google_api_key,
        maxResults: 20,
        q: songName,
        videoCategoryId: 10,
        type: "video",
    }

    $("#songSearchButton").on("click", function(e) {
        e.preventDefault();
        rollBg();
        parameter = getSearchValue(parameter);
        console.log($("#songSearch").val());
        console.log(parameter);
        let searchResultNumber = 0
        getSong(searchResultNumber, parameter);
    })

    $(document).on("click", "#returnButton", function(e) {
        e.preventDefault();
        $("#searchResultDisplay").css("display", "none");
        $("#searchbar").css("display", "block");
    })

    //Buttons to cycle back and forth of songs
    $(document).on("click", "#nextButton", function(e) {
        e.preventDefault();
        if (typeof searchResultNumber === "undefined"){
            searchResultNumber = 0;
        }
        console.log("Next Song")
        console.log("Before added number:" + searchResultNumber);
        searchResultNumber = searchResultNumber + 1;
        if (searchResultNumber > 19){
            searchResultNumber = 0;
        }
        console.log(searchResultNumber);
        closeVideo()
        getSongFromLS(searchResultNumber);
    })

    $(document).on("click", "#backButton", function(e) {
        e.preventDefault();
        console.log("last Song")
        if (typeof searchResultNumber === "undefined"){
            searchResultNumber = 0;
        }
        console.log("Before substracted number:" + searchResultNumber);
        searchResultNumber = searchResultNumber - 1;
        if (searchResultNumber < 0){
            searchResultNumber = 19;
        }
        console.log(searchResultNumber);
        closeVideo()
        getSongFromLS(searchResultNumber);
    })

    $(document).on("click", "#playVideo", function(e){
        playVideo(searchResultNumber)
    })

    $(document).on("click", "#closeVideo", function(e){
        closeVideo()
    })

    // This function is to set the parameter
    function getSearchValue(parameter){
        var songName = $("#songSearch").val();
        var parameter = {
            part: 'snippet',
            key: google_api_key,
            maxResults: 20,
            q: songName,
            videoCategoryId: 10,
            type: "video",
        }
        return parameter
    }

    //This function is to get the json file from youtube base on parameter
    function getSong(searchResultNumber, parameter) {
        console.log("Running getSong");
        console.log(searchResultNumber);

        // save data to local storage
        $.getJSON(url, parameter, function(data){
            console.log(data)
            let youtubeJson = JSON.stringify(data);
            localStorage.setItem("youtubeJsonData", youtubeJson);
            var videoName = data.items[searchResultNumber].snippet.title;
            var videoThumbnail = data.items[searchResultNumber].snippet.thumbnails.high.url;
            var videoChannel = data.items[searchResultNumber].snippet.channelTitle;
            let videoLinkID = data.items[searchResultNumber].id.videoId;
            var videoPublishedDate = data.items[searchResultNumber].snippet.publishedAt;
            searchResultVid(videoName, videoThumbnail, videoChannel, videoLinkID, videoPublishedDate);
        })
    }

    function closeVideo(){
        $("#searchResultDisplay").css("display", "block");
        $("#videoPlayer").css("display", "none");
    }

    function playVideo(searchResultNumber){
        var data = JSON.parse(localStorage.getItem("youtubeJsonData"));
        let videoLinkID = data.items[searchResultNumber].id.videoId;
        $("#searchResultDisplay").css("display", "none");
        $("#videoPlayer").css("display", "block");
        $("#videoPlayer").html(`
        <div  class = "row">
        <iframe width="560" height="670" src="https://www.youtube.com/embed/${videoLinkID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div  class = "row">
            <div class="col-md-3">
                <button class="btn btn-primary btn-lg" id="returnButton">Return</button>
            </div>
            <div class="col-md-2">
            <button class="btn btn-primary btn-lg" id="nextButton">Next</button>
            </div>
            <div class="col-md-2">
            <button class="btn btn-primary btn-lg" id="backButton">Back</button>
            </div>
            <div class="col-md-3">
            <button class="btn btn-primary btn-lg" id="closeVideo">Close video</button>
            </div>
        </div>
        `)
    }

    // This sets the display for the search result IE when user clicks on the search button, this function change the display to be one 
    // the search result
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
                  <a href="https://www.youtube.com/watch?v=${videoLinkID}" target="_blank"><button class="btn btn-primary btn-lg" id="songSearchButton">Youtube</button></a>
              </div>
              <div class="col-md-2">
                  <button class="btn btn-primary btn-lg" id="returnButton">Return</button>
              </div>
              <div class="col-md-2">
                <button class="btn btn-primary btn-lg" id="nextButton">Next</button>
              </div>
              <div class="col-md-2">
                <button class="btn btn-primary btn-lg" id="backButton">Back</button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-primary btn-lg" id="playVideo">Play video</button>
              </div>
          </div>
        </div>
        `)
    }


    // This function is to retrieve the json saved on the local storage 
    function getSongFromLS(searchResultNumber){
        var data = JSON.parse(localStorage.getItem("youtubeJsonData"));
        var videoName = data.items[searchResultNumber].snippet.title;
        var videoThumbnail = data.items[searchResultNumber].snippet.thumbnails.high.url;
        var videoChannel = data.items[searchResultNumber].snippet.channelTitle;
        let videoLinkID = data.items[searchResultNumber].id.videoId;
        var videoPublishedDate = data.items[searchResultNumber].snippet.publishedAt;
        // var videoName = localStorage.getItem(`data.items${searchResultNumber}.snippet.title`);
        // var videoThumbnail = localStorage.getItem(`data.items${searchResultNumber}.snippet.thumbnails.high.url`);
        // var videoChannel = localStorage.getItem(`data.items${searchResultNumber}.snippet.channelTitle`);
        // var videoLinkID = localStorage.getItem(`data.items${searchResultNumber}.id.videoId`);
        // var videoPublishedDate = localStorage.getItem(`data.items${searchResultNumber}.snippet.publishedAt`);
        searchResultVid(videoName, videoThumbnail, videoChannel, videoLinkID, videoPublishedDate);
    }
})

