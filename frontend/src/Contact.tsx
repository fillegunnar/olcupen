interface ContactLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}

const contactLinks: ContactLink[] = [
  {
    href: "https://www.instagram.com/loaolcup/",
    label: "Instagram",
    icon: <img src="/img/instagram.png" alt="Instagram" />,
    external: true,
  },
  {
    href: "https://www.facebook.com/loaolcup",
    label: "Facebook",
    icon: <img src="/img/facebook.png" alt="Facebook" />,
    external: true,
  },
  {
    href: "mailto:loaolcup@gmail.com",
    label: "Mail",
    icon: <span style={{ fontSize: "2rem" }}>✉️</span>,
  },
];

function ContactCard({ href, label, icon, external }: ContactLink) {
  return (
    <a
      className="contact-link"
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function Contact() {
  return (
    <div className="page contact-container">
      <h1>Kontakt</h1>
      <p className="contact-text">
        Du når styrelsen lättast via{" "}
        <a href="https://www.instagram.com/loaolcup/">Instagram</a> eller{" "}
        <a href="https://www.facebook.com/loaolcup">Facebook</a>. Alternativt
        via <a href="mailto:loaolcup@gmail.com">mail</a>. Till lagkaptener så
        kommer telefonnummer till styrelsen delas ut.
      </p>

      <div className="contact-links">
        {contactLinks.map((link) => (
          <ContactCard key={link.label} {...link} />
        ))}
      </div>
    </div>
  );
}
