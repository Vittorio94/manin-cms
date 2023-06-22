const enSidebarStr = `
  <a href="/admin/">
    <img src="/admin/manin.png" alt="" id="sidebar-logo" />
  </a>
  <div class="title">PROPERTIES</div>
  <a href="/admin/contact-info/en/">Contact info</a>
  <a href="/admin/saved-images/en/">Saved images</a>
  <a href="/admin/analytics/en/">Analytics</a>
  <div class="divider"></div>
  <div class="title">PAGES</div>
  <a href="/admin/pages/home/en/">Home</a>
  <div class="divider"></div>
  <a href="/en/" target="_blanck">Show website&#8599;</a>
  <div class="divider"></div>
  <div class="flags">
    <a href="../">
      <img src="/flags/it.svg" alt="" width="20" height="20" />
    </a>
    <a href="./">
      <img src="/flags/us.svg" alt="" width="20" height="20" />
    </a>
  </div>
  <div id="credit">
    <a href="https://vittoriolora.com">Vittorio Lora</a>
  </div>
`;

const itSidebarStr = `
  <a href="/admin/">
    <img src="/admin/manin.png" alt="" id="sidebar-logo" />
  </a>
  <div class="title">PROPRIETÀ</div>
  <a href="/admin/contact-info/">Contatti</a>
  <a href="/admin/saved-images/">Immagini salvate</a>
  <a href="/admin/analytics/">Analytics</a>
  <div class="divider"></div>
  <div class="title">PAGINE</div>
  <a href="/admin/pages/home/">Home</a>
  <div class="divider"></div>
  <a href="/" target="_blank">Mostra sito&#8599;</a>
  <div class="divider"></div>
  <div class="flags">
    <a href="./">
      <img src="/flags/it.svg" alt="" width="20" height="20" />
    </a>
    <a href="./en/">
      <img src="/flags/us.svg" alt="" width="20" height="20" />
    </a>
  </div>
  <div id="credit">
    <a href="https://vittoriolora.com">Vittorio Lora</a>
  </div>
`;

function sidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarContent = document.getElementById("sidebar-content");
  const sidebarButtonOpen = document.getElementById("sidebar-button-open");
  const sidebarButtonClose = document.getElementById("sidebar-button-close");

  let htmlString;
  if (window.location.href.includes("/en/")) {
    sidebarContent.innerHTML = enSidebarStr;
  } else {
    sidebarContent.innerHTML = itSidebarStr;
  }

  sidebarButtonClose.addEventListener("click", (e) => {
    sidebarContent.classList.add("hidden");
    sidebarButtonOpen.classList.remove("hidden");
    sidebarButtonClose.classList.add("hidden");
  });
  sidebarButtonOpen.addEventListener("click", (e) => {
    sidebarContent.classList.remove("hidden");
    sidebarButtonClose.classList.remove("hidden");
    sidebarButtonOpen.classList.add("hidden");
  });
}

window.addEventListener("load", (e) => {
  sidebar();
});
