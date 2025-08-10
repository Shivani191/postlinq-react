import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text" }) => (
  <div style={{ width: "100%" }}>
    <label className="input-label">{label}</label>
    <input
      className="input-field"
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default InputField;
