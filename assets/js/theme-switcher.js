(function () {
  const button = document.getElementById("theme-mode-button");
  const currentLabel = document.getElementById("theme-mode-current");
  const menu = document.getElementById("theme-mode-menu");
  const options = Array.from(document.querySelectorAll(".theme-mode-option"));
  const modal = document.getElementById("party-warning-modal");
  const modalAccept = document.getElementById("party-warning-accept");
  const modalCancel = document.getElementById("party-warning-cancel");

  if (!button || !menu || !currentLabel || options.length === 0) {
    return;
  }

  const MODE_KEY = "site-theme-mode";
  const PARTY_ACK_KEY = "party-mode-warning-accepted";
  const MODES = ["light", "dark", "party"];
  const DEFAULT_MODE = "light";

  const isValidMode = (mode) => MODES.includes(mode);

  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  const getInitialMode = () => {
    const storedMode = localStorage.getItem(MODE_KEY);
    if (isValidMode(storedMode)) {
      return storedMode;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return DEFAULT_MODE;
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  };

  const applyMode = (mode) => {
    document.documentElement.setAttribute("data-theme", mode);
    document.body.classList.toggle("party-mode", mode === "party");
    localStorage.setItem(MODE_KEY, mode);
    currentLabel.textContent = capitalize(mode);

    options.forEach((option) => {
      const selected = option.dataset.mode === mode;
      option.classList.toggle("is-active", selected);
      option.setAttribute("aria-selected", selected ? "true" : "false");
    });
  };

  const requestPartyConfirmation = () => {
    if (!modal || !modalAccept || !modalCancel) {
      return Promise.resolve(
        window.confirm(
          "⚠️ EPILEPSY WARNING\n\nParty Mode uses animated, color-cycling visual effects that may trigger seizures for people with photosensitive epilepsy.\n\nOnly continue if you understand this risk and want to enable Party Mode."
        )
      );
    }

    modal.hidden = false;
    modalAccept.focus();

    return new Promise((resolve) => {
      const cleanup = () => {
        modal.hidden = true;
        modalAccept.removeEventListener("click", onAccept);
        modalCancel.removeEventListener("click", onCancel);
        modal.removeEventListener("click", onBackdropClick);
        document.removeEventListener("keydown", onKeydown);
      };

      const onAccept = () => {
        cleanup();
        resolve(true);
      };

      const onCancel = () => {
        cleanup();
        resolve(false);
      };

      const onBackdropClick = (event) => {
        if (event.target === modal) {
          onCancel();
        }
      };

      const onKeydown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      };

      modalAccept.addEventListener("click", onAccept);
      modalCancel.addEventListener("click", onCancel);
      modal.addEventListener("click", onBackdropClick);
      document.addEventListener("keydown", onKeydown);
    });
  };

  let activeMode = getInitialMode();
  applyMode(activeMode);

  button.addEventListener("click", function () {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", async function () {
      const nextMode = option.dataset.mode;
      if (!isValidMode(nextMode)) {
        return;
      }

      if (nextMode === "party") {
        const warningAccepted = localStorage.getItem(PARTY_ACK_KEY) === "yes";

        if (!warningAccepted) {
          closeMenu();
          const accepted = await requestPartyConfirmation();

          if (!accepted) {
            button.focus();
            return;
          }

          localStorage.setItem(PARTY_ACK_KEY, "yes");
        }
      }

      activeMode = nextMode;
      applyMode(activeMode);
      closeMenu();
    });
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && !button.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();