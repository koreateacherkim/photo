import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleSelector } from './components/StyleSelector';
import { ImageDisplay } from './components/ImageDisplay';
import { Loader } from './components/Loader';
import { generateStyledImage } from './services/geminiService';
import { StyleOption } from './types';

function App() {
  const [originalImage, setOriginalImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyEntered, setIsApiKeyEntered] = useState<boolean>(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeyEntered(true);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim());
      setIsApiKeyEntered(true);
    }
  };
  
  const handleChangeApiKey = () => {
    setIsApiKeyEntered(false);
  };

  const handleImageSelect = (base64: string, mimeType: string) => {
    setOriginalImage({ base64, mimeType });
    setGeneratedImage(null);
    setError(null);
    setSelectedStyle(null);
  };

  const handleStyleSelect = useCallback(async (style: StyleOption) => {
    if (!originalImage || !apiKey) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setSelectedStyle(style);

    try {
      const newImage = await generateStyledImage(
        originalImage.base64,
        originalImage.mimeType,
        style.prompt,
        apiKey
      );
      setGeneratedImage(newImage);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, apiKey]);

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
    setSelectedStyle(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader style={selectedStyle} />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-slate-800 rounded-lg">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={handleReset}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            다시 시작하기
          </button>
        </div>
      );
    }
    if (generatedImage && originalImage) {
      return (
        <ImageDisplay
          originalImage={`data:${originalImage.mimeType};base64,${originalImage.base64}`}
          generatedImage={generatedImage}
          onReset={handleReset}
        />
      );
    }
    if (originalImage) {
      const originalImageUrl = `data:${originalImage.mimeType};base64,${originalImage.base64}`;
      return (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 flex-shrink-0">
            <img src={originalImageUrl} alt="Original" className="rounded-xl shadow-lg object-contain max-h-[50vh]" />
          </div>
          <div className="w-full md:w-1/2">
             <h2 className="text-2xl font-bold mb-4 text-center text-slate-300">스타일을 선택하세요</h2>
            <StyleSelector onSelect={handleStyleSelect} isLoading={isLoading} />
          </div>
        </div>
      );
    }
    return <ImageUploader onImageSelect={handleImageSelect} />;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
          AI 포토 스타일 변환기
        </h1>
        <p className="text-slate-400 mt-2 text-lg">당신의 사진을 예술 작품으로 바꿔보세요!</p>
      </header>
      <main className="w-full max-w-5xl">
        {!isApiKeyEntered ? (
           <div className="w-full max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl text-center">
             <h2 className="text-2xl font-bold mb-4 text-slate-200">Gemini API 키 입력</h2>
             <p className="text-slate-400 mb-6">이미지를 변환하려면 Google AI Studio에서 발급받은 API 키를 입력해주세요.</p>
             <form onSubmit={handleApiKeySubmit}>
               <input
                 type="password"
                 value={apiKey}
                 onChange={(e) => setApiKey(e.target.value)}
                 placeholder="API 키를 여기에 붙여넣으세요"
                 className="w-full px-4 py-2 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 aria-label="Gemini API Key"
               />
               <button
                 type="submit"
                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                 disabled={!apiKey.trim()}
               >
                 API 키 저장
               </button>
             </form>
           </div>
        ) : (
          renderContent()
        )}
      </main>
      <footer className="mt-10 text-center text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
        <p className="mt-1">개발자: 가치있는미래교육연구소 대표 김병찬</p>
         {isApiKeyEntered && (
          <button onClick={handleChangeApiKey} className="text-xs text-slate-600 hover:text-slate-400 mt-2 underline">
            API 키 변경
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;