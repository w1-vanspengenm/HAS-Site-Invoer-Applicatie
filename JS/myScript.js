var j; // Var voor opslaan json object
var output; // Var voor opslaan htmlcode weer te geven in output

function GetGoogleGeocoder(address, callback)
{
    try
    {
        $.ajax(
        {
            type : "GET",
            async : false,
            url : "https://maps.googleapis.com/maps/api/geocode/json?address=" + address,
            timeout : 5000
        }).done(function(data)
        {
            if (data.status == "ZERO_RESULTS")
            {
                callback(undefined);
                return;
            }

            var obj =
            {
                provider : "Google",
                lat : data.results[0].geometry.location.lat,
                lng : data.results[0].geometry.location.lng
            };

            callback(obj);
        }).fail(function(jqXHR, textStatus)
        {
            callback(undefined);
        });
    } catch(ex)
    {
        console.log("Google: " + ex);
        callback(undefined);
    }
}

function GetNominatimGeocoder(address, callback)
{
    try
    {
        $.ajax(
        {
            type : "GET",
            async : false,
            url : "http://nominatim.openstreetmap.org/search?format=json&q=" + address,
            timeout : 5000
        }).done(function(data)
        {

            if (!data || data.length < 1)
            {
                callback(undefined);
                return;
            }

            var obj =
            {
                provider : "Nominatim",
                lat : data[0].lat,
                lng : data[0].lon
            };

            callback(obj);
        }).fail(function(jqXHR, textStatus)
        {
            callback(undefined);
        });
    } catch(ex)
    {
        console.log("Nominatim: " + ex);
        callback(undefined);
    }
}

