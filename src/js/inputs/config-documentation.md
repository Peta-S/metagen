# Input Configuration Settings Documentation

This document outlines the various configuration objects used for dynamic input generation and management within the `src/js/inputs` module. These configurations define the structure and behavior of individual inputs, fieldsets, and specialized input groups.

---

## 1. `singleInputConfig`

Used by `createSingleInput` (from `create-input.js`) and `createColorInput` (from `src/js/core/meta-groups/global/set-inputs.js`). This configuration defines a single input element and its associated validation message holder.

```javascript
singleInputConfig {
  group: string, // The meta group ID (e.g., 'global', 'social'). Maps to data-group attribute.
  tagId: string, // The unique ID of the tag (e.g., 'gl_title', 'gl_charset'). Maps to data-tagid attribute.
  attribute: string, // The attribute name within the tag (e.g., 'content', 'charset', 'text'). Maps to data-attribute attribute.
  input: object, // The input definition from the schema (e.g., schema.inputs.content).
                  // Contains properties like `type` ('text', 'textarea', 'select', 'number', 'url'), `placeholder`, and `validation` rules.
  userData?: { // Optional: Existing user data to pre-populate the input and display validation messages.
    value?: string, // The value to set for the input.
    validStatus?: 'valid' | 'alert' | 'error', // The validation status.
    msg?: string // A validation message to display.
  }
}
```

---

## 2. `altsInputConfig`

Used by `createAlternatesInput` (from `src/js/core/meta-groups/resources/set-inputs.js`). This configuration defines a set of two linked inputs, typically used for `hreflang` and `href` attributes for alternate links.

```javascript
altsInputConfig {
  group: string, // The meta group ID (e.g., 'resources'). Maps to data-group attribute.
  tagId: string, // The unique ID of the tag (e.g., 'res_alternates'). Maps to data-tagid attribute.
  inputs: { // An object containing the definitions for the two linked inputs.
    hreflang: object, // Input definition for the 'hreflang' attribute (from schema.inputs.hreflang).
                       // Contains properties like `type`, `placeholder`, and `validation`.
    href: object // Input definition for the 'href' attribute (from schema.inputs.href).
                 // Contains properties like `type`, `placeholder`, and `validation`.
  },
  userData?: { // Optional: Existing user data to pre-populate the linked inputs.
    hreflang?: { // User data for the 'hreflang' input.
      value?: string,
      validStatus?: 'valid' | 'alert' | 'error',
      msg?: string
    },
    href?: { // User data for the 'href' input.
      value?: string,
      validStatus?: 'valid' | 'alert' | 'error',
      msg?: string
    }
  }
}
```

---

## 3. `ogImageSetConfig`

Used by `getOgImageSet` (from `src/js/core/meta-groups/social/set-inputs.js`). This configuration is specific to Open Graph image tags and handles the creation of a complex set of related inputs (URL, width, height, type, alt) with dynamic addition capabilities.

```javascript
ogImageSetConfig {
  ogImageUserData?: { // Optional: An object containing arrays of user data for each OG image tag, keyed by tagId.
    [tagId: string]: Array<{ // Example: 'og_image_url': [{ value: '...', validStatus: '...' }, ...]
      value?: string,
      validStatus?: 'valid' | 'alert' | 'error',
      msg?: string
    }>
  }
}
```
*Note: This config expects `ogImageUserData` to be structured such that each `tagId` (e.g., `og_image_url`, `og_image_width`) maps to an array of user data objects, where each object corresponds to a specific instance of the image group.*

---

## 4. `fieldsetConfig`

Used by the `Fieldset` class constructor (from `fieldset.js`). This configuration defines the properties and content for a fieldset, which visually groups related input elements.

```javascript
fieldsetConfig {
  group: string, // The meta group ID the fieldset belongs to.
  tagId: string, // The unique ID of the tag or a representative ID for a group of tags (e.g., 'gl_title', 'og_image' for the OG image set).
  inputEls?: DocumentFragment[], // Optional: An array of DocumentFragments, where each fragment contains the input elements for a single instance of the tag.
                                 // Used for tags that do not allow multiple instances, or for initial instances of multiple-allowed tags.
  templateMultiInput?: DocumentFragment // Optional: A DocumentFragment to be used as a template for dynamically adding new instances of inputs
                                       // when `multipleAllowed` is true for the tag. This fragment should contain blank input elements.
}
```
