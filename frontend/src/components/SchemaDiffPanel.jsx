import React from 'react';
import { diff } from 'deep-diff';

export default function SchemaDiffPanel({ previousSchema, currentSchema }) {
  const differences = diff(previousSchema, currentSchema) || [];

  if (differences.length === 0) return null;

  return (
    <div data-testid="schema-diff-panel" className="diff-panel">
      <h3>Changes from previous version:</h3>
      <ul>
        {differences.map((d, i) => {
          const path = d.path ? d.path.join('.') : 'root';
          // The requirement mentions: "if a field newField was added, the panel's text content must include + newField"
          // deep-diff on a new property "newField" in "properties.newField" will have path ["properties", "newField"]
          const propName = d.path ? d.path[d.path.length - 1] : '';

          if (d.kind === 'N') return <li key={i} className="diff-added">+ {propName}</li>;
          if (d.kind === 'D') return <li key={i} className="diff-removed">- {propName}</li>;
          if (d.kind === 'E') return <li key={i} className="diff-modified">~ {propName} modified</li>;
          if (d.kind === 'A') return <li key={i} className="diff-modified">~ {propName} array changed</li>;
          return null;
        })}
      </ul>
    </div>
  );
}
