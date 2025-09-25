/**
 * Advanced background extension that creates beautiful backgrounds from logo colors
 */

export interface BackgroundStyle {
  type: 'gradient' | 'pattern' | 'solid';
  colors: string[];
  direction?: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
}

/**
 * Create an extended background that harmonizes with the logo colors
 */
export const createExtendedBackground = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  primaryColor: string,
  style: 'gradient' | 'pattern' | 'solid' = 'gradient'
): void => {
  const width = canvas.width;
  const height = canvas.height;

  console.log('🎨 Creating extended background with color:', primaryColor, 'style:', style);

  switch (style) {
    case 'gradient':
      createGradientBackground(ctx, width, height, primaryColor);
      break;
    case 'pattern':
      createPatternBackground(ctx, width, height, primaryColor);
      break;
    case 'solid':
      createSolidBackground(ctx, width, height, primaryColor);
      break;
  }
};

/**
 * Create a gradient background that extends the logo color
 */
const createGradientBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  primaryColor: string
): void => {
  // Create multiple color stops for a rich gradient
  const colors = generateColorPalette(primaryColor);
  
  // Create a radial gradient from center
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(width, height) / 2;
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  
  // Add color stops
  gradient.addColorStop(0, colors.lightest);
  gradient.addColorStop(0.3, colors.light);
  gradient.addColorStop(0.6, colors.medium);
  gradient.addColorStop(1, colors.dark);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  console.log('🌈 Gradient background created with colors:', colors);
};

/**
 * Create a pattern background
 */
const createPatternBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  primaryColor: string
): void => {
  // First fill with base color
  const baseColor = lightenColor(primaryColor, 0.3);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle pattern
  const patternColor = lightenColor(primaryColor, 0.15);
  ctx.fillStyle = patternColor;
  
  // Create a subtle dot pattern
  const dotSize = 4;
  const spacing = 20;
  
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      if ((x + y) % (spacing * 2) === 0) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  console.log('🔸 Pattern background created');
};

/**
 * Create a solid background with subtle variations
 */
const createSolidBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  primaryColor: string
): void => {
  const backgroundColor = lightenColor(primaryColor, 0.4);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle border effect
  const borderColor = lightenColor(primaryColor, 0.2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);
  
  console.log('⬜ Solid background created');
};

/**
 * Generate a harmonious color palette from a primary color
 */
const generateColorPalette = (primaryColor: string) => {
  const hex = primaryColor.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  return {
    darkest: rgbToHex(
      Math.max(0, Math.floor(r * 0.3)),
      Math.max(0, Math.floor(g * 0.3)),
      Math.max(0, Math.floor(b * 0.3))
    ),
    dark: rgbToHex(
      Math.max(0, Math.floor(r * 0.5)),
      Math.max(0, Math.floor(g * 0.5)),
      Math.max(0, Math.floor(b * 0.5))
    ),
    medium: rgbToHex(
      Math.min(255, Math.floor(r * 0.7 + 50)),
      Math.min(255, Math.floor(g * 0.7 + 50)),
      Math.min(255, Math.floor(b * 0.7 + 50))
    ),
    light: rgbToHex(
      Math.min(255, Math.floor(r * 0.85 + 100)),
      Math.min(255, Math.floor(g * 0.85 + 100)),
      Math.min(255, Math.floor(b * 0.85 + 100))
    ),
    lightest: rgbToHex(
      Math.min(255, Math.floor(r * 0.95 + 150)),
      Math.min(255, Math.floor(g * 0.95 + 150)),
      Math.min(255, Math.floor(b * 0.95 + 150))
    )
  };
};

/**
 * Lighten a color by a factor (0-1)
 */
const lightenColor = (color: string, factor: number): string => {
  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
  const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
  const newB = Math.min(255, Math.floor(b + (255 - b) * factor));
  
  return rgbToHex(newR, newG, newB);
};

/**
 * Convert RGB to hex
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
