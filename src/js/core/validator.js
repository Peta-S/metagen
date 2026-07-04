/**
 * A generic validator for a single value based on schema rules.
 *
 * @param {string | number} value - The input value to validate.
 * @param {object} validation - The validation object from the schema (e.g., from schema.json's "validation" property).
 * @returns {{status: 'valid' | 'error' | 'alert', msg?: string}} - The validation result.
 */
export function validate(value, validation) {
  // 1. Generic Tests First
  if (typeof value === 'string' && /<script/i.test(value)) {
    return { status: 'error', msg: 'Input must not contain script tags.' };
  }

  // Handle NaN for number types before other numeric checks
  if ((validation.type === 'number' || validation.type === 'integer') && isNaN(Number(value))) {
    return { status: 'error', msg: 'Input must be a valid number.' };
  }

  // 2. Type-specific validation
  switch (validation.type) {
    case 'string':
      if (typeof value !== 'string') {
        return { status: 'error', msg: 'Expected a string.' };
      }

      // Pattern validation (error)
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return { status: 'error', msg: validation.patternHelp || 'Input does not match the required pattern.' };
        }
      }

      // Max length validation (error)
      if (validation.max !== undefined && value.length > validation.max) {
        return { status: 'error', msg: `Input exceeds maximum length of ${validation.max} characters.` };
      }
      // Min length validation (error)
      if (validation.min !== undefined && value.length < validation.min) {
        return { status: 'error', msg: `Input is shorter than minimum length of ${validation.min} characters.` };
      }

      // Recommended max length (alert)
      if (validation.recommendedMax !== undefined && value.length > validation.recommendedMax) {
        return { status: 'alert', msg: validation.warningMessage || `Input exceeds recommended maximum length of ${validation.recommendedMax} characters.` };
      }
      // Recommended min length (alert)
      if (validation.recommendedMin !== undefined && value.length < validation.recommendedMin) {
        return { status: 'alert', msg: validation.warningMessage || `Input is shorter than recommended minimum length of ${validation.recommendedMin} characters.` };
      }
      break;

    case 'number':
    case 'integer':
      const numValue = Number(value);
      if (typeof numValue !== 'number' || isNaN(numValue)) {
        return { status: 'error', msg: 'Expected a number.' };
      }
      if (validation.type === 'integer' && !Number.isInteger(numValue)) {
        return { status: 'error', msg: 'Expected an integer.' };
      }

      // Min value validation (error)
      if (validation.min !== undefined && numValue < validation.min) {
        return { status: 'error', msg: `Input is less than minimum value of ${validation.min}.` };
      }

      // Recommended min value (alert)
      if (validation.recommendedMin !== undefined && numValue < validation.recommendedMin) {
        return { status: 'alert', msg: validation.warningMessage || `Input is less than recommended minimum value of ${validation.recommendedMin}.` };
      }
      break;

    case 'enum':
      if (!Array.isArray(validation.enum)) {
        console.error('Validation schema error: "enum" type requires an array for "enum" property.');
        return { status: 'error', msg: 'Internal validation error: enum options not correctly defined.' };
      }
      if (!validation.enum.includes(value)) {
        return { status: 'error', msg: `Input is not one of the allowed values: ${validation.enum.join(', ')}.` };
      }
      break;

    case 'url':
      if (typeof value !== 'string') {
        return { status: 'error', msg: 'Expected a string for URL.' };
      }
      // Basic URL format check (can be expanded with a more robust regex if needed)
      // This pattern is taken from the schema documentation's example.
      const urlRegex = validation.pattern ? new RegExp(validation.pattern) : /^https?:\/\/.+/;
      if (!urlRegex.test(value)) {
        return { status: 'error', msg: validation.patternHelp || 'Input is not a valid URL.' };
      }
      break;

    case 'color':
      if (typeof value !== 'string') {
        return { status: 'error', msg: 'Expected a string for color.' };
      }
      // Pattern validation for hex color codes
      const colorRegex = validation.pattern ? new RegExp(validation.pattern) : /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorRegex.test(value)) {
        return { status: 'error', msg: validation.patternHelp || 'Input is not a valid hex color code.' };
      }
      break;
      
    // 'array' and 'object' types define structure, not direct value validation for a single primitive.
    // They are handled by iterating over their contained values and applying 'validate' to each.
    // Therefore, no direct handling needed in this single-value validator.
    default:
        // If an unknown validation type is encountered, it's safer to treat it as an error
        // or just let it pass if no specific rules apply. For now, we'll let it pass
        // as the schema implies if no rules, then it's valid.
        break;
  }

  // If no validation rules triggered an error or alert, the value is valid.
  return { status: 'valid' };
}
