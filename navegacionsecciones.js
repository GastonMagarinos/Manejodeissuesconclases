/* ──────────────────────────────────────────────────────────────
   4. NAVEGACIÓN ENTRE SECCIONES (SPA)
   ────────────────────────────────────────────────────────────── */

class NavegacionSecciones {
  /**
   * @param {FuncionesDeRenderizado} renderizado
   */
  constructor(renderizado) {
    this.renderizado = renderizado;
  }

  /**
   * Muestra la pantalla indicada y oculta el resto.
   * @param {"auth"|"app"} id
   */
  mostrarPantalla(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const pantalla = document.getElementById(`screen-${id}`);
    if (pantalla) pantalla.classList.add("active");
  }

  /**
   * Muestra la sección interna de la app y actualiza la navegación activa.
   * @param {"dashboard"|"planes"|"ranking"} seccion
   */
  mostrarSeccion(seccion) {
    document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(`section-${seccion}`);
    if (target) target.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.section === seccion);
    });

    if (seccion === "dashboard") this.renderizado.renderizarDashboard();
    if (seccion === "ranking")   this.renderizado.renderizarRanking();
    if (seccion === "planes")    this.renderizado.marcarPlanActual();
  }
}
