# Taller Nest.js

# E-Commerce de Velas Personalizadas: AromaLife

**Autores del proyecto:**

- Alejandro Amu García - A00395686  
- Rafaela Sofía Ruiz Pizarro - A00395368  
- Pablo Fernando Pineda Patiño - A00395831

 
## 🧑‍💻 ¿Qué puede hacer un usuario?
- 🔐 Crear una cuenta o iniciar sesión : Registrarse con correo y contraseña o acceder al sistema mediante credenciales válidas.
  
- 💡 Recibir recomendaciones personalizadas de fragancias: Responder preguntas sobre intención, espacio y ambiente para obtener sugerencias de velas ideales según sus gustos.
  
- 🕯️ Seleccionar velas con combinaciones únicas : Elegir entre distintas opciones de fragancias y contenedores para crear velas totalmente personalizadas.
  
- 🛒 Agregar productos al carrito : Guardar las velas creadas en el carrito antes de finalizar la compra.
  
- 📦 Gestionar órdenes : Crear, ver y seguir el estado de sus órdenes de compra.
  
- 💳 Realizar pagos seguros: Procesar pagos a través de MercadoPago, con soporte para pruebas en sandbox.
  
- ✉️ Generar mensajes personalizados usando inteligencia artificial: Usar IA para crear frases creativas y emotivas para acompañar velas de regalo.
  
- 📷 Generar códigos QR : Generar códigos QR a partir de texto, URL o cualquier información útil relacionada con la vela personalizada.


### Endpoints de la API

A continuación se listan todos los endpoints identificados en el proyecto, con una descripción breve de su funcionalidad.

## 🛡️ Autenticación

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/register` | Registra un nuevo usuario | `name`, `email`, `password` | `{ id: string, name: string, email: string }` | `400 Bad Request`: Datos inválidos o correo duplicado |
| POST | `/login` | Inicia sesión y devuelve un token JWT | `email`, `password` | `{ access_token: string }` | `401 Unauthorized`: Credenciales inválidas |
| GET | `/profile` | Obtiene el perfil del usuario autenticado | Token JWT en encabezado (`Authorization: Bearer <token>`) | `{ id: string, name: string, email: string, roles: Role[] }` | `401 Unauthorized`: Token no proporcionado o inválido |

## 👥 Usuarios

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| GET | `/` | Obtiene todos los usuarios (solo admin) | Token JWT (rol `ADMIN`) | `[ { id: string, name: string, email: string }, ... ]` | `401 Unauthorized` o `403 Forbidden` |
| GET | `/:id` | Obtiene un usuario por ID | `id` (UUID) | `{ id: string, name: string, email: string }` | `404 Not Found` si no existe |
| PATCH | `/:id` | Actualiza un usuario | `id` (UUID), body: `name?`, `email?`, `password?` | `{ id: string, name: string, email: string }` | `400 Bad Request` o `404 Not Found` |
| DELETE | `/:id` | Elimina un usuario | `id` (UUID) | `200 OK` | `404 Not Found` si no existe |

## 🕯️ Fragancias

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/` | Crea una nueva fragancia | `name`, `topNotes`, `middleNotes`, `baseNotes`, `image` | `{ id: string, name, topNotes, middleNotes, baseNotes, image }` | `400 Bad Request`: Datos inválidos |
| GET | `/` | Obtiene todas las fragancias | Ninguno | `[ { id, name, topNotes, middleNotes, baseNotes, image }, ... ]` | N/A |
| GET | `/:id` | Obtiene una fragancia por ID | `id` (UUID) | `{ id, name, topNotes, middleNotes, baseNotes, image }` | `404 Not Found` si no existe |
| PATCH | `/:id` | Actualiza una fragancia | `id` (UUID), campos opcionales: `name`, `topNotes`, etc. | `{ id, name, topNotes, middleNotes, baseNotes, image }` | `400 Bad Request` o `404 Not Found` |
| DELETE | `/:id` | Elimina una fragancia | `id` (UUID) | `200 OK` | `404 Not Found` si no existe |

