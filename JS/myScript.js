var j;
var output;

function selectedValue()
{
    valueSelect = $("#soortBestand").val();
    console.log(valueSelect);
    return valueSelect;
}

function checkFileType(files)

{
  var fileName=files[0].name;
  if(fileName.indexOf(".xls")==-1 && fileName.indexOf(".xlsx")==-1)
  
  {
      $("#output").html("<h2>Dit bestandstype wordt niet ondersteund!</h2>");
  }
}

function handleFile(e) {
  var files = e.target.files;
  var i,f;
  checkFileType(files);
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
        outputJsonStage(j);
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
        $(this).text("Sleep het (Excel) bestand hierin (werkt niet bij alle browsers).");
    });
    $("#dropzone").on("mouseleave", function ()
    {
        $(this).removeClass("selected");
        $(this).text("Sleep het (Excel) bestand hierin (werkt niet bij alle browsers).");
    });
});

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  var files = e.dataTransfer.files;
  var i,f;
  checkFileType(files);
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
            switch (selectedValue())
            {
                case "stages":
                    outputJsonStage(j);
                    break;
                default:
                    $("#output").html("<h2>Maak een keuze!</h2>");
                    break;
            }
        };
    reader.readAsBinaryString(f);
    }
  }
}

function outputJsonStage(j)

{
output = '<table><tr><th>Bedrijfnaam</th><th>Adres1</th><th>Adres2</th><th>Postcode</th><th>Plaats</th><th>Land</th><th>Student</th><th>Opleiding</th><th>Afstud_richting</th><th>Startdatum</th><th>Einddatum</th></tr>';
    for (i = 0; i != j.length; i++)
            {
                output += '<tr>';
                if(j[i].Bedrijfnaam==null)
                {
                    output += '<td id="A'+i+'">&nbsp;</td>';
                }
                else
                {
                   output += '<td id="A'+i+'">' + j[i].Bedrijfnaam + '</td>';
                }
                if(j[i].Adres1==null)
                {
                    output += '<td id="B'+i+'">&nbsp;</td>';
                }
                else
                {
                    output += '<td id="B'+i+'">' + j[i].Adres1 + '</td>';
                }
                if(j[i].Adres2==null)
                
                {
                    output += '<td id="C'+i+'">&nbsp;</td>';
                }
                else
                {
                     output += '<td id="C'+i+'">' + j[i].Adres2 + '</td>';
                }
               if(j[i].Postcode==null)
               {
                   output += '<td id="D'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="D'+i+'">' + j[i].Postcode + '</td>';
               }
               if(j[i].Plaats==null)
               {
                   output += '<td id="E'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="E'+i+'">' + j[i].Plaats + '</td>';
               }
               if(j[i].Land==null)
               {
                   output += '<td id="F'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="F'+i+'">' + j[i].Land + '</td>';
               }
               if(j[i].Student==null)
               {
                   output += '<td id="G'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="G'+i+'">' + j[i].Student + '</td>';
               }
               if(j[i].Opleiding==null)
               {
                   output += '<td id="H'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="H'+i+'">' + j[i].Opleiding + '</td>';
               }
               if(j[i].Afstud_richting==null)
               {
                   output += '<td id="I'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="I'+i+'">' + j[i].Afstud_richting + '</td>';
               }
               if(j[i].Startdatum==null)
               {
                   output += '<td id="J'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id="J'+i+'">' + j[i].Startdatum + '</td>';
               }
               if(j[i].Einddatum==null)
               {
                   output += '<td id="K'+i+'">&nbsp;</td>';
               }
               else
               {
                   output += '<td id=K'+i+'">' + j[i].Einddatum + '</td>';
               }
                output += '</tr>';
            }
output += "</table>";
$("#output").html(output);
}