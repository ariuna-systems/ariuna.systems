/**
 * Main website functionality including dynamic header colors, mobile navigation, 
 * contact form handling, and theme switching.
 */

/**
 * Animates the rotating text in the teaser section
 * Cycles through "Strategical", "Operational", and "Tactical"
 */
function initTextAnimation() {
  const animatedText = document.getElementById('animated-text');
  if (!animatedText) return;
  
  const words = ['Strategical', 'Operational', 'Tactical'];
  let currentIndex = 1; // Start with "Operational" (index 1)
  
  function rotateText() {
    // Fade out with slide up effect
    animatedText.classList.add('fade-out');
    animatedText.classList.remove('fade-in');
    
    setTimeout(() => {
      // Change text after fade out completes
      currentIndex = (currentIndex + 1) % words.length;
      animatedText.textContent = words[currentIndex];
      
      // Fade in with slide down effect
      animatedText.classList.remove('fade-out');
      animatedText.classList.add('fade-in');
      
      // Clean up fade-in class after animation
      setTimeout(() => {
        animatedText.classList.remove('fade-in');
      }, 800);
    }, 400); // Wait for fade out to complete (half of 0.8s transition)
  }
  
  // Start the rotation cycle
  setInterval(rotateText, 3500); // Change every 3.5 seconds to accommodate longer transition
}

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
  
  console.log('initDynamicHeaderColor called, header found:', !!header, 'navLinks count:', navLinks.length);
  
  if (!header) return;

  let currentMode = null;

  // Helper function to check if background is dark at specific coordinates
  function isDarkBackgroundAt(x, y, sectionContext) {
    if (!sectionContext) return false;
    
    const headerRect = header.getBoundingClientRect();
    const testArea = {
      top: headerRect.top,
      bottom: headerRect.bottom,
      left: x - 50, // 100px wide test area around the point
      right: x + 50
    };
    
    // Look for dark elements within this specific area
    const potentiallyDarkElements = sectionContext.querySelectorAll('*');
    
    for (const element of potentiallyDarkElements) {
      const rect = element.getBoundingClientRect();
      
      // Check if element intersects with this specific test area
      if (rect.top < testArea.bottom && rect.bottom > testArea.top &&
          rect.left < testArea.right && rect.right > testArea.left) {
        
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        // Dark detection
        if (bgColor && (
          bgColor.includes('rgb(0, 0, 0)') ||
          bgColor === 'black' ||
          element.classList.contains('solution') && 
          element.closest('.solution-industries-cards')
        )) {
          return true;
        }
      }
    }
    
    return false;
  }

  function updateHeaderColor() {
    const sections = document.querySelectorAll('main section[id]');
    const headerRect = header.getBoundingClientRect();
    const headerMiddle = headerRect.top + (headerRect.height / 2);
    
    // Find current section
    let currentSection = null;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerMiddle && rect.bottom > headerMiddle) {
        currentSection = section;
        break;
      }
    }
    
    // Define the three header areas
    const leftArea = headerRect.left + headerRect.width * 0.15; // Logo area
    const centerArea = headerRect.left + headerRect.width * 0.5; // Nav area  
    const rightArea = headerRect.left + headerRect.width * 0.85; // Contact area
    
    let leftIsDark = false;
    let centerIsDark = false; 
    let rightIsDark = false;
    
    if (currentSection) {
      const sectionId = currentSection.id;
      // Check each area independently
      leftIsDark = isDarkBackgroundAt(leftArea, headerMiddle, currentSection);
      centerIsDark = isDarkBackgroundAt(centerArea, headerMiddle, currentSection);
      rightIsDark = isDarkBackgroundAt(rightArea, headerMiddle, currentSection);
      
      // Fallback for known dark sections
      if (sectionId === 'teaser' || sectionId === 'platform') {
        leftIsDark = centerIsDark = rightIsDark = true;
      }
      
    } else {
      // Fallback for top of page
      const isTopOfPage = window.scrollY < 100;
      leftIsDark = centerIsDark = rightIsDark = isTopOfPage;
    }
    
    // Store current state for comparison
    const newState = { left: leftIsDark, center: centerIsDark, right: rightIsDark };
    const stateChanged = !currentMode || 
      currentMode.left !== leftIsDark || 
      currentMode.center !== centerIsDark || 
      currentMode.right !== rightIsDark;
    
    if (stateChanged) {
      currentMode = newState;
      
      // Update LEFT area (logo icon and text)
      const logoIcon = document.querySelector('.logo-icon');
      const logoText = document.querySelector('#name');
      
      if (leftIsDark) {
        // Dark background → White logo and text
        if (logoIcon) {
          logoIcon.classList.remove('logo-dark');
          logoIcon.classList.add('logo-white');
        }
        if (logoText) {
          logoText.style.color = 'rgba(255, 255, 255, 0.95)';
          logoText.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.5)';
        }
      } else {
        // Light background → Dark logo and text
        if (logoIcon) {
          logoIcon.classList.remove('logo-white');
          logoIcon.classList.add('logo-dark');
        }
        if (logoText) {
          logoText.style.color = 'rgba(37, 37, 37, 0.9)';
          logoText.style.textShadow = 'none';
        }
      }
      
      // Update CENTER area (navigation links, excluding logo text which is handled by left area)
      if (centerIsDark) {
        // Dark background → Light text
        navLinks.forEach(link => {
          if (link.id !== 'name') { // Skip logo text, handled by left area
            link.style.color = 'rgba(255, 255, 255, 0.95)';
            link.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.5)';
          }
        });
        
        if (mainNav && !mainNav.classList.contains('open')) {
          const mainNavLinks = mainNav.querySelectorAll('a');
          mainNavLinks.forEach(link => {
            link.style.color = 'rgba(255, 255, 255, 0.95)';
            link.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.5)';
          });
        }
        
        document.documentElement.style.setProperty('--nav-text-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
      } else {
        // Light background → Dark text
        navLinks.forEach(link => {
          if (link.id !== 'name') { // Skip logo text, handled by left area
            link.style.color = 'rgba(37, 37, 37, 0.9)';
            link.style.textShadow = 'none';
          }
        });
        
        if (mainNav && !mainNav.classList.contains('open')) {
          const mainNavLinks = mainNav.querySelectorAll('a');
          mainNavLinks.forEach(link => {
            link.style.color = 'rgba(37, 37, 37, 0.9)';
            link.style.textShadow = 'none';
          });
        }
        
        document.documentElement.style.setProperty('--nav-text-shadow', 'none');
      }
      
      // Update RIGHT area (contact button)
      const contactBtn = document.querySelector('.contact-btn');
      if (contactBtn) {
        if (rightIsDark) {
          contactBtn.style.borderColor = 'rgba(255, 255, 255, 0.95)';
          contactBtn.style.color = 'rgba(255, 255, 255, 0.95)';
        } else {
          contactBtn.style.borderColor = 'rgba(37, 37, 37, 0.9)';
          contactBtn.style.color = 'rgba(37, 37, 37, 0.9)';
        }
      }
      
      // Update mobile menu toggle based on left area (where it appears)
      document.documentElement.style.setProperty('--nav-toggle-bg', 
        leftIsDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(37, 37, 37, 0.9)');
      
      // Set header data attribute based on center area (main navigation)
      header.setAttribute('data-bg-mode', centerIsDark ? 'dark' : 'light');
    }
  }

  // Throttle scroll events with requestAnimationFrame for performance
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderColor();
        // Also update nav background if function exists
        if (window.updateNavBackground) {
          window.updateNavBackground();
        }
        // Update header positioning if function exists
        if (window.updateHeaderPosition) {
          window.updateHeaderPosition();
        }
        // Update teaser explore button visibility
        if (window.updateTeaserExplore) {
          window.updateTeaserExplore();
        }
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

