const viewHTML = `
  <div class="view-container">
    <h2 class="landing-title">Manual Entry</h2>
    <form class="manual-entry-form">
    </form>
    <div class="navigation-controls">
      <button id="back-to-selection-btn" class="btn btn-secondary">← Back</button>
      <button id="generate-from-manual-btn" class="btn btn-primary">Generate Tags →</button>
    </div>
  </div>
`;

import { setInputsManager } from '../../inputs/set-inputs-manager.js';
import { attachFormEventListeners } from './manual-events.js';

export const manualEntryView = () => {
  const template = document.createElement('template');
  template.innerHTML = viewHTML.trim();
  const view = template.content.cloneNode(true);
  const formEl = view.querySelector('.manual-entry-form');
  const genBtnEl = view.querySelector('#generate-from-manual-btn');
  setInputsManager(formEl);
  attachFormEventListeners(formEl, genBtnEl);
  return view;
};
