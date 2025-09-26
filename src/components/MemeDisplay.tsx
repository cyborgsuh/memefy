import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { MemeData } from '../types';

interface MemeDisplayProps {
  memes: MemeData[];
}

const MemeDisplay: React.FC<MemeDisplayProps> = ({ memes }) => {
  const downloadMeme = (meme: MemeData, index: number) => {
    const link = document.createElement('a');
    link.href = meme.imageUrl;
    link.download = `meme-${index + 1}.png`;
    link.click();
  };

  const getStyleBadgeColor = (style: string) => {
    switch (style) {
      case 'classic':
        return 'bg-blue-500';
      case 'modern':
        return 'bg-purple-500';
      case 'bold':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Hilarious Memes</h2>
        <div className="text-gray-300">
          {memes.length} variation{memes.length !== 1 ? 's' : ''} generated
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme, index) => (
          <div
            key={meme.id}
            className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
          >
            <div className="relative mb-4">
              <img
                src={meme.imageUrl}
                alt={`Meme ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            <div className="mb-4">
              <div className="text-white text-sm mb-2">
                <strong>Top:</strong> "{meme.topText}"
              </div>
              <div className="text-white text-sm">
                <strong>Bottom:</strong> "{meme.bottomText}"
              </div>
            </div>
            
            <button
              onClick={() => downloadMeme(meme, index)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-blue-600 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-300 mb-4">
          Not satisfied with these? Upload a new logo or try again!
        </p>
        <div className="text-xs text-gray-400">
          All memes are generated in high resolution (800x600px) perfect for social media sharing.
        </div>
      </div>
    </div>
  );
};

export default MemeDisplay;