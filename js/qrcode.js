var timeleft = 60; // Extend the time to 60 seconds
var downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
        clearInterval(downloadTimer);
        document.getElementById("progressBar").remove();
        document.getElementById("main").innerHTML = "QR Expired! Please reload";
        document.getElementById("legend").innerHTML = "";
    }
    document.getElementById("progressBar").value = 60 - timeleft; // Update progress bar calculation
    timeleft -= 1;
}, 1000);
