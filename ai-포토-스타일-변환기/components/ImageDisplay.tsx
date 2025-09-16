import React from 'react';

interface ImageDisplayProps {
  originalImage: string;
  generatedImage: { base64: string; mimeType: string; };
  onReset: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImage, onReset }) => {

  const generatedImageUrl = `data:${generatedImage.mimeType};base64,${generatedImage.base64}`;

  const handleDownload = () => {
    const getFileExtension = (mimeType: string) => {
        switch (mimeType) {
            case 'image/jpeg': return 'jpg';
            case 'image/png': return 'png';
            case 'image/webp': return 'webp';
            default: return 'png';
        }
    }
    
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const extension = getFileExtension(generatedImage.mimeType);
    link.download = `styled_image_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3 text-slate-300">원본 이미지</h3>
          <img src={originalImage} alt="Original" className="rounded-xl shadow-lg w-full h-auto object-contain max-h-[60vh]" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3 text-slate-300">변환된 이미지</h3>
          <img src={generatedImageUrl} alt="Generated" className="rounded-xl shadow-lg w-full h-auto object-contain max-h-[60vh]" />
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          다운로드
        </button>
        <button
          onClick={onReset}
          className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          새로 만들기
        </button>
      </div>
    </div>
  );
};