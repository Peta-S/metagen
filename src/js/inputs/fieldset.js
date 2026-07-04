import Modal from '../ui/components/modal.js';
import { metaGroupsService } from '../core/meta-groups-service.js';

class Fieldset {
  /**
   * Represents a dynamic fieldset for meta-tags.
   * @param {object} fieldsetConfig - Configuration object for the fieldset.
   * @param {string} fieldsetConfig.tagId - The ID of the meta-tag.
   * @param {string} fieldsetConfig.group - The meta-group this tag belongs to.
   * @param {Array<DocumentFragment>} [fieldsetConfig.inputEls=[]] - An array of document fragments, each representing a set of inputs for a single-instance fieldset.
   * @param {DocumentFragment} [fieldsetConfig.templateMultiInput] - A document fragment to be used as a template for multi-instance fieldsets.
   */
  constructor(fieldsetConfig) {
    const { group, tagId, inputEls = [], templateMultiInput } = fieldsetConfig;

    if (!tagId || !group) {
      throw new Error('Fieldset: `tagId` and `group` are required in config.');
    }
    
    this.tagId = tagId;
    this.group = group;
    this.inputEls = inputEls;
    this.templateMultiInput = templateMultiInput;
    this.multipleAllowed = !!this.templateMultiInput;

    const userInfo = metaGroupsService.getTagUserInfo(this.group, this.tagId);
    this.label = userInfo ? userInfo.label : 'Unknown Fieldset';

    this.fieldsetElement = null;
    this.modal = null;
    this.instanceCount = 0;
    this.templateElement = null;
  }

  /**
   * Creates and returns the main DOM element for the fieldset.
   * @returns {HTMLElement} The created fieldset container element.
   */
  createFieldsetElement() {
    this.fieldsetElement = document.createElement('div');
    this.fieldsetElement.className = 'fieldset-container';
    this.fieldsetElement.dataset.fieldsetId = this.tagId;
    this.fieldsetElement.dataset.group = this.group;

    const header = document.createElement('div');
    header.className = 'fieldset-header';

    const legend = document.createElement('legend');
    legend.textContent = this.label;
    header.appendChild(legend);

    // Toggle button
    const toggleButton = this._createButton('toggle-btn round-button', '-', 'Toggle visibility of inputs');
    toggleButton.addEventListener('click', () => this._toggleInputsVisibility());
    header.appendChild(toggleButton);

    // Info button
    const infoButton = this._createButton('info-btn  round-button', 'i', 'Show information about this tag');
    infoButton.dataset.fieldId = this.tagId;
    infoButton.dataset.fieldGroup = this.group;
    infoButton.addEventListener('click', () => this._showInfoModal());
    header.appendChild(infoButton);

    this.fieldsetElement.appendChild(header);

    const instancesWrapper = document.createElement('div');
    instancesWrapper.className = 'instances-wrapper';
    this.fieldsetElement.appendChild(instancesWrapper);

    if (this.multipleAllowed) {
        this.templateElement = document.createElement('template');
        this.templateElement.content.appendChild(this.templateMultiInput);

        instancesWrapper.appendChild(this._createInstanceFromTemplate());

        const addAnotherButton = this._createButton('add-another-btn btn secondary-btn', `+ Add Another ${this.label}`, `Add another instance of ${this.label}`);
        addAnotherButton.addEventListener('click', () => {
            instancesWrapper.appendChild(this._createInstanceFromTemplate());
        });
        this.fieldsetElement.appendChild(addAnotherButton);
    } else {
        this.inputEls.forEach(inputElFragment => {
            instancesWrapper.appendChild(inputElFragment);
        });
    }

    return this.fieldsetElement;
  }

  /**
   * Creates an individual fieldset instance from the template for multi-allowed tags.
   * @returns {HTMLElement} A fieldset element containing the cloned inputs and a remove button.
   * @private
   */
  _createInstanceFromTemplate() {
    this.instanceCount++;
    const instanceContainer = document.createElement('fieldset');
    instanceContainer.className = 'field-instance';
    instanceContainer.dataset.instance = this.instanceCount;

    const instanceHeader = document.createElement('legend');
    instanceHeader.innerHTML = `${this.label} #${this.instanceCount}`;
    
    const removeButton = this._createButton('remove-btn', '✕ Remove', 'Remove this instance');
    removeButton.addEventListener('click', (e) => {
        e.target.closest('.field-instance').remove();
    });
    instanceHeader.appendChild(removeButton);
    instanceContainer.appendChild(instanceHeader);

    const content = this.templateElement.content.cloneNode(true);
    instanceContainer.appendChild(content);
    
    return instanceContainer;
  }

  /**
   * Helper to create a styled button.
   * @param {string} className - Class for the button.
   * @param {string} textContent - Text inside the button.
   * @param {string} ariaLabel - Aria-label for accessibility.
   * @returns {HTMLButtonElement} The created button.
   * @private
   */
  _createButton(className, textContent, ariaLabel) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${className}`;
    button.textContent = textContent;
    button.setAttribute('aria-label', ariaLabel);
    return button;
  }
  // = 'round-button

  /**
   * Toggles the visibility of all input elements within the fieldset.
   * @private
   */
  _toggleInputsVisibility() {
    const instancesWrapper = this.fieldsetElement.querySelector('.instances-wrapper');
    if (!instancesWrapper) return;
  
    const currentlyHidden = instancesWrapper.classList.contains('hidden');
    instancesWrapper.classList.toggle('hidden', !currentlyHidden);
  
    const toggleButton = this.fieldsetElement.querySelector('.toggle-btn');
    if (toggleButton) {
      toggleButton.textContent = !currentlyHidden ? '+' : '-';
    }
  }

  /**
   * Displays a modal with userInfo for the current tag.
   * @private
   */
  _showInfoModal() {
    const userInfo = metaGroupsService.getTagUserInfo(this.group, this.tagId);
    let modalContent = 'No additional information available for this tag.';

    if (userInfo) {
      modalContent = `
        <p>${userInfo.description || ''}</p>
        ${userInfo.exampleOutput ? `<p><strong>Example:</strong> <code>${this.escapeHtml(userInfo.exampleOutput)}</code></p>` : ''}
      `;
    }

    if (!this.modal) {
      this.modal = new Modal({
        title: `Info: ${this.label}`,
        content: modalContent,
      });
    } else {
      this.modal.options.title = `Info: ${this.label}`;
      this.modal.setContent(modalContent);
    }
    this.modal.open();
  }

  /**
   * Simple HTML escaping function to prevent XSS in code examples.
   * @param {string} str 
   * @returns {string}
   */
  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  /**
   * Allows external control over the fieldset's visibility.
   * @param {Function} showHideFn - A function that takes the fieldset's main DOM element
   *                                 and applies show/hide logic. E.g., `(element) => element.style.display = 'none';`
   */
  updateVisibility(showHideFn) {
    if (typeof showHideFn === 'function' && this.fieldsetElement) {
      showHideFn(this.fieldsetElement);
    } else {
      console.warn('Fieldset.updateVisibility: showHideFn must be a function and fieldsetElement must exist.');
    }
  }
}

export default Fieldset;
