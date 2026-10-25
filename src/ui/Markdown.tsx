import katex from 'katex';
import { Fragment, type ReactNode } from 'react';

/**
 * Markdown-lite renderer for lesson text: paragraphs, **bold**, *italic*, `code`,
 * $inline$ and $$display$$ LaTeX via KaTeX. Only KaTeX output is injected as HTML;
 * all other text is rendered as React text nodes.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*|\*[^*\n]+?\*|`[^`]+?`)/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith('$$')) out.push(<Tex key={key} latex={tok.slice(2, -2)} display />);
    else if (tok.startsWith('$')) out.push(<Tex key={key} latex={tok.slice(1, -1)} />);
    else if (tok.startsWith('**')) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) out.push(<code key={key}>{tok.slice(1, -1)}</code>);
    else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Tex({ latex, display = false }: { latex: string; display?: boolean }) {
  const html = katex.renderToString(latex, { displayMode: display, throwOnError: false, output: 'html' });
  return <span className={display ? 'tex-display' : 'tex'} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Markdown({ md, className }: { md: string; className?: string }) {
  const paragraphs = md.trim().split(/\n{2,}/);
  return (
    <div className={className ? `md ${className}` : 'md'}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split('\n').map((line, j, arr) => (
            <Fragment key={j}>
              {renderInline(line, `${i}-${j}`)}
              {j < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
