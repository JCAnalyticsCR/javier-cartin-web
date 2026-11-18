// Inicio de sesión del panel /admin (Decap CMS) SOLO CON CONTRASEÑA. Cloudflare Worker gratuito, sin base de datos.
// Javier escribe una contraseña y nunca ve GitHub. El Worker guarda una llave de acceso al repositorio
// (token de GitHub limitado a ESTE repositorio) y se la entrega al panel solo si la contraseña es correcta.
//
// Variables en Cloudflare (nunca en el código):
//   ADMIN_PASSWORD  (secreto)    contraseña que usa Javier
//   GITHUB_TOKEN    (secreto)    token fine-grained de GitHub: solo javier-cartin-web, permiso "Contents: Read and write"
//   ALLOWED_ORIGIN  (variable)   https://javiercartin.com

function pagina(cuerpo, extra) {
  return new Response(cuerpo, { headers: Object.assign({ 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store', 'x-frame-options': 'DENY' }, extra || {}) });
}

function formulario(error) {
  return pagina(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entrar · Javier Cartín</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0a09;color:#f3ecdd;font-family:system-ui,sans-serif}
  form{width:min(92vw,360px);padding:28px;border:1px solid #c9a15a66}
  h1{margin:0 0 6px;font:600 26px Georgia,serif;color:#e0bd7c}
  p{margin:0 0 18px;color:#d9d0be}
  input,button{width:100%;box-sizing:border-box;min-height:52px;font-size:18px}
  input{padding:0 14px;background:#141110;border:1px solid #c9a15a88;color:#f3ecdd;margin-bottom:12px}
  button{background:#e0bd7c;border:0;color:#1a0a0d;font-weight:700;cursor:pointer}
  .e{color:#ff9d8a;margin:0 0 12px;font-weight:600}
</style>
<form method="post" action="auth">
  <h1>Mis eventos</h1><p>Escriba su contraseña para entrar.</p>
  ${error ? '<p class="e">' + error + '</p>' : ''}
  <input type="password" name="clave" autocomplete="current-password" autofocus required placeholder="Contraseña">
  <button type="submit">Entrar</button>
</form></html>`);
}

// Entrega el resultado al panel, que abrió esta ventana. Solo le habla al origen permitido.
function respuesta(estado, contenido, origin) {
  const msg = 'authorization:github:' + estado + ':' + JSON.stringify(contenido);
  return pagina(`<!doctype html><meta charset="utf-8"><title>Entrando…</title>
<p style="font-family:sans-serif">Listo, puede cerrar esta ventana.</p>
<script>
(function () {
  var origin = ${JSON.stringify(origin)};
  function recibir(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(${JSON.stringify(msg)}, e.origin);
    window.removeEventListener('message', recibir);
    setTimeout(function () { window.close(); }, 300);
  }
  window.addEventListener('message', recibir);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>`);
}

// Comparación de contraseñas sin dar pistas por el tiempo de respuesta
async function iguales(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const A = new Uint8Array(x), B = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < A.length; i++) d |= A[i] ^ B[i];
  return d === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      if (request.method !== 'POST') return formulario();
      const datos = await request.formData().catch(() => null);
      const clave = datos && String(datos.get('clave') || '');
      if (!clave || !(await iguales(clave, env.ADMIN_PASSWORD || '\u0000'))) {
        await new Promise((r) => setTimeout(r, 1500));      // frena los intentos al azar
        return formulario('Contraseña incorrecta.');
      }
      return respuesta('success', { token: env.GITHUB_TOKEN, provider: 'github' }, env.ALLOWED_ORIGIN);
    }

    return new Response('Servicio de acceso de javiercartin.com', { status: 200 });
  }
};
