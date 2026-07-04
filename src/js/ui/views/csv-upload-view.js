const viewHTML = `
  <div class="view-container">
    <h2 class="landing-title">CSV Upload</h2>

    <!-- View 1: Upload -->
    <div id="csv-upload-view">
      <div id="drop-zone" class="upload-drop-zone">
        <p class="drop-zone-text">Drag & drop your .csv files here</p>
        <p class="drop-zone-text-or">or</p>
        <button id="file-browser-btn" class="btn btn-secondary">Browse Files</button>
        <input type="file" id="file-input" style="display: none;" accept=".csv" multiple>
      </div>
    </div>

    <!-- View 2: File Display -->
    <div id="csv-file-display-view" style="display: none;">
      <p>File: <span id="file-name"></span></p>
      <button id="generate-tags-btn" class="btn btn-primary">Generate Tags</button>
    </div> 

    <!-- View 3: Processing -->
    <div id="csv-processing-view" style="display: none;">
      <p>Processing...</p>
    </div>

    <div class="navigation-controls">
      <button id="back-to-selection-btn" class="btn btn-secondary">← Back</button>
    </div>
  </div>
`;

import store from '../../core/store.js';
import { processCsvFiles } from '../../services/csv-processor.js';

export const csvUploadView = () => {
  const element = document.createElement('div');
  element.innerHTML = viewHTML.trim();

  const viewContainer = element.firstElementChild;

  const uploadView = viewContainer.querySelector('#csv-upload-view');
  const fileDisplayView = viewContainer.querySelector('#csv-file-display-view');
  const processingView = viewContainer.querySelector('#csv-processing-view');

  const dropZone = viewContainer.querySelector('#drop-zone');
  const fileBrowserBtn = viewContainer.querySelector('#file-browser-btn');
  const fileInput = viewContainer.querySelector('#file-input');
  const fileNameSpan = viewContainer.querySelector('#file-name');
  const generateTagsBtn = viewContainer.querySelector('#generate-tags-btn');

  const showView = (viewToShow) => {
    uploadView.style.display = 'none';
    fileDisplayView.style.display = 'none';
    processingView.style.display = 'none';
    viewToShow.style.display = 'block';
  };

  const handleFiles = async (files) => {
    const fileNames = [];
    const fileReadPromises = [];

    if (files.length === 0) {
      alert('No files selected.');
      showView(uploadView);
      return;
    }

    Array.from(files).forEach(file => {
      if (file.name.endsWith('.csv')) {
        fileNames.push(file.name);
        fileReadPromises.push(new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            store.csvFiles.push({ name: file.name, content: e.target.result });
            resolve();
          };
          reader.onerror = () => {
            alert(`Failed to read file: ${file.name}`);
            reject(new Error(`Failed to read file: ${file.name}`));
          };
          reader.readAsText(file);
        }));
      } else {
        alert(`File "${file.name}" is not a valid .csv file and will be ignored.`);
      }
    });

    if (fileReadPromises.length === 0) {
      fileNameSpan.textContent = "Please upload at least one valid .csv file.";
      showView(uploadView);
      store.csvFiles = [];
      return;
    }

    try {
      await Promise.all(fileReadPromises);
      fileNameSpan.textContent = fileNames.join(', ');
      showView(fileDisplayView);


    } catch (error) {
      console.error('Error processing files:', error);
      fileNameSpan.textContent = "Error reading some files. Please try again.";
      showView(uploadView);
      store.csvFiles = [];
    }

  };

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('active');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('active');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('active');
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  });

  fileBrowserBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFiles(e.target.files);
    }
  });

  generateTagsBtn.addEventListener('click', () => {
    processingView.firstElementChild.textContent = "Processing ...";
    showView(processingView);

    // Extract only the content from the stored files for processCsvFiles
    // const csvContents = store.csvFiles.map(file => file.content);

    try {
      const processStatus = processCsvFiles(); // return true or false
      if (!processStatus) console.error('generateTagsBtn: An error occured');
    } catch (error) {
      processingView.firstElementChild.textContent = "An error occurred. Try again";
      console.error('Error during CSV processing:', error);
      showView(uploadView); // Go back to file display on error
    }

  });

  return viewContainer;
};

