export default function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-logo"
          src="/img/logga-olcupen.png"
          alt="Ölcupen logga"
        />
        <h1>
          ÖLCUPEN <span className="gold">2025</span>
        </h1>
        <p className="hero-subtitle">
          31 maj 10:00 – 14:00{" "}
          <a href="https://www.facebook.com/events/1661880931110708">
            (samma dag som livets fest)
          </a>
        </p>
        <p className="hero-location">
          Östra Löa 122, 714 94 Kopparberg, Sverige
        </p>
        <a
          className="hero-cta"
          href="https://www.facebook.com/events/1661880931110708"
          target="_blank"
          rel="noopener noreferrer"
        >
          Anmäl ditt lag
        </a>
      </section>

      <div className="info-cards">
        <div className="info-card">
          <div className="info-card-icon">📅</div>
          <div>
            <h3>Datum</h3>
            <p>31 maj 2025</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-icon">📍</div>
          <div>
            <h3>Plats</h3>
            <p>
              Östra Löa 122
              <br />
              Kopparberg
            </p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-icon">🏆</div>
          <div>
            <h3>Priser</h3>
            <p>
              Pokaler &amp; ÖL
              <br />
              till vinnarna
            </p>
          </div>
        </div>
      </div>

      <div className="page">
        <h2 className="section-title">
          Välkommen till <span className="gold">Ölcupen</span>
        </h2>
        <p className="section-text">
          Sedan 2016 har Ölcupen samlat amatörlag från hela regionen för en
          årlig fotbollsturnering fylld av passion, skicklighet och
          sportsmannaanda. I år firar vi vår 10:e upplaga — missa inte det!
        </p>
      </div>
    </>
  );
}
