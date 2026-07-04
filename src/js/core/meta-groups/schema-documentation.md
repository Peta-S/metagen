# Meta Tag Schema Documentation

This document outlines the structure of the `schema.json` files used within each meta-tag group. These schemas define the properties, validation rules, and HTML generation logic for each meta tag.

---

## 1. Root Schema Structure

Each `schema.json` file is a root object where each key is a unique tag identifier (e.g., "gl_title", "og_title"). The value associated with each key is an object defining the meta tag's properties, input types, and validation rules.

```json
{
  "gl_charset": { ... },
  "gl_title": { ... },
  "gl_description": { ... }
}
```

---

## 2. Tag Object Properties

Each tag object (e.g., `gl_charset`) can have the following properties:

| Property           | Type      | Description                                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`               | `String`  | A unique identifier for the tag (e.g., "gl_title"). This should match the key of the parent object.                                                                                                                                                                                                                                                                       |
| `multipleAllowed`  | `Boolean` | (Optional) If `true`, indicates that this tag can appear multiple times in the generated output. Defaults to `false`.                                                                                                                                                                                                                                                    |
| `tag`              | `String`  | The HTML tag name (e.g., "meta", "title", "link"). Special handling may apply for "title" tags where content is placed directly between the tags.                                                                                                                                                                                                                        |
| `presetAttributes` | `Object`  | (Optional) An object containing key-value pairs for attributes that are always present on the HTML tag (e.g., `{ name: "description" }`). If the tag's `id` is also the primary attribute (like `charset` for `<meta charset="utf-8">`), this can be `null`.                                                                                                          |
| `userInfo`         | `Object`  | **(Required)** Contains user-facing information about the tag.                                                                                                                                                                                                                                                                                                            |
| `inputs`           | `Object`  | **(Required)** An object where each key represents an attribute name that takes user input (e.g., "content", "charset") and its value defines the input type and validation.                                                                                                                                                                                           |

### 2.1 The `userInfo` Object

This object contains metadata for displaying information about the tag to the user.

-   `label`: (String) The user-friendly display name for the input field (e.g., "Page Title").
-   `description`: (String) A helper text that explains the purpose of the tag.
-   `exampleOutput`: (String) A string showing an example of the generated HTML tag.

### 2.2 The `inputs` Object

This object defines the UI form fields and their associated validation rules. Each key in this object corresponds to an attribute name in the final HTML tag that will receive user input (e.g., `content`, `charset`). The value for each key is an object with the following properties:

-   `type`: (String) The type of form field to display. Common values include `text`, `textarea`, `select`, `color`, `url`, `number` (formerly integer), etc.
-   `placeholder`: (String) (Optional) If `type` is "text", this provides placeholder text for the input field.
-   `validation`: (Object) **(Required)** An object containing the validation rules for the user's input. The properties within depend on the `validation.type`.
-   If type is `select` then the options are populated from ...validate.enum

---

## 3. Validation Types

The `validation` object is critical for ensuring data integrity. Its behavior is determined by its `type` property.

### 3.1 `type: "string"`

Validates standard text input.

| Property           | Type      | Description                                                      |
| ------------------ | --------- | ---------------------------------------------------------------- |
| `min`              | `Number`  | The minimum allowed character length.                            |
| `max`              | `Number`  | The maximum allowed character length.                            |
| `recommendedMin`   | `Number`  | A "soft" minimum limit that shows a warning but does not fail.   |
| `recommendedMax`   | `Number`  | A "soft" maximum limit that shows a warning but does not fail.   |
| `pattern`          | `String`  | A regular expression string the input value must match.          |
| `patternHelp`      | `String`  | A user-friendly message explaining the pattern.                  |
| `warningMessage`   | `String`  | A message to display when a recommended limit is exceeded.       |
| `allowMultiple`    | `Boolean` | If true, indicates the input can be repeated (e.g., for keywords). |

**Example:**
```json
"validation": {
  "type": "string",
  "max": 70,
  "recommendedMax": 60,
  "warningMessage": "Titles over 60 characters are truncated by Google."
}```

### 3.2 `type: "enum"`

Validates that the input is one of a predefined set of values. Used for `select` inputs.

| Property | Type    | Description                  |
| -------- | ------- | ---------------------------- |
| `enum`   | `Array` | An array of allowed strings. |

**Example:**
```json
validation: { 
    "type": "enum", 
    "enum": "['utf-8', 'ISO-8859-1']" 
}
 ```

### 3.3 `type: "url"`

Validates that the input is a URL.

| Property        | Type      | Description                                             |
| --------------- | --------- | ------------------------------------------------------- |
| `pattern`       | `String`  | A regex pattern to validate the URL format.             |
| `patternHelp`   | `String`  | A user-friendly message explaining the URL format.      |

**Example:**
```json
"validation": {
  "type": "url",
  "pattern": "^https?://.+",
  "patternHelp": "Must be an absolute URL starting with http:// or https://"
}
```

### 3.5 `type: "color"`

Validates that the input is a hex color code.

| Property      | Type      | Description                             |
| ------------- | --------- | --------------------------------------- |
| `pattern`     | `String`  | A regex pattern for hex color codes.    |
| `patternHelp` | `String`  | A message explaining the color format.  |

**Example:**
```json
"validation": {
  "type": "color",
  "pattern": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
  "patternHelp": "Must be a valid Hex color code."
}
```