## 🧺 Contenedores

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/` | Crea un nuevo contenedor | `name`, `description`, `price`, `image` | `{ id, name, description, price, image }` | `400 Bad Request` |
| GET | `/` | Obtiene todos los contenedores | Ninguno | `[ { id, name, description, price, image }, ... ]` | N/A |
| GET | `/:id` | Obtiene un contenedor por ID | `id` (UUID) | `{ id, name, description, price, image }` | `404 Not Found` |
| PATCH | `/:id` | Actualiza un contenedor | `id` (UUID), campos opcionales: `name`, `description`, etc. | `{ id, name, description, price, image }` | `400 Bad Request` o `404 Not Found` |
| DELETE | `/:id` | Elimina un contenedor | `id` (UUID) | `200 OK` | `404 Not Found` |

## 🛒 Carrito

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/items` | Añade un producto al carrito | `candleId`, `quantity` | `{ item: { id, candleId, quantity }, cartTotal }` | `400 Bad Request` o `404 Candle not found` |
| GET | `/` | Obtiene el carrito del usuario autenticado | Token JWT | `{ items: [ { id, candleId, quantity, total }, ... ], totalPrice }` | `404 Cart not found` |
| DELETE | `/items/:itemId` | Elimina un ítem del carrito | `itemId` (UUID) | `200 OK` | `404 Item not found` |

## 📦 Órdenes

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/` | Crea una nueva orden | `items` (array de objetos con `candleId` y `quantity`) | `{ id, status, total, items }` | `400 Bad Request` o `404 Items not found` |
| GET | `/` | Obtiene todas las órdenes (solo admin) | Token JWT (rol `ADMIN`) | `[ { id, status, total, createdAt }, ... ]` | `401 Unauthorized` o `403 Forbidden` |
| GET | `/:id` | Obtiene una orden específica | `id` (UUID) | `{ id, status, total, items }` | `404 Not Found` |
| PATCH | `/:id/status` | Actualiza el estado de una orden | `id` (UUID), `status` | `{ id, status, total }` | `400 Invalid status` o `404 Order not found` |
| DELETE | `/:id` | Elimina una orden | `id` (UUID) | `200 OK` | `404 Order not found` |

## 💳 Pagos

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/` | Crea un nuevo pago | `orderId`, `paymentMethod` | `{ id, mercadopagoId, init_point, sandbox_init_point }` | `400 Bad Request` o `404 Order not found` |
| GET | `/` | Obtiene todos los pagos (solo admin) | Token JWT (rol `ADMIN`) | `[ { id, mercadopagoId, status, paymentMethod, orderId }, ... ]` | `401 Unauthorized` o `403 Forbidden` |
| GET | `/:id` | Obtiene detalles de un pago | `id` (UUID) | `{ id, mercadopagoId, status, paymentMethod, orderId }` | `404 Payment not found` |
| PATCH | `/:id` | Actualiza un pago | `id` (UUID), campos a actualizar | `{ id, mercadopagoId, status, paymentMethod }` | `400 Bad Request` o `404 Payment not found` |
| DELETE | `/:id` | Elimina un pago | `id` (UUID) | `200 OK` | `404 Payment not found` |

## 🧠 Recomendaciones

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/` | Devuelve fragancias recomendadas según preferencias del usuario | `intention`, `space`, `ambiance` | `[ { name, topNotes, middleNotes, baseNotes, image }, ... ]` | `400 Missing fields` |

## 🖋️ Mensaje IA

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/generate-message` | Genera un mensaje personalizado para una vela usando IA | `prompt` (texto opcional que describe el mensaje deseado) | `{ message: string }` | `500 Internal Server Error` si falla el modelo de IA |

## 🧾 QR

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| POST | `/generate` | Genera un código QR a partir de texto o datos proporcionados | `text` (cadena de texto o URL) | `{ qrUrl: "https://cloudinary.com/path-del-archivo.png " }` | `400 Bad Request`: Falta campo `text` |

## 📁 Swagger

| Método | Ruta | Descripción | Parámetros | Respuesta | Error |
|--------|------|-------------|------------|-----------|-------|
| GET | `/` | Accede a la documentación interactiva de la API (Swagger UI) | Ninguno | Redirección a interfaz gráfica de Swagger | N/A |


----

## 🔐 Implementación de Autenticación y Autorización

La API implementa un sistema de autenticación basada en **JWT (JSON Web Token)** y autorización por roles, lo que permite restringir el acceso a ciertos endpoints según los privilegios del usuario.

### Autenticación con JWT

**Estructura:**
- Se utiliza el paquete `@nestjs/jwt` para generar y verificar tokens.
- Los usuarios inician sesión mediante:
  - **Ruta:** `POST /login`
  - **Credenciales:** email y contraseña
