// src/js/core/meta-groups/resources/setter.js

import { metaGroupsService } from '../../meta-groups-service.js';
import { validate } from '../../validator.js';
import { getTagConfigAndHtml } from '../../generator.js';
import { setGroupObject } from '../../../utils/helpers.js'; // Added this import

// The setGroupObjects function previously defined here has been centralized
// in meta-object-setter.js and processGroupObject in helpers.js.

/**
 * Processes an array of alternate tag data, validates them, pairs them, and generates HTML link tags.
 * Directly modifies the provided metaObj, allErrors, and allAlerts arrays.
 *
 * @param {Array<Object>} altDataArray - An array of objects, each containing:
 *   - {string} group: The group ID (e.g., 'resources').
 *   - {string} id: The input ID (e.g., 'alternate_1_lang', 'alternate_1_url').
 *   - {string} value: The raw input value.
 * @param {object} metaObj - The main meta object to update.
 * @param {Array<Object>} allErrors - Array to accumulate error objects.
 * @param {Array<Object>} allAlerts - Array to accumulate alert objects.
 */
export function processAlternateTags(altDataArray, metaObj, allErrors, allAlerts) {
  const groupedAlts = new Map(); // Map<number, { lang?: { group, id, value }, url?: { group, id, value } }>
  const resAlternatesForMetaObj = [];

  // Group alternate tags by their numeric ID (e.g., '1' from 'alternate_1_lang')
  altDataArray.forEach(item => {
    const parts = item.id.split('_'); // e.g., ['alternate', '1', 'lang']
    if (parts.length === 3 && parts[0] === 'alternate') {
      const index = parseInt(parts[1], 10);
      const type = parts[2]; // 'lang' or 'url'

      if (!isNaN(index)) {
        if (!groupedAlts.has(index)) {
          groupedAlts.set(index, {});
        }
        groupedAlts.get(index)[type] = item;
      }
    }
  });

  const sortedIndices = Array.from(groupedAlts.keys()).sort((a, b) => a - b);

  sortedIndices.forEach(index => {
    const pair = groupedAlts.get(index);
    const langInput = pair.lang;
    const urlInput = pair.url;

    // Check for missing pairs (only one part of the pair exists)
    if (!langInput && urlInput) {
      allErrors.push({ id: urlInput.id, label: 'Missing Language', msg: `Alternate tag ${index} is missing its 'lang' value.` });
      return;
    }
    if (langInput && !urlInput) {
      allErrors.push({ id: langInput.id, label: 'Missing URL', msg: `Alternate tag ${index} is missing its 'url' value.` });
      return;
    }
    if (!langInput && !urlInput) {
      // This pair might have been completely empty or invalid, skip
      return;
    }

    const processedLang = { value: langInput.value, validStatus: 'valid' };
    const processedUrl = { value: urlInput.value, validStatus: 'valid' };

    // Get validation rules
    const langValidationRules = metaGroupsService.getInputValidationRules('resources', 'res_alternates', 'hreflang');
    const urlValidationRules = metaGroupsService.getInputValidationRules('resources', 'res_alternates', 'href');

    let isPairValid = true;

    // Validate language
    if (langValidationRules) {
      const validationResult = validate(langInput.value, langValidationRules);
      processedLang.validStatus = validationResult.status;
      if (validationResult.msg) {
        processedLang.msg = validationResult.msg;
      }
      if (validationResult.status === 'error') {
        isPairValid = false;
        allErrors.push({ id: langInput.id, label: 'Hreflang Error', msg: validationResult.msg });
      } else if (validationResult.status === 'alert') {
        allAlerts.push({ id: langInput.id, label: 'Hreflang Alert', msg: validationResult.msg });
      }
    }

    // Validate URL
    if (urlValidationRules) {
      const validationResult = validate(urlInput.value, urlValidationRules);
      processedUrl.validStatus = validationResult.status;
      if (validationResult.msg) {
        processedUrl.msg = validationResult.msg;
      }
      if (validationResult.status === 'error') {
        isPairValid = false;
        allErrors.push({ id: urlInput.id, label: 'URL Error', msg: validationResult.msg });
      } else if (validationResult.status === 'alert') {
        allAlerts.push({ id: urlInput.id, label: 'URL Alert', msg: validationResult.msg });
      }
    }

    // Add to a temporary array for res_alternates (note: the schema uses 'hreflang' and 'href' as keys, not 'lang' and 'url')
    resAlternatesForMetaObj.push({ hreflang: processedLang, href: processedUrl });

    // Generate tag if both are valid
    if (isPairValid && processedLang.validStatus !== 'error' && processedUrl.validStatus !== 'error') {
      const attsObj = { hreflang: langInput.value, href: urlInput.value };
      const { htmlString } = getTagConfigAndHtml('resources', 'res_alternates', attsObj);
      if (htmlString) {
        metaObj.tagsHtmlStrings.push(htmlString);
      }
    }
  });

  // Use setGroupObject to add the collected res_alternates to the metaObj
  if (resAlternatesForMetaObj.length > 0) {
    setGroupObject(metaObj, 'resources', 'res_alternates', resAlternatesForMetaObj, true);
  }
}
