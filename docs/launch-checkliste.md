# Launch-Checkliste

Vor dem Livegang erledigen:

- [x] Domain `https://www.gravndigital.com` in `astro.config.mjs` eingetragen. Beim Hosting: `gravndigital.com` auf `www` weiterleiten.
- [x] `kontakt@gravndigital.com` (Strato-Postfach, `info@` als Alias) eingerichtet; SPF, DKIM, DMARC bestanden; Adresse steht in `src/data/site.ts`.
- [ ] Impressum und Datenschutz mit echten Angaben füllen, rechtlich prüfen lassen, danach in `impressum.astro` und `datenschutz.astro` das `noindex` entfernen und den Sitemap-Filter in `astro.config.mjs` anpassen.
- [ ] Platzhalter (`.placeholder`, `[...]`) auf Startseite, Über uns und Kontakt ersetzen.
- [ ] Kontaktformular: Hosting, Mail-Dienst (`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` als Umgebungsvariablen), Turnstile ergänzen, Testsendung.
- [ ] Open-Graph-Bild (1200x630) ergänzen, falls gewünscht.
- [ ] JSON-LD (`Organization`) erst mit bestätigten Firmendaten ergänzen.
- [ ] `public/_headers` (Security-Header) gilt für Cloudflare Pages / Netlify. Nach Einrichtung CSP im Browser auf Fehler prüfen. Bei Turnstile oder anderen Diensten CSP erweitern.
- [ ] Lighthouse und axe auf der echten URL laufen lassen.