/**
 * Handles nav background transition on scroll
 * Changes from solid black to glassmorphism effect
 */
function initNavScrollTransition() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  function updateNavBackground() {
    const scrollThreshold = 50; // Start transition after 50px scroll
    const scrollY = window.scrollY;
    
    if (scrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Also update border radius when scroll state changes
    if (window.updateBorderRadius) {
      window.updateBorderRadius();
    }
  }

  // Expose globally so it can be called by existing scroll handler
  window.updateNavBackground = updateNavBackground;
  
  // Initial call
  updateNavBackground();
}

/**
 * Handles header positioning on scroll
 * Gradually moves header closer to top of page as user scrolls down
 */
function initHeaderPositioning() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  if (!header || !nav) return;

  function updateHeaderPosition() {
    const scrollY = window.scrollY;
    const maxScroll = 150; // Distance to scroll before header reaches top (px)
    const initialMargin = 16; // Initial margin-top in px (--space-base)
    
    // Calculate the scroll progress (0 to 1)
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    const currentMargin = initialMargin * (1 - scrollProgress);
    
    // Device size detection
    const isVerySmallDevice = window.innerWidth < 600;
    const isMobile = window.innerWidth <= 800;
    const isTablet = window.innerWidth > 800 && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth >= 1025;
    
    if (isDesktop) {
      // Desktop only (1025px+): Apply scroll-based positioning
      header.style.marginTop = `${currentMargin}px`;
      
      // Update nav width - transition from 1400px to 100vw
      const initialWidth = 1400; // --nav-max-width value in px
      const currentWidthPx = initialWidth + (window.innerWidth - initialWidth) * scrollProgress;
      const useViewportWidth = scrollProgress > 0.8; // Switch to 100vw when close to top
      
      if (useViewportWidth) {
        nav.style.width = '100vw';
      } else {
        nav.style.width = `${currentWidthPx}px`;
      }
    } else {
      // Mobile/Tablet (<=1024px): force no margin, full width nav and remove any inline styles
      header.style.marginTop = '0px';
      header.style.top = '0px';
      header.style.margin = '0px';
      header.style.paddingTop = '0px';
      nav.style.width = '100vw';
      
      // Extra aggressive reset for very small devices (< 600px)
      if (isVerySmallDevice) {
        header.style.transform = 'translateY(0px) !important';
        header.style.position = 'fixed !important';
        header.style.left = '0px !important';
        header.style.right = '0px !important';
        header.style.width = '100vw !important';
        
        // Also reset the nav element specifically
        nav.style.marginTop = '0px !important';
        nav.style.paddingTop = '0px !important';
        nav.style.transform = 'translateY(0px) !important';
        
        console.log('Very small device detected - applying aggressive header reset');
      } else {
        header.style.transform = 'translateY(0px)';
        header.style.position = 'fixed';
      }
    }
  }

  // Expose globally so it can be called by existing scroll handler
  window.updateHeaderPosition = updateHeaderPosition;
  
  // Initial call
  updateHeaderPosition();
  
  // Force mobile/tablet styling immediately (<=1024px)
  if (window.innerWidth <= 1024) {
    header.style.marginTop = '0px';
    header.style.top = '0px';
    header.style.margin = '0px';
    header.style.paddingTop = '0px';
    header.style.transform = 'translateY(0px)';
    header.style.position = 'fixed';
    nav.style.width = '100vw';
    
    // Extra measures for very small devices
    if (window.innerWidth < 600) {
      header.style.left = '0px !important';
      header.style.right = '0px !important';
      header.style.width = '100vw !important';
      nav.style.marginTop = '0px !important';
      nav.style.paddingTop = '0px !important';
      nav.style.transform = 'translateY(0px) !important';
      
      console.log('Very small device detected on init:', window.innerWidth, 'px - applying aggressive fixes');
    }
    
    // Debug logging for small devices
    if (window.innerWidth <= 600) {
      console.log('Small device detected:', window.innerWidth, 'px');
      console.log('Header styles applied:', {
        marginTop: header.style.marginTop,
        top: header.style.top,
        margin: header.style.margin,
        position: header.style.position
      });
    }
  }
  
  // Also update on resize to handle desktop/mobile/tablet transitions
  window.addEventListener('resize', () => {
    updateHeaderPosition();
    // Additional mobile/tablet check on resize (<=1024px)
    if (window.innerWidth <= 1024) {
      header.style.marginTop = '0px';
      header.style.top = '0px';
      header.style.margin = '0px';
      header.style.paddingTop = '0px';
      header.style.transform = 'translateY(0px)';
      nav.style.width = '100vw';
      
      // Extra measures for very small devices on resize
      if (window.innerWidth < 600) {
        header.style.left = '0px !important';
        header.style.right = '0px !important';
        header.style.width = '100vw !important';
        nav.style.marginTop = '0px !important';
        nav.style.paddingTop = '0px !important';
        nav.style.transform = 'translateY(0px) !important';
        
        console.log('Resize: Very small device - applying aggressive fixes for', window.innerWidth, 'px');
      }
    }
  });
}

