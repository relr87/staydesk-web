# Claude Build Challenge · Track Hospitality · Plan del Nivel 2 (Data)

Documento de traspaso entre chats. Escrito el 16 de noviembre de 2026. Diseño **aprobado por Rafael** en el chat.

## Dónde quedó todo

| Cosa | Estado |
|---|---|
| Nivel 1 (Launch) | Terminado. https://staydeskhotel.com (Vercel, desde este repo). Lighthouse móvil 94 / 95 / 100 / 100 (`docs/lighthouse-mobile.png`). |
| Repo de la web | `relr87/staydesk-web` (público), 10+ commits, se publica solo con cada push a `main`. |
| Vercel | Equipo "Rafa" (`rafa-bebf`), proyecto `staydesk-web`. El conector de Vercel de Claude **no** puede crear proyectos ni dominios en ese equipo (403/404): se hace desde el navegador. Vercel pide código de autenticación (2FA) que pone Rafael. |
| DNS | En Netlify (equipo `rafael-lunar`). `A @ 216.198.79.1` y `CNAME www → db3155704110b907.vercel-dns-017.com`. **No tocar** los MX, SPF y DKIM de Zoho (correo info@staydeskhotel.com). |
| Supabase actual | Proyecto `oztadhzdxeftzgpipgso` con tablas `sd_*` que usa la app StayDesk 25.8 (datos vivos). **No tocar.** |
| App StayDesk 25.8 | Un solo HTML con datos en el navegador, publicada en `staydesk-hotel.netlify.app`. Repo privado `relr87/staydesk`. |

## Decisiones tomadas

1. **Proyecto nuevo de Supabase** solo para el reto (por ejemplo `staydesk-data`), para no mezclar con las tablas `sd_*`.
2. **Repo nuevo** para la app del Nivel 2 y 3 (propuesta: `relr87/staydesk-app`, público), importado en Vercel.
3. **Stack:** Next.js (App Router, TypeScript) + Supabase Postgres + Vercel, el recomendado por el reto.
4. Rafael activó (o va a activar) la instalación de paquetes para que Claude pueda compilar y probar antes de subir.

## Requisitos del Nivel 2 (del reto)

- Postgres en Supabase; los datos viven en el servidor (el almacenamiento del navegador no cuenta).
- Al menos 3 tablas relacionadas con llaves foráneas y restricciones, como **migraciones SQL en el repo**.
- Crear, leer, editar y borrar los registros principales, con **validación en el servidor**.
- Búsqueda en la lista principal y al menos **2 filtros** (por ejemplo estado y fecha).
- Script de datos de ejemplo con **50 o más registros inventados**.
- Claves en variables de entorno (`.env.local` y Vercel). Solo `NEXT_PUBLIC_*` llega al navegador; la clave secreta nunca lleva ese prefijo. `.env*` en `.gitignore`.
- Estados de carga, vacío y error diseñados.
- En vivo en Vercel conectado a la base de producción.
- Entregables: link en vivo, link del repo y un diagrama del esquema (Mermaid).
- Prueba en vivo: crear en el teléfono y verlo en la laptop; guardar algo inválido quitando la validación del navegador y que el servidor lo rechace; buscar y filtrar; borrar con confirmación; explicar una relación; mostrar que no hay claves en el repo.

## Esquema aprobado

Estados de habitación: `dirty → cleaning → inspected → ready`, más `out_of_order`.

