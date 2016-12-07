<?php
$Referenties=$_POST["Referenties"];
$Bedrijven=$_POST['Bedrijven'];
$adres1=$_POST['Eerste_adressen'];
$adres2=$_POST['Twede_adressen'];
$Postcodes=$_POST['Postcodes'];
$Plaatsen=$_POST['Plaatsen'];
$Landen=$_POST['Landen'];
$Voornamen=$_POST['Roepnamen'];
$Tussenvoegsels=$_POST['Tussenvoegsels'];
$Achternamen=$_POST['Achternamen'];
$Student_nummers=$_POST['Student_nummers'];
$Opleidingen=$_POST['Opleidingen'];
$StartDatumms=$_POST['StartDatumms'];
$EindDatums=$_POST['EindDatums'];
for($i=0; $i<count($StartDatumms); $i++)
{
$date = new DateTime($StartDatumms[$i]);
$StartDatumms[$i]=$date->format('Y-m-d');
$date = new DateTime($EindDatums[$i]);
$EindDatums[$i]=$date->format('Y-m-d');
}
$Lat=$_POST['Lat'];
$Lon=$_POST['Lon'];
$mislukt=0;
$duplicaten=0;

$con = pg_connect("host=localhost dbname=HAS user=postgres password=postgres")
or die('<h2 class="rood">Kan niet verbinden met database, neem contact op met het Geolab</h2>');
for($i=0; $i<count($Bedrijven); $i++)
{
    if($Lat[$i]=="NaN" && $Lon[$i]=="NaN")
    {
        $mislukt++;
    }
    else
    {
        $select="select * from \"tbl_Bedrijven/Onderwijsinstellingen\" where \"Latitude\"=".$Lat[$i]." and \"Longitude\"=".$Lon[$i];
        $result=pg_query($select);
        $numRows=pg_num_rows($result);
        if($numRows==0)
        {
               $insert="INSERT INTO \"tbl_Bedrijven/Onderwijsinstellingen\" (\"Instelling_naam\", \"Adres_1\", \"Adres_2\", \"Plaats\", \"Landcode\", \"Latitude\", \"Longitude\", \"Studie_mogelijkheid\", \"Postcode\")";
               $insert.="VALUES ('".$Bedrijven[$i]."', '".$adres1[$i]."', '".$adres2[$i]."', '".$Plaatsen[$i]."', '".$Landen[$i]."', ".$Lat[$i].", ".$Lon[$i].", "."'f'".", '".$Postcodes[$i]."')";
               $result = pg_query($insert) or $mislukt++;
        }
        else
        {
            $duplicaten++;
        }
    }
}
for($i=0; $i<count($Student_nummers); $i++)
{
           $select="select * from \"tbl_Studenten\" where \"Student_nr\"='".$Student_nummers[$i]."'";
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
               $insert="INSERT INTO \"tbl_Studenten\"VALUES('".$Voornamen[$i]."', '".$Achternamen[$i]."', '".$Opleidingen[$i]."', '".$Student_nummers[$i]."', '".$Tussenvoegsels[$i]."')";
               $result = pg_query($insert) or $mislukt++;
           }
           else
           {
               $duplicaten++;
           }
}
for($i=0; $i<count($Referenties); $i++)
{
    $select="select * from \"tbl_Stages\" where \"Referentie\"='".$Referenties[$i]."'";
    $result=pg_query($select);
    $numRows=pg_num_rows($result);
    if($numRows==0)
    {
        $select="select \"Instelling_ID\" from \"tbl_Bedrijven/Onderwijsinstellingen\" where \"Instelling_naam\"='".$Bedrijven[$i]."'";
        $result=pg_query($select);
        $numRows=pg_num_rows($result);
        $row=pg_fetch_row($result);
        $BedrijfsNummer=$row[0];
        if($numRows==0)
        {
            $mislukt++;
        }
        else
        {
               $insert="INSERT INTO \"tbl_Stages\"VALUES('".$StartDatumms[$i]."', '".$EindDatums[$i]."', ".$BedrijfsNummer.", '".$Student_nummers[$i]."' , '".$Referenties[$i]."')";
               $result = pg_query($insert) or $mislukt++;
        }
    }
    else
    {
        $duplicaten++;
    }
}
if($mislukt>0 || $duplicaten>0)
{
    echo 'Sommige rijen uit het Excel-bestand konden niet worden ingevuld in de database, mogelijke oorzaken zijn:<br><ul><li> De data staat al in de database.</li><li>De data is onvolledig.</li></ul>';
}
else
{
    echo 'Alle data ingevuld.';
}
pg_close($con);
?>