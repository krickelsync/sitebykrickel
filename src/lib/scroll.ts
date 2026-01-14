/**
 * Scroll to an element by ID with offset for fixed navbar
 */
export const scrollToId = (
  id: string,
  options: {
    offset?: number;
    behavior?: ScrollBehavior;
    updateHash?: boolean;
  } = {}
) => {
  const { offset = 96, behavior = 'smooth', updateHash = true } = options;
  
  const element = document.getElementById(id);
  if (!element) return false;

  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });

  // Update URL hash without triggering scroll
  if (updateHash) {
    window.history.replaceState(null, '', `#${id}`);
  }

  return true;
};
