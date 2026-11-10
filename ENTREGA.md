# Entrega: Check List Camiones conectado a Supabase

## Qué contiene
- La app React con el envío a Supabase (rama `conectar-supabase`, ya incluida en este .zip con su historial de git).
- `src/services/remote.ts`: envío al servidor, subida de fotos y cola sin señal.
- `src/lib/supabase.ts`: conexión con la base (URL y clave pública).

## Subir a GitHub
```
git push -u origin conectar-supabase
```
Después crea el Pull Request y combínalo en `main`.

## Publicar en Vercel
1. En vercel.com: Add New → Project → importa `checklist-camiones`.
2. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. Variables (opcionales, la app ya trae valores por defecto):
   - `VITE_SUPABASE_URL` = https://cygtbbihkjrfcepobdce.supabase.co
   - `VITE_SUPABASE_ANON_KEY` = clave anon del proyecto (Supabase → Settings → API)

## Base de datos (ya creada y funcionando)
- Proyecto Supabase `checklist-camiones` (ref `cygtbbihkjrfcepobdce`).
- Función que usa la app: `registrar_inspeccion`.
- Fotos: bucket privado `checklist-fotos`.
- Dashboard de supervisores: https://checklist-camiones.vercel.app/dashboard
