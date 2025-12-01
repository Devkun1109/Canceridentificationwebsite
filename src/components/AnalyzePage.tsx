import { useState, useRef } from 'react';
import { Upload, Camera, Loader, X, Info } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface AnalyzePageProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function AnalyzePage({ user, onNavigate }: AnalyzePageProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);

    try {
      // Upload image to Supabase Storage
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('userId', user.id);

      const uploadResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-83197308/upload-image`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await uploadResponse.json();

      // Call analyze endpoint
      const analyzeResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-83197308/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            userId: user.id,
            imageUrl,
          }),
        }
      );

      if (!analyzeResponse.ok) {
        throw new Error('Analysis failed');
      }

      const result = await analyzeResponse.json();

      // Navigate to results page
      onNavigate('result', {
        scanId: result.scanId,
        imageUrl,
        disease_name: result.disease_name,
        confidence: result.confidence,
        description: result.description,
        severity: result.severity,
        recommendations: result.recommendations,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Analyze Skin Condition
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a clear image of the affected skin area. Our AI will analyze it and provide insights about potential conditions.
          </p>
        </div>

        {/* Guidelines Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-900 mb-2">Photo Guidelines</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Ensure good lighting - natural light works best</li>
                <li>• Take a close-up photo showing the affected area clearly</li>
                <li>• Avoid blurry images or extreme angles</li>
                <li>• Include some surrounding healthy skin for context</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {!selectedImage ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
              }`}
            >
              <div className="max-w-sm mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-6 shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-3 text-gray-800">Upload Skin Image</h3>
                <p className="text-gray-500 mb-6">
                  Drag and drop your image here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer"
                >
                  Choose File
                </label>
                <p className="text-gray-400 text-sm mt-4">
                  Supported formats: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative">
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {analyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      Analyze Now
                    </>
                  )}
                </button>
                
                {!analyzing && (
                  <button
                    onClick={clearImage}
                    className="w-full py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    Choose Different Image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h4 className="text-amber-900 mb-2">Important Disclaimer</h4>
          <p className="text-amber-700 text-sm">
            This AI analysis tool is designed for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified dermatologist or healthcare provider with any questions you may have regarding a skin condition.
          </p>
        </div>
      </div>
    </div>
  );
}
