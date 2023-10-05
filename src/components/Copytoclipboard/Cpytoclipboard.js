// CopyToClipboardButton.js

export const copyToClipboard = (textToCopy) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
  
    // Append the textarea to the document
    document.body.appendChild(textArea);
  
    // Select and copy the text inside the textarea
    textArea.select();
    document.execCommand('copy');
  
    // Remove the temporary textarea
    document.body.removeChild(textArea);
  };
  