# Security Audit Lab -

Laboratorio práctico de desarrollo seguro y auditoría de ciberseguridad enfocado en la mitigación de vulnerabilidades web comunes (OWASP Top 10), control de acceso basado en roles (RBAC) y prácticas de almacenamiento seguro de credenciales.

---

## 1. Arquitectura del Sistema
El sistema está construido bajo una arquitectura monolítica moderna utilizando **Next.js (App Router)**, que integra tanto la interfaz de usuario (Frontend) como las rutas de servidor/API (Backend con Node.js):
* **Frontend:** Desarrollado en React con TypeScript y estilizado con Tailwind CSS, maneja el estado de sesión de forma dinámica.
* **Backend (API Routes):** Endpoints protegidos en el servidor que gestionan la lógica de negocio y las validaciones de acceso.
* **Capa de Datos:** Conexión segura mediante un Pool de conexiones hacia una base de datos relacional en **PostgreSQL**.

---

## 2. Inventario de Activos
* **Base de Datos:** Tabla `users` (almacenamiento de credenciales con hashes y roles) y registros de notas confidenciales.
* **Endpoints Protegidos:**
  * `POST /api/login`: Valida credenciales contra la base de datos de manera cifrada.
  * `GET /api/notes`: Endpoint protegido que filtra la información según el rol del usuario autenticado.

---

##  3. Amenazas Identificadas (Basado en OWASP Top 10)
* **A07:2021 - Identification and Authentication Failures:** Riesgo asociado a la exposición de contraseñas débiles o almacenadas en texto plano en la base de datos.
* **A03:2021 - Injection:** Vulnerabilidad potencial ante la manipulación maliciosa de consultas SQL directas en los inputs de autenticación.
* **A01:2021 - Broken Access Control:** Exposición indebida de recursos restringidos (notas confidenciales) a usuarios con privilegios estándar o sin autenticación.

---

##  4. Vulnerabilidades y Hallazgos del Laboratorio
1. **Almacenamiento Inseguro Histórico:** Demostración de por qué guardar contraseñas en texto plano vulnera la confidencialidad total del sistema ante brechas de datos.
2. **Deficiencias de Control de Acceso (RBAC):** Sin una validación estricta de roles en el servidor, cualquier usuario podría intentar elevar privilegios de forma indebida.

---

##  5. Controles Defensivos Implementados
* **Hashing Criptográfico (`bcrypt`):** Las credenciales se procesan utilizando funciones de derivación de claves con un factor de costo (*salt rounds*), haciendo irreversible la recuperación de la contraseña plana.
* **Consultas Parametrizadas (`$1`):** Neutralización absoluta de ataques de **Inyección SQL** al separar la estructura de la consulta de los datos introducidos por el usuario.
* **Control de Acceso por Roles (RBAC):** Verificación de tokens y filtrado dinámico de información en el backend antes de renderizar la respuesta hacia el cliente.

---

## 6. Pruebas y Evidencias
* *Inicio de sesión exitoso con credenciales cifradas y retorno de roles correctos (`admin` / `user`).*
* *Bloqueo automático de acceso ante credenciales incorrectas (Código de estado HTTP 401).*
* *Filtrado exitoso de notas restringidas para usuarios sin privilegios administrativos.*
---
## 🚀 . Recomendaciones de Mejora Continua
* Reemplazar los tokens simulados por **JWT (JSON Web Tokens)** firmados digitalmente mediante claves asimétricas y con tiempo de expiración limitado.
* Implementar **Rate Limiting** en el endpoint de login para prevenir ataques de fuerza bruta y denegación de servicio (*DoS*).
* Añadir un sistema centralizado de **Logging de Auditoría** para registrar IP, fecha, hora y resultado de cada intento de inicio de sesión.
