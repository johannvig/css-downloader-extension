let modifiedStyles = '';

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const element = mutation.target;
      modifiedStyles += `${element.tagName.toLowerCase()}#${element.id || ''}.${Array.from(element.classList).join('.')} { ${element.getAttribute('style')} }\n`;
    }
  });
});

observer.observe(document, {
  attributes: true,
  subtree: true,
  attributeFilter: ['style']
});

function getAllStyles() {
  let styles = '';
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      let rules = document.styleSheets[i].cssRules;
      for (let j = 0; j < rules.length; j++) {
        styles += rules[j].cssText + '\n';
      }
    } catch (e) {
      console.warn('Could not access stylesheet:', e);
    }
  }
  return styles;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getModifiedStyles') {
    sendResponse({ styles: modifiedStyles });
  } else if (request.action === 'getAllStyles') {
    const allStyles = getAllStyles();
    sendResponse({ styles: allStyles });
  }
});
