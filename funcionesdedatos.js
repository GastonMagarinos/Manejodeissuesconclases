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
