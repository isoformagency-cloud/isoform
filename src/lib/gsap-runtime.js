// GSAP itself. Never import this file directly: use useGsap() from ./gsap.js,
// which loads it on demand, so GSAP is a separate download that only the home
// page fetches.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
