var i = 1;

function randomDisplay() {
    setTimeout(function () {
        var num = Math.floor(Math.random() * photo) + 1;
        var tempImg = 'main_assets/JPL_icons/custome/' + num + '.svg';
        document.getElementById("iconLogo").src = tempImg;
        i = i + 1;
        if (i < 9) { // control the number of photos rolled in the initial display.
            randomDisplay();
        } else {
            document.getElementById("iconLogo").src = 'main_assets/JPL_icons/JPL_b.svg';
        }
    }, 105)
}

//queue.on('complete', function (e) {
//    $('header').ready(function () {
//        $('#whiteIn').fadeOut(300, function () {
//            $('#whiteIn').css('display', 'none');
//        });
//    });
//    randomDisplay();
//}, false);

$('#preLoad').ready(function () {
    $('#whiteIn').fadeOut(500, function () {
        $('#whiteIn').css('display', 'none');
    });
    randomDisplay();
});

// Popup menu feature
$('#hoverLogo').css('display', 'none');
$('#nav_list').hover(function () {
    $('#contact').hover(function () {
        $('#iconLogo').css('display', 'none');
        $('#hoverLogo').css('display', 'block');
        $('#hoverLogo').html("CONTACT");
    });

    $('#resume').hover(function () {
        $('#iconLogo').css('display', 'none');
        $('#hoverLogo').css('display', 'block');
        $('#hoverLogo').html("RÉSUMÉ");
    });

    $('#gallery').hover(function () {
        $('#iconLogo').css('display', 'none');
        $('#hoverLogo').css('display', 'block');
        $('#hoverLogo').html("GALLERY");
    });

    $('#github').hover(function () {
        $('#iconLogo').css('display', 'none');
        $('#hoverLogo').css('display', 'block');
        $('#hoverLogo').html("GITHUB");
    });

    $('#blog').hover(function () {
        $('#iconLogo').css('display', 'none');
        $('#hoverLogo').css('display', 'block');
        $('#hoverLogo').html("BLOG");
    });

}, function () {
    $('#iconLogo').css('display', 'block');
    $('#hoverLogo').css('display', 'none');

});

// Hover and move mouse random logo feature
var timer;
var refresh_time = 17;
var x = 0;
$('#iconLogo').mousemove(function (evt) {
    if (timer)
        clearTimeout(timer);
    timer = setTimeout(function () {
        var mouse_x = evt.clientX;
        if (mouse_x != x) {
            x = mouse_x;
            var num_h = Math.floor(Math.random() * photo) + 1;
            $('#iconLogo').attr('src', 'main_assets/JPL_icons/custome/' + num_h + '.svg');
        }
    }, refresh_time);
})

// Thanks to chilljul.
// https://stackoverflow.com/users/569865/chilljul
