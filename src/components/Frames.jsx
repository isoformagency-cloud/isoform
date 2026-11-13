import { ArrowUpRight } from './Icon.jsx';

// Plain device frames for real client screenshots.

export function BrowserFrame({ image, alt, url, eager = false, className = '' }) {
  return (
    <div className={`browser ${className}`.trim()}>
      <div className="browser-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{url}</span>
      </div>
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}

export function PhoneFrame({ image, alt, eager = false, ratio = 'aspect-[9/19]', className = '' }) {
  return (
    <div className={`phone ${className}`.trim()}>
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`${ratio} w-full object-cover object-top`}
      />
    </div>
  );
}

// A project's screenshots, composed: desktop + phone for sites, the Instagram
// profile for social accounts.
export function ProjectVisual({ project, eager = false, className = '' }) {
  if (project.kind === 'social') {
    return (
      <div className={`flex items-end justify-center gap-6 sm:gap-10 ${className}`.trim()}>
        <PhoneFrame
          image={project.feed}
          alt={`Instagram profile of ${project.display}`}
          eager={eager}
          ratio="aspect-[10/17]"
          className="w-[52%] max-w-[17rem]"
        />
        <p className="pb-4 sm:pb-8">
          <span className="block text-[clamp(2.25rem,5vw,4rem)] font-[450] leading-none tracking-[-0.04em] tabular-nums">
            {project.followers}
          </span>
          <span className="label-caps mt-3 block text-faint">Followers</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`relative pb-5 pr-3 sm:pr-6 ${className}`.trim()}>
      <BrowserFrame
        image={project.desktop}
        url={project.display}
        alt={`${project.name} website on a desktop screen`}
        eager={eager}
      />
      <PhoneFrame
        image={project.mobile}
        alt={`${project.name} website on a phone`}
        eager={eager}
        className="absolute bottom-0 right-0 w-[21%] min-w-[4.75rem]"
      />
    </div>
  );
}

// "Visit site" link that opens the client's live site or profile.
export function ProjectLink({ project, className = '' }) {
  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className={`link-arrow ${className}`.trim()}>
      {project.kind === 'social' ? 'View on Instagram' : `Visit ${project.display}`}
      <ArrowUpRight size={18} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
