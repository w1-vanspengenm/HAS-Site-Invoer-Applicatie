<?php
$url = $_POST["url"];
//$url = 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:huidige%20stages&outputFormat=application%2Fjson';
$res = file_get_contents($url);
echo $res;
?>
