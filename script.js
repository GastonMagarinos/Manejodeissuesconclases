/* ============================================================
   IRONFORGE GYM — script.js
   Lógica completa de la SPA + Base de datos simulada (Mock Data)
   ============================================================ */

"use strict";

/* ──────────────────────────────────────────────────────────────
   1. BASE DE DATOS SIMULADA
   Arreglo principal de 100 usuarios ficticios.
   Cada objeto representa un miembro del gimnasio.
   ────────────────────────────────────────────────────────────── */

const PLANES = ["Premium", "Básico", "Pase Diario"];
const ESTADOS = ["Activo", "Vencido"];

/**
 * Genera un número entero aleatorio entre min y max (inclusive).
 * Se usa internamente para crear la Mock Data.
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Selecciona un elemento aleatorio de un arreglo.
 */
const pick = (arr) => arr[randomInt(0, arr.length - 1)];

/**
 * Genera un correo limpio a partir del nombre y apellido.
 */
const makeEmail = (nombre, apellido) =>
  `${nombre.toLowerCase()}.${apellido.toLowerCase()}@gym.com`
    .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i")
    .replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n")
    .replace(/\s+/g, "");

/* Listas de nombres y apellidos para combinar */
const NOMBRES = [
  "Carlos","Lucía","Pedro","María","Juan","Ana","Diego","Sofía",
  "Andrés","Valentina","Miguel","Laura","Sebastián","Camila","Martín",
  "Isabella","Santiago","Daniela","Tomás","Paula","Felipe","Fernanda",
  "Rodrigo","Natalia","Javier","Gabriela","Nicolás","Verónica","Emilio",
  "Paola","Ignacio","Carolina","Mateo","Juliana","Alejandro","Lorena",
  "Ricardo","Mariana","Pablo","Ximena","Cristian","Valeria","Eduardo",
  "Alejandra","Mauricio","Claudia","Hernán","Patricia","Gustavo","Elena"
];
const APELLIDOS = [
  "García","Martínez","López","González","Rodríguez","Hernández",
  "Pérez","Sánchez","Ramírez","Torres","Flores","Rivera","Díaz",
  "Cruz","Morales","Reyes","Jiménez","Vargas","Castillo","Moreno",
  "Ortega","Silva","Ruiz","Alvarado","Mendoza","Vega","Herrera",
  "Medina","Aguilar","Núñez","Cabrera","Fuentes","Ríos","Guzmán",
  "Castro","Guerrero","Rojas","Muñoz","Escobar","Delgado","Navarro",
  "Sandoval","Ramos","Suárez","Ávila","Serrano","Domínguez","Molina"
];

/**
 * GENERADOR DE USUARIOS FICTICIOS
 * Crea 100 objetos de usuario con datos realistas y variados.
 * Los 3 primeros son "plantados" con datos conocidos para el demo.
 */
