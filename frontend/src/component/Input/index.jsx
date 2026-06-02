import React from 'react';

const InputField = ({ name,type = 'text', placeholder = '', onChange = () => {}, value } = {}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <input
      style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078', marginLeft: '5px' }}
      className="search_input"
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      name={name}
    />
  );
};

export default InputField;
