/* ──────────────────────────────────────────────────────────────
   2. FUNCIONES DE DATOS
   ────────────────────────────────────────────────────────────── */
import { db } from './basededatos.js';
/**
 * Ordena todos los usuarios de MAYOR a MENOR asistencia
 * y retorna el Top N (por defecto 10).
 * Esta función alimenta la sección de Ranking.
 *
 * @param {number} n - Cuántos usuarios retornar
 * @returns {Array} - Arreglo ordenado de los N más constantes
 */
export function obtenerTopRanking(n = 10) {
  return [...db.DB_USUARIOS]
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
export function obtenerPosicionRanking(usuario) {
  const ordenados = [...db.DB_USUARIOS]
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
export function autenticarUsuario(email, password) {
  return db.DB_USUARIOS.find(
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
export function emailExiste(email) {
  return db.DB_USUARIOS.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
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
export function registrarUsuario(nombre, email, password, plan) {
  const nuevoUsuario = {
    id: db.DB_USUARIOS.length + 1,
    nombre: nombre.trim(),
    email: email.toLowerCase().trim(),
    password,
    plan,
    estado: "Activo",
    asistencias_al_mes: 0,
    fecha_registro: new Date().toISOString().split("T")[0]
  };

 db.DB_USUARIOS.push(nuevoUsuario);
  return nuevoUsuario;
}

/**
 * Actualiza el plan del usuario actual en la DB en memoria.
 * Simula un UPDATE en SQL: UPDATE usuarios SET plan = ? WHERE id = ?
 *
 * @param {number} userId
 * @param {string} nuevoPlan
 */
export function actualizarPlanUsuario(userId, nuevoPlan) {
  const usuario = db.DB_USUARIOS.find(u => u.id === userId);
  if (usuario) {
    usuario.plan = nuevoPlan;
    usuario.estado = "Activo";
    if (db.usuarioActual && db.usuarioActual.id === userId) {
      db.usuarioActual.plan   = nuevoPlan;
      db.usuarioActual.estado = "Activo";
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
export function calcularLogros(usuario) {
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
export function simularHistorial(usuario) {
  const dias = ["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"];
  const probabilidad = usuario.asistencias_al_mes / 30;
  return dias.map(d => ({
    dia: d,
    asistio: Math.random() < probabilidad
  }));
}
