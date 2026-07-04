import { landingPageView } from './views/landing-page-view.js';
import { csvUploadView } from './views/csv-upload-view.js';
import { manualEntryView } from './views/manual-entry-view.js';
import { outputView } from './views/output-view.js';
import store from '../core/store.js';

const appContainer = document.getElementById('app');

const views = {
  'inputSelection': landingPageView,
  'csvUpload': csvUploadView,
  'manualEntry': manualEntryView,
  'output': outputView,
};

export const navigate = (viewName, push = true) => {
    if (views[viewName]) {
        if (push) {
            history.pushState({ view: viewName }, '', `#${viewName}`);
        }
        appContainer.innerHTML = ''; // Clear existing content
        appContainer.appendChild(views[viewName]());
        
    } else {
        appContainer.innerHTML = '<p>View not found.</p>';
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth" 
    });
};

const setupEventListeners = () => {
    document.body.addEventListener('click', (event) => {
        const target = event.target.closest('[id]');
        if (!target) return;

        const targetId = target.id;

        switch (targetId) {
            case 'home-link':
                event.preventDefault();
                navigate('inputSelection');
                break;
            case 'manual-entry-btn':
                navigate('manualEntry');
                break;
            case 'csv-upload-btn':
                navigate('csvUpload');
                break;
            case 'create-new-btn':
                store.currentMetaObjIndex = store.currentMetaObjIndex.length
                navigate('inputSelection');
                break;
            case 'edit-file-btn':
                store.editCurrentMetaObj = true
                navigate('manualEntry');
                break;
            case 'back-to-selection-btn':
                navigate('inputSelection');
                break;
            case 'generate-from-csv-btn':
                navigate('output');
                break;
        }

    });
};

export const initViewManager = () => {
    setupEventListeners();

    window.addEventListener('popstate', event => {
        if (event.state && event.state.view) {
            navigate(event.state.view, false);
        } else {
            navigate('inputSelection', false);
        }
    });


    const logo = document.getElementById('init-logo');
    if (logo) {
        logo.remove();
    }
    appContainer.style.display = 'block';
    appContainer.style.height = 'auto';

    let initialView = window.location.hash.substring(1) || 'inputSelection';
    if (initialView === "output" && (!store.metaObjects || store.metaObjects.length === 0)) {
        initialView = 'inputSelection';
    }

    if (views[initialView]) {
        history.replaceState({ view: initialView }, '', `#${initialView}`);
        navigate(initialView, false);
    } else {
        history.replaceState({ view: 'inputSelection' }, '', '#inputSelection');
        navigate('inputSelection', false);
    }

};


const initialView = window.location.hash.substring(1) || 'inputSelection';
        if (views[initialView]) {
            history.replaceState({ view: initialView }, '', `#${initialView}`);
            navigate(initialView, false);
        } else {
            history.replaceState({ view: 'inputSelection' }, '', '#inputSelection');
            navigate('inputSelection', false);
        }

        if(initialView === "output" && !store.metaObjects.length > 0) navigate('inputSelection');