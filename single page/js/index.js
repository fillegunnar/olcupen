
function openPage(pageName, element){
    
    document.getElementById("display").innerHTML = document.getElementById(pageName).text;

    var deviceWidth = window.outerWidth;
    if (deviceWidth < 769 ){
        hasMobileView();
    }
}

function hasMobileView() {
    var deviceWidth = window.outerWidth;
    if (deviceWidth < 769){
        document.getElementById("mobile-button-space").innerHTML = "<button id='mobile-button' onclick='toggleMobileNav()'>__<br>__<br>__<br></button>";
        document.getElementById("nav").innerHTML = "";
    }else {
        document.getElementById("mobile-button-space").innerHTML = "";
        document.getElementById("nav").innerHTML = sessionStorage.navButtonsHTML;
    }
}

function toggleMobileNav() {
    var innerHTML = document.getElementById("nav").innerHTML;
    if (innerHTML == ""){document.getElementById("nav").innerHTML = sessionStorage.navButtonsHTML;}
    else {document.getElementById("nav").innerHTML = "";}
}

window.onload = function () {
    sessionStorage.navButtonsHTML = document.getElementById("nav").innerHTML;
    document.getElementById("default-open").click();
    // hasMobileView();
}

window.onresize = function () {
    hasMobileView();
}
