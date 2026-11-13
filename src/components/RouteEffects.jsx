import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { getMeta } from '../seo.js';

function setMeta(selector, attribute, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attribute, value);
}

// Runs on every navigation: updates the document title and description,
// returns to the top of the page and moves keyboard focus to the new content.
// (The first page already has all of this from the prerendered HTML.)
export default function RouteEffects() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    const meta = getMeta(pathname);
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      const url = new URL(meta.path, canonical.href).href;
      canonical.setAttribute('href', url);
      setMeta('meta[property="og:url"]', 'content', url);
    }

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
