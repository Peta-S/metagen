/**
 * Creates a composite color input, including a text field for hex values and a color picker.
 * The two inputs are synchronized. The text input holds the dataset attributes for delegation,
 * and is associated with the validation message element.
 *
 * @param {object} singleInputConfig - The configuration for the input set.
 * @param {string} singleInputConfig.group - The meta group (e.g., 'global').
 * @param {string} singleInputConfig.tagId - The tag ID (e.g., 'gl_theme_color').
 * @param {string} singleInputConfig.attribute - The attribute name (e.g., 'content').
 * @param {object} singleInputConfig.input - The input definition from the schema.
 * @param {object} [singleInputConfig.userData] - Existing user data to populate the input.
 * @returns {DocumentFragment} A fragment containing the composite color input and its validation message holder.
 */
export function createColorInput(singleInputConfig) {
    const { group, tagId, attribute, input, userData } = singleInputConfig;

    const fragment = document.createDocumentFragment();

    const container = document.createElement('div');
    container.className = 'color-input-container';

    const textInput = document.createElement('input');
    textInput.type = 'text';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';

    // Configure the text input, which is the primary interface for the form logic
    textInput.dataset.group = group;
    textInput.dataset.tagid = tagId;
    textInput.dataset.attribute = attribute;

    if (input.placeholder) {
        textInput.placeholder = input.placeholder;
    }
    
    if (input.validation) {
        const { validation } = input;
        if (validation.pattern) {
            textInput.pattern = validation.pattern;
        }
        // A hex color string #RRGGBB has 7 characters
        textInput.maxLength = 7;
    }

    let initialValue = '#000000'; // A sensible default
    if (userData && userData.value && (userData.validStatus === 'valid' || userData.validStatus === 'alert')) {
        initialValue = userData.value;
    }
    
    textInput.value = '';
    colorInput.value = initialValue;

    // --- Event Listeners to synchronize the two inputs ---

    // Update color picker when user types in the text field
    textInput.addEventListener('input', (e) => {
        const value = e.target.value;
        // The color picker input handles partial or invalid hex codes gracefully.
        // We can set the value directly as the user types.
        colorInput.value = value;
    });

    // Update text field when user chooses a color from the picker
    colorInput.addEventListener('input', (e) => {
        textInput.value = e.target.value;
        // Manually dispatch an 'input' event on the text field. This is crucial
        // to ensure that any application logic that listens for input changes
        // (via event delegation) is triggered.
        textInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    container.appendChild(textInput);
    container.appendChild(colorInput);
    fragment.appendChild(container);

    // Create and append the validation message holder, associated with the text input
    const messageHolder = document.createElement('div');
    messageHolder.className = 'validation-message';
    messageHolder.setAttribute('role', 'alert');
    messageHolder.setAttribute('aria-live', 'polite');
    
    if (userData && userData.msg && (userData.validStatus === 'alert' || userData.validStatus === 'error')) {
        messageHolder.textContent = userData.msg;
        messageHolder.classList.add(userData.validStatus === 'alert' ? 'alert-message' : 'error-message');
    }

    fragment.appendChild(messageHolder);

    return fragment;
}
