import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // To display individual field errors
  placeholder?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '5px' }}>
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        required={required}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
      {error && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export default FormField;