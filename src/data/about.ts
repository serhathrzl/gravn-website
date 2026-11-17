// Team-Vorstellung für "Über uns". Bewusst ohne Namen und Fotos: das Team wird über seine
// Schwerpunkte vorgestellt. Hier ändern, die Seite übernimmt alles automatisch.

export interface Focus {
  title: string;
  text: string;
}

export const team: { intro: string; areas: Focus[] } = {
  intro: 'Hinter GRAVN steht ein kleines Team mit Erfahrung aus der Unternehmens- und SAP-Beratung. Wir verbinden kreative Ideen mit sauberer technischer Umsetzung und bleiben dabei dein direkter Ansprechpartner.',
  areas: [
    {
      title: 'Kreation & Vertrieb',
      text: 'Ideen, Konzepte und der erste Kontakt zu neuen Projekten. Mit langjähriger Erfahrung aus der Unternehmensberatung.',
    },
    {
      title: 'Technik & Umsetzung',
      text: 'Entwicklung, Automatisierung und eine Umsetzung, die im Alltag funktioniert. Mit langjähriger Erfahrung aus der SAP-Beratung.',
    },
  ],
};
