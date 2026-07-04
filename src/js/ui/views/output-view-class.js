// src/js/ui/views/output-view-class.js

import store from '../../core/store.js';
import Modal from '../components/modal.js';
import { downloadHtmlFiles } from '../../services/file-downloader.js';


export class OutputView {
  constructor(viewElement) {
    this.viewElement = viewElement;
    // The store is imported and can be used directly.
    // We initialize the index on the store when the view is created.
    store.currentMetaObjIndex = 0;
  }

  /**
   * Initializes the OutputView controller, attaching event listeners and rendering initial content.
   */
  init() {
    this._attachEventListeners();
    this._renderCurrentMetaObject();
    this._updateMultiFileElementsVisibility();
  }

  /**
   * Renders the current meta object's data into the view.
   */
  _renderCurrentMetaObject() {
    const currentMetaObject = store.metaObjects[store.currentMetaObjIndex];
    if (!currentMetaObject) {
      return;
    }

    // Update HTML code block
    const codeBlock = this.viewElement.querySelector('.code-block code');
    if (codeBlock) {
      codeBlock.textContent = currentMetaObject.tagsHtmlStrings.join('');
    }

    // Update page context
    const pageContextSpan = this.viewElement.querySelector('.page-context span');
    if (pageContextSpan) {
      pageContextSpan.textContent = `For: ${currentMetaObject.setName || 'Untitled Page'}`;
    }

    // Update validation status button
    this._updateValidationStatusButton(currentMetaObject);
    const pageCounter = this.viewElement.querySelector('.page-counter');
    if (pageCounter) {
      pageCounter.textContent = `${store.currentMetaObjIndex + 1} / ${store.metaObjects.length}`;
    }

    this._updateNavigationButtons();
    this._renderFileList();
  }

  /**
   * Updates the validation status button based on the current meta object's errors and alerts.
   * @param {object} metaObject - The current meta object.
   */
  _updateValidationStatusButton(metaObject) {
    const validationBtn = this.viewElement.querySelector('#validation-status-btn');
    const statusText = validationBtn.querySelector('.status-text');
    const svgIcon = validationBtn.querySelector('svg');

    const errorCount = (metaObject.allErrors || []).length;
    const alertCount = (metaObject.allAlerts || []).length;

    statusText.textContent = `${errorCount} error(s), ${alertCount} warning(s)`;

    // Reset styles
    validationBtn.style.borderColor = '';
    svgIcon.style.color = '';

    if (errorCount > 0) {
      validationBtn.style.borderColor = 'var(--error-color)';
      svgIcon.style.color = 'var(--error-color)';
    } else if (alertCount > 0) { 
      validationBtn.style.borderColor = 'var(--warning)'; 
      svgIcon.style.color = 'var(--warning)';
    }
  }

  /**
   * Updates the disabled state and opacity of the previous and next page navigation buttons.
   */
  _updateNavigationButtons() {
    const prevBtn = this.viewElement.querySelector('#prev-page-btn');
    const nextBtn = this.viewElement.querySelector('#next-page-btn');

    if (store.metaObjects.length <= 1) {
      prevBtn.disabled = true;
      prevBtn.setAttribute('inert', '');
      prevBtn.style.opacity = '0.5';
      nextBtn.disabled = true;
      nextBtn.setAttribute('inert', '');
      nextBtn.style.opacity = '0.5';
    } else {
      // Previous button
      if (store.currentMetaObjIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.setAttribute('inert', '');
        prevBtn.style.opacity = '0.5';
      } else {
        prevBtn.disabled = false;
        prevBtn.removeAttribute('inert');
        prevBtn.style.opacity = '1';
      }
      // Next button
      if (store.currentMetaObjIndex === store.metaObjects.length - 1) {
        nextBtn.disabled = true;
        nextBtn.setAttribute('inert', '');
        nextBtn.style.opacity = '0.5';
      } else {
        nextBtn.disabled = false;
        nextBtn.removeAttribute('inert');
        nextBtn.style.opacity = '1';
      }
    }
  }

  /**
   * Renders the list of file buttons in the "File List" tab.
   * Highlights the currently selected file.
   */
  _renderFileList() {
    const fileListContainer = this.viewElement.querySelector('.file-list-container');
    if (!fileListContainer) return;

    fileListContainer.innerHTML = ''; // Clear previous list

    store.metaObjects.forEach((metaObj, index) => {
      const fileButton = document.createElement('button');
      fileButton.type = 'button';
      fileButton.classList.add('file-list-button', 'btn', 'btn-ghost');
      fileButton.textContent = metaObj.setName || `Page ${index + 1}`;
      fileButton.dataset.index = index;

      // Add border based on errors/alerts
      if ((metaObj.allErrors || []).length > 0) {
        fileButton.classList.add('has-errors');
      } else if ((metaObj.allAlerts || []).length > 0) {
        fileButton.classList.add('has-alerts');
      }

      if (index === store.currentMetaObjIndex) {
        fileButton.classList.add('active');
      }

      fileButton.addEventListener('click', () => {
        store.currentMetaObjIndex = index;
        this._renderCurrentMetaObject();
        // Switch to HTML Code tab when a file is selected from the list
        this._switchTab('html-code-tab');
      });
      fileListContainer.appendChild(fileButton);
    });
  }

