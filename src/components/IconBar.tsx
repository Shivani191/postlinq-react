//src/components/IconBar.tsx
import React from "react";

interface IconBarProps {
  onAction: (type: string) => void;
}

const icons = [
  { src: "/assets/back.png", alt: "Back", type: "back" },
  { src: "/assets/edit1.png", alt: "Edit", type: "edit" },
  //{ src: "/src/assets/regen.png", alt: "Regenerate", type: "regenerate" },
  { src: "/assets/save.png", alt: "Save", type: "save" },
  { src: "/assets/schedule.png", alt: "Schedule", type: "schedule" }
];

const IconBar: React.FC<IconBarProps> = ({ onAction }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          backgroundColor: "#D63649",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px 20px",
          gap: "20px",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          width: "fit-content"
        }}
      >
        {icons.map((icon) => (
          <div key={icon.alt} style={{ textAlign: "center", position: "relative" }}>
            <img
              src={icon.src}
              alt={icon.alt}
              onClick={() => onAction(icon.type)}
              style={{
                width: "28px",
                height: "28px",
                cursor: "pointer",
                marginBottom: "4px",
                filter: "invert(1)",
              }}
            />
            <div
              style={{
                fontSize: "11px",
                color: "#fff"
              }}
            >
              {icon.alt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconBar;