- Al autenticarse correctamente, se devuelve un token JWT firmado.

**Funcionamiento:**
- El token contiene información del usuario como:

```json
{
  "id": "uuid",
  "roles": ["user"]
}
```

- Este token debe incluirse en las solicitudes protegidas como:

```
Authorization: Bearer <token>
```

**Archivos clave:**
- `auth.service.ts`: Maneja el login y genera el token usando `JwtService`.
- `auth.guard.ts`: Valida el token antes de permitir el acceso a rutas protegidas.

---

### Autorización por Roles

**Mecanismo:**
- Se implementó una guardia personalizada (`RolesGuard`) que verifica si el rol del usuario cumple con los requisitos definidos en cada endpoint.
- Se usan decoradores como `@Auth(Role.ADMIN)` o `@Auth(Role.USER)` para proteger rutas.

**Ejemplo:**

```typescript
@Get('users')
@Auth(Role.ADMIN)
findAllUsers() {
  return this.usersService.findAll();
}
```
Este endpoint solo será accesible para usuarios con rol **ADMIN**.

**Archivos clave:**
- `guards/roles.guard.ts`: Lógica que compara los roles del usuario contra los requeridos.
- `decorators/roles.decorator.ts`: Define qué roles son necesarios para acceder al endpoint.

---

### 💾 Implementación de Persistencia en la Base de Datos

La persistencia se implementa utilizando **TypeORM** con una base de datos **PostgreSQL**.

#### Configuración de TypeORM

**Configuración dinámica:**
- Se define en `database.config.ts`, donde se selecciona entre:
  - **SQLite** para pruebas unitarias y E2E.
  - **PostgreSQL** para desarrollo y producción.

**Entornos:**
- **Desarrollo:** PostgreSQL (conexión real a BD local o remota)
- **Pruebas:** SQLite en memoria (`:memory:`) para tests

**Ejemplo de configuración:**

```typescript
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'development',
}
```

---

#### Entidades y Relaciones

Se utilizan entidades TypeORM para mapear tablas en la base de datos.

**Entidades principales:**
- **User:** Usuarios registrados en el sistema
- **Fragance:** Fragancias disponibles
- **Container:** Tipos de recipientes para velas
- **Cart:** Carrito de compras asociado a un usuario
- **CartItem:** Ítems dentro de un carrito
- **Order:** Órdenes de compra realizadas
- **Payment:** Pagos procesados (integración MercadoPago)

**Relaciones clave:**
- Un **User** tiene un **Cart** y múltiples **Orders**.
- Un **Cart** contiene varios **CartItem**.
- Cada **CartItem** apunta a una **Candle** (vía relación con Fragance y Container).
- Una **Order** puede tener varios ítems también relacionados a Candle.

---

#### 3. Validaciones y Seguridad de Datos

- Se usan decoradores de `class-validator` para validar entradas en DTOs.
- Contraseñas deben cumplir requisitos de seguridad:
  - Mínimo 8 caracteres
  - Al menos una mayúscula, minúscula, número y carácter especial
- Validación de emails, UUIDs y otros campos importantes.
- En caso de error, se lanzan excepciones como `BadRequestException` o `UnauthorizedException`.

---

#### 4. Seeders y Datos Iniciales

- Para facilitar pruebas y demostraciones, se incluyen métodos de carga inicial de datos.
- Se crean usuarios de prueba, fragancias y contenedores predefinidos.
- Esto se ejecuta en `database.config.ts` durante la conexión a la base de datos en modo desarrollo.

---


## Conclusiones y Reflexión

Durante el desarrollo, se encontraron varios desafíos relacionados con las pruebas unitarias y E2E , principalmente por diferencias entre PostgreSQL (usado en producción) y SQLite (usado en pruebas locales).

#### Principales dificultades:
Enums no soportados en SQLite : TypeORM permite usar enums directamente en PostgreSQL, pero SQLite no los admite nativamente. Esto causó errores en las pruebas cuando intentábamos guardar valores como Role.USER o Role.ADMIN.

Problemas de sincronización : Algunas relaciones entre tablas no se reflejaban correctamente en el entorno de pruebas, lo que provocaba fallos en las consultas.

A pesar de estos problemas, se logró avanzar considerablemente en la cobertura de tests.