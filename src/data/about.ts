// Inhalte für "Über uns". Hier eintragen, die Seiten übernehmen alles automatisch.
// Solange ein Feld leer ist, zeigen die Seiten einen sichtbaren Platzhalter.

export interface Person {
  name: string;
  role: string;
  /** 1–2 Sätze, in "du"-freier Beschreibung (3. Person oder "ich") */
  text?: string;
  /** Pfad unter /public, z. B. "/team/vorname.jpg". Nur echte Fotos, keine Stockfotos. */
  photo?: string;
  /** Beschreibung des Fotos für Screenreader, z. B. "Porträt von Vorname Nachname" */
  photoAlt?: string;
}

export const about: {
  /** 2–3 Sätze: wer ihr seid, seit wann, warum GRAVN. */
  intro?: string;
  people: Person[];
} = {
  intro: 'GRAVN wurde von Önder Türksoy und Serhat Hiraözlü gegründet. Wir verbinden Erfahrung aus der Unternehmens- und SAP-Beratung mit Kreativität und Technik. Das Ziel: Digitales, das für kleine Unternehmen wirklich funktioniert.',
  people: [
    {
      name: 'Önder Türksoy',
      role: 'Gründer / Kreation & Vertrieb',
      text: 'Kreativer Kopf und erster Ansprechpartner für neue Projekte. Bringt langjährige Erfahrung aus der Unternehmensberatung mit.',
    },
    {
      name: 'Serhat Hiraözlü',
      role: 'Gründer / Technik & Umsetzung',
      text: 'Verantwortet Technik und Umsetzung. Bringt langjährige Erfahrung aus der SAP-Beratung mit.',
    },
  ],
};
