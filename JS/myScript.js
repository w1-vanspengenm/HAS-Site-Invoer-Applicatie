var j;
var output;

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
        outputJson(j);
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
            outputJson(j);
        };
    reader.readAsBinaryString(f);
    }
  }
}

function outputJson(j)

{
output = "<table><tr><th>Bedrijfnaam</th><th>Adres1</th><th>Adres2</th><th>Postcode</th><th>Plaats</th><th>Land</th><th>Student</th><th>Opleiding</th><th>Afstud_richting</th><th>Startdatum</th><th>Einddatum</th><th>Soort</th></tr>";
    for (i = 0; i != j.length; i++)
            {
                output += "<tr>";
                output += "<td>" + j[i].Bedrijfnaam + "</td>";
                output += "<td>" + j[i].Adres1 + "</td>";
                output += "<td>" + j[i].Adres2 + "</td>";
                output += "<td>" + j[i].Postcode + "</td>";
                output += "<td>" + j[i].Plaats + "</td>";
                output += "<td>" + j[i].Land + "</td>";
                output += "<td>" + j[i].Student + "</td>";
                output += "<td>" + j[i].Opleiding + "</td>";
                output += "<td>" + j[i].Afstud_richting + "</td>";
                output += "<td>" + j[i].Startdatum + "</td>";
                output += "<td>" + j[i].Einddatum + "</td>";
                output += "<td>" + j[i].Soort + "</td>";
                output += "</tr>";
            }
output += "</table>";
  $("#output").html(output);
}