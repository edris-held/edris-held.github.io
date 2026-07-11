// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Gentle reveal-on-scroll for elements marked .reveal
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  // Countdown to the firework
  var countdownEl = document.querySelector(".countdown");
  if (countdownEl) {
    var target = new Date(countdownEl.getAttribute("data-countdown")).getTime();
    var grid = countdownEl.querySelector(".countdown-grid");
    var message = countdownEl.querySelector(".countdown-message");
    var valueEls = {
      days: countdownEl.querySelector('[data-unit="days"]'),
      hours: countdownEl.querySelector('[data-unit="hours"]'),
      minutes: countdownEl.querySelector('[data-unit="minutes"]'),
      seconds: countdownEl.querySelector('[data-unit="seconds"]')
    };
    var pad = function (n) {
      return String(n).padStart(2, "0");
    };

    var tick = function () {
      var diff = target - Date.now();

      // Still counting down
      if (diff > 0) {
        var days = Math.floor(diff / 86400000);
        var hours = Math.floor((diff % 86400000) / 3600000);
        var minutes = Math.floor((diff % 3600000) / 60000);
        var seconds = Math.floor((diff % 60000) / 1000);
        valueEls.days.textContent = pad(days);
        valueEls.hours.textContent = pad(hours);
        valueEls.minutes.textContent = pad(minutes);
        valueEls.seconds.textContent = pad(seconds);
        return;
      }

      // Within the display window (event day, up to ~6h after start): show a live message
      if (diff > -6 * 3600000) {
        grid.hidden = true;
        message.hidden = false;
        message.textContent = "Es ist soweit — das Feuerwerk läuft gerade!";
        return;
      }

      // Well past the event: stop updating
      grid.hidden = true;
      message.hidden = false;
      message.textContent = "Bis zum nächsten Mal!";
      clearInterval(intervalId);
    };

    tick();
    var intervalId = setInterval(tick, 1000);
  }

  // Map consent gate — nothing is requested from Google until the visitor clicks
  document.querySelectorAll("[data-map-consent]").forEach(function (box) {
    var btn = box.querySelector(".map-consent-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-map-embed-src");
      if (!src) return;
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.title = "Google Maps – Anfahrt";
      iframe.allowFullscreen = true;
      box.innerHTML = "";
      box.appendChild(iframe);
      box.classList.add("is-loaded");
    });
  });
});
