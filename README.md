# BugTracker App

Aplicacion web de seguimiento de bugs con operaciones CRUD, autenticacion por roles y dashboard de estadisticas. Construida con HTML, CSS y JavaScript vanilla — sin frameworks ni dependencias externas.

## Tecnologias

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Funcionalidades

- **Autenticacion** con 3 roles: Administrador, QA Tester y Desarrollador
- **CRUD completo** de bugs: crear, ver, editar y eliminar
- **Dashboard** con metricas en tiempo real (total, abiertos, en progreso, cerrados)
- **Filtros y busqueda** por texto, estado y prioridad (combinables)
- **Persistencia** con localStorage (los datos sobreviven al refresh)
- **UI responsiva** con modales, notificaciones toast y estados vacios
- 8 bugs de ejemplo precargados

## Como usar

1. Abrir `index.html` en cualquier navegador
2. Iniciar sesion con alguna de estas credenciales:

| Usuario | Contrasenia | Rol |
|---------|-------------|-----|
| `admin` | `admin123` | Administrador |
| `tester` | `tester123` | QA Tester |
| `dev` | `dev123` | Desarrollador |

3. Gestionar bugs desde el dashboard

> No requiere servidor, instalacion ni conexion a internet.

## Estructura del proyecto

```
bugtracker-app/
├── index.html          # Pagina de login
├── dashboard.html      # Dashboard principal
├── css/
│   └── styles.css      # Estilos (Grid, Flexbox, responsive)
├── js/
│   ├── auth.js         # Logica de autenticacion
│   └── app.js          # Logica del dashboard y CRUD
└── README.md
```
