import React from "react"

import { IconProps } from "types/icon"

const ArrowLeftCircleFill: React.FC<IconProps & React.SVGProps<SVGSVGElement>> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height={size}
      width={size}
      {...attributes}
    >
      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 7.5a.5.5 0 010 1H5.707l2.147 2.146a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 11.708.708L5.707 7.5H11.5z" />
    </svg>
  );
}

export default ArrowLeftCircleFill;
