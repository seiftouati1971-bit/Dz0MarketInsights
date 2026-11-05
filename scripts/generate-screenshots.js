import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Simple color helper
function hexToRgba(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b, 255];
}

// Drawing primitives for crisp mock renders
function drawRect(png, x, y, w, h, [r, g, b, a = 255]) {
  x = Math.max(0, Math.floor(x));
  y = Math.max(0, Math.floor(y));
  const x2 = Math.min(png.width, x + Math.floor(w));
  const y2 = Math.min(png.height, y + Math.floor(h));

  for (let py = y; py < y2; py++) {
    for (let px = x; px < x2; px++) {
      const idx = (png.width * py + px) << 2;
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }
}

// Draw rounded rect with border
function drawCard(png, x, y, w, h, bgHex, borderHex) {
  const bg = hexToRgba(bgHex);
  const border = hexToRgba(borderHex);
  drawRect(png, x, y, w, h, border);
  drawRect(png, x + 1, y + 1, w - 2, h - 2, bg);
}

// Generate base screenshot template
function createBaseCanvas(width = 1200, height = 750, isMobile = false) {
  const png = new PNG({ width, height });
  // Fill warm white background (#FBFBFA)
  drawRect(png, 0, 0, width, height, hexToRgba('#FBFBFA'));

  if (!isMobile) {
    // Header Bar (#FFFFFF with bottom border #E2E8F0)
    drawRect(png, 0, 0, width, 60, hexToRgba('#FFFFFF'));
    drawRect(png, 0, 59, width, 1, hexToRgba('#E2E8F0'));

    // Logo Mark
    drawRect(png, 32, 14, 32, 32, hexToRgba('#065F46')); // Emerald square
    drawRect(png, 72, 22, 140, 16, hexToRgba('#0F172A')); // Brand text block

    // Nav Links
    drawRect(png, 380, 24, 70, 12, hexToRgba('#065F46')); // Active link
    drawRect(png, 470, 24, 60, 12, hexToRgba('#64748B'));
    drawRect(png, 550, 24, 80, 12, hexToRgba('#64748B'));
    drawRect(png, 650, 24, 60, 12, hexToRgba('#64748B'));

    // Top Right Controls (Language & Admin button)
    drawRect(png, width - 180, 16, 60, 28, hexToRgba('#F1F5F9')); // Lang
    drawRect(png, width - 110, 16, 78, 28, hexToRgba('#0F172A')); // Admin
  } else {
    // Mobile Header
    drawRect(png, 0, 0, width, 54, hexToRgba('#FFFFFF'));
    drawRect(png, 0, 53, width, 1, hexToRgba('#E2E8F0'));
    drawRect(png, 16, 12, 30, 30, hexToRgba('#065F46'));
    drawRect(png, 54, 20, 120, 14, hexToRgba('#0F172A'));
  }

  return png;
}

// 1. Survey Home AR
function generateSurveyHomeAr() {
  const png = createBaseCanvas(1200, 750);
  const cx = 200, cy = 90, cw = 800, ch = 560;

  // Main Hero Container Card
  drawCard(png, cx, cy, cw, ch, '#FFFFFF', '#E2E8F0');
  drawRect(png, cx, cy, cw, 4, hexToRgba('#065F46')); // Top accent

  // Subtitle / Kicker
  drawRect(png, cx + 50, cy + 35, 200, 12, hexToRgba('#065F46'));
  // Big Headline Lines
  drawRect(png, cx + 50, cy + 65, 580, 26, hexToRgba('#0F172A'));
  drawRect(png, cx + 50, cy + 100, 420, 26, hexToRgba('#0F172A'));
  // Paragraph
  drawRect(png, cx + 50, cy + 145, 680, 12, hexToRgba('#64748B'));
  drawRect(png, cx + 50, cy + 165, 600, 12, hexToRgba('#64748B'));

  // 4 Feature Preview Cards
  for (let i = 0; i < 4; i++) {
    const px = cx + 50 + i * 175;
    drawCard(png, px, cy + 205, 160, 95, '#F8FAFC', '#E2E8F0');
    drawRect(png, px + 10, cy + 215, 140, 55, hexToRgba('#CBD5E1')); // image preview block
    drawRect(png, px + 10, cy + 278, 100, 10, hexToRgba('#0F172A'));
  }

  // 3 Assurance Badges
  for (let i = 0; i < 3; i++) {
    const bx = cx + 50 + i * 235;
    drawCard(png, bx, cy + 325, 220, 60, '#F8FAFC', '#E2E8F0');
    drawRect(png, bx + 15, cy + 342, 26, 26, hexToRgba('#065F46'));
    drawRect(png, bx + 50, cy + 344, 90, 10, hexToRgba('#0F172A'));
    drawRect(png, bx + 50, cy + 360, 130, 8, hexToRgba('#94A3B8'));
  }

  // CTA Button
  drawRect(png, cx + 50, cy + 415, 170, 44, hexToRgba('#0F172A'));
  drawCard(png, cx + 235, cy + 415, 150, 44, '#ECFDF5', '#A7F3D0');

  // Bottom Notice
  drawRect(png, cx + 50, cy + 490, 450, 10, hexToRgba('#94A3B8'));

  return png;
}

// 2. Survey Home EN
function generateSurveyHomeEn() {
  const png = createBaseCanvas(1200, 750);
  const cx = 200, cy = 90, cw = 800, ch = 560;

  drawCard(png, cx, cy, cw, ch, '#FFFFFF', '#E2E8F0');
  drawRect(png, cx, cy, cw, 4, hexToRgba('#065F46'));

  drawRect(png, cx + 50, cy + 35, 240, 12, hexToRgba('#065F46'));
  drawRect(png, cx + 50, cy + 65, 620, 26, hexToRgba('#0F172A'));
  drawRect(png, cx + 50, cy + 100, 490, 26, hexToRgba('#0F172A'));
  drawRect(png, cx + 50, cy + 145, 660, 12, hexToRgba('#64748B'));
  drawRect(png, cx + 50, cy + 165, 580, 12, hexToRgba('#64748B'));

  for (let i = 0; i < 4; i++) {
    const px = cx + 50 + i * 175;
    drawCard(png, px, cy + 205, 160, 95, '#F8FAFC', '#E2E8F0');
    drawRect(png, px + 10, cy + 215, 140, 55, hexToRgba('#047857'));
    drawRect(png, px + 10, cy + 278, 110, 10, hexToRgba('#0F172A'));
  }

  for (let i = 0; i < 3; i++) {
    const bx = cx + 50 + i * 235;
    drawCard(png, bx, cy + 325, 220, 60, '#F8FAFC', '#E2E8F0');
    drawRect(png, bx + 15, cy + 342, 26, 26, hexToRgba('#065F46'));
    drawRect(png, bx + 50, cy + 344, 110, 10, hexToRgba('#0F172A'));
    drawRect(png, bx + 50, cy + 360, 130, 8, hexToRgba('#94A3B8'));
  }

  drawRect(png, cx + 50, cy + 415, 180, 44, hexToRgba('#0F172A'));
  drawCard(png, cx + 245, cy + 415, 160, 44, '#ECFDF5', '#A7F3D0');

  return png;
}

// 3. Survey Interactive Cards
function generateSurveyInteractive() {
  const png = createBaseCanvas(1200, 750);
  const cx = 220, cy = 80, cw = 760, ch = 620;

  // Progress Bar
  drawRect(png, cx, cy, cw, 6, hexToRgba('#E2E8F0'));
  drawRect(png, cx, cy, 260, 6, hexToRgba('#065F46'));

  // Main Question Card
  drawCard(png, cx, cy + 20, cw, ch - 20, '#FFFFFF', '#E2E8F0');

  // Section Indicator
  drawRect(png, cx + 40, cy + 45, 28, 28, hexToRgba('#ECFDF5'));
  drawRect(png, cx + 80, cy + 52, 160, 14, hexToRgba('#065F46'));

  // Question Title
  drawRect(png, cx + 40, cy + 90, 520, 22, hexToRgba('#0F172A'));
  drawRect(png, cx + 40, cy + 120, 360, 12, hexToRgba('#64748B'));

  // Interactive 3x2 Visual Grid
  const cardW = 210, cardH = 150;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = cx + 40 + col * (cardW + 20);
      const y = cy + 155 + row * (cardH + 18);
      const isSelected = (row === 0 && col === 0) || (row === 0 && col === 2);

      drawCard(png, x, y, cardW, cardH, isSelected ? '#ECFDF5' : '#FFFFFF', isSelected ? '#065F46' : '#E2E8F0');
      // Image mockup area
      drawRect(png, x + 8, y + 8, cardW - 16, 90, hexToRgba(isSelected ? '#A7F3D0' : '#E2E8F0'));
      // Label
      drawRect(png, x + 12, y + 112, cardW - 40, 14, hexToRgba('#0F172A'));
      // Check indicator if selected
      if (isSelected) {
        drawRect(png, x + cardW - 32, y + 14, 20, 20, hexToRgba('#065F46'));
      }
    }
  }

  // Navigation Bottom Strip
  drawRect(png, cx + 40, cy + ch - 65, 90, 36, hexToRgba('#F1F5F9')); // Prev
  drawRect(png, cx + cw - 150, cy + ch - 65, 110, 36, hexToRgba('#0F172A')); // Next

  return png;
}

