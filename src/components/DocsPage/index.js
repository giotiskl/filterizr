import React from 'react';
import ObjectDocs from './components/ObjectDocs';
import options from './api-json/objects/options.json';

export default function DocsPage() {
  return (
    <div>
      Hello from docs page
      <ObjectDocs jsonDefinition={options.fields} />
    </div>
  );
}
