/**
 * Creates a set of two linked inputs for alternate links (hreflang and href).
 * It includes individual validation messages and a shared message that enforces
 * that both fields must be filled out if one of them is.
 *
 * @param {object} altsInputConfig - The configuration object for this input set.
 * @param {string} altsInputConfig.group - The meta group.
 * @param {string} altsInputConfig.tagId - The tag ID.
 * @param {object} altsInputConfig.inputs - An object containing the two input definitions ('hreflang', 'href').
 * @param {object} [altsInputConfig.userData] - Existing user data for the inputs.
 * @returns {DocumentFragment} A fragment containing the two inputs and their validation elements.
 */
export function createAlternatesInput(altsInputConfig) {
    const { group, tagId, inputs, userData } = altsInputConfig;
    const fragment = document.createDocumentFragment();

    /**
     * Helper to create a single input and its message container.
     * @param {string} attribute - The attribute name (e.g., 'hreflang').
     * @returns {{inputEl: HTMLInputElement, msgEl: HTMLDivElement}}
     */
    const createInput = (attribute) => {
        const inputConfig = inputs[attribute];
        const inputEl = document.createElement('input');
        inputEl.type = inputConfig.type || 'text';
        inputEl.dataset.group = group;
        inputEl.dataset.tagid = tagId;
        inputEl.dataset.attribute = attribute;
        if(inputConfig.placeholder) {
            inputEl.placeholder = inputConfig.placeholder;
        }
        if(inputConfig.validation && inputConfig.validation.pattern) {
            inputEl.pattern = inputConfig.validation.pattern;
        }

        const msgEl = document.createElement('div');
        msgEl.className = 'validation-message';
        msgEl.setAttribute('role', 'alert');
        msgEl.setAttribute('aria-live', 'polite');

        const ud = userData ? userData[attribute] : null;
        if (ud) {
            if (ud.value && (ud.validStatus === 'valid' || ud.validStatus === 'alert')) {
                inputEl.value = ud.value;
            }
            if (ud.msg && (ud.validStatus === 'alert' || ud.validStatus === 'error')) {
                msgEl.textContent = ud.msg;
                msgEl.classList.add(ud.validStatus === 'alert' ? 'alert-message' : 'error-message');
            }
        }
        
        return { inputEl, msgEl };
    }

    const { inputEl: hreflangInput, msgEl: hreflangMsg } = createInput('hreflang');
    const { inputEl: hrefInput, msgEl: hrefMsg } = createInput('href');

    const altMsgEl = document.createElement('div');
    altMsgEl.className = 'validation-message alt-msg';
    altMsgEl.setAttribute('role', 'status');
    altMsgEl.setAttribute('aria-live', 'polite');

    const checkFields = () => {
        const hreflangValue = hreflangInput.value.trim();
        const hrefValue = hrefInput.value.trim();

        if ((hreflangValue && !hrefValue) || (!hreflangValue && hrefValue)) {
            altMsgEl.textContent = 'Both fields are required.';
            altMsgEl.classList.add('alert-message');
        } else {
            altMsgEl.textContent = '';
            altMsgEl.classList.remove('alert-message');
        }
    };

    hreflangInput.addEventListener('input', checkFields);
    hrefInput.addEventListener('input', checkFields);

    fragment.appendChild(hreflangInput);
    fragment.appendChild(hreflangMsg);
    fragment.appendChild(hrefInput);
    fragment.appendChild(hrefMsg);
    fragment.appendChild(altMsgEl);
    
    return fragment;
}