// 4. Survey Mobile
function generateSurveyMobile() {
  const mw = 390, mh = 844;
  const png = createBaseCanvas(mw, mh, true);

  // Status Bar
  drawRect(png, 20, 8, 50, 10, hexToRgba('#0F172A'));
  drawRect(png, mw - 70, 8, 50, 10, hexToRgba('#0F172A'));

  // Progress Bar
  drawRect(png, 16, 68, mw - 32, 4, hexToRgba('#E2E8F0'));
  drawRect(png, 16, 68, 140, 4, hexToRgba('#065F46'));

  // Mobile Question Card
  drawCard(png, 16, 82, mw - 32, 680, '#FFFFFF', '#E2E8F0');

  // Title
  drawRect(png, 32, 105, 30, 30, hexToRgba('#ECFDF5'));
  drawRect(png, 70, 112, 130, 14, hexToRgba('#065F46'));

  drawRect(png, 32, 150, mw - 64, 18, hexToRgba('#0F172A'));
  drawRect(png, 32, 175, 180, 18, hexToRgba('#0F172A'));

  // 4 Single choice options
  for (let i = 0; i < 4; i++) {
    const oy = 215 + i * 72;
    const isSelected = i === 1;
    drawCard(png, 32, oy, mw - 64, 58, isSelected ? '#ECFDF5' : '#FFFFFF', isSelected ? '#065F46' : '#E2E8F0');
    drawRect(png, 46, oy + 18, 22, 22, hexToRgba(isSelected ? '#065F46' : '#E2E8F0'));
    drawRect(png, 80, oy + 23, 190, 12, hexToRgba('#0F172A'));
  }

  // Bottom Nav
  drawRect(png, 32, 700, 90, 42, hexToRgba('#F1F5F9'));
  drawRect(png, mw - 142, 700, 110, 42, hexToRgba('#0F172A'));

  return png;
}

