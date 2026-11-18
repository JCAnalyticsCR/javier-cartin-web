// Inicio de sesión del panel /admin (Decap CMS) con GitHub. Cloudflare Worker gratuito, sin base de datos.
// Variables (se configuran en Cloudflare, nunca en el código):
//   GITHUB_CLIENT_ID      (variable)
//   GITHUB_CLIENT_SECRET  (secreto)
//   ALLOWED_ORIGIN        (variable) = https://javiercartin.com
const GITHUB = 'https://github.com';

function html(body, extraHeaders) {
  return new Response(body, { headers: Object.assign({ 'content-type': 'text/html;charset=utf-8', 'cache-control': 'no-store' }, extraHeaders || {}) });
}

function cookie(request, name) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

// Página que le entrega el resultado (éxito o error) al panel, que la abrió en una ventana emergente
function respuesta(estado, contenido, origin) {
  const msg = 'authorization:github:' + estado + ':' + JSON.stringify(contenido);
  return html(`<!doctype html><meta charset="utf-8"><title>Iniciando sesión…</title>
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
</script>`, { 'set-cookie': 'oauth_state=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax' });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') {
      const state = crypto.randomUUID();
      const authorize = new URL(GITHUB + '/login/oauth/authorize');
      authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorize.searchParams.set('scope', 'public_repo');   // el repositorio del sitio es público
      authorize.searchParams.set('state', state);
      return new Response(null, {
        status: 302,
        headers: { Location: authorize.toString(), 'set-cookie': 'oauth_state=' + state + '; Max-Age=600; Path=/; Secure; HttpOnly; SameSite=Lax' }
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code || !state || state !== cookie(request, 'oauth_state')) {
        return respuesta('error', { message: 'La sesión expiró. Cierre esta ventana e intente de nuevo.' }, env.ALLOWED_ORIGIN);
      }
      const r = await fetch(GITHUB + '/login/oauth/access_token', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'javiercartin-cms-auth' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code })
      });
      const data = await r.json().catch(() => ({}));
      if (!data.access_token) {
        return respuesta('error', { message: data.error_description || 'No se pudo iniciar sesión.' }, env.ALLOWED_ORIGIN);
      }
      return respuesta('success', { token: data.access_token, provider: 'github' }, env.ALLOWED_ORIGIN);
    }

    return new Response('Servicio de inicio de sesión de javiercartin.com', { status: 200 });
  }
};