  /**
   * Toggles the visibility of multi-file specific elements based on the number of meta objects.
   */
  _updateMultiFileElementsVisibility() {
    const isMultiFile = store.metaObjects.length > 1;
    const pageNavigation = this.viewElement.querySelector('.page-navigation');
    const fileListTab = this.viewElement.querySelector('#file-list-tab');
    const fileListContent = this.viewElement.querySelector('#file-list-content');
    const downloadAllBtn = this.viewElement.querySelector('#download-all-btn');

    if (pageNavigation) {
      pageNavigation.style.display = isMultiFile ? 'flex' : 'none';
      if (isMultiFile) {
        pageNavigation.removeAttribute('inert');
      } else {
        pageNavigation.setAttribute('inert', '');
      }
    }
    if (fileListTab) {
      fileListTab.style.display = isMultiFile ? 'block' : 'none';
      if (isMultiFile) {
        fileListTab.removeAttribute('inert');
      } else {
        fileListTab.setAttribute('inert', '');
      }
      // If hiding file list tab, ensure HTML Code tab is active
      if (!isMultiFile && fileListTab.classList.contains('active')) {
        this._switchTab('html-code-tab');
      }
    }
    if (fileListContent) {
      if (isMultiFile) {
        fileListContent.removeAttribute('inert');
      } else {
        fileListContent.setAttribute('inert', '');
      }
    }
    if (downloadAllBtn) {
      downloadAllBtn.style.display = isMultiFile ? 'block' : 'none';
      if (isMultiFile) {
        downloadAllBtn.removeAttribute('inert');
      } else {
        downloadAllBtn.setAttribute('inert', '');
      }
    }
  }


  /**
   * Attach all event listeners to the view elements.
   */
  _attachEventListeners() {
    this.viewElement.querySelector('#html-code-tab').addEventListener('click', () => this._switchTab('html-code-tab'));
    this.viewElement.querySelector('#file-list-tab').addEventListener('click', () => this._switchTab('file-list-tab'));
    this.viewElement.querySelector('#prev-page-btn').addEventListener('click', () => this._navigatePage(-1));
    this.viewElement.querySelector('#next-page-btn').addEventListener('click', () => this._navigatePage(1));
    this.viewElement.querySelector('#validation-status-btn').addEventListener('click', () => this._showValidationModal());
    this.viewElement.querySelector('.copy-all-btn').addEventListener('click', () => this._copyAllMetaTags());
    this.viewElement.querySelector('#download-html-btn').addEventListener('click', () => this._downloadCurrentHtml());
    this.viewElement.querySelector('#download-all-btn').addEventListener('click', () => this._downloadAllHtml());
  }

  /**
   * Switches the active tab and manages accessibility attributes.
   * @param {string} tabId - The ID of the tab to activate ('html-code-tab' or 'file-list-tab').
   */
  _switchTab(tabId) {
    const tabButtons = this.viewElement.querySelectorAll('.tab-button');
    const tabContents = this.viewElement.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      if (button.id === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `${tabId.replace('-tab', '')}-content`) {
        content.classList.add('active');
        content.setAttribute('aria-hidden', 'false');
        content.removeAttribute('inert');
      } else {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
        content.setAttribute('inert', '');
      }
    });
  }

  /**
   * Navigates to the previous or next meta object.
   * @param {number} direction - -1 for previous, 1 for next.
   */
  _navigatePage(direction) {
    const newIndex = store.currentMetaObjIndex + direction;
    if (newIndex >= 0 && newIndex < store.metaObjects.length) {
      store.currentMetaObjIndex = newIndex;
      this._renderCurrentMetaObject();
    }
  }

  /**
   * Shows the validation modal with errors and alerts for the current meta object.
   * {id, label, msg}
   */
  _showValidationModal() {
    const currentMetaObject = store.metaObjects[store.currentMetaObjIndex];
    const errors = currentMetaObject.allErrors || [];
    const alerts = currentMetaObject.allAlerts || [];

    const formatIssues = (issues, type) => {
      if (issues.length === 0) return `<p>No ${type} found.</p>`;
      let html = '<ul>';
      issues.forEach(issue => {
        // Assuming issue object has 'field', 'type', 'message' properties
        html += `<li><strong>${issue.label || 'N/A'} (${issue.id || 'N/A'}):</strong> ${issue.msg || 'No message'}</li>`;
      });
      html += '</ul>';
      return html;
    };

    const modalContent = `
      <h3>Errors</h3>
      ${formatIssues(errors, 'errors')}
      <hr>
      <h3>Warnings</h3>
      ${formatIssues(alerts, 'warnings')}
    `;

    const validationModal = new Modal({
      title: 'Validation Issues',
      content: modalContent,
    });
    validationModal.open();
  }

  /**
   * Copies all generated meta tags for the current meta object to the clipboard.
   */
  _copyAllMetaTags() {
    const currentMetaObject = store.metaObjects[store.currentMetaObjIndex];
    if (currentMetaObject && currentMetaObject.tagsHtmlStrings) {
      const textToCopy = currentMetaObject.tagsHtmlStrings.join('');
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Meta tags copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy meta tags:', err);
        });
    }
  }

  /**
   * Downloads the current meta object's HTML tags as an HTML file.
   */
  _downloadCurrentHtml() {
    const currentMetaObject = store.metaObjects[store.currentMetaObjIndex];
    if (currentMetaObject && currentMetaObject.tagsHtmlStrings) {
      const filename = `${currentMetaObject.setName || 'meta-tags'}.html`;
      const content = currentMetaObject.tagsHtmlStrings.join('');
      downloadHtmlFiles([{ filename: filename, content: content }]);
      console.log(`Downloading ${filename}`);
    }
  }

  /**
   * Downloads all meta objects' HTML tags as multiple HTML files.
   */
  _downloadAllHtml() {
    if (store.metaObjects && store.metaObjects.length > 0) {
      const filesToDownload = store.metaObjects.map((metaObj, index) => ({
        filename: `${metaObj.setName || `meta-tags-${index + 1}`}.html`,
        content: metaObj.tagsHtmlStrings.join('')
      }));
      downloadHtmlFiles(filesToDownload);
      console.log(`Downloading ${filesToDownload.length} files`);
    }
  }


}
