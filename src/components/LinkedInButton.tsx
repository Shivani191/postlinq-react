import React from "react";

interface LinkedInButtonProps {
  label?: string;
}

const LinkedInButton: React.FC<LinkedInButtonProps> = ({ label = "LinkedIn" }) => (
  <button type="button" className="linkedin-button">
    {label}
  </button>
);

export default LinkedInButton;
