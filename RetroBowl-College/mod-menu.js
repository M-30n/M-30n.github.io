(function () {
    if (window.collegeModMenuLoaded) return;
    window.collegeModMenuLoaded = true;

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
            font: 11px monospace;
        }

        #college-mod-panel.open {
            display: block;
        }

        #college-mod-panel button {
            padding: 10px;
            color: white;
            background: #163db0;
            border: 2px solid white;
            cursor: pointer;
            font: inherit;
        }

        .college-mod-section {
            margin-top: 18px;
            padding: 12px;
            border: 2px solid rgba(255,255,255,.4);
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
            <p>Gameplay options will be added after testing.</p>
        </div>

        <div class="college-mod-section">
            <strong>PLAYER CHEATS</strong>
            <p>Player options will be added after testing.</p>
        </div>

        <div class="college-mod-section">
            <strong>GAME UTILITIES</strong>
            <p>Game utilities will be added after testing.</p>
        </div>

        <div class="college-mod-section">
            <strong>SAVE EDITOR</strong>
            <p>College save editing will be added after testing.</p>
        </div>
    `;

    document.body.appendChild(open);
    document.body.appendChild(panel);

    open.onclick = () => panel.classList.add("open");

    panel.querySelector("#college-mod-close").onclick = () => {
        panel.classList.remove("open");
    };

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            panel.classList.remove("open");
        }
    });
})();
