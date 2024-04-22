const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="31"
    viewBox="0 0 32 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="transparent"
    // @ts-ignore
    class={props.className}
    {...props}
  >
    <defs>
      <style>{'.cls-1{fill:currentColor}'}</style>
    </defs>
    <g clipPath="url(#clip0_280_1609)">
      <path // eslint-disable-next-line tailwindcss/no-custom-classname
        className="cls-1"
        d="M9.32 16.0996V21.4196H4V16.0996H9.32ZM13.32 12.0996H0V25.4196H13.32V12.0996Z"
        fill="#1D1D1B"
      />
      <path // eslint-disable-next-line tailwindcss/no-custom-classname
        className="cls-1"
        d="M14.2891 0V25.53H19.0691V13.32H26.5391V9.41H18.8091V4.17H26.5391V0H14.2891Z"
        fill="#1D1D1B"
      />
      <path // eslint-disable-next-line tailwindcss/no-custom-classname
        className="cls-1"
        d="M31.6291 4.67969V30.1997H26.8491V17.9997H19.3691V14.0797H27.0991V8.84969H19.3691V4.67969H31.6291Z"
        fill="#1D1D1B"
      />
    </g>
    <defs>
      <clipPath id="clip0_280_1609">
        <rect width="31.63" height="30.2" fill="transparent" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgComponent;
