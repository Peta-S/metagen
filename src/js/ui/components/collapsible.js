class Collapsible {
  /**
   * Creates a collapsible section with a heading and content.
   *
   * @param {string} groupId - A unique identifier for the collapsible group.
   * @param {string} heading - The text for the collapsible header.
   * @param {HTMLElement} contentEl - The content element to be placed inside the collapsible body.
   * @param {('open'|'closed'|'hidden')} initialState - The initial state of the collapsible ('open', 'closed', or 'hidden').
   * @returns {HTMLElement} The created collapsible section element.
   */
  static mainSectionCollapsible(groupId, heading, contentEl, initialState) {
    const sectionId = `collapsible-section-${groupId}`;
    const contentId = `collapsible-content-${groupId}`;

    const isInitiallyOpen = initialState === 'open';
    const isInitiallyHidden = initialState === 'hidden';

    // Create the main container for the collapsible section
    const collapsibleSection = document.createElement('div');
    collapsibleSection.classList.add('collapsible-section');
    collapsibleSection.dataset.groupId = groupId;
    collapsibleSection.dataset.initialState = initialState;
    collapsibleSection.id = sectionId;

    // Create the header button
    const headerButton = document.createElement('button');
    headerButton.type = 'button'; // Prevent form submission
    headerButton.classList.add('collapsible-header');
    headerButton.setAttribute('aria-expanded', isInitiallyOpen ? 'true' : 'false');
    headerButton.setAttribute('aria-controls', contentId);
    headerButton.innerHTML = `
      <span class="collapsible-heading">${heading}</span>
      <span class="collapsible-toggle-icon" aria-hidden="true"></span>
    `;

    // Create the content container
    const contentWrapper = document.createElement('div');
    contentWrapper.id = contentId;
    contentWrapper.classList.add('collapsible-content');
    contentWrapper.appendChild(contentEl); // Append the provided content element

    // Set initial visibility/state
    if (isInitiallyOpen) {
      collapsibleSection.classList.add('is-expanded');
      contentWrapper.style.maxHeight = 'none';
      contentWrapper.style.opacity = '1';
    } else {
      contentWrapper.style.maxHeight = '0';
      contentWrapper.style.opacity = '0';
      contentWrapper.setAttribute('inert', ''); // Make content inert when closed/hidden
      if (isInitiallyHidden) {
        collapsibleSection.style.display = 'none'; // Completely hide if initial state is hidden
      }
    }


    // Add event listener for toggling
    headerButton.addEventListener('click', () => {
      Collapsible._slideToggle(collapsibleSection, contentWrapper, headerButton);
    });

    collapsibleSection.appendChild(headerButton);
    collapsibleSection.appendChild(contentWrapper);

    return collapsibleSection;
  }

  /**
   * Toggles the visibility of a collapsible section with a slide animation.
   * This can be called externally.
   *
   * @param {HTMLElement} collapsibleElement - The main .collapsible-section element.
   * @param {boolean} [forceShow] - If true, forces the section to show. If false, forces to hide. If undefined, toggles.
   */
  static toggleVisibility(collapsibleElement, forceShow) {
    const headerButton = collapsibleElement.querySelector('.collapsible-header');
    const contentWrapper = collapsibleElement.querySelector('.collapsible-content');

    if (!headerButton || !contentWrapper) {
      console.warn('Collapsible elements not found for toggleVisibility.', collapsibleElement);
      return;
    }

    const isExpanded = collapsibleElement.classList.contains('is-expanded');

    let shouldExpand;
    if (typeof forceShow === 'boolean') {
      shouldExpand = forceShow;
    } else {
      shouldExpand = !isExpanded;
    }

    if (shouldExpand === isExpanded) {
      // If we are forcing show but it's already shown, just ensure display is correct
      if (forceShow === true) collapsibleElement.style.display = '';
      return;
    }

    Collapsible._slideToggle(collapsibleElement, contentWrapper, headerButton, shouldExpand);
  }


  /**
   * Helper function for slide up/down animation.
   * @param {HTMLElement} sectionEl - The main .collapsible-section element.
   * @param {HTMLElement} contentEl - The .collapsible-content element.
   * @param {HTMLElement} headerButton - The .collapsible-header button.
   * @param {boolean} [expand] - Explicitly expand (true) or collapse (false). If undefined, toggles.
   * @private
   */
  static _slideToggle(sectionEl, contentEl, headerButton, expand) {
    const isCurrentlyExpanded = sectionEl.classList.contains('is-expanded');
    const shouldExpand = typeof expand === 'boolean' ? expand : !isCurrentlyExpanded;

    if (shouldExpand) {
      // Expand logic
      sectionEl.style.display = ''; // Ensure it's visible if it was hidden
      headerButton.setAttribute('aria-expanded', 'true');
      sectionEl.classList.add('is-expanded');
      contentEl.removeAttribute('inert');

      // 1. Get current height (usually 0)
      const startHeight = contentEl.offsetHeight;
      
      // 2. Temporarily set to 'none' to calculate target scrollHeight
      contentEl.style.maxHeight = 'none';
      contentEl.style.opacity = '1';
      const targetHeight = contentEl.scrollHeight;
      
      // 3. Revert to start height to prepare for animation
      contentEl.style.maxHeight = startHeight + 'px';
      contentEl.style.opacity = startHeight > 0 ? '1' : '0';
      
      // 4. Force reflow to ensure the browser registers the starting point
      contentEl.offsetHeight; 

      // 5. Start transition
      contentEl.style.maxHeight = targetHeight + 'px';
      contentEl.style.opacity = '1';

      // 6. Cleanup after transition
      const onEnd = (e) => {
        if (e.propertyName === 'max-height') {
          contentEl.style.maxHeight = 'none'; // Set to 'none' to allow internal content to grow dynamically
          contentEl.removeEventListener('transitionend', onEnd);
        }
      };
      contentEl.addEventListener('transitionend', onEnd);
      
      // Fallback for browsers or cases where transitionend might not fire
      setTimeout(() => {
        if (contentEl.style.maxHeight !== 'none') {
           contentEl.style.maxHeight = 'none';
        }
      }, 400); // Slightly longer than transition (300ms)

    } else {
      // Collapse logic
      headerButton.setAttribute('aria-expanded', 'false');
      sectionEl.classList.remove('is-expanded');
      contentEl.setAttribute('inert', '');

      // 1. Set current height to a fixed pixel value to allow animation to 0
      contentEl.style.maxHeight = contentEl.scrollHeight + 'px';
      
      // 2. Force reflow
      contentEl.offsetHeight;

      // 3. Start transition to 0
      contentEl.style.maxHeight = '0';
      contentEl.style.opacity = '0';

      const onEnd = (e) => {
        if (e.propertyName === 'max-height') {
          // If it was initially hidden, hide the entire section after collapse
          if (sectionEl.dataset.initialState === 'hidden') {
            sectionEl.style.display = 'none';
          }
          contentEl.removeEventListener('transitionend', onEnd);
        }
      };
      contentEl.addEventListener('transitionend', onEnd);
    }
  }
}

export default Collapsible;
