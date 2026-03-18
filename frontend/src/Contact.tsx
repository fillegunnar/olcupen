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
        <a
          className="contact-link"
          href="https://www.instagram.com/loaolcup/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/img/instagram.png" alt="Instagram" />
          <span>Instagram</span>
        </a>
        <a
          className="contact-link"
          href="https://www.facebook.com/loaolcup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/img/facebook.png" alt="Facebook" />
          <span>Facebook</span>
        </a>
        <a className="contact-link" href="mailto:loaolcup@gmail.com">
          <span style={{ fontSize: "2rem" }}>✉️</span>
          <span>Mail</span>
        </a>
      </div>
    </div>
  );
}
