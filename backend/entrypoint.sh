#!/bin/sh
set -e

# Fallback: si DATABASE_URL no esta definida, intenta con DATABASE_PUBLIC_URL
if [ -z "$DATABASE_URL" ]; then
  if [ -n "$DATABASE_PUBLIC_URL" ]; then
    echo "WARNING: DATABASE_URL no esta definido; se usa DATABASE_PUBLIC_URL"
    export DATABASE_URL="$DATABASE_PUBLIC_URL"
  fi
fi

# Valida que DATABASE_URL no este vacio
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL no esta configurado."
  echo "Agrega DATABASE_URL (o DATABASE_PUBLIC_URL) en las variables de entorno de Railway."
  exit 1
fi

echo "DATABASE_URL esta configurado correctamente."

# Si una migración previa quedó marcada como fallida, la marca como rolled back
# para permitir que migrate deploy la vuelva a aplicar en una base limpia.
./node_modules/.bin/prisma migrate resolve --rolled-back "20260801043235_add_domain_reference" || true

# Aplica migraciones y arranca el servidor
./node_modules/.bin/prisma migrate deploy
node dist/main
