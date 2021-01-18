<?php
$dictionary = [
    "mysql_host" => "DB_HOST",
    "mysql_db" => "MYSQL_DATABASE",
    "mysql_username" => "MYSQL_USER",
    "mysql_password" => "MYSQL_PASSWORD",
];
echo "Automaticly generate site.ini file for CI...\n";
echo "Will pick values from this variables:\n";

$var = [];
foreach($dictionary as $ini=>$envi) {
    $var[$ini] = $_ENV[$envi];
    echo " ~~ $envi => $ini = " . $var[$ini] . "\n";
}

$siteini = file_get_contents(__DIR__ . "/../config/site.example.ini");
$siteini = preg_replace([
    "/(host=.*;)/mU",
    "/(dbname=.*;)/mU",
    "/username=(.*\n)/mU",
    "/password=(.*\n)/mU"
],[
    "host=" . $var['mysql_host'] . ";",
    "dbname=" . $var['mysql_db'] . ";",
    "username=" . $var['mysql_username'] . "\n",
    "password=" . $var['mysql_password'] . "\n",

], $siteini);
file_put_contents(__DIR__ . "/../config/site.ini", $siteini);