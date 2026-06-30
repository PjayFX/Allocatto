/** Allocatto mark: the cat logo (white cat on a dark disc). */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <img src="/Allocatto.png" width={size} height={size} alt="" aria-hidden="true" className="brand-cat" />
  );
}
