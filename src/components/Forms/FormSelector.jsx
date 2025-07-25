
import React, { useState } from 'react';

function FormSelector({ data, onChange, availableForms = [] }) {
  const [searchTerms, setSearchTerms] = useState({ form: '' });

  const filteredForms = availableForms.filter(form => 
    form.name.toLowerCase().includes(searchTerms.form.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Custom Form
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a form..."
          value={searchTerms.form}
          onChange={(e) =>
            setSearchTerms((prev) => ({ ...prev, form: e.target.value }))
          }
          className="form-input mb-2"
        />
        <select
          value={data.customForm}
          onChange={(e) => onChange("customForm", e.target.value)}
          className="form-select"
        >
          <option value="">Select a form...</option>
          {filteredForms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.name}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Choose a predefined form to collect data for this task
      </p>
    </div>
  );
}

export default FormSelector;
