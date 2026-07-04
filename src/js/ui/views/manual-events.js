
import { metaGroupsService } from '../../core/meta-groups-service.js';
import { validate } from '../../core/validator.js';
import { metaObjSetter } from '../../core/meta-object-setter.js';
import store from '../../core/store.js';
import { navigate } from '../view-manager.js';

/**
 * Attaches event listeners to the manual entry form for real-time validation.
 * @param {HTMLFormElement} formEl - The form element to attach listeners to.
 */
export const attachFormEventListeners = (formEl, generateBtn) => {
  if (!formEl || !generateBtn) {
    console.error('Form element not provided to attachFormEventListeners.');
    return;
  }

  formEl.addEventListener('input', (event) => {
    const target = event.target;

    // We are only interested in elements that have data-tagid, data-group and data-attribute for validation
    if (target && target.dataset.group && target.dataset.tagid && target.dataset.attribute) {
      const group = target.dataset.group;
      const tagId = target.dataset.tagid;
      const attribute = target.dataset.attribute;
      const value = target.value;

      if (Object.keys(store.schemas).length === 0) {
        metaGroupsService.setAllSchemas();
      }
      const validationObj = metaGroupsService.getInputValidationRules(group, tagId, attribute);

      if (validationObj) {
        const validationResult = validate(value, validationObj);
        
        const messageHolder = target.nextElementSibling;
        const inputContainer = target.parentElement;

        if (messageHolder && messageHolder.classList.contains('validation-message') && inputContainer) {
            // Clear previous validation messages and styles on each input event.
            messageHolder.textContent = '';
            messageHolder.classList.remove('alert-message', 'error-message');
            inputContainer.classList.remove('is-error');

            // Apply new validation state if the status is 'error' or 'alert'.
            if (validationResult.status === 'error' || validationResult.status === 'alert') {
                messageHolder.textContent = validationResult.msg;
                messageHolder.classList.add(`${validationResult.status}-message`);
                if (validationResult.status === 'error') {
                    inputContainer.classList.add('is-error');
                }
            } 
        }
      } else {
        console.warn(`No validation object found for ${group}.${tagId}.${attribute}`);
      }
    }
  });

  // const generateBtn = formEl.querySelector('#generate-from-manual-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default form submission
      const formDataArray = [];
      
      // Iterate over all form elements
      for (const element of formEl.elements) {
        // Only consider elements with data-group, data-tagid, and data-attribute and a value
        if (element.dataset.group && element.dataset.tagid && element.dataset.attribute && element.value) {
          const group = element.dataset.group;
          const tagId = element.dataset.tagid;
          const attribute = element.dataset.attribute;
          const value = element.value;

          let idToPush = tagId; // Default id is tagId

          // Special handling for 'res_alternates'
          if (tagId === 'res_alternates') {
            const fieldInstance = element.closest('.field-instance');
            if (fieldInstance && fieldInstance.dataset.instance) {
              const instance = fieldInstance.dataset.instance;
              if (attribute === 'hreflang') {
                idToPush = `alternate_${instance}_lang`;
              } else if (attribute === 'href') {
                idToPush = `alternate_${instance}_url`;
              }
            }
          }
          formDataArray.push({ group, id: idToPush, value });
        }
      }

      if (formDataArray.length === 0) {
        alert('No data entered to generate tags. Please fill in the form.');
        return;
      }
      
      let metaObject = metaObjSetter(formDataArray); // Pass the directly formatted array

      if (metaObject) {
        if ( store.editCurrentMetaObj === true ){
          store.metaObjects[store.currentMetaObjIndex] = metaObject;
          store.editCurrentMetaObj = false
        } else {
          store.metaObjects.push(metaObject);
        }
        navigate('output');
      } else {
        alert('An error occurred during tag generation. Please check your input.');
      }
    });
  }

};

