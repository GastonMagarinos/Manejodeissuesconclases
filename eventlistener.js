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
