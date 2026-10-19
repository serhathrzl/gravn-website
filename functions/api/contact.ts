// Cloudflare Pages Function: nimmt das Kontaktformular entgegen.
// NICHT AKTIV, bis Hosting + Versanddienst eingerichtet sind (Freigabe nötig).
// Benötigte Umgebungsvariablen (beim Host, nie im Code): RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
// Spam-Schutz: Honeypot hier; Cloudflare Turnstile wird bei der Einrichtung ergänzt.

interface Env { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string }

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const data = await request.formData();
  if (String(data.get('website') ?? '') !== '') return json(200, { ok: true }); // Honeypot: Bots still ignorieren

  const name = String(data.get('name') ?? '').trim().slice(0, 200);
  const email = String(data.get('email') ?? '').trim().slice(0, 200);
  const interest = String(data.get('interest') ?? '').trim().slice(0, 100);
  const message = String(data.get('message') ?? '').trim().slice(0, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.get('consent') !== 'on') {
    return json(400, { ok: false });
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) return json(503, { ok: false });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      reply_to: email,
      subject: `Neue Anfrage: ${interest}`,
      text: `Name: ${name}\nE-Mail: ${email}\nInteresse: ${interest}\n\n${message}`,
    }),
  });
  return res.ok ? json(200, { ok: true }) : json(502, { ok: false });
}
