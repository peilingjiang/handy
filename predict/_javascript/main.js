//import React, { Component } from 'react';


// WHITE COVER when loading...
$('#whiteIn').css('display', 'block');

// PROJECT HOLDER generator...

// !!! UPDATE THE PROJECT NUMBER !!!
var projectsNum = 10;
// !!! UPDATE THE PROJECT NUMBER !!!

var projectsHeight = 0;

var statementWideMT = (projectsNum / 2) * 270 + (projectsNum / 2 - 1) * 16 + 320; // + 80 for drawer
var statementNarrowMT = (projectsNum / 2) * 200 + (projectsNum / 2 - 1) * 10 + 320; // +90 for drawer

var widthOfWindow = $(window).width();
if (widthOfWindow > 850) {
    $('#statement').css({
        marginTop: statementWideMT
    });
} else {
    $('#statement').css({
        marginTop: statementNarrowMT
    });
};
$(window).on('resize', function () {
    if ($(this).width() != widthOfWindow) {
        widthOfWindow = $(this).width();
        if (widthOfWindow > 850) {
            $('.projectHolder').css('height', '270px');
            $('.contentHolder').css('height', '270px');
            $('#statement').css({
                marginTop: statementWideMT
            })
        } else {
            $('.projectHolder').css('height', '200px');
            $('.contentHolder').css('height', '200px');
            $('#statement').css({
                marginTop: statementNarrowMT
            })
        };
    }
});



function toPercent(point) {
    var a = point.toFixed(2);
    var b = a.slice(2, 4) + '%';
    return b;
}

var last_width = (Math.floor(Math.random() * 41) + 30) / 100; // (30-70)/100 = 0.30 - 0.70

var width = 1 - last_width;


// Random Width
$('.projectHolder').each(function (index) {

    // index starts from 0.
    if ($(this).is('#lastProject') && (index % 2 == 0)) {
        $(this).css('width', '100%');
        $(this).css('float', "left");
        return false
    };
    if (index % 2 == 0) {
        $(this).css('--element-width', toPercent(last_width));
        $(this).css('float', "left");
    } else {
        $(this).css('--element-width', toPercent(width));
        $(this).css('float', 'right');
        last_width = (Math.floor(Math.random() * 41) + 30) / 100;
        do {
            last_width = (Math.floor(Math.random() * 41) + 30) / 100;
        } while (Math.abs(last_width + width - 1) < 0.1);
        width = 1 - last_width;
    };
});


// Popup
$('.projectHolder').hover(function () {
    var theProject = $(this);
    var theH2 = $(this).find('h2').text();
    var theH3 = $(this).find('h3').text();

    var theBox = document.getElementById("detailBox");
    theBox.innerHTML = '<h2>' + theH2 + '</h2><br><h3>' + theH3 + '</h3>';

    $(this).mousemove(function (e) {
        $("#detailBox").fadeIn(30);
        $("#detailBox").offset({
            left: e.pageX,
            top: e.pageY - 75
        });
        $(this).click(function () {
            $("#detailBox").css('background', 'var(--JPL-yellow-dark)');
        })
    });
}, function () {
    $("#detailBox").fadeOut(10);
});

var theElement = document.getElementById("statement");
theElement.innerHTML = "<p>Designed and developed by Peiling Jiang.<br>Special thanks to 劉 亦清 (リュウ イセイ).<br>Please always wander the mouse to discover tiny surprises.<br>Hosted in US. Please use VPN services for entries from China.<br>© 2019 Peiling Jiang. All Rights Reserved.</p>";
