var j; // Var voor opslaan json object
var output; // Var voor opslaan htmlcode weer te geven in output
var landen; // var voor opslaan van alle landen uit de database
var scholen; // var voor opslaan van alle partner instellingen uit de database
var opleidingen; // var voor opslaan van alle opleidingen uit de database
var landcode; // var voor tijdelijk opslaan 2 letterige landcode
var landnaam_en; // var voor tijdelijke opslag engelse landnaam
var postdata; // var voor de mee te sturen data bij het invoeren van stages
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
      a.render('Dit bestandstype wordt niet ondersteund');
  }
}
// Converteert sheet naar binary en kiest juist outputfunctie
function handleFile(e) {
  $("#output").fadeOut(100);
  console.log(e);
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
$(document).ready(function () {
    $('.form').hide();
    $("#output").hide();
    $("#dropzone").on("dragover", function (e) {
        e.preventDefault();
        $(this).addClass("selected");
        $(this).text("Laat muis los.");

    });
    $("#dropzone").on("dragleave", function (e) {
        e.preventDefault();
        $(this).removeClass("selected");
        $(this).text("Sleep het (Excel) bestand hierin (werkt niet bij alle browsers).");
    });
    $("#dropzone").on("mouseleave", function () {
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
    .done(function (data) {
        landen = data;
        var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:universiteiten%20en%20hogescholen&outputFormat=application%2Fjson' };
        $.ajax(
    {
        url: 'PHP/geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data) {
        scholen = data;
        var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Opleidingen&outputFormat=application%2Fjson' };
        $.ajax(
    {
        url: 'PHP/geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data) {
        opleidingen = data;
        fill_List(landen, scholen, opleidingen);
    })
    .fail(function () {
        a.render("fout opgetreden bij ophalen van opledingen");
    });
    })
    .fail(function () {
        a.render("fout opgetreden bij ophalen van universiteiten en hogescholen");
    });
    })
    .fail(function () {
        a.render("fout opgetreden bij ophalen van landen");
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
                output = '<option disabled selected hidden>Kies een land...</option>';
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
                output = '<option disabled selected hidden>Kies een instelling...</option>';
                output+='<option value="' + school.properties.Instelling_ID+'">' + school.properties.Instelling_naam + '</option>';
            }
            else
            {
                output += '<option value=' + school.properties.Instelling_ID+ '>' + school.properties.Instelling_naam + '</option>';
            }
        });
        $("#S_instelling").append(output);
        $("#M_instelling").append(output);
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
                output = '<option disabled selected hidden>Kies een opleiding...</option>';
                output+='<option value="' + opleiding.properties.Opledingscode+'">' + opleiding.properties.Opleidingsnaam_nl + '</option>';
            }
            else
            {
                output += '<option value=' + opleiding.properties.Opledingscode+ '>' + opleiding.properties.Opleidingsnaam_nl + '</option>';
            }
        });
        $("#S_opleiding").append(output);
    }
    else
    {
        return;
    }
}
function refillInstellingenList()
{
        var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Alle%20instellingen&outputFormat=application%2Fjson' };
        $.ajax(
        {
            url: 'PHP/geoproxy.php',
            dataType: 'json',
            method: 'post',
            data: serviceName
        })
        .done(function (data) {
            scholen = data;
            $.each(data.features, function (i, instelling) {
                if (i == 0) {
                    output = '<option disabled selected hidden>Kies een instelling...</option>';
                    output += '<option value="' + instelling.properties.Instelling_ID + '">' + instelling.properties.Instelling_naam + '</option>';
                }
                else {
                    output += '<option value="' + instelling.properties.Instelling_ID + '">' + instelling.properties.Instelling_naam + '</option>';
                }
            });
            if ($("#soortBestand").val()=="studies")
            {
            $("#S_instelling").empty();
            $("#S_instelling").append(output);
            $("#S_refilInstellingen").prop('disabled', true);
            $("#S_refilInstellingen").prop("value", "Lijst met instellingen aangevuld");
            $("#S_nieuweInstelling").prop('disabled', false);
            }
            else if ($("#soortBestand").val()=="medewerkers")
            {
            $("#M_instelling").empty();
            $("#M_instelling").append(output);
            $("#M_refilInstellingen").prop('disabled', true);
            $("#M_refilInstellingen").prop("value", "Lijst met instellingen aangevuld");
            $("#M_nieuweInstelling").prop('disabled', false);
            }
        })
        .fail(function () {
            a.render("fout opgetreden bij ophalen van instellingen")
        });
}
function fill_List_Check()
{
    if( $('#M_land').has('option').length == 0 || $('#S_land').has('option').length == 0 || $('#I_land').has('option').length == 0)
    {
        a.render('Database niet beschikbaar, neem contact op met het Geolab.');
        $('.form').hide();
    }
}
// Converteert sheet naar binary
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
        a.render('Gebruik 1 bestand tegelijk.');
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
    var kop1, kop2, kop3;
    var koppen = Object.keys(j[0]);
    for (i = 0; i<koppen.length; i++ )
    {
        if(koppen[i]=="Referentie")
        {
            kop1 = true;
        }
        else if(koppen[i]=='Roepnaam')
        {
            kop2 = true;
        }
        else if(koppen[i]=='StudNr')
        {
            kop3 = true;
        }
    }
    if (kop1!=true||kop2!=true||kop3!=true)
    {
        a.render('Dit is een ongeschikt bestand om te importeren');
        return false;
    }

        output = '<table><tr id="hRow"><th>Opmerking</th><th>Referentie</th><th>Bedrijfnaam</th><th>Adres1</th><th>Adres2</th><th>Postcode</th><th>Plaats</th><th>Land</th><th>Roepnaam</th><th>Tussenvoegsel</th><th>Achternaam</th><th>Studentnummer</th><th>Opleiding</th><th>Afstudeerrichting</th><th>Startdatum</th><th>Einddatum</th><th>Latitude</th><th>Longitude</th></tr>';
    for (i = 0; i < j.length; i++)
            {
                output += '<tr>';
                output+='<td class="hiddenCell"><img src="Images/kruisBlauw.png" alt="kruis"></td>'
                output+='<td><input type="text" class="textfield" placeholder="Niet van toepassing" id="STA_opmerking'+i+'" value="" disabled="disabled"></td>';
                if(j[i].Referentie==null)
                {
                    output += '<td><input type="text" class="textfield" id="STA_referentie'+i+'" value=""></td>';
                }
                else
                {
                    output += '<td><input type="text" class="textfield" id="STA_referentie'+i+'" value="'+j[i].Referentie+'"></td>';
                }
                if(j[i].Bedrijf==null)
                {
                    output += '<td><input type="text" class="textfield" id="STA_bedrijfsnaam'+i+'" value=""></td>';
                }
                else
                {
                   output += '<td><input type="text" class="textfield" id="STA_bedrijfsnaam'+i+'" value="'+j[i].Bedrijf+'"></td>';
                }
                if(j[i].Adres1==null)
                {
                    output += '<td><input type="text" class="textfield" id="STA_adres1'+i+'" value=""></td>';
                }
                else
                {
                    output += '<td><input type="text" class="textfield" id="STA_adres1'+i+'" value="'+j[i].Adres1+'"></td>';
                }
                if(j[i].Adres2==null)
                {
                    output += '<td><input type="text" class="textfield" id="STA_adres2'+i+'" value=""></td>';
                }
                else
                {
                     output += '<td><input type="text" class="textfield" id="STA_adres2'+i+'" value="'+j[i].Adres2+'"></td>';
                }
               if(j[i].Postcode==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_postcode'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_postcode'+i+'" value="'+j[i].Postcode+'"></td>';
               }
               if(j[i].Plaats==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_plaats'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_plaats'+i+'" value="'+j[i].Plaats+'"></td>';
               }
               if(j[i].Land==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_land'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_land'+i+'" value="'+j[i].Land+'"></td>';
               }
               if(j[i].Roepnaam==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_roepnaam'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_roepnaam'+i+'" value="'+j[i].Roepnaam+'"></td>';
               }
               if(j[i].Tussenv==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_tussenv'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_tussenv'+i+'" value="'+j[i].Tussenv+'"></td>';
               }
               if(j[i].Achternaam==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_achternaam'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_achternaam'+i+'" value="'+j[i].Achternaam+'"></td>';
               }
               if(j[i].StudNr==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_studNr'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_studNr'+i+'" value="'+j[i].StudNr+'"></td>';
               }
               if(j[i].Opleiding==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_opleiding'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_opleiding'+i+'" value="'+j[i].Opleiding+'"></td>';
               }
               if(j[i].Afstud_richting==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_afstud_richting'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_afstud_richting'+i+'" value="'+j[i].Afstud_richting+'"></td>';
               }
               if(j[i].Startdatum==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_startdatum'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_startdatum'+i+'" value="'+j[i].Startdatum+'"></td>';
               }
               if(j[i].Einddatum==null)
               {
                   output += '<td><input type="text" class="textfield" id="STA_einddatum'+i+'" value=""></td>';
               }
               else
               {
                   output += '<td><input type="text" class="textfield" id="STA_einddatum'+i+'" value="'+j[i].Einddatum+'"></td>';
               }
               output+='<td><input type="text" class="textfield" placeholder="Druk op adres controleren" id="STA_latitude'+i+'" value="" disabled="disabled"></td>';
               output+='<td><input type="text" class="textfield" placeholder="Druk op adres controleren" id="STA_longitude'+i+'" value="" disabled="disabled"></td>';
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
            var search = $("#I_land option:selected").text() + " " + $("#I_plaats").val() + " " + $("#I_adres1").val() + " " + $('#I_postcode').val();
            GetNominatimGeocoder(search, function (data)
            {
                if (data != undefined)
                {
                    console.log(data.provider);
                    $("#I_lat_zichtbaar").val(data.lat);
                    $("#I_lat_onzichtbaar").val(data.lat);
                    $("#I_lon_zichtbaar").val(data.lng);
                    $("#I_lon_onzichtbaar").val(data.lng);
                    $("#submit_Instelling").prop('disabled', false);
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
                            $("#submit_Instelling").prop('disabled', false);
                        }
                        else
                        {
                            a.render('Adres niet gevonden.')
                            $("#I_lat_zichtbaar").css("border", "1px solid #f00");
                            $("#I_lon_zichtbaar").css("border", "1px solid #f00");
                        }
                    });
                }
            });
            break;
        case "studies":
            $("#output").fadeOut("Fast");
            var search = $("#I_land option:selected").text() + " " + $("#I_plaats").val() + " " + $("#I_adres1").val() + " " + $('#I_postcode').val();
            GetNominatimGeocoder(search, function (data)
            {
                if (data != undefined)
                {
                    console.log(data.provider);
                    $("#I_lat_zichtbaar").val(data.lat);
                    $("#I_lat_onzichtbaar").val(data.lat);
                    $("#I_lon_zichtbaar").val(data.lng);
                    $("#I_lon_onzichtbaar").val(data.lng);
                    $("#submit_Instelling").prop('disabled', false);
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
                            $("#submit_Instelling").prop('disabled', false);
                        }
                        else
                        {
                            a.render('Adres niet gevonden.');
                            $("#I_lat_zichtbaar").css("border", "1px solid #f00");
                            $("#I_lon_zichtbaar").css("border", "1px solid #f00");
                        }
                    });
                }
            });
            break;
        case "stages":
            for (i = 0; i < j.length; i++) {
                var search = $('#STA_land' + i).val() + " " + $('#STA_plaats' + i).val() + " " + $('#STA_adres1' + i).val() + " " + $('#STA_postcode' + i).val();
                GetNominatimGeocoder(search, function (data) {
                    if (data != undefined) {
                        console.log(i + " " + data.provider);
                        $('#STA_latitude' + i).val(data.lat);
                        $('#STA_longitude' + i).val(data.lng);
                        $('#STA_opmerking' + i).val('');
                    }
                    else {
                        GetGoogleGeocoder(search, function (data) {
                            if (data != undefined) {
                                console.log(i + " " + data.provider);
                                $('#STA_latitude' + i).val(data.lat);
                                $('#STA_longitude' + i).val(data.lng);
                                $('#STA_opmerking' + i).val('');
                            }
                            else {
                                $('#STA_opmerking' + i).val("Adres niet gevonden.")
                                $('#STA_opmerking' + i).parent().parent().children().children().addClass("rood");
                                console.log(i + " Niet gevonden(" + search + ')');
                            }
                        });

                    }
                });
                $("#adresCheckStages").prop('value', Math.round(i / j.length * 100) + '%');
            }
            $("#submit_Stages").prop('disabled', false);
            $('#adresCheckStages').prop('value', 'Adres opnieuw controleren');
            break;
    }
}
function fillInDataInstelling()
{
    var M_instellingID = $("#M_instelling").val();
    var S_instellingID = $("#S_instelling").val();
    $.each(scholen.features, function (i, school)
    {
        if (school.properties.Instelling_ID == S_instellingID && $("#soortBestand").val()=="studies")
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
            if($("#S_opleiding").val()!=null)
            {
                $("#submit_Studies").prop('disabled', false);
            }
            return false; // stop each
        }
        else if(school.properties.Instelling_ID == M_instellingID && $("#soortBestand").val()=="medewerkers")
        {
            $("#M_land").val(school.properties.Landcode);
            $("#M_plaats").val(school.properties.Plaats);
            $("#M_adres1").val(school.properties.Adres_1);
            $("#M_adres2").val(school.properties.Adres_2);
            $("#M_postcode").val(school.properties.Postcode);
            $("#M_lat_zichtbaar").val(school.properties.Latitude);
            $("#M_lat_onzichtbaar").val(school.properties.Latitude);
            $("#M_lon_zichtbaar").val(school.properties.Longitude);
            $("#M_lon_onzichtbaar").val(school.properties.Longitude);
            $("#submit_Medewerkers").prop('disabled', false);
        }
    })
}
function fillArray()
{
// vars met alle waardes uit de tabel (per kolom)
var ReferentieArray = [];
var BedrijfArray = [];
var Adres1Array = [];
var Adres2Array = [];
var PostcodeArray = [];
var PlaatsArray = [];
var LandArray = [];
var StudentRoepnaamArray = [];
var StudentTussenvoegselArray = [];
var StudentAchternaamArray = [];
var StudNrArray = [];
var OpleidingArray = [];
var StartdatumArray = [];
var EinddatumArray = [];
var LatitudeArray = [];
var LongitudeArray = [];
    for(i=0; i<j.length; i++)
    {
        if($('#STA_referentie'+i).parent().parent().css('display')!='none')
        {
        ReferentieArray.push($('#STA_referentie' + i).val());
        BedrijfArray.push($('#STA_bedrijfsnaam' + i).val());
        Adres1Array.push($('#STA_adres1' + i).val());
        Adres2Array.push($('#STA_adres2' + i).val());
        PostcodeArray.push($('#STA_postcode' + i).val());
        PlaatsArray.push($('#STA_plaats' + i).val());
        $.each(landen.features, function (counter, land) {
            if (verwijderSpecialeTekens($("#STA_land" + i).val()) == verwijderSpecialeTekens(land.properties.Landnaam_nl)) {
                landcode = land.properties.Landcode;
                $('#STA_land' + i).val(landcode);
                return false;
            }
            else
            {
              landcode = 'N ';
            }
        })
        LandArray.push(landcode);
        StudentRoepnaamArray.push($('#STA_roepnaam'+i).val());
        StudentTussenvoegselArray.push($('#STA_tussenv' + i).val());
        StudentAchternaamArray.push($('#STA_achternaam' + i).val());
        StudNrArray.push($('#STA_studNr' + i).val());
        OpleidingArray.push($('#STA_opleiding' + i).val());
        StartdatumArray.push($('#STA_startdatum' + i).val());
        EinddatumArray.push($('#STA_einddatum' + i).val());
        LatitudeArray.push(parseFloat($('#STA_latitude' + i).val()));
        LongitudeArray.push(parseFloat($('#STA_longitude' + i).val()));
    }
        }
        postdata=
        {
            Referenties: ReferentieArray,
            Bedrijven: BedrijfArray,
            Eerste_adressen:Adres1Array,
            Twede_adressen: Adres2Array,
            Postcodes: PostcodeArray,
            Plaatsen: PlaatsArray,
            Landen: LandArray,
            Roepnamen: StudentRoepnaamArray,
            Tussenvoegsels: StudentTussenvoegselArray,
            Achternamen: StudentAchternaamArray,
            Student_nummers: StudNrArray,
            Opleidingen: OpleidingArray,
            StartDatumms: StartdatumArray,
            EindDatums: EinddatumArray,
            Lat: LatitudeArray,
            Lon: LongitudeArray 
        }
        console.log(postdata);
        $.ajax(
    {
        url: 'PHP/invoer_Stages.php',
        method: 'post',
        data: postdata
    })
    .done(function (data) {
        console.log(data);
        $("#output").html(data);
    })
    .fail(function () {
        a.render("Niet gelukt");
    });
}
function rijVerwijderen() // verbergt rijen die niet ingevoerd hoeven te worden in de database
{
    $(".hiddenCell").css("display", "block");
    $("#hRow").html('<th></th><th>Opmerking</th><th>Referentie</th><th>Bedrijfnaam</th><th>Adres1</th><th>Adres2</th><th>Postcode</th><th>Plaats</th><th>Land</th><th>Roepnaam</th><th>Tussenvoegsel</th><th>Achternaam</th><th>Studentnummer</th><th>Opleiding</th><th>Afstudeerrichting</th><th>Startdatum</th><th>Einddatum</th><th>Latitude</th><th>Longitude</th></tr>');
    $(".hiddenCell img").on("mouseover", function () {
        $(this).prop('src', 'Images/kruisRood.png');
    });
    $(".hiddenCell img").on("mouseleave", function () {
        $(this).prop('src', 'Images/kruisBlauw.png');
    });
    $('.hiddenCell img').on("click", function () {
        $(this).parent().parent().fadeOut('slow');
    });
}
function verwijderSpecialeTekens(str)
{
    var r = str.replace(/[^a-zA-Z ]/g, ""); //regex haalt speciale tekens weg
    return r;
}