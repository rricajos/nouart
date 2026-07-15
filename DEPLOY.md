# Despliegue de Nou Art

Sitio: **https://nouart.org** · VPS multicliente `ricajos@86.48.1.238` (Docker Swarm + Traefik v3, red overlay `network`, certresolver `letsencrypt`).

## 1. DNS (una sola vez)

En el registrador de `nouart.org`, crea dos registros **A** apuntando al VPS:

```
A   @     86.48.1.238
A   www   86.48.1.238
```

Traefik pedirá el certificado Let's Encrypt automáticamente (reto HTTP) la primera vez que el servicio esté arriba y el DNS resuelva.

## 2. Secretos en el VPS

En `/home/ricajos/nouart/.env` (a partir de `.env.example`):

```bash
ADMIN_PASSWORD=<contraseña del panel>
SESSION_SECRET=$(openssl rand -hex 32)
MAIL_HOST=mail.barcinet.com  # correo por Barcinet (Mox), no relay externo
MAIL_PORT=465               # Mox no escucha en el 587: TLS implícito
MAIL_USER=no-reply@nouart.org   # login = la dirección, NO el nombre de cuenta
MAIL_PASS=                  # vacío = los mensajes van a data/outbox.jsonl
MAIL_FROM="Nou Art <no-reply@nouart.org>"   # comillas: el < es redirección al sourcear
CONTACT_FALLBACK=hola@nouart.org
```

> El panel de secretos de Forge (`/secrets`) puede guardar estos valores cifrados si se prefiere.

## 3. Primer despliegue (manual)

```bash
# En el Pi: sincronizar el código al VPS
rsync -az --exclude node_modules --exclude data --exclude .svelte-kit --exclude build \
  ./ ricajos@86.48.1.238:/home/ricajos/nouart/

# En el VPS
cd /home/ricajos/nouart
set -a; . ./.env; set +a
docker build -t nouart:latest .
docker stack deploy -c docker-stack.yml nouart
docker service ls | grep nouart          # nouart_app  1/1
```

Comprobar: `curl -I https://nouart.org` → 200 con cert válido.

## 4. Datos de arranque

Sin seed de demo, el sitio arranca vacío. Entra en `https://nouart.org/admin` con `ADMIN_PASSWORD`, crea artistas y obras.

Para cargar los datos de demostración (opcional, entorno de pruebas):
```bash
C=$(docker ps -qf name=nouart_app)
docker cp scripts/seed.cjs "$C":/app/seed.cjs
docker exec -w /app -e DATA_DIR=/data "$C" node seed.cjs   # ⚠️ borra y reinserta demo
```

## 5. Despliegues siguientes (CI)

Registra un runner self-hosted para `rricajos/nouart` con la etiqueta `nouart`
(mismo procedimiento que xorisu, en `/home/ricajos/actions-runner-nouart/`). A partir
de ahí, cada `git push` a `main` construye la imagen y hace `docker service update`
(ver `.github/workflows/deploy.yml`). `paths-ignore` evita redeploys por editar docs.

## Persistencia y backup

Todo el estado vive en el volumen `nouart_data` (`/data`): `nouart.db` (SQLite) +
`uploads/` (imágenes) + `outbox.jsonl`. Backup:

```bash
docker run --rm -v nouart_data:/data -v $PWD:/backup alpine \
  tar czf /backup/nouart-$(date +%F).tar.gz -C /data .
```