```sql
create type room_status   as enum ('dirty','cleaning','inspected','ready','out_of_order');
create type staff_role    as enum ('manager','front_desk','housekeeper','engineer');
create type task_type     as enum ('checkout','stayover','deep_clean');
create type task_status   as enum ('pending','in_progress','done','inspected');
create type req_category  as enum ('ac','plumbing','electrical','lock','tv_wifi','other');
create type req_priority  as enum ('low','normal','urgent');
create type req_status    as enum ('open','in_progress','closed');

create table room_types (
  code        text primary key check (code ~ '^[A-Z]{4,5}$'),
  name        text not null check (length(name) between 3 and 60),
  accessible  boolean not null default false
);

create table rooms (
  id          uuid primary key default gen_random_uuid(),
  number      text not null unique check (number ~ '^[0-9]{3,4}$'),
  floor       smallint not null check (floor between 1 and 20),
  type_code   text not null references room_types(code) on update cascade,
  status      room_status not null default 'dirty',
  occupied    boolean not null default false,
  notes       text check (length(notes) <= 300),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table staff (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null check (length(full_name) between 2 and 80),
  role        staff_role not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table housekeeping_tasks (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references rooms(id) on delete cascade,
  assigned_to  uuid references staff(id) on delete set null,
  inspected_by uuid references staff(id) on delete set null,
  type         task_type not null,
  status       task_status not null default 'pending',
  due_date     date not null default current_date,
  started_at   timestamptz,
  finished_at  timestamptz,
  notes        text check (length(notes) <= 300),
  created_at   timestamptz not null default now(),
  check (finished_at is null or started_at is null or finished_at >= started_at)
);
-- una sola tarea abierta por cuarto y día
create unique index one_open_task_per_room_day on housekeeping_tasks(room_id, due_date)
  where status in ('pending','in_progress');

create table maintenance_requests (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references rooms(id) on delete cascade,
  reported_by  uuid references staff(id) on delete set null,
  assigned_to  uuid references staff(id) on delete set null,
  category     req_category not null,
  priority     req_priority not null default 'normal',
  status       req_status not null default 'open',
  out_of_order boolean not null default false,
  description  text not null check (length(description) between 3 and 500),
  opened_at    timestamptz not null default now(),
  closed_at    timestamptz,
  check ((status = 'closed') = (closed_at is not null))
);

create index on rooms(status);
create index on rooms(floor);
create index on housekeeping_tasks(due_date, status);
create index on housekeeping_tasks(assigned_to);
create index on maintenance_requests(status, priority);
create index on maintenance_requests(room_id);
```

Reglas en la base (funciones / triggers):

- Reparación abierta con `out_of_order = true` → la habitación pasa a `out_of_order`.
- Al cerrar la última reparación que la sacaba de venta → la habitación vuelve a `dirty`.
- Tarea `in_progress` → habitación `cleaning`; `done` → `inspected`; `inspected` → `ready`.
- Validar que `assigned_to` de una tarea sea camarera y el de una reparación sea ingeniero (trigger o en la acción del servidor).

## Pantallas y acciones del servidor

- `/rooms`: tablero con búsqueda por número y filtros por estado, piso y tipo. `/rooms/[id]`: detalle, cambiar estado y notas.
- `/housekeeping`: tareas con filtros por fecha, estado y camarera; crear, editar, empezar, terminar, aprobar y borrar.
- `/maintenance`: reparaciones con filtros por estado y prioridad; crear, editar, cerrar y borrar.
- `/staff`: personal; crear, editar y desactivar.
- Acciones del servidor validadas con un esquema (por ejemplo zod) y, además, restricciones en Postgres.
- Estados de carga, vacío y error en cada lista. Borrar siempre con confirmación.

## Datos de ejemplo (inventados)

"StayDesk Demo Inn": 7 tipos de habitación, 173 habitaciones en 7 pisos, unas 20 personas, unas 60 tareas de limpieza y unas 25 reparaciones. Nombres inventados; ningún huésped ni empleado real.

## Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (públicas).
- `SUPABASE_SECRET_KEY` (o service role): **solo servidor**, nunca `NEXT_PUBLIC_`. En el Nivel 3 la app pasa a consultar como el usuario con sesión y RLS.

## Próximos pasos

1. Crear el proyecto nuevo de Supabase (Rafael aprueba; si el conector lo bloquea, se hace en el navegador).
2. Crear el repo `relr87/staydesk-app` e importarlo en Vercel (navegador; Rafael pone el 2FA).
3. Escribir migraciones, seed y la app paso a paso, compilando y probando localmente.
4. Variables de entorno en Vercel, desplegar, y correr la prueba de aceptación del Nivel 2.
5. Diagrama Mermaid del esquema para entregar.
