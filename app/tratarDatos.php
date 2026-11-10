<?php header('Content-Type: text/html; charset=UTF-8'); ?>
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Datos recibidos</title><link rel="stylesheet" href="estilos.css"></head>
<body><div class="main-container centrado"><main class="estrecho"><h2>Datos recibidos</h2><ul>
<?php foreach ($_POST as $k => $v) { if ($k === 'password') continue; echo '<li>' . htmlspecialchars($k) . ': ' . htmlspecialchars($v) . '</li>'; } ?>
</ul><p><a href="index.html" style="color:#ff1801">Volver al inicio</a></p></main></div></body></html>