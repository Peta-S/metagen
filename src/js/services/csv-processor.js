// src/js/services/csv-processor.js

import CSVParser from './csv-parser.js';
import { metaObjSetter } from '../core/meta-object-setter.js';
import store from '../core/store.js';
import { convertCsvLinesToObjects } from '../core/meta-delegate.js';
import { navigate } from '../ui/view-manager.js';

/**
 * Processes an array of CSV file contents using the CSVParser.
 * Aggregates all parsed lines and errors from multiple CSV files.
 *
 * @param {Array<string>} csvFilesContent - An array where each element is a string
 *   representing the raw content of a CSV file.
 * @returns {{allLines: Array<Array<string>>, allErrors: Array<{fileName: string, line: number, error: string}>}}
 *   An object containing:
 *   - `allLines`: An array of all successfully parsed `[id, input]` pairs from all files.
 *   - `allErrors`: An array of all errors encountered during parsing, including the
 *     file name where the error occurred, the line number, and the error message.
 */
export function processCsvFiles() {
  store.metaObjects = []; // reset store data for new processing
  store.csvFileErrors = [];
  store.currentMetaObjIndex = 0;

  if (!store.csvFiles || store.csvFiles.length === 0) {
    console.log("No CSV files to process.");
    return false; // Indicate no processing occurred
  }

  const parser = new CSVParser();

  store.csvFiles.forEach((file) => {
    const fileName = file.name || `file_${store.csvFiles.indexOf(file) + 1}`; // Use file.name if available, otherwise a placeholder

    try {
      const { lines, errors } = parser.parse(file.content);

      // Convert the raw CSV lines into the standardized object format
      const formattedObjects = convertCsvLinesToObjects(lines, fileName);

      // The metaObjSetter will now receive the array of formatted objects.
      let metaObject = metaObjSetter(formattedObjects); // Get the meta object from the setter

      // Augment the metaObject with parsing errors
      if (errors.length > 0) {
        metaObject.parsingErrors = errors.map(err => ({
          line: err.line,
          error: err.error
        }));
        console.error(`Errors in ${fileName}:`, metaObject.parsingErrors);
      }

      store.metaObjects.push(metaObject); // Push the augmented metaObject to store

    } catch (error) {
      // Catch errors that might occur during the overall parsing of a file.
      const fileError = {
        fileName: fileName,
        error: `Failed to parse file: ${error.message}`
      };
      // For file-level errors, create a minimal metaObject to record the failure
      store.csvFileErrors.push({
        fileName: fileName,
        parsingErrors: [fileError]
      });
      console.error(`Error processing ${fileName}:`, fileError);
    }
  });

  if(store.metaObjects.length > 0 ) {
    navigate('output');
    return true;
  } else {
    alert('An Error occured, please try again.')
    return false;
  }
  
   // Indicate processing was attempted
}
