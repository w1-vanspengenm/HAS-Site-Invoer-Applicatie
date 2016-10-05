var j; // Var voor opslaan json object
var output; // Var voor opslaan htmlcode weer te geven in output

function onSelect() //Haalt geselecteerde waarde dropdownlist op en laat eerdere uitvoer verdwijnen en invoermogelijkheden verschijnen
{
    $("#output").fadeOut("Slow");
    $("#input").fadeIn("Slow");
    valueSelect = $("#soortBestand").val();
    return valueSelect;
}

function checkFileType(files) //Controleert of bestand ondersteund wordt en geeft zonodig foutmelding
{
  var fileName=files[0].name;
  if(fileName.indexOf(".xls")==-1 && fileName.indexOf(".xlsx")==-1)
  
  {
      $("#output").fadeIn("Slow");
      $("#output").html("<h2>Dit bestandstype wordt niet ondersteund!</h2>");
  }
}
// Converteert sheet naar binary en kiest juist outputfunctie
function handleFile(e) {
  $("#output").fadeOut(100);
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
        switch (onSelect())
            {
                case "stages":
                    outputJsonStage(j);
                    break;
                case "medewerkers":
                    outputJsonMedewerkers(j);
                    break;
                case "studies":
                    outputJsonStudies(j);
                    break;
            }
    };
    reader.readAsBinaryString(f);
  }
}
$(document).ready(function ()
{
    $("#input").hide();
    $("#output").hide();
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
// Converteert sheet naar binary en kiest juist outputfunctie
function handleDrop(e) {
  $("#output").fadeOut(100);
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
        $("#output").fadeIn("Slow");
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
            switch (onSelect())
            {
                case "stages":
                    outputJsonStage(j);
                    break;
                case "medewerkers":
                    outputJsonMedewerkers(j);
                    break;
                case "studies":
                    outputJsonStudies(j);
                    break;
            }
        };
    reader.readAsBinaryString(f);
    }
  }
}

function outputJsonStage(j)
{
output = '<table><tr><th>Bedrijfnaam</th><th>Adres1</th><th>Adres2</th><th>Postcode</th><th>Plaats</th><th>Land</th><th>Student</th><th>Opleiding</th><th>Afstudeerrichting</th><th>Startdatum</th><th>Einddatum</th></tr>';
    for (i = 0; i != j.length; i++)
            {
                output += '<tr>';
                if(j[i].Bedrijfnaam==null)
                {
                    output += '<td><input type="text" class="textfield" id="A'+i+'" value=""</td>';
                }
                else
                {
                   output += '<td><input type="text" class="textfield" id="A'+i+'" value="'+j[i].Bedrijfnaam+'"></td>';
                }
                if(j[i].Adres1==null)
                {
                    output += '<td><input type="text" class="textfield" id="B'+i+'" value=""</td>';
                }
                else
                {
                    output += '<td><input type="text" class="textfield" id="B'+i+'" value="'+j[i].Adres1+'"></td>';
                }
                if(j[i].Adres2==null)
                
                {
                    output += '<td><input type="text" class="textfield" id="C'+i+'" value=""</td>';
                }
                else
                {
                     output += '<td><input type="text" class="textfield" id="C'+i+'" value="'+j[i].Adres2+'"></td>';
                }
               if(j[i].Postcode==null)
               {
                   output += '<td><input type="text" class="textfield" id="D'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="D'+i+'" value="'+j[i].Postcode+'"></td>';
               }
               if(j[i].Plaats==null)
               {
                   output += '<td><input type="text" class="textfield" id="E'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="E'+i+'" value="'+j[i].Plaats+'"></td>';
               }
               if(j[i].Land==null)
               {
                   output += '<td><input type="text" class="textfield" id="F'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="F'+i+'" value="'+j[i].Land+'"></td>';
               }
               if(j[i].Student==null)
               {
                   output += '<td><input type="text" class="textfield" id="G'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="G'+i+'" value="'+j[i].Student+'"></td>';
               }
               if(j[i].Opleiding==null)
               {
                   output += '<td><input type="text" class="textfield" id="H'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="H'+i+'" value="'+j[i].Opleiding+'"></td>';
               }
               if(j[i].Afstud_richting==null)
               {
                   output += '<td><input type="text" class="textfield" id="I'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="I'+i+'" value="'+j[i].Afstud_richting+'"></td>';
               }
               if(j[i].Startdatum==null)
               {
                   output += '<td><input type="text" class="textfield" id="J'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="J'+i+'" value="'+j[i].Startdatum+'"></td>';
               }
               if(j[i].Einddatum==null)
               {
                   output += '<td><input type="text" class="textfield" id="K'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="K'+i+'" value="'+j[i].Einddatum+'"></td>';
               }
                output += '</tr>';
            }
output += "</table>";
$("#output").fadeIn("Slow");
$("#output").html(output);
}

