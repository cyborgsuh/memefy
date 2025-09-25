/**
 * Simplified color extraction that focuses on getting the job done
 */

export interface ExtractedColors {
  primary: string;
  background: string;
}

/**
 * Extract dominant colors from an image using a simple, reliable approach
 */
export const extractColorsSimple = async (image: HTMLImageElement): Promise<ExtractedColors> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a small canvas for analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set a reasonable canvas size for analysis
      const maxSize = 200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      canvas.width = Math.floor(image.width * scale);
      canvas.height = Math.floor(image.height * scale);

      console.log('Simple color extraction - Canvas size:', { width: canvas.width, height: canvas.height });

      // Draw image to canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample every 4th pixel (RGBA)
      const colors: string[] = [];
      const step = 4; // Sample every pixel

      for (let i = 0; i < data.length; i += step * 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Convert to hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors.push(hex);
      }

      console.log('Simple extraction - Found', colors.length, 'colors');

      if (colors.length === 0) {
        // Fallback colors
        resolve({
          primary: '#3B82F6',
          background: '#F0F9FF'
        });
        return;
      }

      // Find most common color (simple approach)
      const colorCount = new Map<string, number>();
      colors.forEach(color => {
        colorCount.set(color, (colorCount.get(color) || 0) + 1);
      });

      // Get the most frequent color
      let mostCommonColor = colors[0];
      let maxCount = 0;
      
      for (const [color, count] of colorCount.entries()) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonColor = color;
        }
      }

      console.log('Simple extraction - Most common color:', mostCommonColor);

      // Create a light background from the primary color
      const background = createLightBackground(mostCommonColor);

      console.log('Simple extraction - Generated background:', background);

      resolve({
        primary: mostCommonColor,
        background: background
      });

    } catch (error) {
      console.error('Simple color extraction error:', error);
      reject(error);
    }
  });
};

/**
 * Create a light background color from a primary color
 */
const createLightBackground = (primaryColor: string): string => {
  const hex = primaryColor.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Create a very light version
  const lightR = Math.min(255, Math.floor(r * 0.15 + 240));
  const lightG = Math.min(255, Math.floor(g * 0.15 + 240));
  const lightB = Math.min(255, Math.floor(b * 0.15 + 240));

  return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
};

/**
 * Get best text colors for a background
 */
export const getTextColors = (backgroundColor: string): { textColor: string; strokeColor: string } => {
  const hex = backgroundColor.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Use black text on light backgrounds, white on dark
  const useWhiteText = brightness < 128;
  
  return {
    textColor: useWhiteText ? '#FFFFFF' : '#000000',
    strokeColor: useWhiteText ? '#000000' : '#FFFFFF'
  };
};
