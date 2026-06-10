export interface Point {
  x: number;
  y: number;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;

export class ViewportController {
  offsetX = 0;
  offsetY = 0;
  zoom = 1;

  panBy(dx: number, dy: number): void {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  /** Zoom toward a screen-space anchor point. */
  zoomAt(screenX: number, screenY: number, factor: number): void {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.zoom * factor));
    const scale = next / this.zoom;
    this.offsetX = screenX - scale * (screenX - this.offsetX);
    this.offsetY = screenY - scale * (screenY - this.offsetY);
    this.zoom = next;
  }

  screenToWorld(sx: number, sy: number): Point {
    return {
      x: (sx - this.offsetX) / this.zoom,
      y: (sy - this.offsetY) / this.zoom,
    };
  }

  worldToScreen(wx: number, wy: number): Point {
    return {
      x: wx * this.zoom + this.offsetX,
      y: wy * this.zoom + this.offsetY,
    };
  }
}