function generarUsuariosFicticios() {
  const usuarios = [];

  // ── Usuarios DEMO conocidos (para acceso rápido en la interfaz) ──
  usuarios.push(
    {
      id: 1,
      nombre: "Carlos García",
      email: "carlos.garcia@gym.com",
      password: "Pass1234",
      plan: "Premium",
      estado: "Activo",
      asistencias_al_mes: 28,
      fecha_registro: "2023-01-15"
    },
    {
      id: 2,
      nombre: "Lucía Martínez",
      email: "lucia.martinez@gym.com",
      password: "Pass1234",
      plan: "Básico",
      estado: "Activo",
      asistencias_al_mes: 22,
      fecha_registro: "2023-03-08"
    },
    {
      id: 3,
      nombre: "Pedro López",
      email: "pedro.lopez@gym.com",
      password: "Pass1234",
      plan: "Pase Diario",
      estado: "Vencido",
      asistencias_al_mes: 3,
      fecha_registro: "2024-06-20"
    }
  );

  // ── Usuarios generados automáticamente (IDs 4 al 100) ──
  const usedEmails = new Set(usuarios.map(u => u.email));
  let id = 4;

  while (usuarios.length < 100) {
    const nombre    = pick(NOMBRES);
    const apellido  = pick(APELLIDOS);
    const email     = makeEmail(nombre, apellido);

    // Evitamos correos duplicados
    if (usedEmails.has(email)) continue;
    usedEmails.add(email);

    const plan      = pick(PLANES);
    const estado    = Math.random() < 0.78 ? "Activo" : "Vencido"; // 78% activos

    // Las asistencias varían según el plan: Premium tiende a más asistencias
    let maxAsist = 30;
    let minAsist = 0;
    if (plan === "Premium")     { minAsist = 10; maxAsist = 30; }
    else if (plan === "Básico") { minAsist = 4;  maxAsist = 25; }
    else                        { minAsist = 0;  maxAsist = 8;  } // Pase Diario: pocas

    if (estado === "Vencido") maxAsist = Math.min(maxAsist, 10); // Vencidos asisten menos

    const asistencias = randomInt(minAsist, maxAsist);

    // Año de registro entre 2021 y 2024
    const anio = randomInt(2021, 2024);
    const mes  = String(randomInt(1, 12)).padStart(2, "0");
    const dia  = String(randomInt(1, 28)).padStart(2, "0");

    usuarios.push({
      id,
      nombre: `${nombre} ${apellido}`,
      email,
      password: "Pass1234",       // Contraseña uniforme para demo
      plan,
      estado,
      asistencias_al_mes: asistencias,
      fecha_registro: `${anio}-${mes}-${dia}`
    });

    id++;
  }

  return usuarios;
}

/* ── Base de datos principal en memoria ── */
let DB_USUARIOS = generarUsuariosFicticios();

/* ── Usuario autenticado actualmente (null = no logueado) ── */
let usuarioActual = null;

/* ── Plan que se va a cambiar (para el modal) ── */
let planPendiente = null;


/* ──────────────────────────────────────────────────────────────
   2. FUNCIONES DE DATOS
   ────────────────────────────────────────────────────────────── */

/**
 * Ordena todos los usuarios de MAYOR a MENOR asistencia
 * y retorna el Top N (por defecto 10).
 * Esta función alimenta la sección de Ranking.
 *
 * @param {number} n - Cuántos usuarios retornar
 * @returns {Array} - Arreglo ordenado de los N más constantes
 */
function obtenerTopRanking(n = 10) {
  return [...DB_USUARIOS]
    .sort((a, b) => b.asistencias_al_mes - a.asistencias_al_mes)
    .slice(0, n);
}

/**
 * Obtiene la posición global del usuario actual en el ranking completo.
 * Útil para mostrar "#12 de 100 miembros" en el Dashboard.
 *
 * @param {Object} usuario
 * @returns {number} Posición (1 = el mejor)
 */
function obtenerPosicionRanking(usuario) {
  const ordenados = [...DB_USUARIOS]
    .sort((a, b) => b.asistencias_al_mes - a.asistencias_al_mes);
  return ordenados.findIndex(u => u.id === usuario.id) + 1;
}

/**
 * Busca un usuario por email y contraseña.
 * Simula la autenticación real sin backend.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Object|null} El usuario o null si no se encontró
 */
function autenticarUsuario(email, password) {
  return DB_USUARIOS.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim()
      && u.password === password
  ) || null;
}

/**
 * Verifica si un email ya está registrado en la DB.
 *
 * @param {string} email
 * @returns {boolean}
 */
function emailExiste(email) {
  return DB_USUARIOS.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
}

/**
 * Registra un nuevo usuario en el arreglo DB_USUARIOS.
 * Simula un INSERT en una base de datos real.
 *
 * @param {string} nombre
 * @param {string} email
 * @param {string} password
 * @param {string} plan - "Premium" | "Básico" | "Pase Diario"
 * @returns {Object} El usuario recién creado
 */
function registrarUsuario(nombre, email, password, plan) {
  const nuevoUsuario = {
    id: DB_USUARIOS.length + 1,       // ID autoincremental
    nombre: nombre.trim(),
    email: email.toLowerCase().trim(),
    password,
    plan,
    estado: "Activo",                  // Siempre activo al registrarse
    asistencias_al_mes: 0,             // Empieza de cero
    fecha_registro: new Date().toISOString().split("T")[0]
  };

  DB_USUARIOS.push(nuevoUsuario);      // Se añade en memoria
  return nuevoUsuario;
}

