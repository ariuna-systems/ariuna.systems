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

document.addEventListener("DOMContentLoaded", () => {
  let currentYear = new Date().getFullYear();
  let copyrighYearElement = document.getElementById("copyright-year");
  copyrighYearElement.innerHTML = currentYear;
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        name: form['name'].value,
        email: form['email'].value,
        message: form['message'].value
      };

      // Example: send to your API endpoint
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Thank you for your message!');
          form.reset();
        } else {
          alert('There was an error sending your message.');
        }
      } catch (err) {
        alert('There was an error sending your message.');
      }
    });
  }
});

// Set light theme
document.body.setAttribute('data-theme', 'light');

// Set dark theme (or remove attribute for default)
document.body.setAttribute('data-theme', 'dark');

// Toggle between themes
const currentTheme = document.body.getAttribute('data-theme');
document.body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // Get saved theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  function updateThemeIcon(theme) {
    // Light theme icon - dark outlined square (suggests switching to dark theme)
    const lightSquareIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="8" height="8" stroke="currentColor" stroke-width="2" fill="none" rx="1"/>
    </svg>`;
    
    // Dark theme icon - white filled square (suggests switching to light theme)
    const darkSquareIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="8" height="8" fill="white" rx="1"/>
    </svg>`;
    
    themeIcon.innerHTML = theme === 'light' ? lightSquareIcon : darkSquareIcon;
    themeToggle.setAttribute('aria-label', 
      theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
    );
  }
});
