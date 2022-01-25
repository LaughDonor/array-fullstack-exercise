class ArrayCreditLock extends HTMLElement {
  #historyTemplate;

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <section class="theme-brigit">
        <div class="credit-freeze-center">
          <link rel="stylesheet" href="//cdn-web-assets.array.io/webcom-creditlock-1b/credit-freeze-center.dfca0446987a4417d634c2d9d8ed4546.css">
          <link rel="stylesheet" href="//cdn-web-assets.array.io/brigit/brigit-creditlock-1b/credit-freeze-center.b2d872a91d97968b7a453c107a92899c.css">
          ${this.#createCSS().outerHTML}
          <div class="center-block active">
            <div class="logo">
              <slot name="creditlogo"></slot>
            </div>
            <div class="middle-panel" data-template-id="lockedPanel">
              <div class="unlock-btn" data-template-id="unlockButton" data-array-ref="toggleLockStatus">
                <span class="locked">Locked</span>
                <div class="white-area">
                  ${this.#createLockSVG().outerHTML}
                </div>
              </div>
              <p class="transunion-file">Your TransUnion File is Locked</p>
              <p class="lock-text">Unlock your score to open new accounts under your name</p>
            </div>
            <details>
              <summary class="history-title"> lock history</summary>
              <output id="history"></output>
              <details>
                <summary class="show-all"></summary>
              </details>
            </details>
          </div>
        </div>
      </section>
      <template id="history-template">
        <li class="history-list">
          <time></time>
          <data></data>
        </li>
      </template>
    `;
    // Cache this template for quick access for cloning
    this.#historyTemplate = shadow.getElementById("history-template").content;

    // Fetch data source and populate history
    const srcUrl = this.getAttribute('src');
    if (srcUrl) {
      fetch(srcUrl)
        .then(res => res.json())
        .then(this.#populateHistory.bind(this))
        .catch(err => console.error(err));
    }
  }

  #SVG_TAGS = ["svg", "g", "path"];

  // Alternate method to dynamically create/add tags
  #htmlFragment(tag, props = []) {
    const el = this.#SVG_TAGS.includes(tag) ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    for (const [attr, value] of props) {
      // Special actions based on property "type"
      if (attr === "children") {
        for (const [childTag, childAttr] of value) {
          el.appendChild(childAttr instanceof Node ? childAttr : this.#htmlFragment(childTag, childAttr));
        }
      } else if (attr === "text") {
        el.appendChild(document.createTextNode(value));
      } else {
        el.setAttribute(attr, value);
      }
    }
    return el;
  }

  #createCSS() {
    return this.#htmlFragment("style", new Map([
      ["text", `
        .history-title, .history-title ~ details > summary {
          list-style: none;
          user-select: none;
        }
        .history-title:before {
          content: 'Show';
        }
        [open] > .history-title:before {
          content: 'Hide';
        }
        #history ~ * > .show-all:empty:after {
          content: "No Data Available!"
        }
      `],
    ]));
  }

  #createLockSVG() {
    return this.#htmlFragment("svg", new Map([
      ["viewBox", "0 0 15 19"],
      ["width", "15"],
      ["height", "19"],
      ["children", new Map([
        ["g", new Map([
          ["stroke", "none"],
          ["stroke-width", "1"],
          ["fill", "none"],
          ["fill-rule", "evenodd"],
          ["children", new Map([
            ["g", new Map([
              ["transform", "translate(-379.000000, -337.000000)"],
              ["fill", "#00D2A0"],
              ["children", new Map([
                ["g", new Map([
                  ["transform", "translate(167.000000, 190.000000)"],
                  ["children", new Map([
                    ["g", new Map([
                      ["transform", "translate(108.000000, 136.000000)"],
                      ["children", new Map([
                        ["path", new Map([
                          ["d", "M116.5,17.4431818 L115.625,17.4431818 L115.625,15.7840909 C115.625,13.3690909 113.665,11.4090909 111.25,11.4090909 C108.835,11.4090909 106.875,13.3690909 106.875,15.7840909 L106.875,17.4431818 L106,17.4431818 C105.0375,17.4431818 104.25,18.2306818 104.25,19.1931818 L104.25,27.9431818 C104.25,28.9056818 105.0375,29.6931818 106,29.6931818 L116.5,29.6931818 C117.4625,29.6931818 118.25,28.9056818 118.25,27.9431818 L118.25,19.1931818 C118.25,18.2306818 117.4625,17.4431818 116.5,17.4431818 Z M111.25,25.3181818 C110.2875,25.3181818 109.5,24.5306818 109.5,23.5681818 C109.5,22.6056818 110.2875,21.8181818 111.25,21.8181818 C112.2125,21.8181818 113,22.6056818 113,23.5681818 C113,24.5306818 112.2125,25.3181818 111.25,25.3181818 Z M113.9625,17.4431818 L108.5375,17.4431818 L108.5375,15.7840909 C108.5375,14.2878409 109.75375,13.0715909 111.25,13.0715909 C112.74625,13.0715909 113.9625,14.2878409 113.9625,15.7840909 L113.9625,17.4431818 Z"],
                        ])],
                      ])],
                    ])],
                  ])],
                ])],
              ])],
            ])],
          ])],
        ])],
      ])],
    ]));
  }

  #populateHistory(data) {
    const output = this.shadowRoot.getElementById('history'),
      showAll = output.nextElementSibling,
      fragment1 = document.createDocumentFragment(),
      fragment2 = document.createDocumentFragment(),
      type = ["Locked", "Unlocked"];
    // Show this many by default, and store remainder in "Show All" section
    let totalToDisplay = 5;
    for (const entry of data.sort((a,b) => ~(a.date < b.date))) {
      const clone = this.#historyTemplate.cloneNode(true),
        time = clone.querySelector('time'),
        status = clone.querySelector('data');
      time.setAttribute('datetime', entry.date);
      time.innerHTML = `${entry.date.replace('T', ' ').substring(0, 19)} UTC`;
      status.setAttribute('value', entry.type);
      status.innerHTML = type[~~(entry.type === "enrollment")];
      (totalToDisplay-- > 0 ? fragment1 : fragment2).appendChild(clone);
    }
    output.innerText = '';
    output.appendChild(fragment1);
    showAll.innerHTML = `<summary class="show-all">${data.length ? `Show All (${data.length})` : ''}</summary>`;
    showAll.appendChild(fragment2);
  }
}

customElements.define('array-credit-lock', ArrayCreditLock);
