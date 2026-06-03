/* ──────────────────────────────────────────────────────────────
   3. FUNCIONES DE RENDERIZADO (DOM)
   ────────────────────────────────────────────────────────────── */

class FuncionesDeRenderizado {
  /**
   * @param {BaseDeDatos}    db
   * @param {FuncionesDeDatos} datos
   */
  constructor(db, datos) {
    this.db    = db;
    this.datos = datos;
  }

  /**
   * Renderiza el Dashboard personalizado para el usuario logueado.
   */
  renderizarDashboard() {
    if (!this.db.usuarioActual) return;
    const u = this.db.usuarioActual;

    // Bienvenida personalizada
    const hora    = new Date().getHours();
    const saludo  = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";
    document.getElementById("dash-welcome").textContent =
      `${saludo}, ${u.nombre.split(" ")[0]}! Aquí está tu resumen.`;

    document.getElementById("topbar-username").textContent = u.nombre.split(" ")[0];

    // Tarjeta de Plan
    const badge      = document.getElementById("dash-plan-badge");
    const planNombre = document.getElementById("dash-plan-nombre");
    const planEstado = document.getElementById("dash-plan-estado");
    const estadoDot  = planEstado.querySelector(".estado-dot");
    const estadoText = planEstado.querySelector(".estado-text");

    planNombre.textContent = u.plan;
    badge.textContent      = u.plan;
    badge.className        = "card__badge";
    if (u.plan === "Básico")      badge.classList.add("badge--basico");
    if (u.plan === "Pase Diario") badge.classList.add("badge--pase");

    if (u.estado === "Activo") {
      estadoDot.classList.remove("vencido");
      estadoText.classList.remove("vencido");
      estadoText.textContent = "Plan Activo";
    } else {
      estadoDot.classList.add("vencido");
      estadoText.classList.add("vencido");
      estadoText.textContent = "Plan Vencido — Renueva ahora";
    }

    // Tarjeta Asistencias
    const porcentaje = Math.round((u.asistencias_al_mes / 30) * 100);
    document.getElementById("dash-asistencias").textContent = u.asistencias_al_mes;
    document.getElementById("dash-progress").style.width    = `${porcentaje}%`;

    let motivacion = "";
    if (porcentaje === 0)     motivacion = "¡Empieza hoy! El primer paso es el más difícil.";
    else if (porcentaje < 30) motivacion = `${porcentaje}% del mes — ¡Sigue construyendo el hábito!`;
    else if (porcentaje < 60) motivacion = `${porcentaje}% del mes — ¡Vas muy bien, no te detengas!`;
    else if (porcentaje < 90) motivacion = `${porcentaje}% del mes — ¡Eres una máquina! 🔥`;
    else                      motivacion = `${porcentaje}% del mes — ¡MES PERFECTO! 🏆`;
    document.getElementById("dash-progress-label").textContent = motivacion;

    // Tarjeta Posición en Ranking
    const posicion   = this.datos.obtenerPosicionRanking(u);
    const totalUsers = this.db.DB_USUARIOS.length;
    document.getElementById("dash-rank-pos").textContent   = `#${posicion}`;
    document.getElementById("dash-rank-total").textContent = `de ${totalUsers} miembros`;

    const emojiRank = posicion === 1 ? "🥇" : posicion === 2 ? "🥈" : posicion === 3 ? "🥉"
      : posicion <= 10 ? "🏆" : posicion <= 30 ? "🔥" : "💪";
    document.getElementById("dash-rank-emoji").textContent = emojiRank;

    // Tarjeta Logros
    const logros   = this.datos.calcularLogros(u);
    document.getElementById("dash-logros").innerHTML = logros.map(l => `
      <div class="logro-badge ${l.unlocked ? "" : "locked"}"
           title="${l.unlocked ? "¡Logro desbloqueado!" : "Aún no desbloqueado"}">
        <span>${l.emoji}</span>
        <span>${l.label}</span>
      </div>
    `).join("");

    // Historial últimos 7 días
    const historial = this.datos.simularHistorial(u);
    document.getElementById("dash-historial").innerHTML = historial.map(d => `
      <div class="historial-day ${d.asistio ? "asistio" : ""}">
        <span class="historial-day__label">${d.dia}</span>
        <span class="historial-day__icon">${d.asistio ? "✅" : "⬜"}</span>
      </div>
    `).join("");
  }

  /**
   * Renderiza el ranking completo: podio (Top 3) y tabla (Top 10).
   */
  renderizarRanking() {
    const top10 = this.datos.obtenerTopRanking(10);

    // Podio (orden olímpico: 2°, 1°, 3°)
    const ordenPodio = [top10[1], top10[0], top10[2]];
    const podioHTML  = ordenPodio.map((u, i) => {
      if (!u) return "";
      const alturas  = [60, 90, 40];
      const posicion = [2, 1, 3][i];
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

    // Tabla Top 10
    const medallas = ["🥇","🥈","🥉"];
    const filas    = top10.map((u, i) => {
      const pos       = i + 1;
      const esMiembro = this.db.usuarioActual && u.id === this.db.usuarioActual.id;
      const rowClass  = esMiembro ? "rank-me"
        : pos === 1 ? "rank-gold"
        : pos === 2 ? "rank-silver"
        : pos === 3 ? "rank-bronze" : "";

      const planKey  = u.plan === "Premium" ? "premium" : u.plan === "Básico" ? "basico" : "pase";
      const planPill = `<span class="plan-pill plan-pill--${planKey}">${u.plan}</span>`;
      const pct      = Math.round((u.asistencias_al_mes / 30) * 100);
      const miniBarra = `
        <div class="mini-bar">
          <div class="mini-bar__fill" style="width:${pct}%"></div>
        </div>`;
      const posDisplay = pos <= 3
        ? `<span class="medal">${medallas[pos - 1]}</span>`
        : `<strong>${pos}</strong>`;

      return `
        <tr class="${rowClass}">
          <td class="td-pos">${posDisplay}</td>
          <td class="td-nombre">${u.nombre}${esMiembro ? ' <small>← Tú</small>' : ''}</td>
          <td>${planPill}</td>
          <td class="td-asist">${u.asistencias_al_mes}</td>
          <td>${miniBarra}</td>
        </tr>`;
    }).join("");
    document.getElementById("ranking-tbody").innerHTML = filas;
  }

  /**
   * Marca visualmente el plan actual en la sección Planes.
   */
  marcarPlanActual() {
    document.querySelectorAll(".plan-card").forEach(card => {
      card.classList.remove("plan-actual");
      if (this.db.usuarioActual && card.dataset.plan === this.db.usuarioActual.plan) {
        card.classList.add("plan-actual");
      }
    });
  }

  /**
   * Actualiza el contador de miembros en la pantalla de Login.
   */
  actualizarContadorMiembros() {
    const el = document.getElementById("brand-total-members");
    if (el) el.textContent = this.db.DB_USUARIOS.length;
  }
}
