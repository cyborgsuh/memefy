import { createExtendedBackground } from './backgroundExtender';

export const createMemeImage = async (
  img: HTMLImageElement,
  topText: string,
  bottomText: string,
  style: 'classic' | 'modern' | 'bold',
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  primaryColor?: string,
  textColors?: { textColor: string; strokeColor: string }
): Promise<string> => {
  const canvasWidth = 800;
  const canvasHeight = 600;
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Create extended background that harmonizes with logo colors
  if (primaryColor && primaryColor !== '#FFFFFF' && primaryColor !== '#F8FAFC') {
    console.log('🎨 Creating extended background with primary color:', primaryColor);
    createExtendedBackground(canvas, ctx, primaryColor, 'gradient');
  } else {
    // Fallback to simple background
    ctx.fillStyle = primaryColor || '#F0F9FF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    console.log('⬜ Using simple background color:', primaryColor || '#F0F9FF');
  }
  
  // Calculate image dimensions to fit within canvas while maintaining aspect ratio
  const imgAspectRatio = img.width / img.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  if (imgAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas ratio
    drawWidth = canvasWidth * 0.9; // Leave some margin
    drawHeight = drawWidth / imgAspectRatio;
  } else {
    // Image is taller than canvas ratio
    drawHeight = canvasHeight * 0.7; // Leave space for text
    drawWidth = drawHeight * imgAspectRatio;
  }
  
  drawX = (canvasWidth - drawWidth) / 2;
  drawY = (canvasHeight - drawHeight) / 2;
  
  // Draw the image
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  
  // Configure text style based on meme style
  let fontSize, fontFamily, strokeWidth, shadowBlur;
  
  switch (style) {
    case 'classic':
      fontSize = 48;
      fontFamily = 'Impact, Arial Black, sans-serif';
      strokeWidth = 6;
      shadowBlur = 4;
      break;
    case 'modern':
      fontSize = 42;
      fontFamily = 'Arial Black, sans-serif';
      strokeWidth = 5;
      shadowBlur = 3;
      break;
    case 'bold':
      fontSize = 54;
      fontFamily = 'Arial Black, sans-serif';
      strokeWidth = 7;
      shadowBlur = 5;
      break;
  }
  
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Use calculated text colors or defaults
  const textColor = textColors?.textColor || '#FFFFFF';
  const strokeColor = textColors?.strokeColor || '#000000';
  
  ctx.fillStyle = textColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  
  // Add shadow for better readability
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  // Function to draw text with word wrapping
  const drawWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = y - (totalHeight / 2);
    
    lines.forEach((line, index) => {
      const lineY = startY + (index * lineHeight) + (lineHeight / 2);
      
      // Draw shadow first
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw stroke (outline)
      ctx.strokeText(line, x, lineY);
      
      // Reset shadow for fill
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw fill (white text)
      ctx.fillText(line, x, lineY);
    });
  };
  
  // Draw top text
  if (topText.trim()) {
    const topY = Math.max(fontSize + 30, drawY - 50);
    drawWrappedText(topText.toUpperCase(), canvasWidth / 2, topY, canvasWidth * 0.9);
  }
  
  // Draw bottom text
  if (bottomText.trim()) {
    const bottomY = Math.min(canvasHeight - 50, drawY + drawHeight + 50);
    drawWrappedText(bottomText.toUpperCase(), canvasWidth / 2, bottomY, canvasWidth * 0.9);
  }
  
  // Reset shadow settings
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Add subtle styling effects based on meme style (without ugly borders)
  if (style === 'modern') {
    // Add subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, 'rgba(0,0,0,0.05)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else if (style === 'bold') {
    // Add subtle vignette effect instead of border
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.max(canvasWidth, canvasHeight) * 0.7;
    
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    radialGradient.addColorStop(0, 'rgba(0,0,0,0)');
    radialGradient.addColorStop(0.7, 'rgba(0,0,0,0)');
    radialGradient.addColorStop(1, 'rgba(0,0,0,0.2)');
    
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
  
  return canvas.toDataURL('image/png', 0.9);
};