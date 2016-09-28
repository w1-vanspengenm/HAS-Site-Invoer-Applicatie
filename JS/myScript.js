var json;
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
        json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);
    };
    reader.readAsBinaryString(f);
  }
}
$(document).ready(function ()
{
    $("#Dropzone").on("dragover", function (e)
    {
        e.preventDefault();
        $(this).addClass("selected");
        $(this).text("Laat muis los.");
    });
    $("#Dropzone").on("dragleave", function (e)
    {
        e.preventDefault();
        $(this).removeClass("selected");
        $(this).text("Sleep het (Exel) bestand hierin.");
    });
    $("#Dropzone").on("mouseleave", function ()
    {
        $(this).removeClass("selected");
        $(this).text("Sleep het (Exel) bestand hierin.");
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
        $("#Dropzone").text("Gebruik 1 bestand tegelijk!");
    }
    else
    
    {
            reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {type: 'binary'});
        /*achterhaal de naam van het eerste werkblad*/
        var first_sheet_name = workbook.SheetNames[0];
        /*sla dat werkbland op in var*/
        var worksheet = workbook.Sheets[first_sheet_name];
        json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);
    };
    reader.readAsBinaryString(f);
    }
  }
}
