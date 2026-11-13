import { Link } from 'react-router';
import { ArrowRight } from './Icon.jsx';

// One button, three looks: primary (violet), secondary (outline), light (white).
// Renders a router link, a plain link or a real <button>, depending on props.
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = true,
  className = '',
  children,
  ...rest
}) {
  const classes = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim();
  const content = (
    <>
      {children}
      {arrow ? <ArrowRight size={18} /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
