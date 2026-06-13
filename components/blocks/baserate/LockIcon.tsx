/**
 * Padlock glyph used by the section rail when content is NDA-locked.
 * Traced 1:1 from the owner's downloaded asset (Assets/Icons/Lock.svg), with
 * the hardcoded #1B1B1D fill swapped for `currentColor` so the rail can tint it
 * exactly like the step digits it replaces.
 */
export function LockIcon({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M10 14C9.44772 14 9 14.4477 9 15C9 15.5523 9.44772 16 10 16H14C14.5523 16 15 15.5523 15 15C15 14.4477 14.5523 14 14 14H10Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V9.17071C19.1652 9.58254 20 10.6938 20 12V18C20 19.6569 18.6569 21 17 21H7C5.34315 21 4 19.6569 4 18V12C4 10.6938 4.83481 9.58254 6 9.17071V8ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12V18C18 18.5523 17.5523 19 17 19H7C6.44772 19 6 18.5523 6 18V12ZM16 8V9H8V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z"
        fill="currentColor"
      />
    </svg>
  )
}
