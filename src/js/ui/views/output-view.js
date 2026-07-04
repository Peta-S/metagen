import store from '../../core/store.js';
import Modal from '../components/modal.js';
import { OutputView } from './output-view-class.js';


const viewHTML = `
  <div class="view-container">
    <h2 class="landing-title">Generated Meta Tags</h2>

    <div class="output-view-content">
      <div class="status-header">
        <p class="status-message success-message">✓ Meta tags generated successfully!</p>
        <button id="validation-status-btn" class="btn btn-ghost validation-status-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <span class="status-text"></span>
        </button>
      </div>

      <div class="page-context">
        <span>For: Homepage</span>
      </div>

      <div class="tabs-container">
        <div class="tab-buttons">
          <button class="tab-button active" id="html-code-tab">HTML Code</button>
          <button class="tab-button" id="file-list-tab">File List</button>
        </div>
        <div class="tab-content active" id="html-code-content" aria-hidden="false">
          <pre class="code-block"><code class="language-html"></code></pre>
          <button class="btn btn-secondary copy-all-btn">Copy All</button>
        </div>
        <div class="tab-content" id="file-list-content" aria-hidden="true" inert>
          <div class="file-list-container">
            <!-- File list buttons will be rendered here -->
          </div>
        </div>
      </div>

      <div class="output-actions">
        <button class="btn btn-secondary" id="download-html-btn">Download as HTML</button>
        <button class="btn btn-secondary" id="edit-file-btn">Edit Tags</button>
      </div>

      <div class="page-navigation">
        <button class="btn btn-ghost" id="prev-page-btn" disabled>&lt; Previous</button>
        <span class="page-counter">1 / 1</span>
        <button class="btn btn-ghost" id="next-page-btn">Next &gt;</button>
      </div>

    </div>

    <div class="navigation-controls">
      <button id="create-new-btn" class="btn btn-secondary">← Create New</button>
      <button id="download-all-btn" class="btn btn-secondary">Download All</button>
    </div>
  </div>
`;

export const outputView = () => {
  const template = document.createElement('template');
  template.innerHTML = viewHTML.trim();
  const view = template.content.firstElementChild.cloneNode(true);

  // Pass the view element to the OutputView controller for attaching listeners and managing behavior
  const outputViewController = new OutputView(view);
  outputViewController.init(); // Initialize listeners and display

  return view;
};
