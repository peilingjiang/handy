$(window).ready(function () {
    $('#whiteIn').fadeOut(500, function () {
        $('#whiteIn').css('display', 'none');
    });
});

$('#whiteIn').css('display', 'block');

var theElement = document.getElementById("statement");
theElement.innerHTML = "<p>Special thanks to 劉 亦清 (リュウ イセイ).<br>Please always wander the mouse to discover tiny surprises.<br>Hosted in US. Please use VPN services for entries from China.<br>© 2019 Peiling Jiang. All Rights Reserved.</p>";

// iframe Cover and Autoplay
$('.thumbnail').click(function () {
    var src_0 = $(this).next()[0].src;
    $(this).next().attr('src', src_0 + '?rel=0&autoplay=1');
    $(this).css('display', 'none');
    $(this).next().css('display', 'block'); // the iframe element
    $(this).prev().css('display', 'none'); // the player logo element
});

// after
$('#after').prepend('<h2>after reading</h2>');
