let currentYear = new Date().getFullYear();
let copyrighYearElement = document.getElementById("copyright-year");
copyrighYearElement.innerHTML = currentYear;

/*
const useHash = true;
const routes = ['welcome', 'services', 'products'];

pages = {
  welcome: `
    <div class="section" id="teaser">
      We are experts in audio/visual signal processing, simulation and visualisation.
    </div>
  `,
  services: `<div class="section" id="services"><h2>Services</h2></div>`,
  products: `<div class="section" id="products"><h2>Products</h2></div>`
  // <div class="section" id="members"><h2>Members</h2></div>
  // <div class="section" id="contact"><h2>Contact</h2></div>

}

async function get(page) {
  const content_box = document.getElementById("content");

  // const response = await fetch("./templates/demo.html");
  // const template = await response.text()
  const template = pages[page]
  content_box.innerHTML = template;
  window.history.pushState(
        { 'content': template, 'title': 'demo'},
        title,
        useHash ?
          `#${page}` :
          page
      );
}

window.addEventListener("popstate", function(e) {
  const state = e.state;
  const content_box = document.getElementById("content");
  content_box.innerHTML = state.content;
});

const links = document.getElementsByClassName('link');
for(let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function(event) {
    event.preventDefault();
    get(links[i].href.split('/').pop());
  }, false);
}

(function(fn = function() {
  const page = useHash ?
    window.location.hash.split('#').pop() :
  get(routes.indexOf(page) >= 0 ? page : routes[0]);
}) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})();
</script>

*/