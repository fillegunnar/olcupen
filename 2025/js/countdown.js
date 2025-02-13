document.addEventListener("DOMContentLoaded", function () {
    countdown();
    setInterval(countdown, 1000);
})

function countdown() {
    const countdownDate = new Date("Mar 01, 2025 18:00:00").getTime();     
    const now = new Date().getTime();
    const timeLeft = countdownDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
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
};