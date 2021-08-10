
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
