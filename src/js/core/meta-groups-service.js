
import globalSchema from './meta-groups/global/schema.json';
import advancedSchema from './meta-groups/advanced/schema.json';
import eCommerceSchema from './meta-groups/eCommerce/schema.json';
import articleSchema from './meta-groups/article/schema.json';
import resourcesSchema from './meta-groups/resources/schema.json';
import socialSchema from './meta-groups/social/schema.json';

// Import centralized processing function and core dependencies
import { processGroupObject } from '../utils/helpers.js';
import { validate } from './validator.js';
import { getTagConfigAndHtml } from './generator.js';

import store from './store.js'

class MetaGroupsService {
  /**
   * Returns a list of all available group IDs.
   * @returns {string[]} An array of group IDs.
   */
  getAllGroupIds() {
    return Object.keys(store.schemas);
  }

  // tagid list must remain in this order
  getOgImageTagIds() {
    return ["og_image_url", "og_image_width", "og_image_height", "og_image_type", "og_image_alt"]
  }

  setAllSchemas() {
    store.schemas = {
      global: globalSchema,
      social: socialSchema,
      eCommerce: eCommerceSchema,
      article: articleSchema,
      resources: resourcesSchema,
      advanced: advancedSchema,
    };
  }

  /**
   * Delegates the setting of a meta group object to the appropriate group-specific setter.
   * This function now centralizes the common processing logic for all groups.
   * @param {string} group - The group ID (e.g., 'social', 'global').
   * @param {string} id - The ID of the input within the group.
   * @param {string} value - The value of the input.
   * @param {object} metaObj - The main meta object to update.
   * @param {Array<Object>} allErrors - Array to accumulate error objects.
   * @param {Array<Object>} allAlerts - Array to accumulate alert objects.
   * @param {object} tagDefinition - The definition of the tag from the schema.
   * @param {boolean} isMultipleAllowed - True if multiple entries are allowed for this id.
   */
  delegatedMetaGroupSetter(group, id, value, metaObj, allErrors, allAlerts, tagDefinition, isMultipleAllowed) {
    // Specific pre-check for the 'resources' group (originally in resources/setter.js)
    if (group === 'resources' && !isMultipleAllowed && metaObj[group] && metaObj[group][id]) {
      const userInfo = this.getTagUserInfo(group, id); // Use 'this' for class method
      allErrors.push({
        id,
        label: userInfo ? userInfo.label : id,
        msg: `Only one '${userInfo ? userInfo.label : id}' tag is allowed in the '${group}' group.`,
      });
      return; // Early exit
    }

    // Call the centralized processGroupObject helper
    processGroupObject(
      group,
      id,
      value,
      metaObj,
      allErrors,
      allAlerts,
      tagDefinition,
      isMultipleAllowed,
      validate,
      getTagConfigAndHtml,
      this // Pass the instance of metaGroupsService itself
    );
  }

  /**
   * Retrieves a specific tag definition from a group's schema.
   * @param {string} groupId - The ID of the meta-group.
   * @param {string} tagId - The ID of the tag within the group.
   * @returns {object|null} The tag definition object, or null if not found.
   */
  getTagDefinition(groupId, tagId) {
    if (!store.schemas[groupId]) {
      return null;
    }
    return store.schemas[groupId][tagId] || null;
  }

  /**
   * Retrieves the validation object for a specific input within a tag.
   * @param {string} groupId - The ID of the meta-group (e.g., 'resources').
   * @param {string} tagId - The ID of the tag (e.g., 'res_alternates').
   * @param {string} attributeName - The name of the input attribute (e.g., 'hreflang', 'href').
   * @returns {object|null} The validation object, or null if not found.
   */
  getInputValidationRules(groupId, tagId, attributeName) {
    const tagDefinition = this.getTagDefinition(groupId, tagId);
    if (!tagDefinition || !tagDefinition.inputs || !tagDefinition.inputs[attributeName]) {
      return null;
    }
    return tagDefinition.inputs[attributeName].validation || null;
  }

  /**
   * Retrieves input requirements for a specific tag within a group's schema.
   * @param {string} groupId - The ID of the meta-group.
   * @param {string} tagId - The ID of the tag within the group.
   * @param {string} attributeName - The name of the input attribute.
   * @returns {object|null} The input requirements object, or null if not found.
   */
  getTagInputRequirements(groupId, tagId, attributeName) {
    const tagDefinition = this.getTagDefinition(groupId, tagId);
    if (!tagDefinition || !tagDefinition.inputs || !tagDefinition.inputs[attributeName]) {
      return null;
    }
    // Return the entire input definition for the attribute
    return tagDefinition.inputs[attributeName] || null;
  }

  /**
   * Retrieves user-facing information (label, description, etc.) for a specific tag.
   * @param {string} groupId - The ID of the meta-group.
   * @param {string} tagId - The ID of the tag within the group.
   * @returns {object|null} An object containing user info (label, description), or null.
   */
  getTagUserInfo(groupId, tagId) {
    const tagDefinition = this.getTagDefinition(groupId, tagId);
    if (tagDefinition && tagDefinition.userInfo) {
      return tagDefinition.userInfo;
    }
    return null;
  }
}

export const metaGroupsService = new MetaGroupsService();
