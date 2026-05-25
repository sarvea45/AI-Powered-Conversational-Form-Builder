import React from 'react';

export default function ExportPanel({ schema }) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div data-testid="export-panel" className="export-panel">
      <button 
        data-testid="export-json-button" 
        onClick={() => handleCopy(JSON.stringify(schema, null, 2))}
      >
        Export JSON Schema
      </button>
      <button 
        data-testid="copy-code-button"
        onClick={() => handleCopy("import React from 'react';")}
      >
        Copy Code
      </button>
      <button 
        data-testid="copy-curl-button"
        onClick={() => handleCopy("curl -X POST ...")}
      >
        Copy cURL
      </button>
    </div>
  );
}
