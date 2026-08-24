const DOWNLOAD_URL = "/download/windows";

function setDownloadUrls() {
  document.querySelectorAll(".download-link").forEach((link) => {
    link.href = DOWNLOAD_URL;
    link.setAttribute("download", "");
  });
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");

  toggle?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "Close" : "Menu";
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
      if (toggle) toggle.textContent = "Menu";
    });
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

function setupGallery() {
  const dialog = document.getElementById("galleryDialog");
  const title = document.getElementById("dialogTitle");
  const preview = document.getElementById("dialogPreview");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      title.textContent = item.dataset.galleryTitle || "Chapters";
      preview.className = "dialog-preview";
      preview.innerHTML = item.querySelector(".gallery-mock").outerHTML;
      dialog.showModal();
    });
  });

  document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

setDownloadUrls();
setupNavigation();
setupReveal();
setupGallery();
