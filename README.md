# Booking.com Advanced E2E Automation Project

[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg)](https://github.com/features/actions)
[![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📌 Project Overview
This repository contains a high-level, production-ready End-to-End (E2E) automation suite for **Booking.com**, built using **Cypress** and **JavaScript**. 

The main objective of this project is to demonstrate advanced QA engineering principles, specifically focusing on **Service Virtualization (Mocking)**, handling highly dynamic web elements, and building deterministic pipelines that run flawlessly under Continuous Integration (CI) environments.

---

## 🚀 Key Features & Engineering Challenges

### 1. Anti-Bot Bypass & Humanized Navigation
High-traffic platforms like Booking.com employ aggressive anti-bot and Web Application Firewalls (WAF). To address this, the framework implements a custom user simulation layer:
* **`cy.humanizedVisit()`**: Disables `navigator.webdriver` flags and injects realistic user-agent structures before loading the window.
* **Intrusive Element Cleansing**: Asynchronous interceptors that programmatically detect and dismiss unexpected modales, generic pop-ups, and cookies without breaking the main execution thread.

### 2. Service Virtualization & Mocking Architecture
To guarantee a **100% deterministic test execution** and avoid flakiness caused by third-party network instability or rate-limiting, the project implements strict network intercept layers:
* **Dynamic HTML Injection**: The checkout flow relies on `cy.intercept()` to bypass broken or unpredictable staging states by injecting dynamic, ultra-fast, and reactive HTML components directly into the browser.
* **State Mutation Simulation**: Leverages JavaScript bindings (`onclick` event triggers) inside the mock layers to instantly simulate client-side state transitions (e.g., changing page status headers programmatically).

### 3. Dynamic Date Manipulation
Hardcoded dates cause automation pipelines to expire. This framework features a dynamic date calculator wrapper (**`cy.selectDynamicDates()`**) that programmatically computes checkout targets relative to the execution timestamp ($T + 7$ and $T + 10$ days).

---

## 🛠️ Tech Stack
* **Core Framework:** Cypress (v13+)
* **Language:** JavaScript (ES6+)
* **CI/CD Pipeline:** GitHub Actions
* **Design Pattern:** Customized App Actions / Command-Driven Architecture

---

## 📂 Project Structure
```text
├── cypress/
│   ├── e2e/
│   │   └── booking_final.cy.js    # Main End-to-End Test (Happy Path Flow)
│   ├── fixtures/
│   │   └── autocomplete-ny.json   # Simulated Geo-Location payload
│   └── support/
│       ├── commands.js            # Custom architecture, hooks, and intercept wrappers
│       ├── selectors.js           # Centralized locator dictionary
│       └── e2e.js                 # Global configuration configuration
├── .github/workflows/
│   └── main.yml                   # CI/CD Workflow configuration for automated regression
└── package.json
