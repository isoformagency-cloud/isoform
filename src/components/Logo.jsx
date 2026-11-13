import { site } from '../data/site.js';

// The ISOFORM mark, redrawn as vector from the logo artwork.
export function Mark({ className = '' }) {
  return (
    <svg viewBox="0 0 540 684" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M0 0h125v684H0zM167 0h372l-72.4 133H167zM167 215h254.9l-73.5 135H167zM167 431h137.2L167 684z" />
    </svg>
  );
}

// Mark + wordmark. `tone="light"` is for dark backgrounds, `tone="dark"` for
// light ones (the logo's original colours). The wordmark is the traced logo
// lettering, drawn with a CSS mask so it can take any colour.
export function Lockup({ tone = 'light', tagline = false, size = 'md', className = '' }) {
  const light = tone === 'light';
  const sizes = {
    md: { mark: 'h-[1.9rem]', word: 'w-[6.9rem]', gap: 'gap-3' },
    lg: { mark: 'h-[3.4rem]', word: 'w-[15.5rem]', gap: 'gap-4' },
  }[size];

  return (
    <span className={`inline-flex items-center ${sizes.gap} ${className}`}>
      <Mark className={`${sizes.mark} w-auto flex-none ${light ? 'text-brand-400' : 'text-brand'}`} />
      <span className="flex flex-col gap-[0.6rem]">
        <span
          role="img"
          aria-label={site.name}
          className={`wordmark ${sizes.word} ${light ? 'text-white' : 'text-ink'}`}
        />
        {tagline ? (
          <span
            className={`whitespace-nowrap text-[0.6875rem] font-medium uppercase leading-none tracking-[0.3em] ${
              light ? 'text-muted' : 'text-ink/70'
            }`}
          >
            {site.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
