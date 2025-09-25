import React, { useEffect, useRef } from 'react';
import { MemeData } from '../types';
import { generateCaptions } from '../utils/captionGenerator';
import { createMemeImage } from '../utils/imageProcessor';
import { extractColorsSimple, getTextColors } from '../utils/simpleColorExtractor';

interface MemeGeneratorProps {
  imageFile: File;
  onMemesGenerated: (memes: MemeData[]) => void;
  shouldGenerate: boolean;
  memeCount: number;
  customCaption?: { topText: string; bottomText: string } | null;
}

const MemeGenerator: React.FC<MemeGeneratorProps> = ({
  imageFile,
  onMemesGenerated,
  shouldGenerate,
  memeCount,
  customCaption
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const generationId = useRef(0);

  useEffect(() => {
    if (!shouldGenerate) return;
    
    const generateMemes = async () => {
      try {
        const currentGenerationId = ++generationId.current;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Generate multiple caption variations or use custom caption
        const captions = customCaption ? 
          [{ topText: customCaption.topText, bottomText: customCaption.bottomText, category: 'custom' as any }] : 
          generateCaptions();
        const memes: MemeData[] = [];

        // Create image element
        const img = new Image();
        const imageUrl = URL.createObjectURL(imageFile);
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        // Check if this generation was cancelled
        if (currentGenerationId !== generationId.current) {
          URL.revokeObjectURL(imageUrl);
          return;
        }

        // Extract colors from the uploaded image using simplified method
        let backgroundColor: string | undefined;
        let primaryColor: string | undefined;
        let textColors: { textColor: string; strokeColor: string } | undefined;
        
        try {
          console.log('🔄 Starting SIMPLE color extraction for image:', { width: img.width, height: img.height });
          const extractedColors = await extractColorsSimple(img);
          backgroundColor = extractedColors.background;
          primaryColor = extractedColors.primary;
          textColors = getTextColors(backgroundColor);
          console.log('✅ SIMPLE extraction SUCCESS:', { extractedColors, backgroundColor, primaryColor, textColors });
        } catch (error) {
          console.warn('❌ SIMPLE extraction FAILED, using default colors:', error);
          backgroundColor = '#E0F2FE'; // Light blue background
          primaryColor = '#3B82F6'; // Blue primary
          textColors = { textColor: '#000000', strokeColor: '#FFFFFF' };
        }

        // Generate memes with different styles and captions
        const styles: Array<'classic' | 'modern' | 'bold'> = ['classic', 'modern', 'bold'];
        
        for (let i = 0; i < Math.min(memeCount, captions.length); i++) {
          const caption = captions[i];
          const style = styles[i % styles.length];
          
          const memeImageUrl = await createMemeImage(
            img,
            caption.topText,
            caption.bottomText,
            style,
            canvas,
            ctx,
            primaryColor, // Use primary color for better background creation
            textColors
          );
          
          memes.push({
            id: `meme-${i}`,
            imageUrl: memeImageUrl,
            topText: caption.topText,
            bottomText: caption.bottomText,
            style
          });
        }

        URL.revokeObjectURL(imageUrl);
        
        // Only call callback if this is still the current generation
        if (currentGenerationId === generationId.current) {
          onMemesGenerated(memes);
        }
      } catch (error) {
        console.error('Error generating memes:', error);
        onMemesGenerated([]);
      }
    };

    generateMemes();
  }, [shouldGenerate, imageFile, onMemesGenerated, memeCount, customCaption]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'none' }}
      width={800}
      height={600}
    />
  );
};

export default MemeGenerator;