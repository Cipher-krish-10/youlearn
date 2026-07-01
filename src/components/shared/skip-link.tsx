/**
 * Keyboard-only "skip to content" link. Hidden until focused (Tab on page load),
 * letting keyboard and screen-reader users jump past the nav to the main region.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:border focus-visible:bg-background focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      Skip to content
    </a>
  );
}
