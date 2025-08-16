//src/components/SubmitButton.tsx
import React from "react";

interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, disabled = false }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        padding: "12px 20px",
        backgroundColor: "#4c7ef3",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        marginTop: "20px",
      }}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