/**
 * Actualiza el plan del usuario actual en la DB en memoria.
 * Simula un UPDATE en SQL: UPDATE usuarios SET plan = ? WHERE id = ?
 *
 * @param {number} userId
 * @param {string} nuevoPlan
 */
function actualizarPlanUsuario(userId, nuevoPlan) {
  const usuario = DB_USUARIOS.find(u => u.id === userId);
  if (usuario) {
    usuario.plan = nuevoPlan;
    usuario.estado = "Activo";          // Reactivar al cambiar de plan
    // Reflejamos el cambio también en usuarioActual
    if (usuarioActual && usuarioActual.id === userId) {
      usuarioActual.plan   = nuevoPlan;
      usuarioActual.estado = "Activo";
    }
  }
}

/**
 * Calcula qué "logros" ha desbloqueado el usuario
 * según sus asistencias. Gamificación simple.
 *
 * @param {Object} usuario
 * @returns {Array} Lista de objetos {emoji, label, unlocked}
 */
function calcularLogros(usuario) {
  const a = usuario.asistencias_al_mes;
  return [
    { emoji: "🥇", label: "Primera visita",   unlocked: a >= 1  },
    { emoji: "🔥", label: "Semana activa",    unlocked: a >= 7  },
    { emoji: "⚡", label: "Quincenal",        unlocked: a >= 15 },
    { emoji: "💪", label: "20 días seguidos", unlocked: a >= 20 },
    { emoji: "🏆", label: "Mes perfecto",     unlocked: a >= 28 },
    { emoji: "👑", label: "Leyenda del Gym",  unlocked: a >= 30 }
  ];
}

/**
 * Simula el historial de los últimos 7 días de forma
 * proporcional a las asistencias del usuario.
 * (Si va 20/30 días, estadísticamente va ~66% de los días)
 *
 * @param {Object} usuario
 * @returns {Array} 7 objetos {dia, asistio}
 */
function simularHistorial(usuario) {
  const dias = ["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"];
  const probabilidad = usuario.asistencias_al_mes / 30;
  return dias.map(d => ({
    dia: d,
    asistio: Math.random() < probabilidad
  }));
}


/* ──────────────────────────────────────────────────────────────
   3. FUNCIONES DE RENDERIZADO (DOM)
   ────────────────────────────────────────────────────────────── */

/**
 * Renderiza el Dashboard personalizado para el usuario logueado.
 * Muestra plan, asistencias, posición en ranking y logros.
 */
