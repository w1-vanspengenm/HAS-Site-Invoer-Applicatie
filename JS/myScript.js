var j; // Var voor opslaan json object
var output; // Var voor opslaan htmlcode weer te geven in output
var landen;
var scholen;
var opleidingen;

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
                    $('.form').fadeOut("Slow");
                    $("#formStages").fadeIn("Slow");
                     fill_List_Check();
                    break;
                case "medewerkers":
                    $('.form').fadeOut("Slow");
                    $("#formMedewerkers").fadeIn("Slow");
                     fill_List_Check();
                    break;
                case "studies":
                    $('.form').fadeOut("Slow");
                    $("#formStudies").fadeIn("Slow");
                     fill_List_Check();
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
      $("#output").html('<h2 class="rood">Dit bestandstype wordt niet ondersteund.</h2>');
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
    $('.form').hide();
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
    var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:landensort&outputFormat=application%2Fjson' };
    $.ajax(
    {
        url: 'PHP/geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data)
    {
        landen = data;
        var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:universiteiten%20en%20hogescholen&outputFormat=application%2Fjson' };
        $.ajax(
    {
        url: 'PHP/geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data)
    {
        scholen = data;
        var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:tbl_Opleidingen&outputFormat=application%2Fjson' };
        $.ajax(
    {
        url: 'PHP/geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data)
    {
        opleidingen = data;
        fill_List(landen, scholen, opleidingen);
    })
    .fail(function ()
    {
        console.log("fout opgetreden bij ophalen van opledingen");
    });
    })
    .fail(function ()
    {
        console.log("fout opgetreden bij ophalen van universiteiten en hogescholen");
    });
    })
    .fail(function ()
    {
        console.log("fout opgetreden bij ophalen van landen");
    });
});
function fill_List(landen, scholen, opleidingen)
{
    if(landen != undefined)
    {
        $.each(landen.features, function (i, land)
        {
            if (i == 0)
            {
                output = '<option value="placeholder" disabled selected hidden>Kies een land...</option>';
                output+='<option value="' + land.properties.Landcode+'">' + land.properties.Landnaam_nl_html + '</option>';
            }
            else
            {
                output += '<option value="' + land.properties.Landcode+ '">' + land.properties.Landnaam_nl_html + '</option>';
            }
        });
        $("#M_land").append(output);
        $("#S_land").append(output);
        $("#I_land").append(output);
    }
    else
    {
        return;
    }

    if (scholen != undefined)
    {
        $.each(scholen.features, function (i, school)
        {
            if (i == 0)
            {
                output = '<option value="placeholder" disabled selected hidden>Kies een instelling...</option>';
                output+='<option value="' + school.properties.Instelling_ID+'">' + school.properties.Instelling_naam + '</option>';
            }
            else
            {
                output += '<option value=' + school.properties.Instelling_ID+ '>' + school.properties.Instelling_naam + '</option>';
            }
        });
        $("#S_instelling").append(output);
    }
    else
    {
        return;
    }
        if (opleidingen != undefined)
        {
        $.each(opleidingen.features, function (i, opleiding)
        {
            if (i == 0)
            {
                output = '<option value="placeholder" disabled selected hidden>Kies een opleiding...</option>';
                output+='<option value="' + opleiding.id.substring(16, 19)+'">' + opleiding.properties.Opleidingsnaam_nl + '</option>';
            }
            else
            {
                output += '<option value=' + opleiding.id.substring(16, 19)+ '>' + opleiding.properties.Opleidingsnaam_nl + '</option>';
            }
        });
        $("#S_opleiding").append(output);
    }
    else
    {
        return;
    }
}
function fill_List_Check()
{
    if( $('#M_land').has('option').length == 0 || $('#S_land').has('option').length == 0 || $('#I_land').has('option').length == 0)
    {
        $("#output").html('<h2 class="rood">Database niet beschikbaar, neem contact op met het Geolab.</h2>').fadeIn("Slow");
        $('.form').hide();
    }
}
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
        $("#output").html('<h2 class="rood">Gebruik 1 bestand tegelijk.</h2>');
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
    for (i = 0; i < j.length; i++)
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
    $('*').removeClass('rood');
    switch(valueSelect)
    {
        case "medewerkers":
            $("#output").fadeOut("Fast");
            var search = $("#M_land option:selected").text() + " " + $("#M_plaats").val() + " " + $("#M_adres1").val() + " " + $('M_postcode');
            GetNominatimGeocoder(search, function (data)
            {
                if (data != undefined)
                {
                    console.log(data.provider);
                    $("#M_lat_zichtbaar").val(data.lat);
                    $("#M_lat_onzichtbaar").val(data.lat);
                    $("#M_lon_zichtbaar").val(data.lng);
                    $("#M_lon_onzichtbaar").val(data.lng);
                    $("#submit_Medewerkers").attr('disabled', false);
                }
                else
                {
                    GetGoogleGeocoder(search, function (data)
                    {
                        if (data != undefined)
                        {
                            console.log(data.provider);
                            $("#M_lat_zichtbaar").val(data.lat);
                            $("#M_lat_onzichtbaar").val(data.lat);
                            $("#M_lon_zichtbaar").val(data.lng);
                            $("#M_lon_onzichtbaar").val(data.lng);
                            $("#submit_Medewerkers").attr('disabled', false);
                        }
                        else
                        {
                            $("#output").html('<h2 class="rood">Adres niet gevonden.</h2>').fadeIn("Slow");
                            $("#M_lat_zichtbaar").addClass("rood");
                            $("#M_lon_zichtbaar").addClass("rood");
                        }
                    });
                }
            });
            break;
        case "studies":
            $("#output").fadeOut("Fast");
            var search = $("#I_land option:selected").text() + " " + $("#I_plaats").val() + " " + $("#I_adres1").val() + " " + $('I_postcode');
            GetNominatimGeocoder(search, function (data)
            {
                if (data != undefined)
                {
                    console.log(data.provider);
                    $("#I_lat_zichtbaar").val(data.lat);
                    $("#I_lat_onzichtbaar").val(data.lat);
                    $("#I_lon_zichtbaar").val(data.lng);
                    $("#I_lon_onzichtbaar").val(data.lng);
                    $("#submit_Instelling").attr('disabled', false);
                }
                else
                {
                    GetGoogleGeocoder(search, function (data)
                    {
                        if (data != undefined)
                        {
                            console.log(data.provider);
                            $("#I_lat_zichtbaar").val(data.lat);
                            $("#I_lat_onzichtbaar").val(data.lat);
                            $("#I_lon_zichtbaar").val(data.lng);
                            $("#I_lon_onzichtbaar").val(data.lng);
                            $("#submit_Instelling").attr('disabled', false);
                        }
                        else
                        {
                            $("#output").html('<h2 class="rood">Adres niet gevonden.</h2>').fadeIn("Slow");
                            $("#I_lat_zichtbaar").addClass("rood");
                            $("#I_lon_zichtbaar").addClass("rood");
                        }
                    });
                }
            });
            break;
        case "stages":
            for (i = 0; i < j.length; i++)
            {
                var search = $('#F' + i).val() + " " + $('#G' + i).val() + " " + $('#C' + i).val() + " " + $('#E' + i).val();
                GetNominatimGeocoder(search, function (data)
                {
                    if (data != undefined)
                    {
                        console.log(i + " " + data.provider);
                        $('#M' + i).val(data.lat);
                        $('#N' + i).val(data.lng);
                        $('#A' + i).val('');
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
                                $('#A' + i).val('');
                            }
                            else
                            {
                                $('#A' + i).val("Adres niet gevonden.")
                                $('#A' + i).parent().parent().children().children().addClass("rood");
                                console.log(i + " Niet gevonden(" + search + ')');
                            }
                        });

                    }
                });
                $("#adresCheckStages").attr('value', Math.round(i / j.length * 100) + '%');
            }
            $("#submit_Stages").attr('disabled', false);
            $('#adresCheckStages').attr('value', 'Adres opniew controleren');
            break;
    }
}
function formValMedewerkers(form)
{
 $('*').removeClass("rood");
 $("#output").fadeOut("Slow");
            with (form.M_voornaam)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">voornaam invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_voornaam").addClass("rood");
                    return false;
                }
            }

            with (form.M_achternaam)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Achternaam invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_achternaam").addClass("rood");
                    return false;
                }
            }

            with (form.M_pers_nr)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Personeels nummer invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_pers_nr").addClass("rood");
                    return false;
                }
            }

            with (form.M_omschrijving)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Omschrijving invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_omschrijving").addClass("rood");
                    return false;
                }
            }

            with (form.M_land)
            {
                if (value == "" || value == null || value=='placeholder')
                {
                    $("#output").html('<h2 class="rood">Land kiezen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_land").addClass("rood");
                    return false;
                }
            }

            with (form.M_plaats)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Plaats invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_plaats").addClass("rood");
                    return false;
                }
            }

            with (form.M_adres1)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Adres invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_adres1").addClass("rood");
                    return false;
                }
            }

            with (form.M_adres2)
            {
                if (value == "" || value == null)
                {
                    $("#M_adres2").val("Onbekend");
                }
            }

            with (form.M_postcode)
            {
                if (value == "" || value == null)
                {
                    $("#M_postcode").val("Onbekend");
                }
            }

            with (form.M_startDatum)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Start datum activiteit invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_startDatum").addClass("rood");
                    return false;
                }
            }

            with (form.M_eindDatum)
            {
                if (value == "" || value == null)
                {
                    $("#output").html('<h2 class="rood">Eind datum activiteit invullen is verplicht.</h2>').fadeIn("Slow");
                    $("#M_eindDatum").addClass("rood");
                    return false;
                }
            }
}
function fillInDataInstelling()
{
    var instellingID = $("#S_instelling").val();
    $.each(scholen.features, function (i, school)
    {
        if (school.properties.Instelling_ID == instellingID)
        {
            $("#S_land").val(school.properties.Landcode);
            $("#S_plaats").val(school.properties.Plaats);
            $("#S_adres1").val(school.properties.Adres_1);
            $("#S_adres2").val(school.properties.Adres_2);
            $("#S_postcode").val(school.properties.Postcode);
            $("#S_lat_zichtbaar").val(school.properties.Latitude);
            $("#S_lat_onzichtbaar").val(school.properties.Latitude);
            $("#S_lon_zichtbaar").val(school.properties.Longitude);
            $("#S_lon_onzichtbaar").val(school.properties.Longitude);
            $("#submit_Studies").attr('disabled', false);
            return false; // stop each
        }
    })
}