
import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const enableCamera = async () => {
      if (isCameraOpen) {
        setCameraError(null);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera error:", err);
          setCameraError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
          setIsCameraOpen(false); // 카메라 실패 시 되돌아가기
        }
      }
    };

    enableCamera();

    // 정리 함수
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (base64) {
          onImageSelect(base64, file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const startCamera = () => {
    setIsCameraOpen(true);
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        onImageSelect(base64, 'image/jpeg');
        stopCamera();
      }
    }
  };
  
  if (isCameraOpen) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="relative w-full aspect-video mb-4 bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={handleCapture} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            촬영하기
          </button>
          <button onClick={stopCamera} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl text-center">
      <h2 className="text-2xl font-semibold mb-2 text-slate-200">사진 준비하기</h2>
      <p className="text-slate-400 mb-6">스타일을 적용할 사진을 업로드하거나 새로 촬영하세요.</p>
      
      {cameraError && <p className="text-red-400 mb-4">{cameraError}</p>}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        <button
          onClick={handleUploadClick}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <UploadIcon />
          <span>파일 업로드</span>
        </button>
        <button
          onClick={startCamera}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <CameraIcon />
          <span>카메라로 촬영</span>
        </button>
      </div>
    </div>
  );
};
