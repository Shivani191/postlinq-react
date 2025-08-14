import React, { useState } from "react";
//import eyeOpenIcon from "public/assets/eye.png";
//import eyeClosedIcon from "public/assets/eyeclose.png";


interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-wrapper" style={{ width: "100%" }}>
      <label className="input-label">{label}</label>
      <input
        className="input-field"
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="eye-button"
        onClick={() => setVisible(!visible)}
        style={{
          position: "absolute",
          right: "11px",
          top: "70%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {/* 🔑 Conditionally render the image based on the 'visible' state */}
        <img
          src={visible ? "assets/eye.png" : "assets/eyeclose.png"}
          alt={visible ? "Hide password" : "Show password"}  
          style={{ width: "20px", height: "20px" }}
        />
      </button>
    </div>
  );
};

export default PasswordField;
