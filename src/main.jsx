// Fonts are bundled with the site (no third-party font requests).
import '@fontsource-variable/outfit/index.css';
import '@fontsource/instrument-serif/400-italic.css';
import './index.css';

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages are prerendered to HTML, so React attaches to that markup.
// In development the root is empty and React renders from scratch.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
