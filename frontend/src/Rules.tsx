interface Prize {
  icon: string;
  label: string;
}

const prizes: Prize[] = [
  { icon: "🥇", label: "Första plats i fotbollsturneringen: 15 OPÖL" },
  { icon: "🥈", label: "Andra plats i fotbollsturneringen: 3 OPÖL" },
  { icon: "🏃", label: "Vinnare av stafett: 3 OPÖL" },
  { icon: "🎭", label: "Bästa utklädnad: 6 OPÖL" },
];

const rules = [
  "Lagavgift: 4 OPÖL (Olika Plattor Öl per Lag). Ölen lämnas till styrelsen i början av turneringen. Laget lämnar WO i alla sina matcher tills laget har fått in ölen på plats.",
  "Om man inte kommer till en match inom 3 min efter utsatt tid så lämnar man automatiskt WO.",
  "Max 3 utespelare + 1 målvakt som är aktiva fotbollsspelare får vara på plan samtidigt. Har man inte tillräckligt med icke aktiva spelare för att fylla ut ett 7-mannalag så får man spela med mindre spelare på planen. (OBS! Det räcker med att ha spelat en match i div.7, eller någon högre division, denna säsong eller förra säsongen för att räknas som aktiv fotbollsspelare!)",
  "Aktiva spelare måste tejpas med utstickande färg gentemot lagets tröjor. Styrelsen har med tejp men egna lösningar godtas också om lösningen inte är sämst.",
  "Ingen offside.",
  'Målvakt får ej ta upp boll med händer vid "hemåtpass" så vidare det inte är en nick. Indirekt frispark till andra laget om man bryter mot regeln.',
  "Ingen inspark, målvakt kastar ut på frivilligt sätt.",
  "Två gula kort = rött kort.",
  "Rött kort = matchstraff + avstängning nästkommande match.",
  "Antalet gula kort nollställs efter varje match.",
  "Skruvdobb får ej användas.",
  "Platsen där laget hållt till under cupen måste vara städad när platsen lämnas. Om laget inte städar efter sig riskerar laget att bli bannade från nästa ölcup. Plocka upp grejer och släng hemma.",
  "Matcherna är 12 minuter långa.",
  "Vid samma poäng i tabell så avgörs det först på målskillnad. Om lagen även har samma målskillnad så går det på inbördes möten.",
  "Vid lika i finaler körs bäst av tre straffar. Om fortfarande lika blir det suddenstraffar.",
  "ÅLDERSGRÄNS 18 ÅR.",
  "I övrigt så gäller sunt förnuft och vanliga fotbollsregler.",
];

function PrizeList({ items }: { items: Prize[] }) {
  return (
    <ul className="prizes-list">
      {items.map((prize) => (
        <li key={prize.icon}>
          <span className="prize-icon">{prize.icon}</span> {prize.label}
        </li>
      ))}
    </ul>
  );
}

function RuleList({ items }: { items: string[] }) {
  return (
    <ol className="rules-list">
      {items.map((rule, i) => (
        <li key={i}>{rule}</li>
      ))}
    </ol>
  );
}

export default function Rules() {
  return (
    <div className="page rules-container">
      <h1>Priser</h1>
      <PrizeList items={prizes} />

      <h1>Regler</h1>
      <RuleList items={rules} />
    </div>
  );
}
