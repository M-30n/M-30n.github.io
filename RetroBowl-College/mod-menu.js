
(function () {
    if (window.collegeModMenuLoaded) return;
    window.collegeModMenuLoaded = true;

    const SETTINGS_KEY = "moose_college_gameplay_mods";

    const mods = {
        noFumbles: false
    };

    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
        mods.noFumbles = !!saved.noFumbles;
    } catch (e) {}

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(mods));
    }

    let hookInstalled = false;
    let originalDropBall = null;

    function installHooks() {
        if (hookInstalled) return;

        if (typeof window._W31 !== "function") return;

        originalDropBall = window._W31;

        window._W31 = function () {
            if (mods.noFumbles) return;
            return originalDropBall.apply(this, arguments);
        };

        hookInstalled = true;
        window._W31.__collegeHooked = true;
        updateStatus();
    }

    function updateStatus() {
        const status = document.getElementById("college-hook-status");
        if (!status) return;

        status.textContent = hookInstalled
            ? "Gameplay hook detected"
            : "Waiting for game functions...";
    }

    const style = document.createElement("style");
    style.textContent = `
        #college-mod-open {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 10000;
            padding: 12px 14px;
            color: white;
            background: #1a4fd6;
            border: 3px solid white;
            border-radius: 6px;
            font: 11px monospace;
            cursor: pointer;
        }

        #college-mod-panel {
            display: none;
            position: fixed;
            top: 12px;
            right: 12px;
            bottom: 12px;
            width: 360px;
            max-width: calc(100vw - 24px);
            z-index: 10001;
            box-sizing: border-box;
            padding: 18px;
            overflow-y: auto;
            color: white;
            background: #1a4fd6;
            border: 3px solid white;
            border-radius: 10px;
            font: 12px monospace;
        }

        #college-mod-panel.open {
            display: block;
        }

        .college-mod-section {
            margin-top: 18px;
            padding: 12px;
            border: 2px solid rgba(255,255,255,.4);
        }

        .college-mod-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 14px;
        }

        .college-mod-toggle input {
            width: 20px;
            height: 20px;
        }

        #college-mod-panel button {
            padding: 9px;
            color: white;
            background: #163db0;
            border: 2px solid white;
            cursor: pointer;
            font: inherit;
        }
    `;

    document.head.appendChild(style);

    const open = document.createElement("button");
    open.id = "college-mod-open";
    open.textContent = "MOD MENU";

    const panel = document.createElement("div");
    panel.id = "college-mod-panel";

    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>COLLEGE MOD MENU</strong>
            <button id="college-mod-close">X</button>
        </div>

        <div class="college-mod-section">
            <strong>GAMEPLAY CHEATS</strong>

            <label class="college-mod-toggle">
                <span>No Fumbles</span>
                <input type="checkbox" id="college-no-fumbles">
            </label>

            <p id="college-hook-status">
                Checking game functions...
            </p>
        </div>

        <div class="college-mod-section">
            <strong>COMING NEXT</strong>
            <p>No Injuries</p>
            <p>Freeze Clock</p>
            <p>Unlimited Downs</p>
            <p>Infinite Stamina</p>
        </div>

        <div class="college-mod-section">
            <strong>COLLEGE FEATURES</strong>
            <p>Scholarship editor</p>
            <p>Player GPA editor</p>
            <p>Roster editor</p>
        </div>
    `;

    document.body.appendChild(open);
    document.body.appendChild(panel);

    const toggle = panel.querySelector("#college-no-fumbles");
    toggle.checked = mods.noFumbles;

    toggle.addEventListener("change", function () {
        mods.noFumbles = toggle.checked;
        saveSettings();
    });

    open.onclick = () => panel.classList.add("open");

    panel.querySelector("#college-mod-close").onclick = () => {
        panel.classList.remove("open");
    };

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            panel.classList.remove("open");
        }
    });

    installHooks();

    const hookTimer = setInterval(function () {
        installHooks();
        updateStatus();

        if (hookInstalled) {
            clearInterval(hookTimer);
        }
    }, 500);

})();
