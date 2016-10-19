<?php
$voornaam=$_POST['M_voornaam'];
$achternaam=$_POST['M_achternaam'];
$pers_nr=$_POST['M_pers_nr'];
$omschrijving=$_POST['M_omschrijving'];
$land=$_POST['M_land'];
$plaats=$_POST['M_plaats'];
$adres1=$_POST['M_adres1'];
$adres2=$_POST['M_adres2'];
$startDatum=$_POST['M_startDatum'];
$eindDatum=$_POST['M_eindDatum'];
$lat=$_POST['M_lat_onzichtbaar'];
$lon=$_POST['M_lon_onzichtbaar'];
$postcode=$_POST['M_postcode'];
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Invoer medewerkers</title>
    </head>
    <body>
        <?php
           echo $land; 
        ?>
    </body>
</html>
