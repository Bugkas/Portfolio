// darkmode.js
// Toggle dark mode by adding/removing the `dark` class on documentElement

(function () {
    const STORAGE_KEY = 'darkMode';
    const TOGGLE_SELECTOR = '.dark-mode-toggle';

    // Apply theme immediately
    function applyTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        // Update toggle buttons' aria-pressed state and icon
        document.querySelectorAll(TOGGLE_SELECTOR).forEach(btn => {
            btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            btn.textContent = isDark ? '☀️' : '🌙';
        });
    }

    // Persist preference
    function savePreference(isDark) {
        try {
            localStorage.setItem(STORAGE_KEY, isDark ? '1' : '0');
        } catch (e) {
            // ignore storage errors
        }
    }

    // Read saved preference or system preference
    function loadPreference() {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            if (v === '1') return true;
            if (v === '0') return false;
        } catch (e) {
            // ignore
        }
        // fallback to system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Toggle handler
    function toggleHandler(e) {
        const isDark = document.documentElement.classList.contains('dark');
        const next = !isDark;
        applyTheme(next);
        savePreference(next);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        // Apply initial theme
        const initial = loadPreference();
        applyTheme(initial);

        // Hook up toggle buttons
        document.querySelectorAll(TOGGLE_SELECTOR).forEach(btn => {
            btn.addEventListener('click', toggleHandler);
            // ensure button reflects current state
            btn.setAttribute('aria-pressed', initial ? 'true' : 'false');
            btn.textContent = initial ? '☀️' : '🌙';
        });
    });
})();
