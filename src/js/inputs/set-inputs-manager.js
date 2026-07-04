
import { metaGroupsService } from '../core/meta-groups-service.js';
import Collapsible from '../ui/components/collapsible.js';
import store from '../core/store.js';
import { createSingleInput } from '../inputs/create-input.js';
import { createColorInput } from '../core/meta-groups/global/set-inputs.js';
import { createAlternatesInput } from '../core/meta-groups/resources/set-inputs.js';
import { getOgImageSet } from '../core/meta-groups/social/set-inputs.js';
import Fieldset from '../inputs/fieldset.js';

// bottom-up composition
// 1. Import group schemas
// 2. For each group[key] get required inputs (getSingleInputGroup, getColorInputGroup, getAlternatesInputGroup)
//    - if key (tagId) is = getColorInputGroup
//    - if key (tagId) is = getAlternatesInputGroup
//    - else = getSingleInputGroup
//  *If (currentMetaObject) then get inputs prefilled (and an empty copy if multiallowed)
// 3. Set the fieldset with the group tagId and input/s
// 4. Add each returned fieldset to the fieldsetsFragment
// 5. Create the collapsibles and append them to the finalFormFragment
// 6. Append finalFormFragment to the form
export const setInputsManager = (formEl) => {
  const currentMetaObject = store.metaObjects[store.currentMetaObjIndex] || null;
  const finalFormFragment = document.createDocumentFragment();

  const groupIds = metaGroupsService.getAllGroupIds();

  groupIds.forEach((groupId, index) => {
    const groupSchema = store.schemas[groupId];
    if (!groupSchema) return;

    const groupFragment = document.createDocumentFragment();
    let ogImageUserData = {}; // To collect og:image data for social group
    const ogImageTagIds = (groupId === 'social') ? metaGroupsService.getOgImageTagIds() : [];
    let hasOgImageTags = false;

    const tagIds = Object.keys(groupSchema);

    tagIds.forEach(tagId => {
      // If og:image tags are handled by a separate function, collect their user data and skip individual processing
      if (groupId === 'social' && ogImageTagIds.includes(tagId)) {
        hasOgImageTags = true;
        const userData = currentMetaObject?.[groupId]?.[tagId];
        if (userData) {
          ogImageUserData[tagId] = userData;
        }
        return; // Skip individual fieldset creation for og:image tags
      }

      const tagSchema = groupSchema[tagId];
      const tagUserData = currentMetaObject?.[groupId]?.[tagId];

      let inputEls = [];
      let templateMultiInput = null;

      // Determine the attribute name for single/color inputs (assuming one input per tag for simplicity if not alternates)
      const attributeName = Object.keys(tagSchema.inputs)[0];
      const inputSchema = tagSchema.inputs[attributeName];

      const createInputAndMessage = (config, currentAttributeName = attributeName) => {
        if (tagId.includes('gl_theme_color')) {
          return createColorInput({
            group: groupId,
            tagId: tagId,
            attribute: currentAttributeName,
            input: inputSchema,
            userData: config.userData
          });
        } else if (tagId.includes('alternates')) {
          // Special handling for alternates input config
          // The userData for alternates is an object like { hreflang: {...}, href: {...} }
          return createAlternatesInput({
            group: groupId,
            tagId: tagId,
            inputs: tagSchema.inputs, // Pass the whole inputs object for alternates
            userData: config.userData
          });
        } else {
          return createSingleInput({
            group: groupId,
            tagId: tagId,
            attribute: currentAttributeName,
            input: inputSchema,
            userData: config.userData
          });
        }
      };

      if (tagSchema.multipleAllowed) {
        if (tagUserData && Array.isArray(tagUserData)) {
          tagUserData.forEach(data => {
            inputEls.push(createInputAndMessage({ userData: data }));
          });
        }
        // Always add an empty template for new instances
        templateMultiInput = createInputAndMessage({ userData: null });
      } else {
        inputEls.push(createInputAndMessage({ userData: tagUserData }));
      }

      const fieldsetConfig = {
        group: groupId,
        tagId: tagId,
        inputEls: inputEls,
        templateMultiInput: templateMultiInput
      };
      const fieldset = new Fieldset(fieldsetConfig);
      groupFragment.appendChild(fieldset.createFieldsetElement());
    });

    // After iterating through all tags in the group, handle og:image set if they exist
    if (groupId === 'social' && hasOgImageTags) {
      const ogImageSetEl = getOgImageSet({ ogImageUserData: ogImageUserData });
      groupFragment.appendChild(ogImageSetEl);
    }

    const heading = groupId.charAt(0).toUpperCase() + groupId.slice(1) + " Group";
    const initialState = index === 0 ? 'open' : 'closed';

    const collapsible = Collapsible.mainSectionCollapsible(groupId, heading, groupFragment, initialState);
    finalFormFragment.appendChild(collapsible);
  });

  formEl.appendChild(finalFormFragment);
};
