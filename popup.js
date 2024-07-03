function download(cssContent, fileName) {
  const blob = new Blob([cssContent], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('loadModifiedCss').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getModifiedStyles' }, (response) => {
      if (response && response.styles) {
        document.getElementById('cssContent').value = response.styles;
        document.getElementById('downloadCss').style.display = 'block';
        document.getElementById('downloadCss').onclick = () => download(response.styles, 'modified-styles.css');
      }
    });
  });
});

document.getElementById('loadAllCss').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getAllStyles' }, (response) => {
      if (response && response.styles) {
        document.getElementById('cssContent').value = response.styles;
        document.getElementById('downloadCss').style.display = 'block';
        document.getElementById('downloadCss').onclick = () => download(response.styles, 'all-styles.css');
      }
    });
  });
});