/**
 * Handles teaser explore button visibility on scroll
 * Fades out when user scrolls past the teaser section
 */
function initTeaserExplore() {
  const teaser = document.getElementById('teaser');
  if (!teaser) return;

  function updateTeaserExplore() {
    const teaserRect = teaser.getBoundingClientRect();
    const teaserBottom = teaserRect.bottom;
    
    // Add 'scrolled' class when teaser section scrolls out of view
    if (teaserBottom <= 0) {
      teaser.classList.add('scrolled');
    } else {
      teaser.classList.remove('scrolled');
    }
  }

  // Expose globally so it can be called by existing scroll handler
  window.updateTeaserExplore = updateTeaserExplore;
  
  // Initial call
  updateTeaserExplore();
}


document.addEventListener("DOMContentLoaded", () => {
  // Initialize text animation
  initTextAnimation();
  
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      mainNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
      
      // Reapply header colors after menu state changes
      if (updateHeaderColorGlobal) {
        setTimeout(updateHeaderColorGlobal, 10);
      }
    });
    mainNav.addEventListener("click", () => {
      navToggle.classList.remove("open");
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      mainNav.setAttribute("aria-hidden", "true");
      
      // Reapply header colors after menu closes
      if (updateHeaderColorGlobal) {
        setTimeout(updateHeaderColorGlobal, 10);
      }
    });
  }

  // Dynamic header text color - adjust based on what's scrolling behind the semi-transparent header
  initDynamicHeaderColor();
  
  // Initialize nav background transition on scroll
  initNavScrollTransition();
  
  // Initialize header positioning on scroll
  initHeaderPositioning();
  
  // Initialize teaser explore button
  initTeaserExplore();
  
  // Additional mobile/tablet header fix - run after everything is loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.innerWidth <= 1024) {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        if (header) {
          header.style.marginTop = '0px';
          header.style.top = '0px';
          header.style.margin = '0px';
          header.style.paddingTop = '0px';
          header.style.transform = 'translateY(0px)';
          header.style.position = 'fixed';
          
          // Special treatment for very small devices
          if (window.innerWidth < 600) {
            header.style.left = '0px !important';
            header.style.right = '0px !important';
            header.style.width = '100vw !important';
            if (nav) {
              nav.style.marginTop = '0px !important';
              nav.style.paddingTop = '0px !important';
              nav.style.transform = 'translateY(0px) !important';
            }
            console.log('Post-load: Very small device aggressive fix for', window.innerWidth, 'px');
          }
          
          console.log('Post-load mobile/tablet header fix applied for device width:', window.innerWidth);
        }
      }
    }, 100);
  });
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

