import Reveal from './Reveal.jsx';
import { Title } from './TitleText.jsx';

// Label + large heading (+ optional text and a link on the right) that opens a section.
export default function SectionHeading({ id, label, title, text, action, as: Heading = 'h2', className = '' }) {
  return (
    <Reveal className={`flex flex-col gap-8 md:flex-row md:items-end md:justify-between ${className}`.trim()}>
      <div>
        <p className="label-caps text-brand-300">{label}</p>
        <Heading id={id} className="type-h2 mt-6 max-w-[16ch]">
          <Title text={title} />
        </Heading>
        {text ? <p className="type-lead mt-6 max-w-xl text-muted">{text}</p> : null}
      </div>
      {action ? <div className="flex-none md:pb-2">{action}</div> : null}
    </Reveal>
  );
}
