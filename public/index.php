<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    $sysRoot = $_SERVER['SystemRoot'] ?? $_ENV['SystemRoot'] ?? 'C:\\Windows';
    $_ENV['SystemRoot'] = $sysRoot;
    $_SERVER['SystemRoot'] = $sysRoot;
    putenv("SystemRoot=$sysRoot");

    $windir = $_SERVER['windir'] ?? $_ENV['windir'] ?? 'C:\\Windows';
    $_ENV['windir'] = $windir;
    $_SERVER['windir'] = $windir;
    putenv("windir=$windir");
}

// Disable execution time limit for PHP built-in web server on Windows
if (php_sapi_name() === 'cli-server') {
    ini_set('max_execution_time', 0);
    set_time_limit(0);
}


// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
