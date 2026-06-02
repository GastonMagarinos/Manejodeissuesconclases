/* ──────────────────────────────────────────────────────────────
   6. LÓGICA DE CAMBIO DE PLAN
   ────────────────────────────────────────────────────────────── */

class CambioDePlan {
  /**
   * @param {BaseDeDatos}           db
   * @param {FuncionesDeDatos}      datos
   * @param {FuncionesDeRenderizado} renderizado
   * @param {Utilidades}            util
   */
  constructor(db, datos, renderizado, util) {
    this.db         = db;
    this.datos      = datos;
    this.renderizado = renderizado;
    this.util       = util;
  }

  /**
   * Abre el modal de confirmación cuando el usuario selecciona un plan.
   * @param {string} plan
   */
  mostrarModalPlan(plan) {
    if (!this.db.usuarioActual) return;

    if (plan === this.db.usuarioActual.plan) {
      this.util.mostrarToast("¡Ya tienes este plan activo!", "success");
      return;
    }

    this.db.planPendiente = plan;

    const precios = { "Premium":"$59/mes", "Básico":"$29/mes", "Pase Diario":"$5/día" };
    document.getElementById("modal-body-text").innerHTML = `
      Estás a punto de cambiar tu plan de <strong>${this.db.usuarioActual.plan}</strong>
      a <strong>${plan}</strong> (${precios[plan]}).<br><br>
      ¿Deseas confirmar el cambio?
    `;
    document.getElementById("plan-modal").classList.remove("hidden");
  }

  /**
   * Confirma el cambio de plan desde el modal.
   */
  confirmarCambioPlan() {
    if (!this.db.usuarioActual || !this.db.planPendiente) return;

    this.datos.actualizarPlanUsuario(this.db.usuarioActual.id, this.db.planPendiente);
    this.cerrarModal();
    this.renderizado.marcarPlanActual();
    this.util.mostrarToast(`Plan actualizado a ${this.db.planPendiente} ✅`, "success");
    this.db.planPendiente = null;
  }

  /**
   * Cierra el modal sin realizar cambios.
   */
  cerrarModal() {
    document.getElementById("plan-modal").classList.add("hidden");
    this.db.planPendiente = null;
  }
}
