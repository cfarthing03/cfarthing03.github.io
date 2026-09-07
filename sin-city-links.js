/* =========================================================
   SINNERS — SIN PROFILE CITY LINK ENHANCER
   Drop this file at /sin-city-links.js and load it on Sin deity pages.
   It links:
     1) Major City in "At a Glance"
     2) the city's existing lore-section heading
     3) a small "Explore [City]" link at the bottom of that section
   ========================================================= */
(() => {
  const cityBySin = {
    pride:     { city: "Oro",        href: "/oro.html" },
    greed:     { city: "Hilnem",     href: "/hilnem.html" },
    lust:      { city: "Rushinghan", href: "/rushinghan.html" },
    envy:      { city: "Etro",       href: "/etro.html" },
    gluttony:  { city: "Hus",        href: "/hus.html" },
    wrath:     { city: "Palin",      href: "/palin.html" },
    sloth:     { city: "Sol",        href: "/sol.html" }
  };

  const body = document.body;
  if (!body) return;

  const sin = Object.keys(cityBySin).find(name =>
    body.classList.contains(`deity-${name}`)
  );
  if (!sin) return;

  const { city, href } = cityBySin[sin];
  const norm = s => (s || "").replace(/\s+/g, " ").trim().toLowerCase();
  const cityNorm = city.toLowerCase();

  // Link "Major City" in At a Glance.
  document.querySelectorAll(".deity-facts .fact").forEach(fact => {
    const label = fact.querySelector(".fact-label");
    const value = fact.querySelector(".fact-value");
    if (!label || !value) return;

    if (norm(label.textContent) === "major city" &&
        !value.querySelector("a") &&
        norm(value.textContent).includes(cityNorm)) {
      const text = value.textContent.trim();
      value.innerHTML = "";
      const a = document.createElement("a");
      a.href = href;
      a.textContent = text;
      a.className = "sin-city-inline-link";
      value.appendChild(a);
    }
  });

  // Find the city's existing article section.
  let citySection = null;
  document.querySelectorAll(".deity-article section").forEach(section => {
    if (citySection) return;
    const h2 = section.querySelector("h2");
    if (!h2) return;

    const heading = norm(h2.textContent);
    if (heading === cityNorm ||
        heading.startsWith(cityNorm + ",") ||
        heading.startsWith(cityNorm + " ") ||
        heading.includes(cityNorm + " and ")) {
      citySection = section;
    }
  });

  if (citySection) {
    citySection.classList.add("sin-city-related-section");

    const h2 = citySection.querySelector("h2");
    if (h2 && !h2.querySelector("a")) {
      const original = h2.innerHTML;
      const a = document.createElement("a");
      a.href = href;
      a.className = "sin-city-heading-link";
      a.innerHTML = original;
      h2.innerHTML = "";
      h2.appendChild(a);
    }

    if (!citySection.querySelector(".sin-city-explore-link")) {
      const explore = document.createElement("a");
      explore.href = href;
      explore.className = "sin-city-explore-link";
      explore.textContent = `Explore ${city} →`;
      citySection.appendChild(explore);
    }
  }

  // Small styling layer, intentionally neutral so it inherits each Sin's page palette.
  if (!document.getElementById("sin-city-link-styles")) {
    const style = document.createElement("style");
    style.id = "sin-city-link-styles";
    style.textContent = `
      .sin-city-inline-link,
      .sin-city-heading-link {
        color: inherit;
        text-decoration-color: currentColor;
        text-decoration-thickness: 1px;
        text-underline-offset: .16em;
      }
      .sin-city-heading-link {
        text-decoration: none;
      }
      .sin-city-heading-link:hover,
      .sin-city-inline-link:hover {
        text-decoration: underline;
      }
      .sin-city-related-section {
        transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease;
      }
      .sin-city-related-section:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 28px rgba(0,0,0,.12);
      }
      .sin-city-explore-link {
        display: inline-block;
        margin-top: .65rem;
        font-size: .86rem;
        letter-spacing: .035em;
        text-decoration: none;
        border-bottom: 1px solid currentColor;
        padding-bottom: .12rem;
        opacity: .82;
      }
      .sin-city-explore-link:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
})();
