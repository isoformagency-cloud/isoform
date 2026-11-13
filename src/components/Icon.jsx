// One small icon set: 24px grid, 1.6px round strokes, always decorative.
// Meaning is carried by the text next to each icon.

function Svg({ size = 20, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (props) => (
  <Svg {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);

export const ArrowUpRight = (props) => (
  <Svg {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const ChevronDown = (props) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const Plus = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Check = (props) => (
  <Svg {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const Close = (props) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const Menu = (props) => (
  <Svg {...props}>
    <path d="M4 8h16M4 16h16" />
  </Svg>
);

// Chat bubble with a phone handset: the WhatsApp idea, drawn in this icon set's style.
export const WhatsApp = (props) => (
  <Svg {...props}>
    <path d="M4.5 19.5l1.1-3.9A8.5 8.5 0 1 1 8.6 18.6z" />
    <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.6.3-1.6.5-3.3-.4a8.6 8.6 0 0 1-3.4-3.4c-.9-1.7-.7-2.7-.4-3.3z" />
  </Svg>
);

export const Instagram = (props) => (
  <Svg {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.2 6.8v.01" />
  </Svg>
);

export const Alert = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </Svg>
);
