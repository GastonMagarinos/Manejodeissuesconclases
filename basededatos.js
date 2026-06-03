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