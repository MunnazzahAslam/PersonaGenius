import React from 'react';

interface AvatarProps {
  svgContent: string;
}

const Avatar: React.FC<AvatarProps> = ({ svgContent }) => (
  <div 
    className="h-20 w-20 rounded-full" 
    dangerouslySetInnerHTML={{ __html: svgContent }} 
  />
);

export default Avatar;
