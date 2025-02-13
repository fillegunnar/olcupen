document.addEventListener("DOMContentLoaded", function () {
  const menu = `
    <nav>
      <ul>
        <li><a href="https://www.instagram.com/loaolcup/"><img class="social-button" src="./img/instagram.png" alt="Instagram (loaolcup)"></a></li>
        <li><a href="https://www.facebook.com/loaolcup"><img class="social-button" src="./img/facebook.png" alt="Facebook (ölcupen)"></a></li>
        <li><a href="index.html">Hem</a></li>
        <li><a href="tabell-och-spelschema.html">Tabell och spelschema</a></li>
        <li><a href="regler.html">Regler</a></li>
        <li><a href="anmälan.html">Anmälan</a></li>
        <li><a href="om-oss.html">Om oss</a></li>
        <li><a href="trupper.html">Trupper</a></li>
      </ul>
    </nav>
  `;
  document.getElementById("menu-container").innerHTML = menu;
})