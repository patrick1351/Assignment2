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

    $("#songSearchButton").on("click", function(e) {
            e.preventDefault();
            rollBg();
            console.log($("#songSearch").val());
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
            console.log(parameter);

            getSong()

            function getSong() {
                $.getJSON(url, parameter, function(data){
                    console.log(data);
                    var videoName = data.items[0].snippet.title
                    var videoThumbnail = data.items[0].snippet.thumbnails.high.url
                    var videoDescription = data.items[0].snippet.description
                    var videoLinkID = data.items[0].id.videoId
                    searchResultVid(videoName, videoThumbnail, videoDescription, videoLinkID);
                })
            }

            function searchResultVid(videoName, videoThumbnail, videoDescription, videoLinkID) {
                $("#searchbar").css("display", "none");
                $("#searchResultDisplay").css("display", "block");
                $("#searchResult").html(`
                <div class="col-md-5 videoimg"><img src=${videoThumbnail} alt="Thumbnail"  class="img-fluid img-thumbnail"></div>
                <div class="col-md-7 d-flex align-items-start flex-column">
                    <div class="row">
                        <h1>${videoName}</h1>
                    </div>
                    <div class="row">
                        <p>${videoDescription}</p>
                    </div>
                    <div class="row mt-auto">
                        <a href="https://www.youtube.com/watch?v=${videoLinkID}"><button class="btn btn-primary btn-lg" id="songSearchButton">Search</button></a>
                        <button class="btn btn-primary btn-lg" id="returnButton">Return</button>
                    </div>
                </div>
                `)
            }

            // fetch("")
            //  .then(Response => Response.json())
            //  .then(data => console.log(data))
        })

    $("#returnButton").on("click", function(e) {
        $("#searchResultDisplay").css("display", "none");
        $("#searchbar").css("display", "block");
    })
})

