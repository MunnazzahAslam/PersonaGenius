import React from "react";

const LinkedInIcon = ({ className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={className}
    >
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.94 0 54.36a53.79 53.79 0 01107.58 0c0 29.58-24.09 53.74-53.79 53.74zM447.97 448h-92.66V302.4c0-34.7-12.45-58.5-43.54-58.5-23.77 0-37.88 16-44.1 31.4-2.26 5.47-2.82 13.1-2.82 20.7V448H171.88s1.22-267.4 0-295H264.5v41.8c12.27-18.9 34.1-45.9 83.02-45.9 60.67 0 106.45 39.57 106.45 124.7V448z" />
    </svg>
  );
};

export default LinkedInIcon;
