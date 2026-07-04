import { metaGroupsService } from '../../meta-groups-service.js';
import Fieldset from '../../../inputs/fieldset.js';
import { createSingleInput } from '../../../inputs/create-input.js';
// import store from '../core/store.js';

//store.schemas[groupId];

function getHrElement(){
    return document.createElement('hr');
}

function getGroupTitle(){
    const titleEl = document.createElement('p');
    titleEl.classList.add('og-group-title')
    titleEl.innerText = `Image Group`
    return titleEl
}

/**
 * Creates a complex input set for Open Graph image tags.
 * It handles multiple image groups, with the first one wrapped in a Fieldset for better UI context.
 * It also provides a template and a button to dynamically add more image groups.
 *
 * @param {object} ogImageSetConfig - Configuration for the OG image set.
 * @param {object} [ogImageSetConfig.ogImageUserData] - Object containing arrays of user data for each OG image tag, keyed by tagId.
 * @returns {HTMLElement} The container element for the entire OG image input set.
 */
export function getOgImageSet(ogImageSetConfig) {
    const { ogImageUserData } = ogImageSetConfig;

    // 1. Create main container that will be returned
    const ogImageSetEl = document.createElement('div');
    ogImageSetEl.className = 'og-image-set-container';
    ogImageSetEl.appendChild(getHrElement())

    
    const ogImageTagIds = metaGroupsService.getOgImageTagIds();

    // --- 2. Create the first image group and wrap each input in a Fieldset ONLY for the first group---
    const firstInstanceInputFragment = document.createDocumentFragment();
    firstInstanceInputFragment.appendChild(getGroupTitle(1))
    ogImageTagIds.forEach(tagId => {
        const schema = metaGroupsService.getTagDefinition('social', tagId);
        if (!schema || !schema.inputs) return;
        
        const attribute = Object.keys(schema.inputs)[0];
        const inputSchema = schema.inputs[attribute];

        const userDataForTag = ogImageUserData ? ogImageUserData[tagId] : null;
        const firstUserData = userDataForTag && userDataForTag[0] ? userDataForTag[0] : null;

        const singleInputConfig = {
            group: 'social',
            tagId,
            attribute,
            input: inputSchema,
            userData: firstUserData
        };
        const firstTagInput = createSingleInput(singleInputConfig)
        // get the fieldset for each tag for the first instance only
        // the below needs to have the tagId for only the first group
        const fieldsetConfig = {
            group: 'social',
            tagId: tagId, // og_image Use a representative tag for the Fieldset's context and info modal
            inputEls: [firstTagInput]
        };
        const fieldset = new Fieldset(fieldsetConfig);
        // ogImageSetEl.appendChild(fieldset.createFieldsetElement());
        //firstInstanceInputFragment.appendChild(createSingleInput(singleInputConfig));
        firstInstanceInputFragment.appendChild(fieldset.createFieldsetElement());
        
    });
    firstInstanceInputFragment.appendChild(getHrElement())

    ogImageSetEl.appendChild(firstInstanceInputFragment);


    // --- 3. Create groups for any additional images found in user data ---
    const numInstances = ogImageUserData?.og_image_url?.length || 0;
    if (numInstances > 1) {
        for (let i = 1; i < numInstances; i++) {
            const subsequentGroupEl = document.createElement('div');
            subsequentGroupEl.appendChild(getGroupTitle(1 + i))
            subsequentGroupEl.className = 'og-image-instance additional-image-group';
            
            ogImageTagIds.forEach(tagId => {
                const schema = metaGroupsService.getTagDefinition('social', tagId);
                if (!schema || !schema.inputs) return;

                const attribute = Object.keys(schema.inputs)[0];
                const inputSchema = schema.inputs[attribute];
                const userData = (ogImageUserData && ogImageUserData[tagId] && ogImageUserData[tagId][i]) ? ogImageUserData[tagId][i] : null;
                
                const singleInputConfig = {
                    group: 'social',
                    tagId,
                    attribute,
                    input: inputSchema,
                    userData
                };
                subsequentGroupEl.appendChild(createSingleInput(singleInputConfig));
            });
            ogImageSetEl.appendChild(subsequentGroupEl);
            
        }
        // ogImageSetEl.appendChild(getHrElement());
        
    }
    // ogImageSetEl.appendChild(getHrElement());

    // --- 4. Create a <template> for adding new, blank image groups ---
    const template = document.createElement('template');
    const templateContentFragment = document.createDocumentFragment();
    templateContentFragment.appendChild(getGroupTitle());
    ogImageTagIds.forEach(tagId => {
        const schema = metaGroupsService.getTagDefinition('social', tagId);
        if (!schema || !schema.inputs) return;

        const attribute = Object.keys(schema.inputs)[0];
        const inputSchema = schema.inputs[attribute];
        
        const blankConfig = {
            group: 'social',
            tagId,
            attribute,
            input: inputSchema,
            userData: null // Ensure inputs are blank
        };
        templateContentFragment.appendChild(createSingleInput(blankConfig));
    });
    // templateContentFragment.appendChild(getHrElement());
    
    const templateInstanceWrapper = document.createElement('div');
    templateInstanceWrapper.className = 'og-image-instance additional-image-group';
    templateInstanceWrapper.appendChild(templateContentFragment);
    // templateInstanceWrapper.appendChild(getHrElement());
    template.content.appendChild(templateInstanceWrapper);
    ogImageSetEl.appendChild(template);

    // --- 5. Add a button to append new instances from the template ---
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = '+ Add new image group';
    addButton.className = 'add-another-btn btn secondary-btn';
    
    addButton.addEventListener('click', () => {
        const newInstance = template.content.cloneNode(true);
        ogImageSetEl.insertBefore(newInstance, addButton);
    });
    
    ogImageSetEl.appendChild(addButton);
    
    return ogImageSetEl;
}