function renderizarDashboard() {
  if (!usuarioActual) return;

  const u = usuarioActual;

  // ── Bienvenida personalizada ──
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
  document.getElementById("dash-welcome").textContent =
    `${saludo}, ${u.nombre.split(" ")[0]}! Aquí está tu resumen.`;

  // ── Topbar username ──
  document.getElementById("topbar-username").textContent = u.nombre.split(" ")[0];

  // ── Tarjeta de Plan ──
  const badge       = document.getElementById("dash-plan-badge");
  const planNombre  = document.getElementById("dash-plan-nombre");
  const planEstado  = document.getElementById("dash-plan-estado");
  const estadoDot   = planEstado.querySelector(".estado-dot");
  const estadoText  = planEstado.querySelector(".estado-text");

  planNombre.textContent = u.plan;

  // Asignamos clase de color al badge según el plan
  badge.textContent = u.plan;
  badge.className   = "card__badge";
  if (u.plan === "Básico")      badge.classList.add("badge--basico");
  if (u.plan === "Pase Diario") badge.classList.add("badge--pase");

  // Estado activo o vencido
  if (u.estado === "Activo") {
    estadoDot.classList.remove("vencido");
    estadoText.classList.remove("vencido");
    estadoText.textContent = "Plan Activo";
  } else {
    estadoDot.classList.add("vencido");
    estadoText.classList.add("vencido");
    estadoText.textContent = "Plan Vencido — Renueva ahora";
  }

  // ── Tarjeta Asistencias ──
  const porcentaje = Math.round((u.asistencias_al_mes / 30) * 100);
  document.getElementById("dash-asistencias").textContent = u.asistencias_al_mes;
  document.getElementById("dash-progress").style.width    = `${porcentaje}%`;

  // Mensaje motivacional según el porcentaje
  let motivacion = "";
  if (porcentaje === 0)     motivacion = "¡Empieza hoy! El primer paso es el más difícil.";
  else if (porcentaje < 30) motivacion = `${porcentaje}% del mes — ¡Sigue construyendo el hábito!`;
  else if (porcentaje < 60) motivacion = `${porcentaje}% del mes — ¡Vas muy bien, no te detengas!`;
  else if (porcentaje < 90) motivacion = `${porcentaje}% del mes — ¡Eres una máquina! 🔥`;
  else                      motivacion = `${porcentaje}% del mes — ¡MES PERFECTO! 🏆`;
  document.getElementById("dash-progress-label").textContent = motivacion;

  // ── Tarjeta Posición en Ranking ──
  const posicion   = obtenerPosicionRanking(u);
  const totalUsers = DB_USUARIOS.length;
  document.getElementById("dash-rank-pos").textContent   = `#${posicion}`;
  document.getElementById("dash-rank-total").textContent = `de ${totalUsers} miembros`;

  // Emoji según posición
  const emojiRank = posicion === 1 ? "🥇" : posicion === 2 ? "🥈" : posicion === 3 ? "🥉"
    : posicion <= 10 ? "🏆" : posicion <= 30 ? "🔥" : "💪";
  document.getElementById("dash-rank-emoji").textContent = emojiRank;

  // ── Tarjeta Logros ──
  const logros   = calcularLogros(u);
  const logrosCt = document.getElementById("dash-logros");
  logrosCt.innerHTML = logros.map(l => `
    <div class="logro-badge ${l.unlocked ? "" : "locked"}"
         title="${l.unlocked ? "¡Logro desbloqueado!" : "Aún no desbloqueado"}">
      <span>${l.emoji}</span>
      <span>${l.label}</span>
    </div>
  `).join("");

  // ── Historial últimos 7 días ──
  const historial   = simularHistorial(u);
  const historialCt = document.getElementById("dash-historial");
  historialCt.innerHTML = historial.map(d => `
    <div class="historial-day ${d.asistio ? "asistio" : ""}">
      <span class="historial-day__label">${d.dia}</span>
      <span class="historial-day__icon">${d.asistio ? "✅" : "⬜"}</span>
    </div>
  `).join("");
}

/**
 * Renderiza el ranking completo:
 * - Podio visual (Top 3)
 * - Tabla del Top 10
 *
 * Marca al usuario actual en la tabla si aparece.
 */
