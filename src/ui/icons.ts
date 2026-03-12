/**
 * ChatyPlayer v1.0
 * SVG Icon Factory
 * icons.ts
 * ----------------------------------------
 * - Safe SVG creation
 * - No innerHTML injection
 * - Reusable icon system
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSVG(
  viewBox: string,
  paths: { d: string }[]
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');

  paths.forEach(({ d }) => {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  });

  return svg;
}

export const Icons = {
  play(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      { d: 'M8 5v14l11-7z' }
    ]);
  },

  pause(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      { d: 'M6 5h4v14H6z' },
      { d: 'M14 5h4v14h-4z' }
    ]);
  },

  volume(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      { d: 'M3 9v6h4l5 5V4L7 9H3z' },
      { d: 'M16 7c1.66 1.66 1.66 8.34 0 10' }
    ]);
  },

  mute(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      { d: 'M3 9v6h4l5 5V4L7 9H3z' },
      { d: 'M16 9l4 4M20 9l-4 4' }
    ]);
  },

  fullscreen(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      { d: 'M7 14H5v5h5v-2H7v-3z' },
      { d: 'M19 14h-2v3h-3v2h5v-5z' },
      { d: 'M7 10h3V7h2v5H5V5h2v5z' }
    ]);
  },

  settings(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      {
        d: 'M12 8a4 4 0 100 8 4 4 0 000-8zm9.4 4a7.4 7.4 0 01-.1 1l2 1.6-2 3.4-2.4-1a7.6 7.6 0 01-1.7 1l-.4 2.6H9.2l-.4-2.6a7.6 7.6 0 01-1.7-1l-2.4 1-2-3.4 2-1.6a7.4 7.4 0 010-2L2.7 9.4l2-3.4 2.4 1a7.6 7.6 0 011.7-1L9.2 3h5.6l.4 2.6a7.6 7.6 0 011.7 1l2.4-1 2 3.4-2 1.6a7.4 7.4 0 01.1 1z'
      }
    ]);
  },

  pip(): SVGSVGElement {
    return createSVG('0 0 24 24', [
      { d: 'M3 5h18v14H3z' },
      { d: 'M13 13h8v6h-8z' }
    ]);
  }
};