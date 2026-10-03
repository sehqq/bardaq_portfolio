interface OutlineTextProps {
  children: string;
  outlined?: boolean;
  className?: string;
}

/** Keep fill and stroke paint constant; animate only independent layer opacity. */
export const OutlineText = ({ children, outlined = false, className = '' }: OutlineTextProps) => (
  <span className={`outline-text ${className}`} data-outlined={outlined}>
    <span className="outline-text-fill">{children}</span>
    <span className="outline-text-stroke" aria-hidden="true">{children}</span>
  </span>
);
