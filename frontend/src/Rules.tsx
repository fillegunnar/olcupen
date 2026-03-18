export default function Rules() {
  return (
    <div className="page rules-container">
      <h1>Priser</h1>
      <ul className="prizes-list">
        <li>
          <span className="prize-icon">🥇</span> Första plats i
          fotbollsturneringen: 15 OPÖL
        </li>
        <li>
          <span className="prize-icon">🥈</span> Andra plats i
          fotbollsturneringen: 3 OPÖL
        </li>
        <li>
          <span className="prize-icon">🏃</span> Vinnare av stafett: 3 OPÖL
        </li>
        <li>
          <span className="prize-icon">🎭</span> Bästa utklädnad: 6 OPÖL
        </li>
      </ul>

      <h1>Regler</h1>
      <ol className="rules-list">
        <li>
          Lagavgift: 4 OPÖL (Olika Plattor Öl per Lag). Ölen lämnas till
          styrelsen i början av turneringen. Laget lämnar WO i alla sina matcher
          tills laget har fått in ölen på plats.
        </li>
        <li>
          Om man inte kommer till en match inom 3 min efter utsatt tid så lämnar
          man automatiskt WO.
        </li>
        <li>
          Max 3 utespelare + 1 målvakt som är aktiva fotbollsspelare får vara på
          plan samtidigt. Har man inte tillräckligt med icke aktiva spelare för
          att fylla ut ett 7-mannalag så får man spela med mindre spelare på
          planen. (OBS! Det räcker med att ha spelat en match i div.7, eller
          någon högre division, denna säsong eller förra säsongen för att räknas
          som aktiv fotbollsspelare!)
        </li>
        <li>
          Aktiva spelare måste tejpas med utstickande färg gentemot lagets
          tröjor. Styrelsen har med tejp men egna lösningar godtas också om
          lösningen inte är sämst.
        </li>
        <li>Ingen offside.</li>
        <li>
          Målvakt får ej ta upp boll med händer vid "hemåtpass" så vidare det
          inte är en nick. Indirekt frispark till andra laget om man bryter mot
          regeln.
        </li>
        <li>Ingen inspark, målvakt kastar ut på frivilligt sätt.</li>
        <li>Två gula kort = rött kort.</li>
        <li>Rött kort = matchstraff + avstängning nästkommande match.</li>
        <li>Antalet gula kort nollställs efter varje match.</li>
        <li>Skruvdobb får ej användas.</li>
        <li>
          Platsen där laget hållt till under cupen måste vara städad när platsen
          lämnas. Om laget inte städar efter sig riskerar laget att bli bannade
          från nästa ölcup. Plocka upp grejer och släng hemma.
        </li>
        <li>Matcherna är 12 minuter långa.</li>
        <li>
          Vid samma poäng i tabell så avgörs det först på målskillnad. Om lagen
          även har samma målskillnad så går det på inbördes möten.
        </li>
        <li>
          Vid lika i finaler körs bäst av tre straffar. Om fortfarande lika blir
          det suddenstraffar.
        </li>
        <li>ÅLDERSGRÄNS 18 ÅR.</li>
        <li>I övrigt så gäller sunt förnuft och vanliga fotbollsregler.</li>
      </ol>
    </div>
  );
}
