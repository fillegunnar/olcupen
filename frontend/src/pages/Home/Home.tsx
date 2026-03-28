import { Link } from "react-router-dom";
import "./Home.css";

interface InfoCardProps {
  icon: string;
  title: string;
  href?: string;
  internalLink?: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, href, internalLink, children }: InfoCardProps) {
  const content = (
    <>
      <div className="info-card-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        className="info-card info-card-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  if (internalLink) {
    return (
      <Link className="info-card info-card-link" to={internalLink}>
        {content}
      </Link>
    );
  }

  return <div className="info-card">{content}</div>;
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
          Lördag, 30 maj 2026
        </InfoCard>
        <InfoCard
          icon="📍"
          title="Plats"
          href="https://www.google.com/maps/place/%C3%96stra+L%C3%B6a+122,+714+94+Kopparberg/@59.8837596,14.9111746,70878m/data=!3m1!1e3!4m6!3m5!1s0x465dae073817475d:0x9f0025803d357c27!8m2!3d59.8019946!4d15.1603439!16s%2Fg%2F11csnrtl30?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D"
        >
          Östra Löa 122
          <br />
          Kopparberg
        </InfoCard>
        <InfoCard icon="🏆" title="Priser" internalLink="/rules">
          Asmånga OPÖL
          <br />
          till vinnarna
        </InfoCard>
      </div>
    </>
  );
}
