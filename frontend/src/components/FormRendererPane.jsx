import React, { useState, useMemo } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import SchemaDiffPanel from './SchemaDiffPanel';
import ExportPanel from './ExportPanel';

function CustomFieldTemplate(props) {
  const { id, classNames, label, help, required, description, errors, children } = props;
  const fieldName = id.replace('root_', '');
  
  return (
    <div className={classNames} data-testid={`field-${fieldName}`} style={{ marginBottom: '1rem' }}>
      {label && <label htmlFor={id} style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>{label}{required ? "*" : null}</label>}
      {description && <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{description}</div>}
      {children}
      {errors}
      {help}
    </div>
  );
}

export default function FormRendererPane({ currentSchema, previousSchema, formVersion }) {
  const [formData, setFormData] = useState({});

  const filteredSchema = useMemo(() => {
    if (!currentSchema) return null;
    const newSchema = JSON.parse(JSON.stringify(currentSchema));
    if (newSchema.properties) {
      Object.keys(newSchema.properties).forEach(key => {
        const prop = newSchema.properties[key];
        if (prop['x-show-when']) {
          const { field, equals } = prop['x-show-when'];
          if (formData[field] !== equals) {
            delete newSchema.properties[key];
          }
        }
      });
    }
    return newSchema;
  }, [currentSchema, formData]);

  if (!currentSchema) {
    return (
      <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        No form generated yet. Ask the assistant to build one!
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Generated Form (v{formVersion})</h2>
      
      {formVersion > 1 && previousSchema && (
        <SchemaDiffPanel previousSchema={previousSchema} currentSchema={currentSchema} />
      )}

      <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        {filteredSchema && (
          <Form 
            schema={filteredSchema} 
            validator={validator} 
            formData={formData}
            onChange={e => setFormData(e.formData)}
            templates={{ FieldTemplate: CustomFieldTemplate }}
          />
        )}
      </div>

      <ExportPanel schema={currentSchema} />
    </div>
  );
}
