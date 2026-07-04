/**
 * @file meta-delegate.js
 * @description Delegates tasks to appropriate meta-group modules based on ID prefixes.
 * This acts as a central router for handling different meta tag groups.
 */

// Defines the mapping from a specific ID prefix to its logical group name.
const prefixToGroupMap = {
    // `setName` is a special case, handled directly by the store/view manager.
    // set: 'name',

    // Global SEO and document settings
    gl: 'global',

    // Resource links (canonical, alternate, etc.)
    res: 'resources',
    alternate: 'resources',

    // Social media cards (Open Graph, Twitter, etc.)
    og: 'social',
    fb: 'social',
    twt: 'social',

    // article specific tags for articles
    art: 'article',

    // eCommerce specific tags for products
    ec: 'eCommerce',
    twitter: 'eCommerce',

    // Advanced settings (verification, http-equiv, schema)
    ver: 'advanced',
    httpEquiv: 'advanced',
    itemprop: 'advanced',

    // *for the main object
    set: 'main',
};

/**
 * Retrieves the logical group name associated with a given element ID.
 *
 * The function works by extracting the prefix from the ID (the part before the
 * first underscore) and looking it up in the `prefixToGroupMap`.
 *
 * @param {string} id - The full ID of the input element (e.g., 'gl_title', 'og_image_1_url').
 * @returns {string|null} The corresponding group name (e.g., 'global', 'social') or null if no matching group is found.
 *
 * @example
 * // returns 'global'
 * getGroupFromId('gl_charset');
 *
 * @example
 * // returns 'social'
 * getGroupFromId('og_title');
 *
 * @example
 * // returns 'eCommerce'
 * getGroupFromId('ec_priceAmount');
 *
 * @example
 * // returns null
 * getGroupFromId('unknown_id');
 */
export const getGroupFromId = (id) => {
    if (!id || typeof id !== 'string') {
        return null;
    }
    const prefix = id.split('_')[0];
    return prefixToGroupMap[prefix] || null;
};

/**
 * Converts CSV lines into an array of objects, each containing group, id, and value.
 * This format is compatible with the one generated from manual form inputs.
 * If 'set_name' is not present in the lines, it will be added using the filename.
 *
 * @param {Array<Array<string>>} lines - An array of `[id, value]` pairs from CSV parsing.
 * @param {string} filename - The name of the source file, used as a fallback for 'set_name'.
 * @returns {Array<{group: string|null, id: string, value: string}>} An array of formatted objects.
 *
 * @example
 * // returns [{ group: 'global', id: 'gl_title', value: 'My Page' }, { group: 'main', id: 'set_name', value: 'my-csv.csv' }]
 * convertCsvLinesToObjects([['gl_title', 'My Page']], 'my-csv.csv');
 */
export const convertCsvLinesToObjects = (lines, filename) => {
    const objects = lines.map(([id, value]) => ({
        group: getGroupFromId(id),
        id,
        value,
    }));

    // 1. Try to find the actual object reference
    const setNameObj = objects.find(obj => obj.id === 'set_name');

    // 2. Define the fallback value from the filename
    const fallbackValue = filename.replace(/\.csv$/, '');

    if (!setNameObj) {
        // SCENARIO A: The key 'set_name' does not exist at all.
        // Add it to the top.
        objects.unshift({
            group: 'main',
            id: 'set_name',
            value: fallbackValue,
        });
    } else if (!setNameObj.value || setNameObj.value.trim() === '') {
        // SCENARIO B: The key exists, but the value is empty (or just whitespace).
        // Update the existing object's value.
        setNameObj.value = fallbackValue;
    }
    return objects;
};


