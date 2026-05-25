import React, { useState } from 'react';

export default function ExportPanel({ schema }) {
  const [copiedButton, setCopiedButton] = useState(null);

  const handleCopy = (text, buttonId) => {
    navigator.clipboard.writeText(text);
    setCopiedButton(buttonId);
    setTimeout(() => setCopiedButton(null), 2000);
  };

  const reactCodeSnippet = `import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const schema = ${JSON.stringify(schema, null, 2)};

export default function MyForm() {
  return (
    <div style={{ padding: '2rem' }}>
      <Form 
        schema={schema} 
        validator={validator} 
        onSubmit={(e) => console.log('Submitted data:', e.formData)} 
      />
    </div>
  );
}`;

  const curlSnippet = `curl -X POST http://localhost:8080/api/form/generate \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Create a form based on this."}'`;

  return (
    <div data-testid="export-panel" className="export-panel">
      <button 
        data-testid="export-json-button" 
        onClick={() => handleCopy(JSON.stringify(schema, null, 2), 'json')}
        style={{ backgroundColor: copiedButton === 'json' ? '#22c55e' : '', color: copiedButton === 'json' ? 'white' : '' }}
      >
        {copiedButton === 'json' ? 'Copied!' : 'Export JSON Schema'}
      </button>
      
      <button 
        data-testid="copy-code-button"
        onClick={() => handleCopy(reactCodeSnippet, 'code')}
        style={{ backgroundColor: copiedButton === 'code' ? '#22c55e' : '', color: copiedButton === 'code' ? 'white' : '' }}
      >
        {copiedButton === 'code' ? 'Copied!' : 'Copy React Code'}
      </button>
      
      <button 
        data-testid="copy-curl-button"
        onClick={() => handleCopy(curlSnippet, 'curl')}
        style={{ backgroundColor: copiedButton === 'curl' ? '#22c55e' : '', color: copiedButton === 'curl' ? 'white' : '' }}
      >
        {copiedButton === 'curl' ? 'Copied!' : 'Copy cURL'}
      </button>
    </div>
  );
}