// 5. Analytics Overview
function generateAnalyticsOverview() {
  const png = createBaseCanvas(1200, 750);

  // Subnav tabs
  drawRect(png, 40, 75, 1120, 34, hexToRgba('#FFFFFF'));
  drawRect(png, 40, 75, 130, 34, hexToRgba('#0F172A')); // Active tab
  drawRect(png, 180, 85, 90, 14, hexToRgba('#64748B'));
  drawRect(png, 280, 85, 90, 14, hexToRgba('#64748B'));
  drawRect(png, 380, 85, 110, 14, hexToRgba('#64748B'));
  drawRect(png, 500, 85, 90, 14, hexToRgba('#64748B'));

  // 6 KPI Metric Cards
  for (let i = 0; i < 6; i++) {
    const kx = 40 + i * 190;
    drawCard(png, kx, 125, 175, 95, '#FFFFFF', '#E2E8F0');
    drawRect(png, kx + 15, 140, 100, 10, hexToRgba('#64748B'));
    drawRect(png, kx + 15, 160, 70, 26, hexToRgba(i === 1 ? '#065F46' : '#0F172A')); // Big number
    drawRect(png, kx + 15, 195, 110, 8, hexToRgba('#94A3B8'));
  }

  // 2 Major Grid Sections (Hurdles vs Opportunities)
  drawCard(png, 40, 235, 550, 235, '#FFFFFF', '#E2E8F0');
  drawRect(png, 60, 255, 220, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 3; i++) {
    drawCard(png, 60, 285 + i * 54, 510, 44, '#FFFBEB', '#FEF3C7');
    drawRect(png, 75, 300 + i * 54, 340, 12, hexToRgba('#0F172A'));
    drawRect(png, 520, 298 + i * 54, 36, 18, hexToRgba('#D97706'));
  }

  drawCard(png, 610, 235, 550, 235, '#FFFFFF', '#E2E8F0');
  drawRect(png, 630, 255, 240, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 3; i++) {
    drawCard(png, 630, 285 + i * 54, 510, 44, '#ECFDF5', '#A7F3D0');
    drawRect(png, 645, 300 + i * 54, 340, 12, hexToRgba('#065F46'));
    drawRect(png, 1080, 298 + i * 54, 45, 18, hexToRgba('#065F46'));
  }

  // Bottom Chart Strips
  drawCard(png, 40, 485, 1120, 230, '#FFFFFF', '#E2E8F0');
  drawRect(png, 60, 505, 280, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 5; i++) {
    const by = 540 + i * 32;
    drawRect(png, 60, by, 160, 12, hexToRgba('#64748B'));
    drawRect(png, 240, by + 2, 700 - i * 110, 10, hexToRgba('#065F46'));
    drawRect(png, 960, by, 60, 12, hexToRgba('#0F172A'));
  }

  return png;
}

