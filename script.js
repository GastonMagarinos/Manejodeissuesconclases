/* ──────────────────────────────────────────────────────────────
   PUNTO DE ENTRADA — Unifica todos los módulos de la aplicación
   ────────────────────────────────────────────────────────────── */

// 1. Base de datos simulada (objeto único: DB_USUARIOS, usuarioActual, planPendiente)
import { db } from './basededatos.js';

// 2. Funciones de datos (se agrupan en un objeto "datos" para inyectarlas como dependencia)
import * as datos from './funcionesdedatos.js';

// 7. Utilidades de UI (se agrupan en un objeto "util" para inyectarlas como dependencia)
import * as util from './utilidades.js';

// 3. Funciones de renderizado (DOM)
import { FuncionesDeRenderizado } from './funcionesderenderizado.js';

// 4. Navegación entre secciones (SPA)
import { NavegacionSecciones } from './navegacionsecciones.js';

// 5. Lógica de autenticación
import { Autenticacion } from './autenticacion.js';

// 6. Lógica de cambio de plan
import { CambioDePlan } from './cambiodeplan.js';

// 8. Event listeners (inicialización de la app)
import { initEventListeners } from './eventlistener.js';

/* ── Instanciamos las clases respetando el orden de dependencias ── */
const renderizado = new FuncionesDeRenderizado(db, datos);
const nav          = new NavegacionSecciones(renderizado);
const auth         = new Autenticacion(db, datos, nav, util);
auth.setRenderizado(renderizado); // evita la dependencia circular auth <-> renderizado
const cambioPlan   = new CambioDePlan(db, datos, renderizado, util);

/* ── Conectamos todos los event listeners del DOM ── */
initEventListeners({ db, datos, util, nav, auth, cambioPlan, renderizado });