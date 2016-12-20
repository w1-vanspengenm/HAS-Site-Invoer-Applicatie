<?php
$instellingNaam=$_POST['I_naam'];
$land=$_POST['I_land'];
$plaats=$_POST['I_plaats'];
$adres1=$_POST['I_adres1'];
$adres2=$_POST['I_adres2'];
$postcode=$_POST['I_postcode'];
$lat=$_POST['I_lat_onzichtbaar'];
$lon=$_POST['I_lon_onzichtbaar'];
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Invoer nieuwe instelling</title>
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
           $con = pg_connect("host=localhost dbname=Internationale-kaart user=".$_SESSION['username']." password=".$_SESSION['ww'])
           or die('<h2 class="rood">Kan niet verbinden met database, neem contact op met het Geolab</h2>');
           $select="select * from \"tbl_Bedrijven/Onderwijsinstellingen\" where \"Latitude\"=".$lat." and \"Longitude\"=".$lon;
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
               $insert="INSERT INTO \"tbl_Bedrijven/Onderwijsinstellingen\" (\"Instelling_naam\", \"Adres_1\", \"Adres_2\", \"Plaats\", \"Landcode\", \"Latitude\", \"Longitude\", \"Studie_mogelijkheid\", \"Postcode\")";
               $insert.="VALUES ('".$instellingNaam."', '".$adres1."', '".$adres2."', '".$plaats."', '".$land."', ".$lat.", ".$lon.", "."'t'".", '".$postcode."')";
               $result=pg_query($insert) or die ('<h2 class="rood">Query mislukt, neem contact op met het Geolab</h2>');
               echo '<h2>Instelling ingevoerd.</h2>';
           }
           else
           {
               echo '<h2 class="rood">Instelling bestaat al.</h2>';
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