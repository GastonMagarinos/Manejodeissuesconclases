/* ──────────────────────────────────────────────────────────────
   8. EVENT LISTENERS (Inicialización de la app)
   ────────────────────────────────────────────────────────────── */

/**
 * Conecta todos los listeners del DOM con las instancias ya creadas
 * en script.js (db, datos, util, nav, auth, cambioPlan, renderizado).
 */
export function initEventListeners({ db, datos, util, nav, auth, cambioPlan, renderizado }) {

  document.addEventListener("DOMContentLoaded", () => {

    renderizado.actualizarContadorMiembros();

    document.querySelectorAll(".auth-tab").forEach(tab => {
      tab.addEventListener("click", () => util.cambiarTab(tab.dataset.tab));
    });

    document.getElementById("btn-login").addEventListener("click", () => auth.handleLogin());

    document.getElementById("login-password").addEventListener("keydown", e => {
      if (e.key === "Enter") auth.handleLogin();
    });
    document.getElementById("login-email").addEventListener("keydown", e => {
      if (e.key === "Enter") auth.handleLogin();
    });

    document.getElementById("btn-register").addEventListener("click", () => auth.handleRegistro());

    document.querySelectorAll(".demo-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("login-email").value    = btn.dataset.email;
        document.getElementById("login-password").value = btn.dataset.pass;
        setTimeout(() => auth.handleLogin(), 150);
      });
    });

    document.querySelectorAll(".toggle-pass").forEach(btn => {
      btn.addEventListener("click", () => util.togglePassword(btn.dataset.target));
    });

    document.getElementById("btn-logout").addEventListener("click", () => auth.handleLogout());

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => nav.mostrarSeccion(btn.dataset.section));
    });

    document.getElementById("btn-ver-ranking").addEventListener("click", () => {
      nav.mostrarSeccion("ranking");
    });

    document.querySelectorAll(".plan-btn").forEach(btn => {
      btn.addEventListener("click", () => cambioPlan.mostrarModalPlan(btn.dataset.plan));
    });

    document.getElementById("modal-cancel").addEventListener("click", () => cambioPlan.cerrarModal());
    document.getElementById("modal-confirm").addEventListener("click", () => cambioPlan.confirmarCambioPlan());
    document.querySelector(".modal__backdrop").addEventListener("click", () => cambioPlan.cerrarModal());

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") cambioPlan.cerrarModal();
    });

    console.log(
      `%c⚡ IRONFORGE GYM — Base de datos inicializada`,
      "color:#f04e1a; font-weight:bold; font-size:14px;"
    );
    console.log(`%c${db.DB_USUARIOS.length} usuarios en memoria`, "color:#8888a0");
    console.log("%cTop 3 más constantes:", "color:#e8b84b");
    console.table(datos.obtenerTopRanking(3).map(u => ({
      Nombre: u.nombre,
      Plan: u.plan,
      Asistencias: u.asistencias_al_mes
    })));
  });
}