function outputJsonMedewerkers(j)
{
    output = '<table><tr><th>Naam medewerker</th><th>Datum vertrek</th><th>Datum terugkomst</th><th>Instelling of organisatie</th><th>beschrijving (engels)</th><th>Straat</th><th>Huisnummer</th><th>Plaats</th><th>Land (engels)</th></tr>';
    for(i=0; i!=j.length; i++)
    {
        output += '<tr>';
        if(j[i].Naam_medewerker==null)
        {
            output += '<td><input type="text" class="textfield" id="A'+i+'" value=""</td>';
        }
        else
        {
             output += '<td><input type="text" class="textfield" id="A'+i+'" value="'+j[i].Naam_medewerker+'"></td>';
        }
        if(j[i].Datum_vertrek==null)
        {
            output += '<td><input type="text" class="textfield" id="B'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="B'+i+'" value="'+j[i].Datum_vertrek+'"></td>';
        }
        if(j[i].Datum_terugkomst==null)
        {
            output += '<td><input type="text" class="textfield" id="C'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="C'+i+'" value="'+j[i].Datum_terugkomst+'"></td>';
        }
        if(j[i].Instelling_of_organisatie==null)
        {
            output += '<td><input type="text" class="textfield" id="D'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="D'+i+'" value="'+j[i].Instelling_of_organisatie+'"></td>';
        }
        if(j[i].Beschrijving_En==null)
        {
            output += '<td><input type="text" class="textfield" id="E'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="E'+i+'" value="'+j[i].Beschrijving_En+'"></td>';
        }
        if(j[i].Straat==null)
        {
            output += '<td><input type="text" class="textfield" id="F'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="F'+i+'" value="'+j[i].Straat+'"></td>';
        }
        if(j[i].Huisnummer==null)
        {
            output += '<td><input type="text" class="textfield" id="G'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="G'+i+'" value="'+j[i].Huisnummer+'"></td>';
        }
        if(j[i].Plaats==null)
        {
            output += '<td><input type="text" class="textfield" id="H'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="H'+i+'" value="'+j[i].Plaats+'"></td>';
        }
        if(j[i].Land_En==null)
        {
            output += '<td><input type="text" class="textfield" id="I'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="I'+i+'" value="'+j[i].Land_En+'"></td>';
        }
        output += '</tr>';
    }
output += "</table>";
$("#output").fadeIn("Slow");
$("#output").html(output);
}

function outputJsonStudies(j)
{
    output = '<table><tr><th>Naam student</th><th>Opleiding</th><th>Datum vertrek</th><th>Datum terugkomst</th><th>Instelling</th><th>Land</th></tr>';
    for(i=0; i!=j.length; i++)
    {
        output += '<tr>';
        if(j[i].Naam_student==null)
        {
            output += '<td><input type="text" class="textfield" id="A'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="A'+i+'" value="'+j[i].Naam_student+'"></td>';
        }
        if(j[i].Opleiding==null)
        {
            output += '<td><input type="text" class="textfield" id="B'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="B'+i+'" value="'+j[i].Opleiding+'"></td>';
        }
        if(j[i].Datum_vertrek==null)
        {
            output += '<td><input type="text" class="textfield" id="C'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="C'+i+'" value="'+j[i].Datum_vertrek+'"></td>';
        }
        if(j[i].Datum_terugkomst==null)
        {
            output += '<td><input type="text" class="textfield" id="D'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="D'+i+'" value="'+j[i].Datum_terugkomst+'"></td>';
        }
        if(j[i].Instelling==null)
        {
            output += '<td><input type="text" class="textfield" id="E'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="E'+i+'" value="'+j[i].Instelling+'"></td>';
        }
        if(j[i].Land==null)
        {
            output += '<td><input type="text" class="textfield" id="F'+i+'" value=""</td>';
        }
        else
        {
            output += '<td><input type="text" class="textfield" id="F'+i+'" value="'+j[i].Land+'"></td>';
        }
        output += '</tr>';
    }
    output += '</table>';
$("#output").fadeIn("Slow");
$("#output").html(output);
}