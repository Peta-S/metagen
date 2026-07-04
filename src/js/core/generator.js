import { sanitizeHTML } from './sanitizer.js';
import { metaGroupsService } from './meta-groups-service.js';
import { escapeHtml } from '../utils/helpers.js';

/**
 * @typedef {Object} TagConfig
 * @property {string} tag - The HTML tag name (e.g., "meta", "title").
 * @property {Object.<string, string>} [attributes] - Key-value pairs for attributes (for "meta" tags).
 * @property {string} [title] - The title text (for "title" tags).
 * @property {string} [comment] - Optional comment to add before the tag.
 */

const isEmpty = (val) => val === null || val === undefined || (typeof val === 'string' && val.trim() === '');
const s = sanitizeHTML;

/**
 * Generates an HTML tag string based on the provided TagConfig.
 *
 * @param {TagConfig} tagConfig - The configuration object for the tag.
 * @returns {string} The generated HTML tag string.
 */
const generateTagHtml = (tagConfig) => {
  if (!tagConfig || !tagConfig.tag) {
    return '';
  }

  let html = '';
  if (tagConfig.comment) {
    html += `\n    <!-- ${s(tagConfig.comment)} -->\n`;
  }

  switch (tagConfig.tag) {
    case 'title':
      if (!isEmpty(tagConfig.title)) {
        html += `    <title>${escapeHtml(tagConfig.title)}</title>\n`;
      }
      break;
    case 'meta':
      if (tagConfig.attributes) {
        const attrString = Object.entries(tagConfig.attributes)
          .filter(([, value]) => !isEmpty(value))
          .map(([key, value]) => `${s(key)}="${escapeHtml(value)}"`).join(' ');
        if (!isEmpty(attrString)) {
          html += `    <meta ${attrString}>\n`;
        }
      }
      break;
    case 'link':
        if (tagConfig.attributes) {
            const attrString = Object.entries(tagConfig.attributes)
            .filter(([, value]) => !isEmpty(value))
            .map(([key, value]) => `${s(key)}="${escapeHtml(value)}"`).join(' ');
            if (!isEmpty(attrString)) {
                html += `    <link ${attrString}>\n`;
            }
        }
        break;
    // Add other cases as needed (e.g., 'link' tags)
    default:
      // For unsupported tag types, return an empty string or log a warning
      console.warn(`Unsupported tag type: ${tagConfig.tag}`);
      break;
  }
  return html;
};

/**
 * Generates a TagConfig object and its corresponding HTML string for a given tag definition and input attributes.
 *
 * @param {string} group - The meta-group ID (e.g., 'global', 'resources').
 * @param {string} tagId - The ID of the specific tag (e.g., 'gl_title', 'res_canonical').
 * @param {Object.<string, string>} attsObj - An object where keys are attribute names (or 'text' for title)
 *                                            and values are the user-provided inputs for those attributes.
 * @returns {{tagConfig: TagConfig, htmlString: string}} An object containing the generated TagConfig and HTML string.
 */
const getTagConfigAndHtml = (group, tagId, attsObj) => {
  const tagDefinition = metaGroupsService.getTagDefinition(group, tagId);

  if (!tagDefinition) {
    console.warn(`Tag definition not found for group: ${group}, tagId: ${tagId}`);
    return { tagConfig: null, htmlString: '' };
  }

  const tagConfig = {
    tag: tagDefinition.tag,
  };

  switch (tagDefinition.tag) {
    case 'title':
      // For title tags, the input value is usually under 'text' key in attsObj
      if (attsObj && attsObj.text !== undefined) {
        tagConfig.title = attsObj.text;
      }
      break;
    case 'meta':
    case 'link':
      tagConfig.attributes = {};
      // Add preset attributes first
      if (tagDefinition.presetAttributes) {
        Object.assign(tagConfig.attributes, tagDefinition.presetAttributes);
      }
      // Add dynamic attributes from attsObj
      if (attsObj) {
        Object.assign(tagConfig.attributes, attsObj);
      }
      break;
    // Add other cases if new tag types are introduced
  }

  const htmlString = generateTagHtml(tagConfig);

  return { tagConfig, htmlString };
};

export { generateTagHtml, getTagConfigAndHtml };
