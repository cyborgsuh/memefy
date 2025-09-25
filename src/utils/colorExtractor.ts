export interface ColorInfo {
  color: string;
  count: number;
  percentage: number;
}

export interface DominantColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

/**
 * Extract dominant colors from an image
 * @param image - HTMLImageElement to analyze
 * @param sampleSize - Number of pixels to sample (default: 1000)
 * @returns Promise<DominantColors> - Object containing dominant colors
 */
export const extractDominantColors = async (
  image: HTMLImageElement,
  sampleSize: number = 1000
): Promise<DominantColors> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Ensure image is loaded
    if (!image.complete || image.naturalWidth === 0) {
      reject(new Error('Image not loaded properly'));
      return;
    }

    // Set canvas size to match image, but limit size for performance
    const maxSize = 400;
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    canvas.width = Math.floor(image.width * scale);
    canvas.height = Math.floor(image.height * scale);
    
    // Draw image to canvas with scaling
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Sample pixels for color analysis
    const colorMap = new Map<string, number>();
    const totalPixels = canvas.width * canvas.height;
    const step = Math.max(1, Math.floor(totalPixels / sampleSize));
    
    console.log('Color extraction debug:', { 
      canvasWidth: canvas.width, 
      canvasHeight: canvas.height, 
      totalPixels, 
      step, 
      sampleSize 
    });
    
    for (let i = 0; i < data.length; i += 4 * step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Skip transparent or nearly transparent pixels
      if (a < 128) continue;
      
      // Convert to hex
      const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      
      // Group similar colors to reduce noise
      const groupedColor = groupSimilarColors(color);
      
      colorMap.set(groupedColor, (colorMap.get(groupedColor) || 0) + 1);
    }
    
    // Convert to array and sort by frequency
    const colorInfo: ColorInfo[] = Array.from(colorMap.entries())
      .map(([color, count]) => ({
        color,
        count,
        percentage: (count / sampleSize) * 100
      }))
      .sort((a, b) => b.count - a.count);
    
    console.log('Extracted colors:', colorInfo.slice(0, 10)); // Show top 10 colors
    
    // Extract dominant colors
    const dominantColors = extractColorPalette(colorInfo);
    
    resolve(dominantColors);
  });
};

/**
 * Group similar colors to reduce noise in color extraction
 */
const groupSimilarColors = (color: string): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Group colors into buckets of 32 (0-31, 32-63, etc.)
  const bucketSize = 32;
  const groupedR = Math.floor(r / bucketSize) * bucketSize;
  const groupedG = Math.floor(g / bucketSize) * bucketSize;
  const groupedB = Math.floor(b / bucketSize) * bucketSize;
  
  return `#${groupedR.toString(16).padStart(2, '0')}${groupedG.toString(16).padStart(2, '0')}${groupedB.toString(16).padStart(2, '0')}`;
};

/**
 * Extract a color palette from color information
 */
const extractColorPalette = (colorInfo: ColorInfo[]): DominantColors => {
  // Filter out very dark and very light colors that are likely backgrounds
  const filteredColors = colorInfo.filter(color => {
    const hex = color.color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Filter out very dark (< 30) and very light (> 240) colors
    return brightness >= 30 && brightness <= 240;
  });
  
  // If no suitable colors found, use the original list
  const colorsToUse = filteredColors.length > 0 ? filteredColors : colorInfo;
  
  // If still no colors, create a fallback palette
  if (colorsToUse.length === 0) {
    return {
      primary: '#3B82F6', // Blue
      secondary: '#EF4444', // Red
      accent: '#10B981', // Green
      background: '#F8FAFC' // Light gray
    };
  }
  
  // Get primary color (most frequent)
  const primary = colorsToUse[0]?.color || '#000000';
  
  // Get secondary color (second most frequent, or a contrasting color)
  let secondary = colorsToUse[1]?.color || primary;
  
  // If secondary is too similar to primary, generate a contrasting color
  if (isColorSimilar(primary, secondary)) {
    secondary = generateContrastingColor(primary);
  }
  
  // Get accent color (third most frequent, or a complementary color)
  let accent = colorsToUse[2]?.color || primary;
  
  // If accent is too similar to primary or secondary, generate a complementary color
  if (isColorSimilar(accent, primary) || isColorSimilar(accent, secondary)) {
    accent = generateComplementaryColor(primary);
  }
  
  // Get background color (lightest suitable color, or generate one)
  const background = generateBackgroundColor(primary);
  
  return {
    primary,
    secondary,
    accent,
    background
  };
};

/**
 * Check if two colors are similar
 */
const isColorSimilar = (color1: string, color2: string): boolean => {
  const hex1 = color1.slice(1);
  const hex2 = color2.slice(1);
  
  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);
  
  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);
  
  // Calculate Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
  
  // Colors are similar if distance is less than 100 (out of 441 max)
  return distance < 100;
};

/**
 * Generate a contrasting color
 */
const generateContrastingColor = (color: string): string => {
  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If color is dark, make it light; if light, make it dark
  if (brightness < 128) {
    return '#FFFFFF';
  } else {
    return '#000000';
  }
};

/**
 * Generate a complementary color
 */
const generateComplementaryColor = (color: string): string => {
  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate complementary color
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
};

/**
 * Generate a background color based on the primary color
 */
const generateBackgroundColor = (primaryColor: string): string => {
  const hex = primaryColor.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate brightness of the primary color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If the primary color is already light, make it even lighter
  // If it's dark, create a light tinted version
  if (brightness > 180) {
    // Already light color - make it very light with a subtle tint
    const lightR = Math.min(255, Math.floor(r * 0.15 + 240));
    const lightG = Math.min(255, Math.floor(g * 0.15 + 240));
    const lightB = Math.min(255, Math.floor(b * 0.15 + 240));
    return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  } else if (brightness > 100) {
    // Medium brightness - create a light tinted version
    const lightR = Math.min(255, Math.floor(r * 0.2 + 230));
    const lightG = Math.min(255, Math.floor(g * 0.2 + 230));
    const lightB = Math.min(255, Math.floor(b * 0.2 + 230));
    return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  } else {
    // Dark color - create a very light tinted version
    const lightR = Math.min(255, Math.floor(r * 0.3 + 220));
    const lightG = Math.min(255, Math.floor(g * 0.3 + 220));
    const lightB = Math.min(255, Math.floor(b * 0.3 + 220));
    return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  }
};

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB to hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Calculate the contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Get the best text color (black or white) for a given background
 */
export const getBestTextColor = (backgroundColor: string): { textColor: string; strokeColor: string } => {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  // Use white text if it has better contrast, otherwise use black
  const useWhiteText = whiteContrast > blackContrast;
  
  return {
    textColor: useWhiteText ? '#FFFFFF' : '#000000',
    strokeColor: useWhiteText ? '#000000' : '#FFFFFF'
  };
};
