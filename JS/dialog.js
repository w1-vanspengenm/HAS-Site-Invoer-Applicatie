function aangepasteAlart()
{
    this.render = function (tekst) {
        var posleft = (window.innerWidth / 2) - 250 + 'px';
        var postop = window.innerHeight / 2 + 'px';
        var dialogoverlay = $("#dialogoverlay");
        var dialogbox = $("#dialogbox");
        dialogoverlay.fadeIn("Slow");
        dialogoverlay.css("height", window.innerHeight);
        dialogbox.css('left', posleft);
        dialogbox.css('top', postop);
        dialogbox.fadeIn('slow');
        $("#dialogboxhead").html("Let op!");
        $("#dialogboxbody").html(tekst);
        $("#dialogboxfoot").html('<input type="button" value="Oké" onclick="a.ok()">');

    }
    this.ok = function () {
        $("#dialogbox").fadeOut("slow");
        $("#dialogoverlay").fadeOut("slow");
    }
}
var a = new aangepasteAlart();