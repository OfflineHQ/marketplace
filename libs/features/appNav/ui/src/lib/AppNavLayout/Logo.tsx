import * as React from 'react';
const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 194 90"
    height="100%" // You can adjust these values as per your needs
    {...props}
  >
    <defs>
      <style>{'.cls-1{fill:currentColor}'}</style>
    </defs>
    <path
      d="M22.14 10.9c4.76 0 8.39 1.14 10.88 3.42 2.48 2.27 3.73 5.93 3.73 10.98v20.81c0 5.02-1.24 8.67-3.71 10.96-2.46 2.29-6.09 3.44-10.9 3.44s-8.43-1.11-10.9-3.35c-2.47-2.25-3.71-5.93-3.71-11.04V25.31c0-5.01 1.23-8.67 3.71-10.96 2.47-2.29 6.1-3.44 10.9-3.44Zm-2.33 10.94v27.73c0 .93.2 1.66.6 2.17.4.52.98.77 1.73.77s1.34-.26 1.73-.77c.4-.51.6-1.23.6-2.17V21.84c0-.93-.2-1.65-.6-2.17-.39-.51-.97-.77-1.73-.77-1.56 0-2.33.98-2.33 2.94ZM61.67 21.5h-8.4v8.73h7.21v9.21h-7.21V59.5H41V11.9h20.67v9.6ZM85.2 21.5h-8.4v8.73h7.21v9.21H76.8V59.5H64.53V11.9H85.2v9.6ZM100.33 50.29h8.15v9.21H88.06V11.9h12.27v38.4ZM123.67 59.5H111.4V11.9h12.27v47.6ZM145.14 35.56h.13V11.9h10.4v47.6h-10.4l-6.94-26.6h-.19v26.6h-10.42V11.9h10.42l7 23.67ZM180.67 21.5h-8.48v8.73h7.94v9.21h-7.94V49.9h9.15v9.6h-21.42V11.9h20.75v9.6Z"
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className="cls-1"
    />
    <path
      d="M30.75 80.33h127"
      style={{
        fill: 'none',
        stroke: 'currentColor',
      }}
    />
  </svg>
);
export default SvgComponent;
