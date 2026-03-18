interface InfoCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div className="info-card">
      <div className="info-card-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
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
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <div className="info-cards">
        <InfoCard icon="📅" title="Datum">
          31 maj 2025
        </InfoCard>
        <InfoCard icon="📍" title="Plats">
          Östra Löa 122
          <br />
          Kopparberg
        </InfoCard>
        <InfoCard icon="🏆" title="Priser">
          Pokaler &amp; ÖL
          <br />
          till vinnarna
        </InfoCard>
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