// 6. Analytics Consumer Insights
function generateAnalyticsConsumerInsights() {
  const png = createBaseCanvas(1200, 750);
  drawRect(png, 40, 75, 1120, 34, hexToRgba('#FFFFFF'));
  drawRect(png, 175, 75, 120, 34, hexToRgba('#0F172A')); // Behavior tab active

  // Insight Box: Stated vs Revealed
  drawCard(png, 40, 125, 1120, 110, '#ECFDF5', '#A7F3D0');
  drawRect(png, 65, 145, 350, 16, hexToRgba('#065F46'));
  drawRect(png, 65, 172, 980, 12, hexToRgba('#0F172A'));
  drawRect(png, 65, 192, 850, 12, hexToRgba('#0F172A'));

  // 4 Funnel Stages
  for (let i = 0; i < 4; i++) {
    const fx = 40 + i * 290;
    drawCard(png, fx, 250, 260, 130, i === 3 ? '#065F46' : '#FFFFFF', '#E2E8F0');
    drawRect(png, fx + 15, 268, 60, 10, hexToRgba(i === 3 ? '#A7F3D0' : '#94A3B8'));
    drawRect(png, fx + 15, 288, 120, 20, hexToRgba(i === 3 ? '#FFFFFF' : '#0F172A'));
    drawRect(png, fx + 15, 320, 220, 28, hexToRgba(i === 3 ? '#D1FAE5' : '#64748B'));
  }

  // 2 Side-by-Side Charts
  drawCard(png, 40, 400, 550, 310, '#FFFFFF', '#E2E8F0');
  drawRect(png, 60, 420, 240, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 4; i++) {
    drawCard(png, 60, 455 + i * 55, 510, 44, '#F8FAFC', '#E2E8F0');
    drawRect(png, 75, 470 + i * 55, 260, 12, hexToRgba('#0F172A'));
    drawRect(png, 490, 468 + i * 55, 50, 16, hexToRgba('#0F172A'));
  }

  drawCard(png, 610, 400, 550, 310, '#FFFFFF', '#E2E8F0');
  drawRect(png, 630, 420, 240, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 4; i++) {
    drawCard(png, 630, 455 + i * 55, 510, 44, '#ECFDF5', '#A7F3D0');
    drawRect(png, 645, 470 + i * 55, 260, 12, hexToRgba('#065F46'));
    drawRect(png, 1060, 468 + i * 55, 50, 16, hexToRgba('#065F46'));
  }

  return png;
}

