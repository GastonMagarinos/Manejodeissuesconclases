# 🏋️ IRONFORGE GYM — Sistema de Gestión

## 👥 Integrantes

| Nombre |
|---|
| Gaston Magariños |
| Giovanni Bisignani |
| Agustin Ferrer Quaglia |
| Ignacio Robaina |
| Tiago Delfini |

---

Aplicación web de gestión de gimnasio desarrollada con HTML, CSS y JavaScript vanilla. Permite a los miembros iniciar sesión, visualizar su dashboard personalizado, consultar el ranking de asistencias y gestionar su plan de membresía.

---

## 🚀 Funcionalidades

- **Autenticación** — Login y registro de usuarios con validaciones de cliente
- **Dashboard personalizado** — Asistencias, logros desbloqueados e historial semanal
- **Ranking** — Podio y tabla Top 10 de miembros más constantes
- **Gestión de planes** — Cambio de plan con modal de confirmación
- **Base de datos simulada** — 100 usuarios ficticios generados automáticamente

---

## 🗂️ Estructura del proyecto

```
files/
├── index.html                   # Estructura principal de la app
├── style.css                    # Estilos globales
├── script.js                    # Punto de entrada — instancia todas las clases
├── basededatos.js               # Clase BaseDeDatos
├── funcionesdedatos.js          # Clase FuncionesDeDatos
├── funcionesderenderizado.JS    # Clase FuncionesDeRenderizado
├── navegacionsecciones.js       # Clase NavegacionSecciones
├── autenticacion.js             # Clase Autenticacion
├── cambiodeplan.js              # Clase CambioDePlan
├── utilidades.js                # Clase Utilidades
└── eventlistener.js             # Clase EventListeners
```

---

## ⚙️ Arquitectura

Cada módulo está encapsulado en una **clase JavaScript**. `script.js` actúa como punto de entrada, instancia todas las clases respetando el orden de dependencias e inyecta las referencias necesarias entre módulos.

---

## 📐 Diagrama de Clases UML

```mermaid
classDiagram
    class BaseDeDatos {
        +PLANES: Array
        +ESTADOS: Array
        +NOMBRES: Array
        +APELLIDOS: Array
        +DB_USUARIOS: Array
        +usuarioActual: Object
        +planPendiente: String
        -_randomInt(min, max) int
        -_pick(arr) any
        -_makeEmail(nombre, apellido) String
        -_generarUsuariosFicticios() Array
    }

    class FuncionesDeDatos {
        -db: BaseDeDatos
        +obtenerTopRanking(n) Array
        +obtenerPosicionRanking(usuario) int
        +autenticarUsuario(email, password) Object
        +emailExiste(email) Boolean
        +registrarUsuario(nombre, email, password, plan) Object
        +actualizarPlanUsuario(userId, nuevoPlan) void
        +calcularLogros(usuario) Array
        +simularHistorial(usuario) Array
    }

    class FuncionesDeRenderizado {
        -db: BaseDeDatos
        -datos: FuncionesDeDatos
        +renderizarDashboard() void
        +renderizarRanking() void
        +marcarPlanActual() void
        +actualizarContadorMiembros() void
    }

    class NavegacionSecciones {
        -renderizado: FuncionesDeRenderizado
        +mostrarPantalla(id) void
        +mostrarSeccion(seccion) void
    }

    class Autenticacion {
        -db: BaseDeDatos
        -datos: FuncionesDeDatos
        -nav: NavegacionSecciones
        -util: Utilidades
        -renderizado: FuncionesDeRenderizado
        +handleLogin() void
        +handleRegistro() void
        +handleLogout() void
        +setRenderizado(renderizado) void
    }

    class CambioDePlan {
        -db: BaseDeDatos
        -datos: FuncionesDeDatos
        -renderizado: FuncionesDeRenderizado
        -util: Utilidades
        +mostrarModalPlan(plan) void
        +confirmarCambioPlan() void
        +cerrarModal() void
    }

    class Utilidades {
        +mostrarMensajeAuth(texto, tipo) void
        +mostrarToast(mensaje, tipo) void
        +limpiarFormularios() void
        +togglePassword(targetId) void
        +cambiarTab(tab) void
    }

    class EventListeners {
        -auth: Autenticacion
        -cambioPlan: CambioDePlan
        -nav: NavegacionSecciones
        -renderizado: FuncionesDeRenderizado
        -util: Utilidades
        -db: BaseDeDatos
        -datos: FuncionesDeDatos
        +init() void
    }

    FuncionesDeDatos --> BaseDeDatos : usa
    FuncionesDeRenderizado --> BaseDeDatos : usa
    FuncionesDeRenderizado --> FuncionesDeDatos : usa
    NavegacionSecciones --> FuncionesDeRenderizado : usa
    Autenticacion --> BaseDeDatos : usa
    Autenticacion --> FuncionesDeDatos : usa
    Autenticacion --> NavegacionSecciones : usa
    Autenticacion --> Utilidades : usa
    Autenticacion --> FuncionesDeRenderizado : usa
    CambioDePlan --> BaseDeDatos : usa
    CambioDePlan --> FuncionesDeDatos : usa
    CambioDePlan --> FuncionesDeRenderizado : usa
    CambioDePlan --> Utilidades : usa
    EventListeners --> Autenticacion : orquesta
    EventListeners --> CambioDePlan : orquesta
    EventListeners --> NavegacionSecciones : orquesta
    EventListeners --> FuncionesDeRenderizado : orquesta
    EventListeners --> Utilidades : orquesta
    EventListeners --> BaseDeDatos : orquesta
    EventListeners --> FuncionesDeDatos : orquesta

    class ScriptJS {
        <<punto de entrada>>
        +db: BaseDeDatos
        +util: Utilidades
        +datos: FuncionesDeDatos
        +renderizado: FuncionesDeRenderizado
        +nav: NavegacionSecciones
        +auth: Autenticacion
        +cambioPlan: CambioDePlan
        +listeners: EventListeners
    }

    ScriptJS --> BaseDeDatos : instancia
    ScriptJS --> Utilidades : instancia
    ScriptJS --> FuncionesDeDatos : instancia
    ScriptJS --> FuncionesDeRenderizado : instancia
    ScriptJS --> NavegacionSecciones : instancia
    ScriptJS --> Autenticacion : instancia
    ScriptJS --> CambioDePlan : instancia
    ScriptJS --> EventListeners : instancia e inicializa
```

---

## ▶️ Cómo ejecutar

1. Clonar o descargar el repositorio
2. Abrir `index.html` en cualquier navegador moderno
3. Usar las credenciales demo para probar la app:

| Usuario | Email | Contraseña |
|---|---|---|
| Carlos García | carlos.garcia@gym.com | Pass1234 |
| Lucía Martínez | lucia.martinez@gym.com | Pass1234 |
| Pedro López | pedro.lopez@gym.com | Pass1234 |

> No requiere servidor ni dependencias externas.