function renderizarRanking() {
  const top10 = obtenerTopRanking(10);

  // ── PODIO (Top 3) ──
  // El orden en pantalla es: 2°, 1°, 3° (estilo olímpico clásico)
  const ordenPodio = [top10[1], top10[0], top10[2]]; // 2°, 1°, 3°
  const podioHTML  = ordenPodio.map((u, i) => {
    if (!u) return ""; // seguridad si hay menos de 3 usuarios
    const alturas  = [60, 90, 40];  // base del podio
    const posicion = [2, 1, 3][i];  // posición real
    const inicial  = u.nombre.split(" ").map(p => p[0]).join("").substring(0, 2).toUpperCase();

    return `
      <div class="podio-item">
        <div class="podio-avatar">${inicial}</div>
        <div class="podio-name">${u.nombre.split(" ")[0]}</div>
        <div class="podio-score">${u.asistencias_al_mes}</div>
        <div class="podio-base" style="height:${alturas[i]}px">${posicion}°</div>
      </div>
    `;
  }).join("");

  document.getElementById("podio-container").innerHTML = podioHTML;

  // ── TABLA Top 10 ──
  const medallas = ["🥇","🥈","🥉"];
  const filas    = top10.map((u, i) => {
    const pos       = i + 1;
    const esMiembro = usuarioActual && u.id === usuarioActual.id;
    const rowClass  = esMiembro ? "rank-me"
      : pos === 1 ? "rank-gold"
      : pos === 2 ? "rank-silver"
      : pos === 3 ? "rank-bronze" : "";

    // Pill de plan
    const planKey   = u.plan === "Premium" ? "premium"
      : u.plan === "Básico" ? "basico" : "pase";
    const planPill  = `<span class="plan-pill plan-pill--${planKey}">${u.plan}</span>`;

    // Mini barra de asistencias
    const pct       = Math.round((u.asistencias_al_mes / 30) * 100);
    const miniBarra = `
      <div class="mini-bar">
        <div class="mini-bar__fill" style="width:${pct}%"></div>
      </div>
    `;

    // Indicador de posición con medalla o número
    const posDisplay = pos <= 3
      ? `<span class="medal">${medallas[pos - 1]}</span>`
      : `<strong>${pos}</strong>`;

    return `
      <tr class="${rowClass}">
        <td class="td-pos">${posDisplay}</td>
        <td class="td-nombre">
          ${u.nombre}
          ${esMiembro ? '<small>← Tú</small>' : ''}
        </td>
        <td>${planPill}</td>
        <td class="td-asist">${u.asistencias_al_mes}</td>
        <td>${miniBarra}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("ranking-tbody").innerHTML = filas;
}

/**
 * Marca visualmente el plan actual del usuario en la sección Planes.
 * Agrega la clase "plan-actual" a la tarjeta correspondiente.
 */
function marcarPlanActual() {
  document.querySelectorAll(".plan-card").forEach(card => {
    card.classList.remove("plan-actual");
    if (usuarioActual && card.dataset.plan === usuarioActual.plan) {
      card.classList.add("plan-actual");
    }
  });
}

/**
 * Actualiza el contador de miembros en la pantalla de Login.
 */
function actualizarContadorMiembros() {
  const el = document.getElementById("brand-total-members");
  if (el) el.textContent = DB_USUARIOS.length;
}


/* ──────────────────────────────────────────────────────────────
   4. NAVEGACIÓN ENTRE SECCIONES (SPA)
   ────────────────────────────────────────────────────────────── */

/**
 * Muestra la pantalla indicada y oculta el resto.
 * Las "pantallas" son los bloques principales: auth y app.
 *
 * @param {"auth"|"app"} id
 */
function mostrarPantalla(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const pantalla = document.getElementById(`screen-${id}`);
  if (pantalla) pantalla.classList.add("active");
}

/**
 * Muestra la sección interna de la app (dashboard, planes, ranking)
 * y actualiza los botones de navegación activos.
 *
 * @param {string} seccion - "dashboard" | "planes" | "ranking"
 */
function mostrarSeccion(seccion) {
  // Ocultar todas las secciones
  document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));

  // Mostrar la solicitada
  const target = document.getElementById(`section-${seccion}`);
  if (target) target.classList.add("active");

  // Actualizar botones de nav
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.section === seccion);
  });

  // Re-renderizar contenido dinámico según la sección
  if (seccion === "dashboard") renderizarDashboard();
  if (seccion === "ranking")   renderizarRanking();
  if (seccion === "planes")    marcarPlanActual();
}


/* ──────────────────────────────────────────────────────────────
   5. LÓGICA DE AUTENTICACIÓN
   ────────────────────────────────────────────────────────────── */

/**
 * Maneja el inicio de sesión.
 * Valida campos, busca al usuario en DB_USUARIOS y
 * en caso de éxito carga la app personalizada.
 */
function handleLogin() {
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  // Validaciones básicas de cliente
  if (!email || !password) {
    mostrarMensajeAuth("Completa todos los campos.", "error");
    return;
  }

  // Buscar usuario en la base de datos simulada
  const usuario = autenticarUsuario(email, password);

  if (!usuario) {
    mostrarMensajeAuth(
      "Credenciales incorrectas. Verifica tu correo y contraseña.",
      "error"
    );
    return;
  }

  // ✅ Login exitoso
  usuarioActual = usuario;
  mostrarPantalla("app");
  mostrarSeccion("dashboard");
  mostrarMensajeAuth("", ""); // Limpiar mensajes
  limpiarFormularios();
  mostrarToast(`¡Bienvenido de vuelta, ${usuario.nombre.split(" ")[0]}! 💪`, "success");
}

/**
 * Maneja el registro de un nuevo usuario.
 * Valida los datos y lo agrega a DB_USUARIOS.
 */
function handleRegistro() {
  const nombre   = document.getElementById("reg-nombre").value.trim();
  const email    = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const plan     = document.getElementById("reg-plan").value;

  // ── Validaciones ──
  if (!nombre || !email || !password) {
    mostrarMensajeAuth("Todos los campos son obligatorios.", "error");
    return;
  }
  if (nombre.length < 3) {
    mostrarMensajeAuth("El nombre debe tener al menos 3 caracteres.", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarMensajeAuth("Ingresa un correo electrónico válido.", "error");
    return;
  }
  if (password.length < 6) {
    mostrarMensajeAuth("La contraseña debe tener al menos 6 caracteres.", "error");
    return;
  }
  if (emailExiste(email)) {
    mostrarMensajeAuth(
      "Este correo ya está registrado. Intenta iniciar sesión.",
      "error"
    );
    return;
  }

  // ✅ Registrar nuevo usuario en memoria
  const nuevoUsuario = registrarUsuario(nombre, email, password, plan);
  actualizarContadorMiembros();

  // Auto-login después del registro
  usuarioActual = nuevoUsuario;
  mostrarPantalla("app");
  mostrarSeccion("dashboard");
  limpiarFormularios();
  mostrarToast(`¡Cuenta creada! Bienvenido a IRONFORGE, ${nombre.split(" ")[0]}! ⚡`, "success");
}

/**
 * Cierra la sesión del usuario actual.
 * Resetea el estado y vuelve a la pantalla de login.
 */
function handleLogout() {
  usuarioActual = null;
  mostrarPantalla("auth");
  mostrarToast("Sesión cerrada. ¡Hasta pronto! 👋", "");
}


/* ──────────────────────────────────────────────────────────────
   6. LÓGICA DE CAMBIO DE PLAN
   ────────────────────────────────────────────────────────────── */

/**
 * Abre el modal de confirmación cuando el usuario selecciona un plan.
 *
 * @param {string} plan - El plan que quiere adquirir
 */
function mostrarModalPlan(plan) {
  if (!usuarioActual) return;

  if (plan === usuarioActual.plan) {
    mostrarToast("¡Ya tienes este plan activo!", "success");
    return;
  }

  planPendiente = plan;

  const precios = { "Premium": "$59/mes", "Básico": "$29/mes", "Pase Diario": "$5/día" };
  document.getElementById("modal-body-text").innerHTML = `
    Estás a punto de cambiar tu plan de <strong>${usuarioActual.plan}</strong>
    a <strong>${plan}</strong> (${precios[plan]}).<br><br>
    ¿Deseas confirmar el cambio?
  `;

  document.getElementById("plan-modal").classList.remove("hidden");
}

/**
 * Confirma el cambio de plan desde el modal.
 */
function confirmarCambioPlan() {
  if (!usuarioActual || !planPendiente) return;

  actualizarPlanUsuario(usuarioActual.id, planPendiente);
  cerrarModal();
  marcarPlanActual();

  mostrarToast(`Plan actualizado a ${planPendiente} ✅`, "success");
  planPendiente = null;
}

/**
 * Cierra el modal sin realizar cambios.
 */
function cerrarModal() {
  document.getElementById("plan-modal").classList.add("hidden");
  planPendiente = null;
}


/* ──────────────────────────────────────────────────────────────
   7. UTILIDADES DE UI
   ────────────────────────────────────────────────────────────── */

/**
 * Muestra un mensaje de error o éxito en la pantalla de Auth.
 *
 * @param {string} texto  - Mensaje a mostrar
 * @param {"error"|"success"|""} tipo
 */
function mostrarMensajeAuth(texto, tipo) {
  const el = document.getElementById("auth-message");
  if (!texto) {
    el.classList.add("hidden");
    return;
  }
  el.textContent = texto;
  el.className   = `auth-message ${tipo}`;
  el.classList.remove("hidden");
}

/**
 * Muestra una notificación tipo "toast" temporal en la parte inferior.
 *
 * @param {string} mensaje
 * @param {"success"|"error"|""} tipo
 */
function mostrarToast(mensaje, tipo = "") {
  const toast = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = mensaje;
  toast.className = `toast ${tipo ? "toast--" + tipo : ""} show`;

  // Se oculta solo después de 3 segundos
  setTimeout(() => { toast.classList.remove("show"); }, 3000);
}

/**
 * Limpia todos los formularios de la pantalla auth.
 */
function limpiarFormularios() {
  ["login-email","login-password","reg-nombre","reg-email","reg-password"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("reg-plan").selectedIndex = 0;
}

/**
 * Alterna visibilidad del campo de contraseña (mostrar/ocultar).
 *
 * @param {string} targetId - ID del input de contraseña
 */
function togglePassword(targetId) {
  const input = document.getElementById(targetId);
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
}

/**
 * Cambia entre el tab de Login y el de Registro.
 *
 * @param {"login"|"register"} tab
 */
function cambiarTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.tab === tab);
  });
  document.querySelectorAll(".tab-content").forEach(c => {
    c.classList.toggle("active", c.id === `tab-${tab}`);
  });
  mostrarMensajeAuth("", ""); // Limpiar mensajes al cambiar tab
}


/* ──────────────────────────────────────────────────────────────
   8. EVENT LISTENERS (Inicialización de la app)
   ────────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {

  // ── Inicializar datos de display en la pantalla auth ──
  actualizarContadorMiembros();

  // ── TABS: Login / Registro ──
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => cambiarTab(tab.dataset.tab));
  });

  // ── Botón LOGIN ──
  document.getElementById("btn-login").addEventListener("click", handleLogin);

  // También permite Login con Enter
  document.getElementById("login-password").addEventListener("keydown", e => {
    if (e.key === "Enter") handleLogin();
  });
  document.getElementById("login-email").addEventListener("keydown", e => {
    if (e.key === "Enter") handleLogin();
  });

  // ── Botón REGISTRO ──
  document.getElementById("btn-register").addEventListener("click", handleRegistro);

  // ── Botones DEMO (auto-rellena el formulario de login) ──
  document.querySelectorAll(".demo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("login-email").value    = btn.dataset.email;
      document.getElementById("login-password").value = btn.dataset.pass;
      // Pequeño delay visual antes de loguear
      setTimeout(handleLogin, 150);
    });
  });

  // ── Toggle contraseña (mostrar/ocultar) ──
  document.querySelectorAll(".toggle-pass").forEach(btn => {
    btn.addEventListener("click", () => togglePassword(btn.dataset.target));
  });

  // ── LOGOUT ──
  document.getElementById("btn-logout").addEventListener("click", handleLogout);

  // ── NAV BUTTONS (topbar) ──
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => mostrarSeccion(btn.dataset.section));
  });

  // ── Botón "Ver Ranking Completo" en el dashboard ──
  document.getElementById("btn-ver-ranking").addEventListener("click", () => {
    mostrarSeccion("ranking");
  });

  // ── BOTONES DE SELECCIÓN DE PLAN ──
  document.querySelectorAll(".plan-btn").forEach(btn => {
    btn.addEventListener("click", () => mostrarModalPlan(btn.dataset.plan));
  });

  // ── MODAL: Cancelar ──
  document.getElementById("modal-cancel").addEventListener("click", cerrarModal);

  // ── MODAL: Confirmar ──
  document.getElementById("modal-confirm").addEventListener("click", confirmarCambioPlan);

  // ── MODAL: Cerrar al hacer clic en el backdrop ──
  document.querySelector(".modal__backdrop").addEventListener("click", cerrarModal);

  // ── Tecla ESC cierra el modal ──
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarModal();
  });

  // ── Log en consola para desarrollo (verifica los 100 usuarios) ──
  console.log(
    `%c⚡ IRONFORGE GYM — Base de datos inicializada`,
    "color:#f04e1a; font-weight:bold; font-size:14px;"
  );
  console.log(`%c${DB_USUARIOS.length} usuarios en memoria`, "color:#8888a0");
  console.log("%cTop 3 más constantes:", "color:#e8b84b");
  console.table(obtenerTopRanking(3).map(u => ({
    Nombre: u.nombre,
    Plan: u.plan,
    Asistencias: u.asistencias_al_mes
  })));
});