// 7. Analytics Segmentation
function generateAnalyticsSegmentation() {
  const png = createBaseCanvas(1200, 750);
  drawRect(png, 40, 75, 1120, 34, hexToRgba('#FFFFFF'));
  drawRect(png, 300, 75, 110, 34, hexToRgba('#0F172A')); // Segmentation tab active

  drawRect(png, 40, 125, 340, 20, hexToRgba('#0F172A'));
  drawRect(png, 40, 150, 480, 12, hexToRgba('#64748B'));

  // 4 Segment Cards Grid
  const cardW = 550, cardH = 250;
  for (let i = 0; i < 4; i++) {
    const x = 40 + (i % 2) * 570;
    const y = 175 + Math.floor(i / 2) * 265;
    drawCard(png, x, y, cardW, cardH, '#FFFFFF', '#E2E8F0');

    // Badge & Share
    drawRect(png, x + 20, y + 20, 100, 18, hexToRgba('#ECFDF5'));
    drawRect(png, x + cardW - 70, y + 20, 50, 26, hexToRgba('#065F46')); // percentage

    // Title & desc
    drawRect(png, x + 20, y + 50, 280, 18, hexToRgba('#0F172A'));
    drawRect(png, x + 20, y + 78, 480, 10, hexToRgba('#64748B'));
    drawRect(png, x + 20, y + 94, 420, 10, hexToRgba('#64748B'));

    // Traits & Fears Split
    drawCard(png, x + 20, y + 115, 245, 65, '#F8FAFC', '#E2E8F0');
    drawRect(png, x + 30, y + 125, 90, 8, hexToRgba('#64748B'));
    drawRect(png, x + 30, y + 140, 180, 8, hexToRgba('#0F172A'));
    drawRect(png, x + 30, y + 155, 160, 8, hexToRgba('#0F172A'));

    drawCard(png, x + 280, y + 115, 245, 65, '#FFFBEB', '#FEF3C7');
    drawRect(png, x + 290, y + 125, 90, 8, hexToRgba('#D97706'));
    drawRect(png, x + 290, y + 140, 180, 8, hexToRgba('#78350F'));
    drawRect(png, x + 290, y + 155, 160, 8, hexToRgba('#78350F'));

    // Directive
    drawCard(png, x + 20, y + 190, 505, 44, '#ECFDF5', '#A7F3D0');
    drawRect(png, x + 30, y + 206, 460, 10, hexToRgba('#065F46'));
  }

  return png;
}

// 8. Analytics Delivery
function generateAnalyticsDelivery() {
  const png = createBaseCanvas(1200, 750);
  drawRect(png, 40, 75, 1120, 34, hexToRgba('#FFFFFF'));
  drawRect(png, 560, 75, 120, 34, hexToRgba('#0F172A')); // Logistics tab active

  // 3 Logistics Metric Cards
  for (let i = 0; i < 3; i++) {
    const x = 40 + i * 380;
    drawCard(png, x, 125, 360, 100, '#FFFFFF', '#E2E8F0');
    drawRect(png, x + 20, 145, 140, 12, hexToRgba('#64748B'));
    drawRect(png, x + 20, 168, 90, 26, hexToRgba('#065F46'));
  }

  // Delivery Directives
  drawCard(png, 40, 245, 1120, 210, '#FFFFFF', '#E2E8F0');
  drawRect(png, 65, 268, 280, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 3; i++) {
    drawCard(png, 65, 300 + i * 46, 1070, 38, '#F8FAFC', '#E2E8F0');
    drawRect(png, 80, 312 + i * 46, 20, 14, hexToRgba('#065F46'));
    drawRect(png, 115, 313 + i * 46, 750, 12, hexToRgba('#0F172A'));
  }

  // Wilaya Delivery Breakdown
  drawCard(png, 40, 475, 1120, 240, '#FFFFFF', '#E2E8F0');
  drawRect(png, 65, 498, 260, 16, hexToRgba('#0F172A'));
  for (let i = 0; i < 4; i++) {
    const by = 530 + i * 40;
    drawRect(png, 65, by, 140, 14, hexToRgba('#0F172A'));
    drawRect(png, 220, by + 2, 800 - i * 90, 10, hexToRgba('#0D9488'));
  }

  return png;
}

