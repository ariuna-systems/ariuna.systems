/**
 * Main website functionality including dynamic header colors, mobile navigation, 
 * contact form handling, and theme switching.
 */

/**
 * Dynamically adjusts header link colors based on the background of the section
 * currently scrolling behind the semi-transparent sticky header.
 * Dark sections get white text, light sections get dark text for optimal contrast.
 */
function initDynamicHeaderColor() {
  const header = document.querySelector('header');
  const mainNav = document.getElementById('main-nav');
  // Select navigation links - will filter out mobile dropdown links
  const navLinks = document.querySelectorAll('nav a, #home a, #name');
  
  if (!header) return;

  // Sections with dark backgrounds that need white text
  const darkSections = ['teaser', 'platform'];
  
  let currentMode = null;

  function updateHeaderColor() {
    const sections = document.querySelectorAll('main section[id]');
    const headerRect = header.getBoundingClientRect();
    const headerMiddle = headerRect.top + (headerRect.height / 2);
    
    // Find which section is under the middle of the header
    let currentSectionId = null;
    let maxOverlap = 0;
    
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      
      // Calculate overlap between section and header
      if (rect.top <= headerMiddle && rect.bottom > headerMiddle) {
        const overlap = Math.min(rect.bottom, headerRect.bottom) - Math.max(rect.top, headerRect.top);
        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          currentSectionId = section.id;
        }
      }
    }
    
    // Fallback to first section if at very top of page
    if (!currentSectionId && window.scrollY < 100) {
      currentSectionId = 'teaser';
    }
    
    // Determine if current section has dark background
    const isDarkSection = darkSections.includes(currentSectionId);
    
    // Only update if mode changed (prevents unnecessary repaints)
    if (currentMode !== isDarkSection) {
      currentMode = isDarkSection;
      
      if (isDarkSection) {
        // Dark background → Light text (white)
        navLinks.forEach(link => {
          link.style.color = 'rgba(255, 255, 255, 0.95)';
          link.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.5)';
        });
        
        // Apply to desktop nav links only (not when mobile menu is open)
        if (mainNav && !mainNav.classList.contains('open')) {
          const mainNavLinks = mainNav.querySelectorAll('a');
          mainNavLinks.forEach(link => {
            link.style.color = 'rgba(255, 255, 255, 0.95)';
            link.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.5)';
          });
        }
        
        // Update hamburger menu icon color (for mobile)
        document.documentElement.style.setProperty('--nav-toggle-bg', 'rgba(255, 255, 255, 0.95)');
        
        header.setAttribute('data-bg-mode', 'dark');
      } else {
        // Light background → Dark text
        navLinks.forEach(link => {
          link.style.color = 'rgba(37, 37, 37, 0.9)';
          link.style.textShadow = 'none';
        });
        
        // Apply to desktop nav links only (not when mobile menu is open)
        if (mainNav && !mainNav.classList.contains('open')) {
          const mainNavLinks = mainNav.querySelectorAll('a');
          mainNavLinks.forEach(link => {
            link.style.color = 'rgba(37, 37, 37, 0.9)';
            link.style.textShadow = 'none';
          });
        }
        
        // Update hamburger menu icon color (for mobile)
        document.documentElement.style.setProperty('--nav-toggle-bg', 'rgba(37, 37, 37, 0.9)');
        
        header.setAttribute('data-bg-mode', 'light');
      }
    }
  }

  // Throttle scroll events with requestAnimationFrame for performance
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderColor();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', updateHeaderColor);
  
  // Initial updates (multiple timings ensure it catches after fonts/images load)
  setTimeout(updateHeaderColor, 100);
  setTimeout(updateHeaderColor, 500);
  window.addEventListener('load', () => setTimeout(updateHeaderColor, 200));
  
  // Expose function globally for mobile menu toggle
  updateHeaderColorGlobal = updateHeaderColor;
}

// Global reference to color update function
let updateHeaderColorGlobal = null;


document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      
      // Reapply header colors after menu state changes
      if (updateHeaderColorGlobal) {
        setTimeout(updateHeaderColorGlobal, 10);
      }
    });
    mainNav.addEventListener("click", () => {
      navToggle.classList.remove("open");
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      
      // Reapply header colors after menu closes
      if (updateHeaderColorGlobal) {
        setTimeout(updateHeaderColorGlobal, 10);
      }
    });
  }

  // Dynamic header text color - adjust based on what's scrolling behind the semi-transparent header
  initDynamicHeaderColor();
});

// Rest of the code (copyright year, contact form, theme toggle)
document.addEventListener("DOMContentLoaded", () => {
  let currentYear = new Date().getFullYear();
  let copyrighYearElement = document.getElementById("copyright-year");
  if (copyrighYearElement) {
    copyrighYearElement.innerHTML = currentYear;
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
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
    const lightSquareIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="8" height="8" stroke="currentColor" stroke-width="2" fill="none" rx="1"/>
    </svg>`;
    
    const darkSquareIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="8" height="8" fill="white" rx="1"/>
    </svg>`;
    
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'light' ? lightSquareIcon : darkSquareIcon;
    }
    themeToggle.setAttribute('aria-label', 
      theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
    );
  }
});
