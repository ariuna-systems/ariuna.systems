/**
 * Header Navigation Web Component
 * Provides consistent navigation across all pages
 */
class HeaderNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initializeEventListeners();
  }

  disconnectedCallback() {
    this._cleanupEventListeners();
  }

  _cleanupEventListeners() {
        const navToggle = this.querySelector('#nav-toggle');
        if (navToggle && this.handleNavToggle) {
            navToggle.removeEventListener('click', this.handleNavToggle);
        }
    }

  render() {
    this.innerHTML = `
      <header>
        <nav aria-label="Main navigation">
          <div class="nav-left">
            <div id="home">
              <a id="logo" href="/" aria-label="Arjuna Systems Home">
                <span class="logo-icon logo-white"></span>
              </a>
              <a id="name" href="/">ariuna</a>
            </div>
          </div>
          <ul id="main-nav" aria-hidden="true">
          <li><a href="/#solutions">Solutions</a></li>
          <li><a href="/#platform">Platform</a></li>
            <li><a href="/#research">Research</a></li>
            <li><a href="/company/" class="mobile-company-link">Company <span class="external-link-arrow"><svg width="10"
                  height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L9 1M9 1H3.5M9 1V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg></span></a></li>
          </ul>
          <div class="header-controls">
            <button id="search-btn" aria-label="Search" class="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>
    `;
  }

  initializeEventListeners() {
    const navToggle = this.querySelector('#nav-toggle');
    const mainNav = this.querySelector('#main-nav');
    
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        mainNav.setAttribute('aria-hidden', !isOpen);
      });
    }
  }
}

customElements.define('header-nav', HeaderNav);
