<?php
$voornaam=$_POST['M_voornaam'];
$tussenvoegsel=$_POST['M_tussenv'];
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
        <!--Linken stylesheet-->
        <link rel="stylesheet" type="text/css" href="../CSS/Style.css">
        <!--Linken has favicon-->
        <link rel="shortcut icon" type="image/x-icon" href="../Images/has_favicon.ico">
        <link rel="icon" href="../Images/has_favicon.ico" type="image/x-icon">
    </head>
    <body>
        <div id="header">
            <img src="../Images/has_logo.png" alt="HAS logo">
            <h1>Invoer applicatie HAS actuele internationale mobiliteit</h1>
        </div>
        <?php
            session_start();
            if(isset($_SESSION['username']) && isset($_SESSION['ww']))
            {
           $con = pg_connect("host=localhost dbname=Internationale-kaart user=postgres password=postgres")
           or die('<h2 class="rood">Kan niet verbinden met database, neem contact op met het Geolab</h2>');
           $select="select * from \"tbl_Medewerkers\" where \"Medewerkers_nr\"='".$pers_nr."'";
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
           $insert = "INSERT INTO \"tbl_Medewerkers\" VALUES('".$voornaam."', '".$achternaam."', '".$pers_nr."', '".$tussenvoegsel."')";
           $result = pg_query($insert) or die('<h2 class="rood">Query mislukt, neem contact op met het Geolab</h2>');
           echo '<h2>Medewerker ingevoerd.</h2>';
           }
           $select="select * from \"tbl_Medewerker_activiteit\" where \"Medewerkers_nr\"='".$pers_nr."' and \"Start_datum\"='".$startDatum."'";
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
               $insert="INSERT INTO \"tbl_Medewerker_activiteit\" (\"Medewerkers_nr\", \"Omschrijving\", \"Plaats\", \"Landcode\", \"Latitude\", \"Longitude\", \"Start_datum\", \"Eind_datum\", \"Adres1\", \"Adres2\", \"Postcode\")";
               $insert.="VALUES ('".$pers_nr."', '".$omschrijving."', '".$plaats."', '".$land."', ".$lat.", ".$lon.", '".$startDatum."', '".$eindDatum."', '".$adres1."', '".$adres2."', '".$postcode."')";
               $result=pg_query($insert) or die ('<h2 class="rood">Query mislukt, neem contact op met het Geolab</h2>');
               echo '<h2>Activiteit ingevoerd.</h2>'; 
           }
           else
           {
               echo'<h2 class="rood">Activiteit bestaat al.</h2>';
           }
           pg_close($con);
           }
           else
           {
               die("Log in aub'<input type=\"button\" value=\"Ga terug naar login\" onclick=\"window.location.href = '../index.php'; \">");
           }
        ?>
        <input type="button" value="Ga terug naar home" onclick="window.location.href = '../main.html'; ">
    </body>
</html>