/**
 * OneWord: Native A2HS (Add to Home Screen) & PWA Lifecycle Manager (v0.8.0)
 * - Standalone display mode detection (iOS & Android)
 * - beforeinstallprompt event hook & deferred prompt handling
 * - Safari iOS Add-to-Home-Screen step-by-step visual guidance
 * - Real-time Network Status (Online / Offline) reactive pill
 * - Zero external library dependency (Pure Vanilla JS)
 */

export class InstallPromptManager {
  constructor(options = {}) {
    this.deferredPrompt = null;
    this.installed = this.isStandalone();
    this.isIosDevice = this.checkIos();
    this.currentLang = options.lang || "ko";

    // UI Element references (bound in init)
    this.installBtn = null;
    this.installModal = null;
    this.offlineBadge = null;
    this.installAndroidBox = null;
    this.installIosBox = null;

    this.onInstallStateChange = options.onInstallStateChange || null;
    this.onNetworkStateChange = options.onNetworkStateChange || null;
  }

  isStandalone() {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://")
    );
  }

  checkIos() {
    if (typeof window === "undefined" || !navigator.userAgent) return false;
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !window.MSStream;
  }

  init() {
    this.installBtn = document.getElementById("pwaInstallBtn");
    this.installModal = document.getElementById("installModal");
    this.offlineBadge = document.getElementById("offlineBadge");
    this.installAndroidBox = document.getElementById("installAndroidBox");
    this.installIosBox = document.getElementById("installIosBox");

    this.bindEvents();
    this.registerServiceWorker();
    this.updateNetworkStatus();
    this.renderButtonState();
  }

  bindEvents() {
    // 1. Android / Chrome / Edge BeforeInstallPrompt Hook
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installed = false;
      this.renderButtonState();
      if (this.onInstallStateChange) this.onInstallStateChange("prompt_available");
    });

    // 2. Successful App Installed Event
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
      this.installed = true;
      this.renderButtonState();
      this.closeModal();
      if (this.onInstallStateChange) this.onInstallStateChange("installed");
    });

    // 3. Online / Offline Network Transitions
    window.addEventListener("online", () => this.updateNetworkStatus());
    window.addEventListener("offline", () => this.updateNetworkStatus());

    // 4. Button Click Trigger
    if (this.installBtn) {
      this.installBtn.addEventListener("click", () => this.triggerInstallFlow());
    }

    // 5. Modal Close Buttons
    const closeBtn = document.getElementById("closeInstallModalBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
    const footerCloseBtn = document.getElementById("closeInstallModalFooterBtn");
    if (footerCloseBtn) {
      footerCloseBtn.addEventListener("click", () => this.closeModal());
    }
    const backdrop = document.getElementById("installModalBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeModal());
    }

    // 6. Direct Android Trigger button inside modal
    const directInstallBtn = document.getElementById("directInstallAndroidBtn");
    if (directInstallBtn) {
      directInstallBtn.addEventListener("click", () => this.executeNativePrompt());
    }
  }

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.register("./sw.js");
        console.log("[PWA] ServiceWorker registered with scope:", reg.scope);
      } catch (err) {
        console.warn("[PWA] ServiceWorker registration failed:", err);
      }
    }
  }

  updateNetworkStatus() {
    const isOnline = navigator.onLine;
    if (this.offlineBadge) {
      if (isOnline) {
        this.offlineBadge.classList.add("hidden");
      } else {
        this.offlineBadge.classList.remove("hidden");
      }
    }
    if (this.onNetworkStateChange) {
      this.onNetworkStateChange(isOnline);
    }
  }

  renderButtonState() {
    if (!this.installBtn) return;

    if (this.installed) {
      // Already running as standalone PWA
      this.installBtn.classList.add("hidden");
      return;
    }

    // Visible on both iOS Safari (via manual guide) and browsers supporting prompt
    this.installBtn.classList.remove("hidden");
  }

  triggerInstallFlow() {
    // If native prompt is ready (Android/Chrome/Edge), execute immediately or show modal
    if (this.deferredPrompt) {
      this.executeNativePrompt();
    } else {
      // Fallback or iOS Safari: Open informative modal with step-by-step guide
      this.openModal();
    }
  }

  async executeNativePrompt() {
    if (!this.deferredPrompt) {
      this.openModal();
      return;
    }

    const promptEvent = this.deferredPrompt;
    this.deferredPrompt = null;
    promptEvent.prompt();

    const choiceResult = await promptEvent.userChoice;
    if (choiceResult.outcome === "accepted") {
      this.installed = true;
      this.renderButtonState();
      this.closeModal();
    }
  }

  openModal() {
    if (!this.installModal) return;

    // Toggle iOS specific vs Generic/Android box
    if (this.isIosDevice) {
      if (this.installIosBox) this.installIosBox.classList.remove("hidden");
      if (this.installAndroidBox) this.installAndroidBox.classList.add("hidden");
    } else {
      if (this.installIosBox) this.installIosBox.classList.add("hidden");
      if (this.installAndroidBox) this.installAndroidBox.classList.remove("hidden");
    }

    this.installModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  closeModal() {
    if (!this.installModal) return;
    this.installModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  setLanguage(lang, translations) {
    this.currentLang = lang;
    if (!translations || !translations[lang]) return;
    const t = translations[lang];

    const label = document.getElementById("pwaInstallLabel");
    if (label && t.pwa_install_btn) label.innerText = t.pwa_install_btn;

    const offlineBadge = document.getElementById("offlineBadge");
    if (offlineBadge && t.pwa_offline_badge) offlineBadge.innerText = t.pwa_offline_badge;

    const pwaModalTitle = document.getElementById("pwaModalTitle");
    if (pwaModalTitle && t.pwa_modal_title) pwaModalTitle.innerHTML = `<span>${t.pwa_modal_title}</span>`;

    const pwaModalDesc = document.getElementById("pwaModalDesc");
    if (pwaModalDesc && t.pwa_modal_desc) pwaModalDesc.innerText = t.pwa_modal_desc;

    const pwaIosTitle = document.getElementById("pwaIosTitle");
    if (pwaIosTitle && t.pwa_ios_title) pwaIosTitle.innerHTML = `<span>${t.pwa_ios_title}</span>`;

    const pwaIosStep1 = document.getElementById("pwaIosStep1");
    if (pwaIosStep1 && t.pwa_ios_step1) pwaIosStep1.innerHTML = t.pwa_ios_step1;

    const pwaIosStep2 = document.getElementById("pwaIosStep2");
    if (pwaIosStep2 && t.pwa_ios_step2) pwaIosStep2.innerHTML = t.pwa_ios_step2;

    const pwaIosStep3 = document.getElementById("pwaIosStep3");
    if (pwaIosStep3 && t.pwa_ios_step3) pwaIosStep3.innerHTML = t.pwa_ios_step3;

    const pwaAndroidTitle = document.getElementById("pwaAndroidTitle");
    if (pwaAndroidTitle && t.pwa_android_title) pwaAndroidTitle.innerHTML = `<span>${t.pwa_android_title}</span>`;

    const pwaAndroidDesc = document.getElementById("pwaAndroidDesc");
    if (pwaAndroidDesc && t.pwa_android_desc) pwaAndroidDesc.innerText = t.pwa_android_desc;

    const pwaAndroidBtnText = document.getElementById("pwaAndroidBtnText");
    if (pwaAndroidBtnText && t.pwa_android_btn) pwaAndroidBtnText.innerText = t.pwa_android_btn;

    const pwaModalCloseText = document.getElementById("pwaModalCloseText");
    if (pwaModalCloseText && t.pwa_modal_close) pwaModalCloseText.innerText = t.pwa_modal_close;
  }
}
