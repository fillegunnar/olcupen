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
}

window.onload = function () {
    document.getElementById("default-open").click();
}
