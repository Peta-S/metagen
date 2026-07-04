/**
 * Creates a single input element set, including the input and a validation message holder,
 * based on a configuration object. This function is designed to be modular and easy to
 * understand, following the project's coding standards for clarity and maintainability.
 * It uses dataset attributes for event delegation, avoiding direct event listener attachments.
 *
 * @param {object} singleInputConfig - The configuration for the input set.
 * @param {string} singleInputConfig.group - The meta group (e.g., 'global'). Used for data-group attribute.
 * @param {string} singleInputConfig.tagId - The tag ID (e.g., 'gl_title'). Used for data-tagid attribute.
 * @param {string} singleInputConfig.attribute - The attribute name (e.g., 'content'). Used for data-attribute attribute.
 * @param {object} singleInputConfig.input - The input definition from the schema.
 * @param {string} singleInputConfig.input.type - The type of the input ('text', 'textarea', 'select', 'number', 'url').
 * @param {object} singleInputConfig.input.validation - Validation rules for the input.
 * @param {string} [singleInputConfig.input.placeholder] - Placeholder text for the input.
 * @param {object} [singleInputConfig.userData] - Existing user data to populate the input.
 * @param {string} [singleInputConfig.userData.value] - The value to set for the input.
 * @param {string} [singleInputConfig.userData.validStatus] - The validation status ('valid', 'alert', 'error').
 * @param {string} [singleInputConfig.userData.msg] - A validation message to display.
 * @returns {DocumentFragment} A fragment containing the configured input element and its validation message holder.
 */
export function createSingleInput(singleInputConfig) {
    const { group, tagId, attribute, input, userData } = singleInputConfig;

    const fragment = document.createDocumentFragment();
    let inputElement;

    // Create the appropriate input element based on the schema type
    switch (input.type) {
        case 'text':
        case 'url':
        case 'number':
            inputElement = document.createElement('input');
            inputElement.type = input.type;
            break;
        case 'textarea':
            inputElement = document.createElement('textarea');
            inputElement.rows = 3;
            break;
        case 'select':
            inputElement = document.createElement('select');
            inputElement.appendChild(getselectPlaceHolder());
            if (input.validation && input.validation.enum) {
                input.validation.enum.forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    inputElement.appendChild(option);
                });
            }
            break;
        // As per instructions, 'color' input type is to be implemented later.
        default:
            // Default to a text input if type is unknown or not supported yet
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            break;
    }

    // Assign dataset attributes for event delegation
    inputElement.dataset.group = group;
    inputElement.dataset.tagid = tagId;
    inputElement.dataset.attribute = attribute;

    if (input.placeholder) {
        inputElement.placeholder = input.placeholder;
    }

    // Apply validation attributes from the schema
    if (input.validation) {
        const { validation } = input;
        if (typeof validation.max !== 'undefined') {
            if (input.type === 'textarea' || input.type === 'text' || input.type === 'url') {
                inputElement.maxLength = validation.max;
            } else if (input.type === 'number') {
                inputElement.max = validation.max;
            }
        }
        if (typeof validation.min !== 'undefined') {
            if (input.type === 'textarea' || input.type === 'text' || input.type === 'url') {
                inputElement.minLength = validation.min;
            } else if (input.type === 'number') {
                inputElement.min = validation.min;
            }
        }
        if (input.type === 'number') {
            if (validation.integer) {
                inputElement.step = 1;
            } else if (validation.step) {
                inputElement.step = validation.step;
            }
        }
    }
    
    // Populate with existing user data if provided
    if (userData) {
        if (userData.value && (userData.validStatus === 'valid' || userData.validStatus === 'alert')) {
            inputElement.value = userData.value;
        }
    }

    fragment.appendChild(inputElement);

    // Create and append the validation message holder
    const messageHolder = document.createElement('div');
    messageHolder.className = 'validation-message';
    messageHolder.setAttribute('role', 'alert');
    messageHolder.setAttribute('aria-live', 'polite');

    // Display validation messages from user data
    if (userData && userData.msg && (userData.validStatus === 'alert' || userData.validStatus === 'error')) {
        messageHolder.textContent = userData.msg;
        messageHolder.classList.add(userData.validStatus === 'alert' ? 'alert-message' : 'error-message');
    }

    fragment.appendChild(messageHolder);

    return fragment;
}

function getselectPlaceHolder(placeholderText = "Select ..."){
    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = placeholderText;
    placeholderOption.value = ''; // Empty value for validation
    placeholderOption.disabled = true; // Prevent selection after change
    placeholderOption.selected = true; // Show as default
    placeholderOption.hidden = true;   // Hide from dropdown list
    return placeholderOption
}