// 9. Analytics Pain Points
function generateAnalyticsPainPoints() {
  const png = createBaseCanvas(1200, 750);
  drawRect(png, 40, 75, 1120, 34, hexToRgba('#FFFFFF'));
  drawRect(png, 420, 75, 130, 34, hexToRgba('#0F172A')); // Pain points tab active

  drawRect(png, 40, 125, 320, 20, hexToRgba('#0F172A'));
  drawRect(png, 40, 150, 520, 12, hexToRgba('#64748B'));

  // 3 Ranked Pain Point Cards
  for (let i = 0; i < 3; i++) {
    const y = 175 + i * 175;
    drawCard(png, 40, y, 1120, 160, '#FFFFFF', '#E2E8F0');

    // Index & Title
    drawRect(png, 60, y + 18, 28, 28, hexToRgba('#0F172A'));
    drawRect(png, 100, y + 24, 340, 16, hexToRgba('#0F172A'));

    // Priority Score Badge
    drawRect(png, 1050, y + 18, 80, 28, hexToRgba('#065F46'));

    // Quotes
    drawCard(png, 60, y + 55, 520, 42, '#F8FAFC', '#E2E8F0');
    drawRect(png, 75, y + 68, 450, 10, hexToRgba('#64748B'));

    drawCard(png, 595, y + 55, 535, 42, '#F8FAFC', '#E2E8F0');
    drawRect(png, 610, y + 68, 450, 10, hexToRgba('#64748B'));

    // Solution
    drawCard(png, 60, y + 105, 1070, 42, '#ECFDF5', '#A7F3D0');
    drawRect(png, 75, y + 120, 800, 10, hexToRgba('#065F46'));
  }

  return png;
}

// 10. Analytics Strategic Insights
function generateAnalyticsStrategicInsights() {
  const png = createBaseCanvas(1200, 750);
  drawRect(png, 40, 75, 1120, 34, hexToRgba('#FFFFFF'));
  drawRect(png, 690, 75, 120, 34, hexToRgba('#0F172A')); // Strategic tab active

  drawRect(png, 40, 125, 340, 20, hexToRgba('#0F172A'));
  drawRect(png, 40, 150, 520, 12, hexToRgba('#64748B'));

  for (let i = 0; i < 3; i++) {
    const y = 180 + i * 170;
    drawCard(png, 40, y, 1120, 155, '#FFFFFF', '#E2E8F0');

    // Priority tag & title
    drawRect(png, 60, y + 20, 70, 18, hexToRgba(i === 0 ? '#FFE4E6' : '#ECFDF5'));
    drawRect(png, 145, y + 22, 380, 16, hexToRgba('#0F172A'));

    // Sample backing
    drawRect(png, 980, y + 22, 140, 14, hexToRgba('#64748B'));

    // Supporting data
    drawCard(png, 60, y + 52, 1060, 40, '#F8FAFC', '#E2E8F0');
    drawRect(png, 75, y + 66, 680, 12, hexToRgba('#64748B'));

    // MVP action plan
    drawCard(png, 60, y + 100, 1060, 44, '#ECFDF5', '#A7F3D0');
    drawRect(png, 75, y + 115, 850, 12, hexToRgba('#065F46'));
  }

  return png;
}

// Write files
const files = [
  { name: 'survey-home-ar.png', fn: generateSurveyHomeAr },
  { name: 'survey-home-en.png', fn: generateSurveyHomeEn },
  { name: 'survey-interactive.png', fn: generateSurveyInteractive },
  { name: 'survey-mobile.png', fn: generateSurveyMobile },
  { name: 'analytics-overview.png', fn: generateAnalyticsOverview },
  { name: 'analytics-consumer-insights.png', fn: generateAnalyticsConsumerInsights },
  { name: 'analytics-segmentation.png', fn: generateAnalyticsSegmentation },
  { name: 'analytics-delivery.png', fn: generateAnalyticsDelivery },
  { name: 'analytics-pain-points.png', fn: generateAnalyticsPainPoints },
  { name: 'analytics-strategic-insights.png', fn: generateAnalyticsStrategicInsights }
];

console.log(`Generating ${files.length} screenshots into ${SCREENSHOTS_DIR}...`);

files.forEach(({ name, fn }) => {
  const png = fn();
  const filePath = path.join(SCREENSHOTS_DIR, name);
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
  console.log(`Saved ${name} (${buffer.length} bytes)`);
});

console.log('All screenshots generated successfully!');
