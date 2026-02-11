
function openPage(pageName, element){
    document.getElementById("display").innerHTML = document.getElementById(pageName).text;
    sessionStorage.setItem('currentPage', pageName);

    // So that the navbar "hides" after click in mobileview
    displayNav();
}

function displayNav() {
    var deviceWidth = window.outerWidth;
    if (deviceWidth < 769){
        document.getElementById("mobile-button-space").innerHTML = "<button id='mobile-button' onclick='toggleMobileNav()'>__<br>__<br>__<br></button>";
        document.getElementById("nav").innerHTML = "";
    }else {
        document.getElementById("mobile-button-space").innerHTML = "";
        document.getElementById("nav").innerHTML = sessionStorage.getItem('navButtons');
    }
}

function toggleMobileNav() {
    var innerHTML = document.getElementById("nav").innerHTML;
    if (innerHTML == ""){document.getElementById("nav").innerHTML = sessionStorage.getItem('navButtons');}
    else {document.getElementById("nav").innerHTML = "";}
}

window.onload = function () {
    // Show nav buttons
    sessionStorage.setItem('navButtons', document.getElementById("nav").innerHTML);
    displayNav();

    // Show content
    if (!sessionStorage.getItem('currentPage')){
        sessionStorage.setItem('currentPage', "home")
    }
    document.getElementById("display").innerHTML = document.getElementById(sessionStorage.getItem('currentPage')).text;
}

window.onresize = function () {
    displayNav();
}

var countDownDate = new Date("Mar 01, 2026 18:00:00").getTime();
        
var countDown = setInterval(function() {
    var now = new Date().getTime();
    var timeLeft = countDownDate - now;

    var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    var strDay = ' dagar, ';
    var strHour = ' timmar, ';
    var strMin = ' minuter och ';
    var strSec = ' sekunder. ';

    if (days === 1) strDay = ' dag, ';
    if (hours === 1) strHour = ' timme, ';
    if (minutes === 1) strMin = ' minut och ';
    if (seconds === 1) strSec = ' sekund. ';

    document.getElementById("days").innerHTML = days + strDay;
    document.getElementById("hours").innerHTML = hours + strHour;
    document.getElementById("mins").innerHTML = minutes + strMin;
    document.getElementById("secs").innerHTML = seconds + strSec;
}, 1000)
