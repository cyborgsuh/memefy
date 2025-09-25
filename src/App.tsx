import { useState } from 'react';
import { Upload, Download, RefreshCw, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import MemeGenerator from './components/MemeGenerator';
import MemeDisplay from './components/MemeDisplay';
import { MemeData } from './types';

function App() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [memes, setMemes] = useState<MemeData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memeCount, setMemeCount] = useState(3);
  const [customCaption, setCustomCaption] = useState({ topText: '', bottomText: '' });
  const [useCustomCaption, setUseCustomCaption] = useState(false);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setMemes([]);
  };

  const handleMemesGenerated = (generatedMemes: MemeData[]) => {
    setMemes(generatedMemes);
    setIsGenerating(false);
  };

  const handleGenerateClick = () => {
    setIsGenerating(true);
    setMemes([]); // Clear existing memes
  };

  const resetApp = () => {
    setUploadedImage(null);
    setMemes([]);
    setIsGenerating(false);
    setMemeCount(3);
    setCustomCaption({ topText: '', bottomText: '' });
    setUseCustomCaption(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full mr-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Meme<span className="text-yellow-400">fy</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform any company logo into hilarious memes! Upload your logo and watch the magic happen.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!uploadedImage ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <FileUpload onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Image Preview and Controls */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Uploaded logo"
                      className="w-16 h-16 object-contain bg-white rounded-lg p-2"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{uploadedImage.name}</h3>
                      <p className="text-gray-300 text-sm">
                        {(uploadedImage.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                      <label className="text-white text-sm font-medium">Count:</label>
                      <select
                        value={memeCount}
                        onChange={(e) => setMemeCount(Number(e.target.value))}
                        className="bg-white/20 text-black rounded px-2 py-1 text-sm border border-white/30 focus:border-white/50 outline-none"
                        disabled={isGenerating}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setUseCustomCaption(!useCustomCaption)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        useCustomCaption
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {useCustomCaption ? 'Using Custom Caption' : 'Add Custom Caption'}
                    </button>
                    <button
                      onClick={handleGenerateClick}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                      {isGenerating ? 'Generating...' : 'Generate Memes'}
                    </button>
                    <button
                      onClick={resetApp}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-700 transition-all"
                    >
                      <Upload className="w-5 h-5" />
                      New Logo
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Caption Input */}
              {useCustomCaption && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Custom Caption
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Top Text
                      </label>
                      <input
                        type="text"
                        value={customCaption.topText}
                        onChange={(e) => setCustomCaption(prev => ({ ...prev, topText: e.target.value }))}
                        placeholder="Enter top caption..."
                        className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-white/50 focus:outline-none"
                        maxLength={100}
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        {customCaption.topText.length}/100 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Bottom Text
                      </label>
                      <input
                        type="text"
                        value={customCaption.bottomText}
                        onChange={(e) => setCustomCaption(prev => ({ ...prev, bottomText: e.target.value }))}
                        placeholder="Enter bottom caption..."
                        className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-white/50 focus:outline-none"
                        maxLength={100}
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        {customCaption.bottomText.length}/100 characters
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    <p>💡 <strong>Tip:</strong> Keep it short and punchy for the best meme effect!</p>
                  </div>
                </div>
              )}

              {/* Meme Generator */}
              {uploadedImage && (
                <MemeGenerator
                  imageFile={uploadedImage}
                  onMemesGenerated={handleMemesGenerated}
                  shouldGenerate={isGenerating}
                  memeCount={memeCount}
                  customCaption={useCustomCaption ? customCaption : null}
                />
              )}

              {/* Meme Display */}
              {memes.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <MemeDisplay memes={memes} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-300 text-sm">
              Support for PNG, JPG, and SVG files with drag-and-drop
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Smart Captions</h3>
            <p className="text-gray-300 text-sm">
              AI-powered witty captions tailored to your brand
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Instant Download</h3>
            <p className="text-gray-300 text-sm">
              High-quality memes ready to share on social media
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;