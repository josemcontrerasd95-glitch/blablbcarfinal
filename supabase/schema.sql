-- RoadTrip Finanzas · esquema de la tabla de movimientos
-- Pégalo en Supabase -> SQL Editor -> New query -> Run

create table if not exists public.movements (
  id          text primary key,
  fecha       date not null,
  tipo        text not null check (tipo in ('gasto', 'ingreso')),
  categoria   text not null check (
                categoria in ('gasolina', 'revision', 'pasajero', 'imprevistos', 'blablacar', 'particular')
              ),
  importe     numeric(10, 2) not null check (importe > 0),
  nombre      text,
  pagado      boolean,
  created_at  timestamptz not null default now()
);

create index if not exists movements_fecha_idx on public.movements (fecha);

-- Row Level Security: lo activamos para seguir buenas prácticas, pero con
-- una política abierta (acceso con la clave pública "anon"), ya que la app
-- no tiene login propio. Si en el futuro añades autenticación, sustituye
-- esta política por una que filtre por auth.uid().
alter table public.movements enable row level security;

create policy "Acceso anon a movements"
  on public.movements
  for all
  to anon
  using (true)
  with check (true);
