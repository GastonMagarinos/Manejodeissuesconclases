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