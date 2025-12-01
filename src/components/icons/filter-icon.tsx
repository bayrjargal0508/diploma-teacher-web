import * as React from "react";

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={35}
      height={30}
      viewBox="0 0 39 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.624 13h12m0 0a3 3 0 106 0 3 3 0 00-6 0zm-6 8h12m-12 0a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="#9EACBF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default FilterIcon;
