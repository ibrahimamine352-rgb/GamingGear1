"use client"
import { useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface GridItem {
  x: number;
  y: number;
  points: {
    hex: Point[];
    hl: Point[];
  };
  init(): void;
  draw(ct: CanvasRenderingContext2D): void;
  highlight(ct: CanvasRenderingContext2D): void;
}

class Grid {
  cols: number;
  rows: number;
  items: GridItem[];
  n: number;

  constructor(rows: number, cols: number) {
    this.cols = cols || 16;
    this.rows = rows || 16;
    this.items = [];
    this.n = this.items.length;

    this.init();
  }

  init() {
    let x, y;

    const HEX_CRAD = 32;
    const HEX_GAP = 4;
    const off_x = 1.5 * HEX_CRAD + HEX_GAP * Math.sqrt(3) * 0.5;
    const unit_x = 3 * HEX_CRAD + HEX_GAP * Math.sqrt(3);
    const unit_y = HEX_CRAD * Math.sqrt(3) * 0.5 + 0.5 * HEX_GAP;

    for (let row = 0; row < this.rows; row++) {
      y = row * unit_y;

      for (let col = 0; col < this.cols; col++) {
        x = ((row % 2 === 0) ? 0 : off_x) + col * unit_x;

        const gridItem: GridItem = {
          x,
          y,
          points: { hex: [], hl: [] },
          init() {
            let x, y, a;
            const ba = Math.PI / 3;
            const ri = HEX_CRAD - 0.5 * 2;

            for (let i = 0; i < 6; i++) {
              a = i * ba;
              x = this.x + HEX_CRAD * Math.cos(a);
              y = this.y + HEX_CRAD * Math.sin(a);

              this.points.hex.push({ 'x': x, 'y': y });

              if (i > 2) {
                x = this.x + ri * Math.cos(a);
                y = this.y + ri * Math.sin(a);

                this.points.hl.push({ 'x': x, 'y': y });
              }
            }
          },
          draw(ct) {
            for (let i = 0; i < 6; i++) {
              (ct as any)[(i === 0 ? 'move' : 'line') + 'To'](
                this.points.hex[i].x,
                this.points.hex[i].y
              );
            }
          },
          highlight(ct) {
            for (let i = 0; i < 3; i++) {
              (ct as any)[(i === 0 ? 'move' : 'line') + 'To'](
                this.points.hl[i].x,
                this.points.hl[i].y
              );
            }
          }
        };

        gridItem.init();
        this.items.push(gridItem);
      }
    }

    this.n = this.items.length;
  }

  draw(ct: CanvasRenderingContext2D) {
    ct.fillStyle = '#171717';
    ct.beginPath();

    for (let i = 0; i < this.n; i++) {
      this.items[i].draw(ct);
    }

    ct.closePath();
    ct.fill();

    ct.strokeStyle = '#2a2a2a';
    ct.beginPath();

    for (let i = 0; i < this.n; i++) {
      this.items[i].highlight(ct);
    }

    ct.closePath();
    ct.stroke();
  }
}

const NeonBackground: React.FC = () => {
  const [grid, setGrid] = useState<Grid | null>(null);

  useEffect(() => {
    const c = document.getElementById('cover')?.querySelectorAll('canvas');
    if(c

    ){
      
        const s = window.getComputedStyle(c[0]);
        const w = parseInt(s.width || '0', 10);
        const h = parseInt(s.height || '0', 10);
        const _min = 0.75 * Math.min(w, h);
        const rows = Math.floor(h / (32 * Math.sqrt(3) * 0.5 + 0.5 * 4)) + 2;
        const cols = Math.floor(w / (3 * 32 + 4 * Math.sqrt(3))) + 2;
        const ctx: CanvasRenderingContext2D[] = [];
    
        for (let i = 0; i < c.length; i++) {
          c[i].width = w;
          c[i].height = h;
          ctx[i] = c[i].getContext('2d') as CanvasRenderingContext2D;
        }
    
        const newGrid = new Grid(rows, cols);
        setGrid(newGrid);
    
        const requestId = requestAnimationFrame(NeonBackground);
        return () => cancelAnimationFrame(requestId);
    }
   
  }, []);

  useEffect(() => {
    if (grid) {
      const ctx = document.getElementById('cover')?.querySelectorAll('canvas')[1].getContext('2d') as CanvasRenderingContext2D;
     if(ctx)
      grid.draw(ctx);
    }
  }, [grid]);

  return <div id="cover"><canvas /></div>;
};

export default NeonBackground;
