var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};


var tokenStudent;
function getStudentInfo() {
    var tokenEncrypt = sessionStorage.getItem("token_neth");
    var base64Url = tokenEncrypt.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    tokenStudent = JSON.parse(jsonPayload); 
    document.getElementById("i_stud_level").innerText = tokenStudent.level;
     document.getElementById("navbarDropdown").innerText = tokenStudent.name;
   
}
getStudentInfo();

$('#logout_stud').on('click', function () {
    sessionStorage.removeItem("token_pap");
    window.location.replace("/login");
});


//get audio files
var stud_level = tokenStudent.level;
var stud_id = tokenStudent.id;
var audioArray;
const result = await fetch("/get_audio_files", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        stud_level,
        stud_id
    }),
}).then((res) => res.json());
audioArray = result.data;var 
level2_name = result.level2N;
document.getElementById("i_stud_level").innerText = tokenStudent.level+ " - " +level2_name;
var jsonData;
var i = 0;
var json_obj;
var temp;
var target = [];
var mediaPath;
function getDuration(src) {
    return new Promise(function(resolve) {
        var audio = new Audio();
        $(audio).on("loadedmetadata", function(){
            resolve(audio.duration);
        });
        audio.src = src;
    });
}


audioArray.forEach(function (column) {
    const musicNameRemove = column.match(/(?<=\-).+?(?=\.)/g).join('');
    const filename = column.replace('.mp3', '');
    const tempTemplate = { track: (++i), name: musicNameRemove, duration:"",file: filename };
    jsonData = JSON.parse(JSON.stringify(tempTemplate));
    target.push(jsonData);
});


var supportsAudio = !!document.createElement('audio').canPlayType;
if (supportsAudio) {
    // initialize plyr
    var player = new Plyr('#audio1', {
        controls: [
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'restart',
        ]
    });

    if (stud_level == "Accord Method 1") {
        mediaPath = '/media/audios/akord_metodo_1/'
    } else if (stud_level == "Accord Method 2") {
        mediaPath = '/media/audios/akord_metodo_2/'
    } else if (stud_level == "Piano for Singers") {
        mediaPath = '/media/audios/zangers_methode_1/'
    } else if (stud_level == "Hymnal Skool") {
        if(level2_name == "Nivel 1"){
            mediaPath = '/media/audios/hmnal_school/nivel_1/'
        }else if(level2_name == "Nivel 2"){
            mediaPath = '/media/audios/hmnal_school/nivel_2/'
        }else if(level2_name == "Nivel 3"){
            mediaPath = '/media/audios/hmnal_school/nivel_3/'
        }else if(level2_name == "Nivel 4"){
            mediaPath = '/media/audios/hmnal_school/nivel_4/'
        }else if(level2_name == "Nivel 5"){
            mediaPath = '/media/audios/hmnal_school/nivel_5/'
        }
        
    } else if (stud_level == "P&W Skool") {

        if(level2_name == "Nivel 1"){
            mediaPath = '/media/audios/p_w_school/nivel_1/'
        }else if(level2_name == "Nivel 2"){
            mediaPath = '/media/audios/p_w_school/nivel_2/'
        }else if(level2_name == "Nivel 3"){
            mediaPath = '/media/audios/p_w_school/nivel_3/'
        }else if(level2_name == "Nivel 4"){
            mediaPath = '/media/audios/p_w_school/nivel_4/'
        }else if(level2_name == "Nivel 5"){
            mediaPath = '/media/audios/p_w_school/nivel_5/'
        }
    }

    // initialize playlist and controls
    var index = 0,
        playing = false,
        extension = '',
        tracks = target,
        buildPlaylist = $.each(tracks, function (key, value) {
            var trackNumber = value.track,
                trackName = value.name,
                trackDuration = value.duration;
            if (trackNumber.toString().length === 1) {
                trackNumber = '0' + trackNumber;
            }
            $('#plList').append('<li> \
                  <div class="plItem"> \
                      <span class="plNum">' + trackNumber + '.</span> \
                      <span class="plTitle">' + trackName + '</span> \
                      <span class="plLength">' + trackDuration + '</span> \
                  </div> \
              </li>');
        }),
        trackCount = tracks.length,
        npAction = $('#npAction'),
        npTitle = $('#npTitle'),
        audio = $('#audio1').on('play', function () {
            playing = true;
            npAction.text('Now Playing...');
        }).on('pause', function () {
            playing = false;
            npAction.text('Paused...');
        }).on('ended', function () {
            npAction.text('Paused...');
            if ((index + 1) < trackCount) {
                index++;
                loadTrack(index);
                audio.play();
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        }).get(0),
        btnPrev = $('#btnPrev').on('click', function () {
            if ((index - 1) > -1) {
                index--;
                loadTrack(index);
                if (playing) {
                    audio.play();
                }
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        }),
        btnNext = $('#btnNext').on('click', function () {
            if ((index + 1) < trackCount) {
                index++;
                loadTrack(index);
                if (playing) {
                    audio.play();
                }
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        }),
        li = $('#plList li').on('click', function () {
            var id = parseInt($(this).index());
            if (id !== index) {
                playTrack(id);
            }
        }),
        loadTrack = function (id) {
            $('.plSel').removeClass('plSel');
            $('#plList li:eq(' + id + ')').addClass('plSel');
            npTitle.text(tracks[id].name);
            index = id;
            audio.src = mediaPath + tracks[id].file + extension;
            updateDownload(id, audio.src);
        },
        updateDownload = function (id, source) {
            player.on('loadedmetadata', function () {
                $('a[data-plyr="download"]').attr('href', source);
            });
        },
        playTrack = function (id) {
            loadTrack(id);
            audio.play();
        };
    extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
    loadTrack(index);
} else {
    // no audio support
    $('.column').addClass('hidden');
    var noSupport = $('#audio1').text();
    $('.container').append('<p class="no-support">' + noSupport + '</p>');
}

//to do levels in hymnal skol and p&w skool