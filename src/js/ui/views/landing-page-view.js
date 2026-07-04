import { downloadCsvTemplate } from './../../services/csv-generator.js';

export const landingPageView = () => {
  const template = document.getElementById('landing-page-view-template');
  const templateCloned = template.content.cloneNode(true);
  const downloadButton = templateCloned.getElementById('download-template-btn');
  if (downloadButton) {
    downloadButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      downloadCsvTemplate();
    });
  } 
  return templateCloned;
};
