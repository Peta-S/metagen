const sanitizeHTML = (str) => {
  if (typeof str !== 'string' || !str) {
    return str;
  }
  // Use the browser's built-in capabilities to parse and strip HTML.
  // This is a standard and safe way to remove tags.
  const temp = document.createElement('div');
  temp.innerHTML = str;
  return temp.textContent || temp.innerText || '';
};

export { sanitizeHTML };
