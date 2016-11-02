<?php
$insellingID=$_POST['S_Instelling'];
$voornaam=$_POST['S_voornaam'];
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
           $con = pg_connect("host=localhost dbname=HAS user=postgres password=postgres")
           or die('<h2 class="rood">Kan niet verbinden met database, neem contact op met het Geolab</h2>');
           $select="select * from \"tbl_Studenten\" where \"Student_nr\"=".$stud_nr;
           $result=pg_query($select);
           $numRows=pg_num_rows($result);
           if($numRows==0)
           {
               
           }
        ?>
        <input type="button" value="Ga terug naar home" onclick="window.location.href = '../index.html'; ">
    </body>
</html>