class CSVParser {
  /**
   * Parses a CSV string to extract specific data based on template requirements.
   *
   * The function expects a CSV where:
   * - The second column is the 'id'.
   * - The third column is the 'user input'.
   *
   * It skips:
   * - The first line (header).
   * - Lines beginning with '*'.
   * - Empty lines.
   *
   * @param {string} csvText - The raw CSV content as a string.
   * @returns {{lines: Array<Array<string>>, errors: Array<{line: number, error: string}>}} An object containing
   *   an array of successfully parsed [id, input] pairs and an array of errors.
   */
  parse(csvText) {
    // Remove BOM if present
    csvText = csvText.replace(/^\uFEFF/, '');

    const allLines = this._splitLines(csvText);
    const resultLines = [];
    const errors = [];

    // Skip the first line (header) and iterate from the second line
    for (let i = 1; i < allLines.length; i++) {
      const originalLine = allLines[i];
      const lineNumber = i + 1; // Human-readable line number

      // Skip empty lines and lines starting with '*' (comments)
      if (!originalLine.trim() || originalLine.trim().startsWith('*')) {
        continue;
      }

      try {
        const columns = this._parseLine(originalLine);

        // Ensure there are at least 3 columns (Section, Field, YourInput)
        if (columns.length < 3) {
          errors.push({ line: lineNumber, error: `Insufficient columns. Expected at least 3, got ${columns.length}.` });
          continue;
        }

        const id = columns[1].trim(); // Second column (Field)
        const userInput = columns[2].trim(); // Third column (YourInput)
        if (id !== "") resultLines.push([id, userInput]);

        
      } catch (error) {
        errors.push({ line: lineNumber, error: error.message });
      }
    }

    return { lines: resultLines, errors: errors };
  }

  /**
   * Splits a multi-line string into an array of lines, handling different line endings.
   * @param {string} text - The input string.
   * @returns {string[]} An array of lines.
   * @private
   */
  _splitLines(text) {
    return text.split(/\r\n|\n|\r/);
  }

  /**
   * Parses a single CSV line into an array of column values, handling quoted fields.
   * This is an adaptation of a standard CSV parsing logic.
   * @param {string} line - The CSV line to parse.
   * @returns {string[]} An array of column values.
   * @private
   */
  _parseLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote: "" becomes "
          current += '"';
          i += 2;
          continue;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
          continue;
        }
      }

      if (char === ',' && !inQuotes) {
        // End of field
        values.push(current);
        current = '';
        i++;
        continue;
      }

      current += char;
      i++;
    }

    // Push the last field
    values.push(current);

    return values;
  }
}

// Export for modularity
export default CSVParser;
