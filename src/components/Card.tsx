import type { ReactNode } from 'react';

/** `plain` drops the boxed card chrome (no fill/border/shadow) and separates the
 *  section with a top divider instead — lighter, less "shapey" surfaces. */
export function Card({
  title,
  children,
  plain,
}: {
  title?: string;
  children: ReactNode;
  plain?: boolean;
}) {
  return (
    <section className={plain ? 'section-plain' : 'card'}>
      {title ? <h2 className="card__title">{title}</h2> : null}
      {children}
    </section>
  );
}
