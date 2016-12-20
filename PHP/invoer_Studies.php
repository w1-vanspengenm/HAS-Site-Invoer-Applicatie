<?php
$insellingID=$_POST['S_instelling'];
$opleiding=$_POST['S_opleiding'];
$voornaam=$_POST['S_voornaam'];
$tussenvoegsel=$_POST['S_tussenv'];
$achternaam=$_POST['S_achternaam'];
$stud_nr=$_POST['S_stud_nr'];
$startDatum=$_POST['S_startDatum'];
$eindDatum=$_POST['S_eindDatum'];
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Invoer studies</title>
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
           $select="select * from \"tbl_Studenten\" where \"Student_nr\"='".$stud_nr."'";
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
               $insert="INSERT INTO \"tbl_Studenten\"VALUES('".$voornaam."', '".$achternaam."', '".$opleiding."', '".$stud_nr."', '".$tussenvoegsel."')";
               $result = pg_query($insert) or die('<h2 class="rood">Query mislukt, neem contact op met het Geolab</h2>');
               echo '<h2>Student ingevoerd.</h2>';
           }
           $select="select * from \"tbl_Studies\"where \"Student_nr\"='".$stud_nr."' and \"Start_datum\"='".$startDatum."' and \"Eind_datum\"='".$eindDatum."'";
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
               $insert="INSERT INTO \"tbl_Studies\"VALUES('".$startDatum."', '".$eindDatum."', ".$insellingID.", '".$stud_nr."')";
               $result = pg_query($insert) or die('<h2 class="rood">Query mislukt, neem contact op met het Geolab</h2>');
               echo "<h2>Studie ingevoerd.</h2>";
               $update="UPDATE \"tbl_Bedrijven/Onderwijsinstellingen\" set \"Studie_mogelijkheid\"='t' where \"Instelling_ID\"=".$insellingID;
               $result = pg_query($update) or die('<h2 class="rood">Query mislukt, neem contact op met het Geolab</h2>');
           }
           else
           {
               echo '<h2 class="rood">Studie bestaat al.</h2>';
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