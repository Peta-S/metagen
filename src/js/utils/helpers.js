// src/js/utils/helpers.js

/**
 * Escapes HTML characters in a string to prevent XSS.
 * @param {string} unsafe - The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeHtml = (unsafe) => {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
};

/**
 * Sets an input object into the meta object structure, handling single and multiple allowed entries.
 * @param {object} metaObj - The main meta object to update.
 * @param {string} group - The group name (e.g., 'social', 'global').
 * @param {string} id - The ID of the input within the group.
 * @param {object} inputObjectDetails - The object containing value, validStatus, and msg (if any).
 * @param {boolean} isMultipleAllowed - True if multiple entries are allowed for this id.
 */
export const setGroupObject = (metaObj, group, id, inputObjectDetails, isMultipleAllowed) => {
  if (!metaObj[group]) {
    metaObj[group] = {};
  }
  if (isMultipleAllowed) {
    if (!metaObj[group][id]) {
      metaObj[group][id] = [];
    }
    metaObj[group][id].push(inputObjectDetails);
  } else {
    metaObj[group][id] = inputObjectDetails;
  }
};

/**
 * Processes and sets a meta tag object, performing validation, error/alert accumulation,
 * and HTML string generation. This function encapsulates the common logic from
 * individual group setter files.
 * @param {string} group - The group ID (e.g., 'social', 'global').
 * @param {string} id - The ID of the input within the group.
 * @param {string} value - The value of the input.
 * @param {object} metaObj - The main meta object to update.
 * @param {Array<Object>} allErrors - Array to accumulate error objects.
 * @param {Array<Object>} allAlerts - Array to accumulate alert objects.
 * @param {object} tagDefinition - The definition of the tag from the schema.
 * @param {boolean} isMultipleAllowed - True if multiple entries are allowed for this id.
 * @param {function} validateFn - The validate function from 'src/js/core/validator.js'.
 * @param {function} getTagConfigAndHtmlFn - The getTagConfigAndHtml function from 'src/js/core/generator.js'.
 * @param {object} metaGroupsServiceInstance - The metaGroupsService instance from 'src/js/core/meta-groups-service.js'.
 */
export const processGroupObject = (
  group,
  id,
  value,
  metaObj,
  allErrors,
  allAlerts,
  tagDefinition,
  isMultipleAllowed,
  validateFn,
  getTagConfigAndHtmlFn,
  metaGroupsServiceInstance
) => {
  let isValidInput = true;
  const inputObjectDetails = { value, validStatus: 'valid' };
  const attsObj = {};

  const inputKeys = Object.keys(tagDefinition.inputs);
  if (inputKeys.length > 0) {
    const primaryAttributeName = inputKeys[0];
    attsObj[primaryAttributeName] = value;

    const validationRules = tagDefinition.inputs[primaryAttributeName].validation;
    if (validationRules) {
      const validationResult = validateFn(value, validationRules);
      inputObjectDetails.validStatus = validationResult.status;
      if (validationResult.msg) {
        inputObjectDetails.msg = validationResult.msg;
      }

      if (validationResult.status === 'error') {
        isValidInput = false;
        const userInfo = metaGroupsServiceInstance.getTagUserInfo(group, id);
        allErrors.push({
          id,
          label: userInfo ? userInfo.label : id,
          msg: validationResult.msg,
        });
      } else if (validationResult.status === 'alert') {
        const userInfo = metaGroupsServiceInstance.getTagUserInfo(group, id);
        allAlerts.push({
          id,
          label: userInfo ? userInfo.label : id,
          msg: validationResult.msg,
        });
      }
    }
  } else {
      isValidInput = false;
      allErrors.push({
          id,
          label: 'Schema Error',
          msg: `No inputs defined for tag: ${group}.${id}. Cannot validate or generate.`,
      });
  }

  if (isValidInput && inputObjectDetails.validStatus !== 'error') {
    const { htmlString } = getTagConfigAndHtmlFn(group, id, attsObj);
    if (htmlString) {
      metaObj.tagsHtmlStrings.push(htmlString);
    }
  }

  // Calls the existing setGroupObject helper
  setGroupObject(metaObj, group, id, inputObjectDetails, isMultipleAllowed);
};

