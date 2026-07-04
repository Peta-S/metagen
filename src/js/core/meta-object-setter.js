// src/js/core/meta-object-setter.js

import { metaGroupsService } from './meta-groups-service.js';
import { processAlternateTags } from './meta-groups/resources/setter.js';
import store from './store.js';

/**
 * Processes an array of input objects to construct a comprehensive meta object,
 * including validation, HTML generation, and error/alert aggregation.
 *
 * @param {Array<{group: string, id: string, value: string}>} inputObjects - An array of objects,
 *   each containing a group, id, and value for a meta tag input.
 * @return {object} A complex meta object containing structured data, HTML strings, errors, and alerts.
 */
export function metaObjSetter(inputObjects) {
  const metaObj = {
    setName: '',
    tagsHtmlStrings: [],
    allErrors: [],
    allAlerts: [],
    global: {},
    social: {},
    resources: {},
    eCommerce: {},
    article: {},
    advanced: {},
  };

  const altDataArray = []; 

  // Ensure schemas are loaded
  if (Object.keys(store.schemas).length === 0) {
    metaGroupsService.setAllSchemas();
  }

  inputObjects.forEach(inputObj => {
    const { group, id, value } = inputObj;

    // 1. Delete/ignore empty input fields
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return; // Skip empty values
    }

    // 2. If group is main, then "set_name" should be the only id
    if (group === 'main') {
      if (id === 'set_name') {
        metaObj.setName = value;
      }
      return; // Main group handled, move to next input
    }

    // 3. Tags in the "resources" group with id beginning with alternate_ are processed later
    if (group === 'resources' && id.startsWith('alternate_')) {
      altDataArray.push(inputObj);
      return; // Alternate tags processed later
    }

    const tagDefinition = metaGroupsService.getTagDefinition(group, id);
    if (!tagDefinition) {
      metaObj.allErrors.push({ id, label: 'Unknown Tag', msg: `No definition found for tag: ${group}.${id}` });
      return;
    }

    // Delegate to the metaGroupsService for group-specific processing
    metaGroupsService.delegatedMetaGroupSetter(
      group, id, value, metaObj, metaObj.allErrors, metaObj.allAlerts, tagDefinition, tagDefinition.multipleAllowed
    );
  });

  // 5. Process all collected alternate tags from the "resources" group
  if (altDataArray.length > 0) {
    processAlternateTags(altDataArray, metaObj, metaObj.allErrors, metaObj.allAlerts);
  }

  // 7. return the metaObj
  return metaObj;
}
