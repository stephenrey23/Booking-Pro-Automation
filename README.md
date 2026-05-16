# Booking.com Advanced Hybrid Automation Project

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg)](https://github.com/features/actions)
[![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📌 Project Overview
This repository contains an advanced automation suite built using **Cypress** and **JavaScript** that targets the "Happy Path" checkout flow of **Booking.com**. 

### ⚠️ Architecture Note: Hybrid Testing Approach
Automating against live third-party production applications presents severe limitations due to Web Application Firewalls (WAF) and aggressive anti-bot triggers. To build a reliable and non-flaky pipeline without having access to a dedicated corporate **Staging environment**, this project deliberately implements a **Hybrid Service Virtualization approach**. 

The suite interacts with the live site for initial navigation and search, but strategically transitions into an isolated, mocked UI component layer during the checkout phase to ensure a 100% deterministic build in CI/CD.

---

## 🚀 Key Features & Engineering Solutions

### 1. Environment Isolation via Service Virtualization
High-traffic public platforms restrict automated tools during sensitive data input stages (checkout/payment). To handle this infrastructure blocker, the framework shifts from a standard E2E to a mock-driven approach:
* **Network Interception:** Uses `cy.intercept()` to capture and halt outbound GraphQL and POST network requests at the checkout boundary.
* **Component Simulation:** Injects a controlled, lightweight HTML structure directly into the browser DOM to simulate the checkout fields (`#firstname`, `#lastname`, `#email`).
* **State Transition Triggering:** Leverages native JavaScript binding (`onclick` event handlers) within the injected components to programmatically trigger client-side UI mutations and verify success states instantly.

### 2. Live UI Interactivity & Dynamic Dates
Before entering the virtualized checkout state, the script interacts with live components using robust scripting practices:
* **Dynamic Date Calculation:** Features a custom utility (**`cy.selectDynamicDates()`**) that programmatically computes check-in and check-out targets relative to the execution timestamp (T + 7 and T + 10 days), eliminating hardcoded calendar expirations.
* **Asynchronous Pop-up Cleansing:** Incorporates conditional handling hooks to dismiss third-party overlays, cookie banners, and login prompts that appear asynchronously without halting the main test execution thread.

---

## 🛠️ Tech Stack
* **Core Framework:** Cypress (v13+)
* **Language:** JavaScript (ES6+)
* **CI/CD Pipeline:** GitHub Actions
* **Design Pattern:** Command-Driven Architecture / Centralized Element Mapping

---

## 📂 Project Structure
```text
├── cypress/
│   ├── e2e/
│   │   └── booking_final.cy.js    # Hybrid Automation Flow (Live Search + Mocked Checkout)
│   ├── fixtures/
│   │   └── autocomplete-ny.json   # Simulated Geo-Location payload
│   └── support/
│       ├── commands.js            # Intercept wrappers, injection logic, and hooks
│       ├── selectors.js           # Centralized element locator dictionary
│       └── e2e.js                 # Global configuration configuration
├── .github/workflows/
│   └── main.yml                   # GitHub Actions pipeline configuration
└── package.json
