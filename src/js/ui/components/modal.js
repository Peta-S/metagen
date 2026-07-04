class Modal {
  constructor(options = {}) {
    this.options = Object.assign({
      title: 'Modal',
      content: '',
      footer: '',
      onClose: null,
    }, options);
    this.modalElement = null;
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    const modalId = `modal-${Date.now()}`;
    const { title, content, footer } = this.options;

    const modalHTML = `
      <div class="modal-overlay" id="${modalId}">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      </div>
    `;

    const template = document.createElement('template');
    template.innerHTML = modalHTML.trim();
    this.modalElement = template.content.firstChild;
  }

  bindEvents() {
    this.modalElement.querySelector('.modal-close-btn').addEventListener('click', () => this.close());
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });
  }

  open() {
    document.body.appendChild(this.modalElement);
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalElement && this.modalElement.parentNode) {
      this.modalElement.parentNode.removeChild(this.modalElement);
    }
    document.body.style.overflow = 'auto';
    if (typeof this.options.onClose === 'function') {
      this.options.onClose();
    }
  }

  setContent(newContent) {
      this.modalElement.querySelector('.modal-body').innerHTML = newContent;
  }
}

export default Modal;
