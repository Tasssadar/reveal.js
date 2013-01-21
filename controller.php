<?php 
if(is_numeric($_GET["indexv"]) && is_numeric($_GET["indexh"]) && is_numeric($_GET["indexf"]))
{
    $f = fopen("data/data.txt", "w");
    if(!$f)
        return;
    fwrite($f, $_GET["indexh"]." ".$_GET["indexv"]." ".$_GET["indexf"]);
    fclose($f);
}
else if($_GET["get"] == "1")
{
    $f = fopen("data/data.txt", "r");
    if(!$f)
        return;
    echo fread($f, 100);
    fclose($f);
}
?>