function onSelect() //Haalt geselecteerde waarde dropdownlist op en laat eerdere uitvoer verdwijnen en invoermogelijkheden verschijnen
{
    $("#fileSelect").val("");
    $(".hiddenButtons").hide();
    $("#output").fadeOut("Slow");
    valueSelect = $("#soortBestand").val();
            switch (valueSelect)
            {
                case "stages":
                     $("#formStudies").fadeOut("Slow");
                    $("#formMedewerkers").fadeOut("Slow");
                    $("#formStages").fadeIn("Slow");
                    break;
                case "medewerkers":
                    $("#formStudies").fadeOut("Slow");
                    $("#formStages").fadeOut("Slow");
                    $("#formMedewerkers").fadeIn("Slow");
                    break;
                case "studies":
                    $("#formStages").fadeOut("Slow");
                    $("#formMedewerkers").fadeOut("Slow");
                    $("#formStudies").fadeIn("Slow");
                    break;
            }
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
        outputJsonStage(j);
    };
    reader.readAsBinaryString(f);
  }
}
$(document).ready(function ()
{
    $("#formStudies").hide();
    $("#formMedewerkers").hide();
    $("#formStages").hide();
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
            outputJsonStage(j);

        };
    reader.readAsBinaryString(f);
    }
  }
}
function outputJsonStage(j)
{
output = '<table><tr><th>Opmerking</th><th>Bedrijfnaam</th><th>Adres1</th><th>Adres2</th><th>Postcode</th><th>Plaats</th><th>Land</th><th>Student</th><th>Opleiding</th><th>Afstudeerrichting</th><th>Startdatum</th><th>Einddatum</th><th>Latitude</th><th>Longitude</th></tr>';
    for (i = 0; i != j.length; i++)
            {
                output += '<tr>';
                output+='<td><input type="text" class="textfield" placeholder="Niet van toepassing" id="A'+i+'" value="" disabled="disabled"></td>';
                if(j[i].Bedrijfnaam==null)
                {
                    output += '<td><input type="text" class="textfield" id="B'+i+'" value=""</td>';
                }
                else
                {
                   output += '<td><input type="text" class="textfield" id="B'+i+'" value="'+j[i].Bedrijfnaam+'"></td>';
                }
                if(j[i].Adres1==null)
                {
                    output += '<td><input type="text" class="textfield" id="C'+i+'" value=""</td>';
                }
                else
                {
                    output += '<td><input type="text" class="textfield" id="C'+i+'" value="'+j[i].Adres1+'"></td>';
                }
                if(j[i].Adres2==null)
                
                {
                    output += '<td><input type="text" class="textfield" id="D'+i+'" value=""</td>';
                }
                else
                {
                     output += '<td><input type="text" class="textfield" id="D'+i+'" value="'+j[i].Adres2+'"></td>';
                }
               if(j[i].Postcode==null)
               {
                   output += '<td><input type="text" class="textfield" id="E'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="E'+i+'" value="'+j[i].Postcode+'"></td>';
               }
               if(j[i].Plaats==null)
               {
                   output += '<td><input type="text" class="textfield" id="F'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="F'+i+'" value="'+j[i].Plaats+'"></td>';
               }
               if(j[i].Land==null)
               {
                   output += '<td><input type="text" class="textfield" id="G'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="G'+i+'" value="'+j[i].Land+'"></td>';
               }
               if(j[i].Student==null)
               {
                   output += '<td><input type="text" class="textfield" id="H'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="H'+i+'" value="'+j[i].Student+'"></td>';
               }
               if(j[i].Opleiding==null)
               {
                   output += '<td><input type="text" class="textfield" id="I'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="I'+i+'" value="'+j[i].Opleiding+'"></td>';
               }
               if(j[i].Afstud_richting==null)
               {
                   output += '<td><input type="text" class="textfield" id="J'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="J'+i+'" value="'+j[i].Afstud_richting+'"></td>';
               }
               if(j[i].Startdatum==null)
               {
                   output += '<td><input type="text" class="textfield" id="K'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="K'+i+'" value="'+j[i].Startdatum+'"></td>';
               }
               if(j[i].Einddatum==null)
               {
                   output += '<td><input type="text" class="textfield" id="L'+i+'" value=""</td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="L'+i+'" value="'+j[i].Einddatum+'"></td>';
               }
               output+='<td><input type="text" class="textfield" placeholder="Druk op adres controleren" id="M'+i+'" value="" disabled="disabled"></td>';
               output+='<td><input type="text" class="textfield" placeholder="Druk op adres controleren" id="N'+i+'" value="" disabled="disabled"></td>';
                output += '</tr>';
            }
output += "</table>";
$("#output").html(output);
$(".hiddenButtons").fadeIn("Slow");
$("#output").fadeIn("Slow");
}
function getLatLon(j)
{
    switch(valueSelect)
    {
        case "medewerkers":
            var search = $("#M_land").val() + " " + $("#M_plaats").val() + " " + $("#M_adres1").val();
            GetNominatimGeocoder(search, function (data)
            {
                if (data != undefined)
                {
                    console.log(data.provider);
                    $("#M_lat").val(data.lat);
                    $("#M_lon").val(data.lng);
                }
                else
                {
                    GetGoogleGeocoder(search, function (data)
                    {
                        if (data != undefined)
                        {
                            console.log(data.provider);
                            $("#M_lat").val(data.lat);
                            $("#M_lon").val(data.lng);
                        }
                    });
                }
            });
            break;
        case "studies":
            var search = $("#S_land").val() + " " + $("#S_plaats").val() + " " + $("#S_adres1").val();
            GetNominatimGeocoder(search, function (data)
            {
                if (data != undefined)
                {
                    console.log(data.provider);
                    $("#S_lat").val(data.lat);
                    $("#S_lon").val(data.lng);
                }
                else
                {
                    GetGoogleGeocoder(search, function (data)
                    {
                        if (data != undefined)
                        {
                            console.log(data.provider);
                            $("#S_lat").val(data.lat);
                            $("#S_lon").val(data.lng);
                        }
                    });
                }
            });
            break;
        case "stages":
            for (i = 0; i != j.length; i++)
            {
                var search = $('#G' + i).val() + " " + $('#F' + i).val() + " " + $('C' + i).val();
                GetNominatimGeocoder(search, function (data)
                {
                    if (data != undefined)
                    {
                        console.log(i + " " + data.provider);
                        $('#M' + i).val(data.lat);
                        $('#N' + i).val(data.lng);
                    }
                    else
                    {
                        GetGoogleGeocoder(search, function (data)
                        {
                            if (data != undefined)
                            {
                                console.log(i + " " + data.provider);
                                $('#M' + i).val(data.lat);
                                $('#N' + i).val(data.lng);
                            }
                            else
                            {
                                $('#A' + i).val("Adres niet gevonden")
                                $('#A' + i).parent().parent().children().children().addClass("rood");
                            }
                        });
                    }
                });
            }
    }
}