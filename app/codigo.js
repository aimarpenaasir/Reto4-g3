$(document).ready(function () {

    const esMovil = () => window.matchMedia('(max-width: 992px)').matches;

    // Los enlaces "#" no deben saltar al inicio de la página
    $('a[href="#"]').click(function (e) { e.preventDefault(); });

    // La versión 2.0 actualiza periódicamente la instancia que responde.
    const estadoDespliegue = $('#estado-despliegue');
    if (estadoDespliegue.length) {
        let sondeoIniciado = false;
        function consultarEstado() {
            $.ajax({ url: 'estado.php', dataType: 'json', cache: false })
                .done(function (estado) {
                    estadoDespliegue.text(`Versión ${estado.version} · Nodo: ${estado.hostname}`);
                    if (estado.version === '2.0' && !sondeoIniciado) {
                        sondeoIniciado = true;
                        setInterval(consultarEstado, 2000);
                    }
                })
                .fail(function () {
                    estadoDespliegue.text('No se pudo consultar la versión y el nodo que respondieron.');
                });
        }
        consultarEstado();
    }

    // 1. SUBMENÚS: hover en escritorio, clic en móvil
    $('nav > ul > li').hover(
        function () { if (!esMovil()) $(this).children('.submenu').stop(true, true).slideDown(200); },
        function () { if (!esMovil()) $(this).children('.submenu').stop(true, true).slideUp(200); }
    );
    $('nav > ul > li > a').click(function () {
        if (esMovil()) $(this).siblings('.submenu').stop(true, true).slideToggle(200);
    });
    $('#menu-toggle').click(function () { $('#nav-menu').toggleClass('active'); });

    // 2. CONTADOR HACIA ATRÁS (6 diciembre 2026, 14:00)
    if ($('#tiempo-restante').length) {
        const objetivo = new Date(2026, 11, 6, 14, 0, 0).getTime();
        function pintarContador() {
            const dif = objetivo - Date.now();
            if (dif > 0) {
                const d = Math.floor(dif / 86400000);
                const h = Math.floor((dif % 86400000) / 3600000);
                const m = Math.floor((dif % 3600000) / 60000);
                const s = Math.floor((dif % 60000) / 1000);
                $('#tiempo-restante').text(`${d} días, ${h} horas, ${m} minutos, ${s} segundos`);
            } else {
                $('#tiempo-restante').text('¡La carrera ha comenzado!');
            }
        }
        pintarContador();
        setInterval(pintarContador, 1000);
    }

    // 3. FORMULARIO DE ENTRADAS
    // Resaltar el campo al hacer clic en él; se quita al salir
    $('#form-entradas input, #form-entradas select').on('focus', function () {
        $(this).addClass('campo-activo');
    }).on('blur', function () {
        $(this).removeClass('campo-activo');
    });

    // DNI siempre en mayúsculas
    $('#dni').on('input', function () { this.value = this.value.toUpperCase(); });

    // Cálculo de precio
    function calcularPrecio() {
        const tipo = $('#tipo-entrada').val();
        const zona = $('#zona').val();
        let precio = 30;
        if (tipo === 'adulto') precio = (zona === 'zona1') ? 80 : 60;
        return precio;
    }
    $('#btn-calcular').click(function () {
        const p = calcularPrecio();
        $('#precio').val(p + ' €');
        $('#precio-hidden').val(p);
        $('#err-precio').text('');
    });
    // Si cambia tipo o zona, el precio mostrado deja de ser válido
    $('#tipo-entrada, #zona').change(function () {
        $('#precio, #precio-hidden').val('');
    });

    // Aceptar condiciones -> activar botón
    $('#acepto-condiciones').change(function () {
        $('#btn-comprar').prop('disabled', !$(this).is(':checked'));
    });

    // DNI: solo se valida el formato (8 números y 1 letra mayúscula)
    function dniValido(dni) {
        return /^[0-9]{8}[A-Z]$/.test(dni);
    }

    $('#form-entradas').submit(function (e) {
        let valido = true;
        $('.error-msg').text('');
        $('#form-entradas .error').removeClass('error');
        const error = (campo, msg) => { $('#err-' + campo).text(msg); $('#' + campo).addClass('error'); valido = false; };

        if (!dniValido($('#dni').val())) error('dni', 'El DNI debe tener 8 números y una letra mayúscula.');
        if ($('#nombre').val().trim() === '') error('nombre', 'El nombre es obligatorio.');
        if ($('#apellidos').val().trim() === '') error('apellidos', 'Los apellidos son obligatorios.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').val())) error('email', 'Formato de email incorrecto.');

        const edad = parseInt($('#edad').val(), 10);
        const tipo = $('#tipo-entrada').val();
        if (isNaN(edad) || edad < 0) error('edad', 'Introduce una edad válida.');
        else if (tipo === 'infantil' && edad >= 18) error('edad', 'Una entrada infantil exige ser menor de 18 años.');
        else if (tipo === 'adulto' && edad < 18) error('edad', 'Una entrada de adulto exige ser mayor de edad.');

        if ($('#precio-hidden').val() === '') error('precio', 'Pulsa "Calcular precio" antes de comprar.');

        if (!valido) { e.preventDefault(); return; }
        alert('Todos los datos son correctos');
    });

    // 4. ACCESO
    $('#toggle-pwd').click(function () {
        const input = $('#password');
        const oculto = input.attr('type') === 'password';
        input.attr('type', oculto ? 'text' : 'password');
        $(this).text(oculto ? '🙈' : '👁️');
    });

    $('#form-acceso').submit(function (e) {
        const usuario = $('#usuario').val().trim();
        const password = $('#password').val().trim();
        if (usuario === '' || password === '') {
            alert('Los campos no pueden estar vacíos.');
            e.preventDefault();
            return;
        }
        if (usuario === 'alumno' && password === 'sanluis') {
            alert('Todo es correcto. Accediendo...');
        } else {
            alert('Usuario o contraseña incorrectos.');
            e.preventDefault();
        }
    });

    // 5. SORTEO (podio aleatorio distinto en cada pulsación)
    const pilotos = [
        { id: 'verstappen', nombre: 'Max Verstappen' }, { id: 'hamilton', nombre: 'Lewis Hamilton' },
        { id: 'leclerc', nombre: 'Charles Leclerc' },   { id: 'norris', nombre: 'Lando Norris' },
        { id: 'russell', nombre: 'George Russell' },    { id: 'piastri', nombre: 'Oscar Piastri' },
        { id: 'alonso', nombre: 'Fernando Alonso' },    { id: 'sainz', nombre: 'Carlos Sainz' }
    ];
    const premios = { 1: 5000, 2: 3000, 3: 1000 };

    function barajar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    if ($('#btn-sorteo').length) {
        const selects = $('#puesto1, #puesto2, #puesto3');
        selects.append('<option value="">-- Elige --</option>');
        pilotos.forEach(p => selects.append(`<option value="${p.id}">${p.nombre}</option>`));

        // Sin repetir: se deshabilita en los otros desplegables lo ya elegido
        selects.on('change', function () {
            const elegidos = selects.map(function () { return $(this).val(); }).get();
            selects.each(function () {
                const propio = $(this).val();
                $(this).find('option').each(function () {
                    const v = $(this).val();
                    $(this).prop('disabled', v !== '' && v !== propio && elegidos.includes(v));
                });
            });
        });

        $('#btn-sorteo').click(function () {
            const eleccion = [1, 2, 3].map(n => $('#puesto' + n).val());
            if (eleccion.some(v => !v)) {
                alert('Debes seleccionar los tres puestos.');
                return;
            }
            if (new Set(eleccion).size < 3) {
                alert('No puedes repetir pilotos en diferentes puestos.');
                return;
            }

            // Podio aleatorio: 3 pilotos distintos
            const podio = barajar([...pilotos]).slice(0, 3);
            let html = '<h3>Podio sorteado</h3><div class="podio">';
            let lista = '<ul class="res-lista">';
            let aciertos = 0;

            podio.forEach((p, i) => {
                const puesto = i + 1;
                const acierto = eleccion[i] === p.id;
                if (acierto) aciertos++;
                html += `<figure class="${acierto ? 'acierto' : ''}"><img src="img/pilotos/${p.id}.svg" alt="${p.nombre}">` +
                        `<figcaption>${puesto}º · ${p.nombre}</figcaption></figure>`;
                const tuyo = pilotos.find(x => x.id === eleccion[i]).nombre;
                lista += acierto
                    ? `<li>✅ ¡Has acertado el ${puesto}º puesto (${p.nombre})! Premio: ${premios[puesto].toLocaleString('es-ES')} €</li>`
                    : `<li>❌ No has acertado el ${puesto}º puesto (ganó ${p.nombre}, elegiste ${tuyo})</li>`;
            });
            lista += '</ul>';
            html += '</div>' + lista;
            if (aciertos === 0) {
                html += '<p><strong>No has acertado ningún puesto. ¡Otra vez será!</strong></p>';
            } else {
                const total = podio.reduce((s, p, i) => s + (eleccion[i] === p.id ? premios[i + 1] : 0), 0);
                html += `<p><strong>Aciertos: ${aciertos}/3 · Premio total: ${total.toLocaleString('es-ES')} €</strong></p>`;
            }
            $('#resultado-sorteo').hide().html(html).fadeIn(300);
        });
    }

    // 6. CARRUSEL (10 imágenes, orden aleatorio, sin repetir hasta agotarlas)
    if ($('#carrusel-img').length) {
        const imagenes = [
            { src: 'img/bilbao1.jpg', titulo: 'Guggenheim Bilbao' },
            { src: 'img/f1_car1.jpg', titulo: 'Carrera Coches F1' },
            { src: 'img/bilbao2.jpg', titulo: 'Puente Colgante' },
            { src: 'img/f1_car2.jpg', titulo: 'Coche F1 Vodafone' },
            { src: 'img/bilbao3.jpg', titulo: 'San Mamés iluminado' },
            { src: 'img/f1_car3.jpg', titulo: 'Coche F1 Oracle' },
            { src: 'img/bilbao4.jpg', titulo: 'Casco Viejo' },
            { src: 'img/f1_car4.jpg', titulo: 'Coche F1 Aramco' },
            { src: 'img/bilbao5.jpg', titulo: 'Torre Iberdrola' },
            { src: 'img/f1_car5.jpg', titulo: 'Coche F1 Marlboro' }
        ];

        let orden = barajar([...Array(imagenes.length).keys()]);
        let pos = 0;

        function siguiente() {
            if (pos >= orden.length) {
                const ultima = orden[orden.length - 1];
                do { barajar(orden); } while (orden[0] === ultima); // no repetir en el cambio de ronda
                pos = 0;
            }
            const item = imagenes[orden[pos++]];
            $('#carrusel-container').fadeOut(250, function () {
                $('#carrusel-img').attr({ src: item.src, alt: item.titulo });
                $('#carrusel-titulo').text(item.titulo);
                $(this).fadeIn(250);
            });
        }

        siguiente();
        setInterval(siguiente, 3000);
    }
});
