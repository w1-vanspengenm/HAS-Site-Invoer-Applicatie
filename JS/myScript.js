var l;
var j;
function handleFile(e) {
  var files = e.target.files;
  var i,f;
 for (i = 0, f = files[i]; i != files.length; ++i) {
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function (e)
    {
        var data = e.target.result;
        /*sla de werkmap op in var*/
        var workbook = XLSX.read(data, { type: 'binary' });
        /*achterhaal de naam van het eerste werkblad*/
        var first_sheet_name = workbook.SheetNames[0];
        /*sla dat werkbland op in var*/
        var worksheet = workbook.Sheets[first_sheet_name];
        j = XLSX.utils.sheet_to_json(worksheet);
        console.log(j);
    };
    reader.readAsBinaryString(f);
  }
}
$(document).ready(function ()
{
    $("#dropzone").on("dragover", function (e)
    {
        e.preventDefault();
        $(this).addClass("selected");
        $(this).text("Laat muis los.");
    });
    $("#dropzone").on("dragleave", function (e)
    {
        e.preventDefault();
        $(this).removeClass("selected");
        $(this).text("Sleep het (Excel) bestand hierin.");
    });
    $("#dropzone").on("mouseleave", function ()
    {
        $(this).removeClass("selected");
        $(this).text("Sleep het (Excel) bestand hierin.");
    });
});

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  var files = e.dataTransfer.files;
  var i,f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var reader = new FileReader();
    var name = f.name;
    // tijdelijke oplossing zodat de functie maar 1 bestand tegelijk verwerkt
    if(files.length!=1)
    
    {
        $("#output").html("<h2>Gebruik 1 bestand tegelijk!</h2>");
    }
    else
    
    {
        reader.onload = function (e)
        {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            /*achterhaal de naam van het eerste werkblad*/
            var first_sheet_name = workbook.SheetNames[0];
            /*sla dat werkbland op in var*/
            var worksheet = workbook.Sheets[first_sheet_name];
            j = XLSX.utils.sheet_to_json(worksheet);
            l = j.length;
            outputJSON(j,l);
        };
    reader.readAsBinaryString(f);
    }
  }
}


function outputJSON(j,l)

{
    for(i=0; i<l; i++ )
    {
      $("#output").html("<h1>"+j[i].adres1+"</h1>");  
    }
}