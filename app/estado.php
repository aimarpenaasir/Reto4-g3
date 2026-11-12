<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$version = getenv('APP_VERSION');
$hostname = gethostname();

if ($version === false || $version === '' || $hostname === false) {
    http_response_code(500);
    error_log('No se pudo obtener la versión o el hostname de la instancia.');
    echo json_encode(['error' => 'No se pudo identificar la instancia.']);
    exit;
}

echo json_encode([
    'version' => $version,
    'hostname' => $hostname,
], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