/**
 * Updates the current date and time (Zulu/UTC) in the teaser section
 */
function updateDateTime() {
  const datetimeElement = document.getElementById('current-datetime');
  
  if (!datetimeElement) return;
  
  const now = new Date();
  
  // Format date: DD MMM YYYY
  const options = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' };
  const formattedDate = now.toLocaleDateString('en-US', options).toUpperCase();
  
  // Format time: HH:MM:SS ZULU
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds} ZULU`;
  
  // Combine date and time in one line
  datetimeElement.textContent = `${formattedDate} ${formattedTime}`;
}

// Initialize date/time and update every second
updateDateTime();
setInterval(updateDateTime, 1000);

/**
 * Rotate through sector names in the teaser subtitle
 */
function rotateSector() {
  const sectors = ['Energy', 'Industry', 'Defense', 'Manufacturing', 'Supply Chain', 'Logistics'];
  const sectorElement = document.getElementById('rotating-sector');
  
  if (!sectorElement) return;
  
  let currentIndex = 0;
  
  // Set initial sector
  sectorElement.textContent = sectors[currentIndex];
  
  // Rotate every 3 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % sectors.length;
    sectorElement.textContent = sectors[currentIndex];
  }, 3000);
}

// Initialize sector rotation
rotateSector();

/**
 * Handles header border-radius based on fullscreen state
 * Adds rounded corners when not in fullscreen mode
 */
function initHeaderBorderRadius() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  function updateBorderRadius() {
    // Check if document is in fullscreen mode
    const isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    // Check if on mobile device
    const isMobile = window.innerWidth <= 800;

    // Check if header is in scrolled state
    const isScrolled = nav.classList.contains('scrolled');

    if (isFullscreen || isMobile || isScrolled) {
      nav.style.borderRadius = '0';
    } else {
      nav.style.borderRadius = '2px';
    }
  }

  // Initial check
  updateBorderRadius();

  // Listen for fullscreen changes
  document.addEventListener('fullscreenchange', updateBorderRadius);
  document.addEventListener('webkitfullscreenchange', updateBorderRadius);
  document.addEventListener('mozfullscreenchange', updateBorderRadius);
  document.addEventListener('MSFullscreenChange', updateBorderRadius);

  // Listen for window resize (for mobile detection)
  window.addEventListener('resize', updateBorderRadius);

  // Expose updateBorderRadius globally so it can be called by other functions
  window.updateBorderRadius = updateBorderRadius;
}

// Initialize header border-radius handling
initHeaderBorderRadius();
