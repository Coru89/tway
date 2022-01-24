// For syntax highlighting only
const html = String.raw;

class ThemeToggle extends HTMLElement {
  constructor() {
    super();

    this.STORAGE_KEY = 'user-color-scheme';
    this.COLOR_MODE_KEY = '--color-mode';
  }

  connectedCallback() {
    this.render();
  }

  getCSSCustomProp(propKey) {
    let response = getComputedStyle(document.documentElement).getPropertyValue(propKey);

    // Tidy up the string if there’s something to work with
    if (response.length) {
      response = response.replace(/\'|"/g, '').trim();
    }

    // Return the string response by default
    return response;
  }

  applySetting(passedSetting) {
    let currentSetting = passedSetting || localStorage.getItem(this.STORAGE_KEY);

    if (currentSetting) {
      document.documentElement.setAttribute('data-user-color-scheme', currentSetting);
      this.setButtonLabelAndStatus(currentSetting);
    } else {
      this.setButtonLabelAndStatus(this.getCSSCustomProp(this.COLOR_MODE_KEY));
    }
  }

  toggleSetting() {
    let currentSetting = localStorage.getItem(this.STORAGE_KEY);

    switch (currentSetting) {
      case null:
        currentSetting =
          this.getCSSCustomProp(this.COLOR_MODE_KEY) === 'dark' ? 'light' : 'dark';
        break;
      case 'light':
        currentSetting = 'dark';
        break;
      case 'dark':
        currentSetting = 'light';
        break;
    }

    localStorage.setItem(this.STORAGE_KEY, currentSetting);

    return currentSetting;
  }

  setButtonLabelAndStatus(currentSetting) {
    this.modeToggleButton.innerHTML = `${
      currentSetting === 'dark' ?
        `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="22" viewBox="0 0 256 256">
        <g fill="#fff" stroke-miterlimit="10" stroke-width="0">
          <path d="M128 201.347c-40.444 0-73.347-32.903-73.347-73.347 0-40.444 32.903-73.347 73.347-73.347 40.44 0 73.347 32.903 73.347 73.347 0 13.234-3.562 26.201-10.304 37.508-13.178 22.104-37.334 35.84-63.043 35.84zm0-135.488c-34.265 0-62.144 27.876-62.144 62.144S93.735 190.144 128 190.144c21.782 0 42.253-11.637 53.42-30.375 5.705-9.57 8.721-20.555 8.721-31.769.003-34.265-27.876-62.141-62.141-62.141zM128 43.595a5.604 5.604 0 0 1-5.602-5.602V7.566c0-3.092 2.51-5.602 5.602-5.602s5.602 2.51 5.602 5.602v30.427A5.604 5.604 0 0 1 128 43.595zM128 254.036a5.604 5.604 0 0 1-5.602-5.602V218.01c0-3.092 2.51-5.601 5.602-5.601s5.602 2.51 5.602 5.601v30.425a5.604 5.604 0 0 1-5.602 5.602zM37.993 133.602H7.566c-3.092 0-5.602-2.51-5.602-5.602s2.51-5.602 5.602-5.602h30.427c3.093 0 5.602 2.51 5.602 5.602s-2.51 5.602-5.602 5.602zM248.434 133.602H218.01c-3.092 0-5.601-2.51-5.601-5.602s2.51-5.602 5.601-5.602h30.425c3.092 0 5.602 2.51 5.602 5.602s-2.51 5.602-5.602 5.602zM191.645 69.956a5.6 5.6 0 0 1-3.96-9.562l21.516-21.515a5.6 5.6 0 1 1 7.92 7.92l-21.515 21.516a5.584 5.584 0 0 1-3.96 1.641zM42.839 218.76a5.575 5.575 0 0 1-3.96-1.641 5.6 5.6 0 0 1 0-7.921l21.515-21.516a5.6 5.6 0 1 1 7.921 7.92L46.799 217.12a5.575 5.575 0 0 1-3.96 1.64zM64.355 69.956a5.575 5.575 0 0 1-3.96-1.641L38.878 46.799a5.6 5.6 0 1 1 7.92-7.92l21.516 21.515a5.6 5.6 0 0 1 0 7.921 5.575 5.575 0 0 1-3.96 1.641zM213.158 218.76a5.58 5.58 0 0 1-3.96-1.641l-21.516-21.516a5.6 5.6 0 1 1 7.92-7.92l21.517 21.515a5.6 5.6 0 0 1 0 7.92 5.575 5.575 0 0 1-3.96 1.642zM93.559 50.449a5.605 5.605 0 0 1-5.18-3.46L76.738 18.879a5.6 5.6 0 1 1 10.349-4.288l11.646 28.112a5.6 5.6 0 0 1-5.173 7.747zM174.09 244.872a5.612 5.612 0 0 1-5.179-3.46l-11.643-28.11a5.6 5.6 0 1 1 10.35-4.289l11.642 28.109a5.6 5.6 0 0 1-3.03 7.318c-.7.292-1.426.432-2.14.432zM16.735 179.692a5.61 5.61 0 0 1-5.178-3.46 5.6 5.6 0 0 1 3.033-7.318l28.112-11.643a5.6 5.6 0 1 1 4.285 10.349l-28.112 11.643a5.61 5.61 0 0 1-2.14.429zM211.159 99.16a5.6 5.6 0 0 1-2.148-10.777l28.108-11.646a5.6 5.6 0 1 1 4.288 10.349l-28.106 11.646c-.7.288-1.428.428-2.142.428zM162.441 50.449c-.714 0-1.44-.138-2.142-.429a5.598 5.598 0 0 1-3.03-7.318L168.91 14.59a5.596 5.596 0 0 1 7.319-3.033 5.598 5.598 0 0 1 3.03 7.318l-11.643 28.112a5.6 5.6 0 0 1-5.176 3.462zM81.907 244.872c-.714 0-1.44-.14-2.142-.429a5.6 5.6 0 0 1-3.03-7.318l11.645-28.11a5.601 5.601 0 0 1 10.349 4.289l-11.646 28.109a5.6 5.6 0 0 1-5.176 3.459zM44.841 99.16c-.714 0-1.44-.137-2.142-.428L14.587 87.086a5.602 5.602 0 0 1 4.288-10.349l28.112 11.646A5.602 5.602 0 0 1 44.84 99.16zM239.265 179.692c-.715 0-1.44-.14-2.143-.429l-28.109-11.643a5.6 5.6 0 0 1-3.03-7.318 5.598 5.598 0 0 1 7.318-3.03l28.109 11.642a5.6 5.6 0 0 1 3.03 7.319 5.605 5.605 0 0 1-5.175 3.459z"/>
        </g>
      </svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" viewBox="0 0 256 256">
        <path fill="#000" stroke-miterlimit="10" stroke-width="0" d="M46.607 90c-12.452 0-24.159-4.849-32.964-13.654-18.176-18.177-18.176-47.752 0-65.928A46.342 46.342 0 0 1 29.15.145a1.998 1.998 0 0 1 2.295.588c.555.677.606 1.635.125 2.366-10.35 15.731-8.183 36.83 5.154 50.167 13.338 13.336 34.437 15.503 50.166 5.153a2 2 0 0 1 2.954 2.419 46.338 46.338 0 0 1-10.272 15.508C70.766 85.151 59.059 90 46.607 90zM25.065 6.595a42.576 42.576 0 0 0-8.594 6.651C-.145 29.863-.145 56.9 16.471 73.517 24.521 81.567 35.223 86 46.607 86s22.086-4.433 30.136-12.482a42.61 42.61 0 0 0 6.651-8.595c-16.447 7.582-36.384 4.285-49.499-8.829-13.114-13.115-16.411-33.053-8.83-49.499z" transform="translate(1.964 1.964) scale(2.8008)"/>
      </svg>`
    }`;
    this.modeStatusElement.innerText = `Color mode is now "${currentSetting}"`;
  }

  render() {
    this.innerHTML = html`
      <div class="[ theme-toggle ] [ pad-left-700 ]">
        <div role="status" class="[ visually-hidden ][ js-mode-status ]"></div>
        <button class="[ button-dark-mode ] [ js-mode-toggle ]">
          Dark theme
        </button>
      </div>
    `;

    this.afterRender();
  }

  afterRender() {
    this.modeToggleButton = document.querySelector('.js-mode-toggle');
    this.modeStatusElement = document.querySelector('.js-mode-status');

    this.modeToggleButton.addEventListener('click', evt => {
      evt.preventDefault();

      this.applySetting(this.toggleSetting());
    });

    this.applySetting();
  }
}

if ('customElements' in window) {
  customElements.define('theme-toggle', ThemeToggle);
}

export default ThemeToggle;
