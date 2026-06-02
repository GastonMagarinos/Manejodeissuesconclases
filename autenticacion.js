/* ──────────────────────────────────────────────────────────────
   5. LÓGICA DE AUTENTICACIÓN
   ────────────────────────────────────────────────────────────── */

class Autenticacion {
  /**
   * @param {BaseDeDatos}        db
   * @param {FuncionesDeDatos}   datos
   * @param {NavegacionSecciones} nav
   * @param {Utilidades}         util
   */
  constructor(db, datos, nav, util) {
    this.db   = db;
    this.datos = datos;
    this.nav  = nav;
    this.util = util;
  }

  /**
   * Maneja el inicio de sesión.
   * Valida campos, busca el usuario y carga la app.
   */
  handleLogin() {
    const email    = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      this.util.mostrarMensajeAuth("Completa todos los campos.", "error");
      return;
    }

    const usuario = this.datos.autenticarUsuario(email, password);

    if (!usuario) {
      this.util.mostrarMensajeAuth(
        "Credenciales incorrectas. Verifica tu correo y contraseña.", "error"
      );
      return;
    }

    this.db.usuarioActual = usuario;
    this.nav.mostrarPantalla("app");
    this.nav.mostrarSeccion("dashboard");
    this.util.mostrarMensajeAuth("", "");
    this.util.limpiarFormularios();
    this.util.mostrarToast(`¡Bienvenido de vuelta, ${usuario.nombre.split(" ")[0]}! 💪`, "success");
  }

  /**
   * Maneja el registro de un nuevo usuario.
   */
  handleRegistro() {
    const nombre   = document.getElementById("reg-nombre").value.trim();
    const email    = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const plan     = document.getElementById("reg-plan").value;

    if (!nombre || !email || !password) {
      this.util.mostrarMensajeAuth("Todos los campos son obligatorios.", "error");
      return;
    }
    if (nombre.length < 3) {
      this.util.mostrarMensajeAuth("El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.util.mostrarMensajeAuth("Ingresa un correo electrónico válido.", "error");
      return;
    }
    if (password.length < 6) {
      this.util.mostrarMensajeAuth("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }
    if (this.datos.emailExiste(email)) {
      this.util.mostrarMensajeAuth(
        "Este correo ya está registrado. Intenta iniciar sesión.", "error"
      );
      return;
    }

    const nuevoUsuario = this.datos.registrarUsuario(nombre, email, password, plan);
    this.renderizado && this.renderizado.actualizarContadorMiembros();

    this.db.usuarioActual = nuevoUsuario;
    this.nav.mostrarPantalla("app");
    this.nav.mostrarSeccion("dashboard");
    this.util.limpiarFormularios();
    this.util.mostrarToast(`¡Cuenta creada! Bienvenido a IRONFORGE, ${nombre.split(" ")[0]}! ⚡`, "success");
  }

  /**
   * Cierra la sesión y vuelve a la pantalla de login.
   */
  handleLogout() {
    this.db.usuarioActual = null;
    this.nav.mostrarPantalla("auth");
    this.util.mostrarToast("Sesión cerrada. ¡Hasta pronto! 👋", "");
  }

  /**
   * Permite inyectar la referencia a renderizado post-construcción
   * (para evitar dependencia circular).
   */
  setRenderizado(renderizado) {
    this.renderizado = renderizado;
  }
}
