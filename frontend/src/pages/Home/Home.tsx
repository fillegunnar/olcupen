import "./Home.css";

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
        src={import.meta.env.BASE_URL + "img/logga-olcupen-2.webp"}
        alt="Ölcupen logga"
      />
      <h1>
        ÖLCUPEN <span className="gold">2026</span>
      </h1>
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
          Asmånga OPÖL
          <br />
          till vinnarna
        </InfoCard>
      </div>
    </>
  );
}
