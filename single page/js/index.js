// Because it does not exist height = 100% in css which works the way I want
var HEIGHT;
var tabcontent;
let DEFAULT_OPEN = "home";
tabcontent = document.getElementsByClassName("tabcontent");

function openPage(pageName){
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(pageName).style.display = "block";
    var deviceWidth = window.outerWidth;
    var currentDisplay = document.getElementById("nav").style.display;
    if (deviceWidth < 769 && currentDisplay == "block"){
        toggleMobileNav();
    }
}

function hasMobileButton() {
    var deviceWidth = window.outerWidth;
    if (deviceWidth < 769){
        document.getElementById("mobile-button").innerHTML = "<a onclick='toggleMobileNav()'>__<br>__<br>__<br></button>";
    }else {
        document.getElementById("mobile-button").innerHTML = "";
    }
}

function toggleMobileNav() {
    var currentDisplay = document.getElementById("nav").style.display;

    if (currentDisplay == "block"){ document.getElementById("nav").style.display = "none"; }
    else { openMobileNav() }
}

function openMobileNav() {
    document.getElementById("nav").style.display = "block"; 
    document.getElementById("nav").style.gridTemplateColumns = "1fr 1fr";
}

window.onload = function () {
    document.getElementById("default-open").click();
    hasMobileButton();
}

window.onresize = function () {
    hasMobileButton();
}
