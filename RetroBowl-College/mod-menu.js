
(function () {
    if (window.collegeModMenuLoaded) return;
    window.collegeModMenuLoaded = true;

    const SETTINGS_KEY = "moose_college_gameplay_mods";

    const mods = {
        noFumbles: false,
        noInjuries: false
    };

    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
        mods.noFumbles = !!saved.noFumbles;
        mods.noInjuries = !!saved.noInjuries;
    } catch (e) {}

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(mods));
        } catch (e) {}
    }

    const hooks = {
        noFumbles: false,
        noInjuries: false
    };

    function installHooks() {
        // NO FUMBLES
        // College uses gml_Script_s_drop_ball.
        if (
            !hooks.noFumbles &&
            typeof window.gml_Script_s_drop_ball === "function"
        ) {
            const original = window.gml_Script_s_drop_ball;

            if (!original.__collegeModHook) {
                const replacement = function () {
                    const isFumble = Boolean(arguments[2]);

                    if (mods.noFumbles && isFumble) {
                        return;
                    }

                    return original.apply(this, arguments);
                };

                replacement.__collegeModHook = true;
                window.gml_Script_s_drop_ball = replacement;
                hooks.noFumbles = true;
            }
        }

        // NO INJURIES
        // Returning false prevents the injury check from creating an injury.
        if (
            !hooks.noInjuries &&
            typeof window.gml_Script_s_check_for_injury === "function"
        ) {
            const original = window.gml_Script_s_check_for_injury;

            if (!original.__collegeModHook) {
                const replacement = function () {
                    if (mods.noInjuries) {
                        return false;
                    }

                    return original.apply(this, arguments);
                };

                replacement.__collegeModHook = true;
                window.gml_Script_s_check_for_injury = replacement;
                hooks.noInjuries = true;
            }
        }

        updateStatus();
    }

    function updateStatus() {
        const status = document.getElementById("college-hook-status");
        if (!status) return;

        const fumbles = hooks.noFumbles ? "Connected" : "Waiting...";
        const injuries = hooks.noInjuries ? "Connected" : "Waiting...";

        status.textContent =
            "No Fumbles Hook: " + fumbles +
            "\nNo Injuries Hook: " + injuries;
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
            cursor: pointer;
        }

        #college-mod-panel button {
            padding: 9px;
            color: white;
            background: #163db0;
            border: 2px solid white;
            cursor: pointer;
            font: inherit;
        }

        #college-hook-status {
            white-space: pre-line;
            line-height: 1.8;
            opacity: .9;
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

            <label class="college-mod-toggle">
                <span>No Injuries</span>
                <input type="checkbox" id="college-no-injuries">
            </label>

            <p id="college-hook-status">
                Checking game functions...
            </p>
        </div>

        <div class="college-mod-section">
            <strong>COMING NEXT</strong>
            <p>Freeze Clock</p>
            <p>Unlimited Downs</p>
            <p>Infinite Stamina</p>
            <p>Player Speed Multiplier</p>
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

    const fumbleToggle = panel.querySelector("#college-no-fumbles");
    const injuryToggle = panel.querySelector("#college-no-injuries");

    fumbleToggle.checked = mods.noFumbles;
    injuryToggle.checked = mods.noInjuries;

    fumbleToggle.addEventListener("change", function () {
        mods.noFumbles = fumbleToggle.checked;
        saveSettings();
    });

    injuryToggle.addEventListener("change", function () {
        mods.noInjuries = injuryToggle.checked;
        saveSettings();
    });

    open.onclick = function () {
        panel.classList.add("open");
    };

    panel.querySelector("#college-mod-close").onclick = function () {
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

        if (hooks.noFumbles && hooks.noInjuries) {
            clearInterval(hookTimer);
        }
    }, 500);

})();
