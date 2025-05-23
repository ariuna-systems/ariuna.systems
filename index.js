document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.addEventListener("click", () => {
      console.log("click");
      navToggle.classList.remove("open");
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let currentYear = new Date().getFullYear();
  let copyrighYearElement = document.getElementById("copyright-year");
  copyrighYearElement.innerHTML = currentYear;
});
