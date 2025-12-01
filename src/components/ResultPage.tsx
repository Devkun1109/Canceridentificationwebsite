import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, MapPin, ArrowRight, Calendar, Percent } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DiseaseModal } from './DiseaseModal';

interface ResultPageProps {
  data: {
    scanId: string;
    imageUrl: string;
    disease_name: string;
    confidence: number;
    description: string;
    severity: string;
    recommendations: string[];
  };
  onNavigate: (page: string) => void;
}

export function ResultPage({ data, onNavigate }: ResultPageProps) {
  const [showDiseaseModal, setShowDiseaseModal] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'from-green-500 to-green-600';
      case 'medium':
      case 'moderate':
        return 'from-yellow-500 to-yellow-600';
      case 'high':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return { text: 'High', color: 'text-green-600 bg-green-50' };
    if (confidence >= 60) return { text: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'Low', color: 'text-red-600 bg-red-50' };
  };

  const confidenceLevel = getConfidenceLevel(data.confidence);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Analysis Complete
          </h1>
          <p className="text-gray-600">
            Review your results and recommendations below
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Quick Stats */}
          <div className="space-y-6">
            {/* Image Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 animate-fade-in">
              <h3 className="mb-4 text-gray-800">Analyzed Image</h3>
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={data.imageUrl}
                  alt="Analyzed skin"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                Analyzed on {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Confidence Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h4 className="mb-4 text-gray-800">Analysis Confidence</h4>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-4 py-2 rounded-full ${confidenceLevel.color}`}>
                  {confidenceLevel.text} Confidence
                </span>
                <span className="text-purple-600">{data.confidence.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${data.confidence}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                This indicates how certain our AI is about the identification
              </p>
            </div>
          </div>

          {/* Right Column - Results & Recommendations */}
          <div className="space-y-6">
            {/* Disease Identification Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSeverityColor(data.severity)} rounded-xl flex items-center justify-center shadow-md`}>
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Identified Condition</p>
                  <h3 className="text-gray-800">{data.disease_name}</h3>
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Severity Level:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    data.severity.toLowerCase() === 'low'
                      ? 'bg-green-100 text-green-700'
                      : data.severity.toLowerCase() === 'medium' || data.severity.toLowerCase() === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {data.severity}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{data.description}</p>

              <button
                onClick={() => setShowDiseaseModal(true)}
                className="w-full py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
              >
                <Info className="w-5 h-5" />
                Learn More About This Condition
              </button>
            </div>

            {/* Recommendations Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h4 className="mb-4 text-gray-800">Recommendations</h4>
              <div className="space-y-3">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Dermatologist Card */}
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4>Need Professional Care?</h4>
                  <p className="text-white/80 text-sm">Find nearby dermatologists</p>
                </div>
              </div>
              <button
                onClick={() => {
                  // This would trigger Google Maps integration
                  window.open(`https://www.google.com/maps/search/dermatologist+near+me`, '_blank');
                }}
                className="w-full py-3 bg-white text-purple-600 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Find Dermatologists Nearby
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => onNavigate('analyze')}
            className="py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all"
          >
            Analyze Another Image
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="py-4 bg-white border-2 border-purple-200 text-purple-600 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all"
          >
            View History
          </button>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-900 mb-2">Medical Disclaimer</h4>
              <p className="text-amber-700 text-sm">
                This analysis is provided for informational purposes only and should not be considered as medical advice. Please consult with a qualified dermatologist for proper diagnosis and treatment. Early professional consultation is recommended for any concerning skin conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Modal */}
      {showDiseaseModal && (
        <DiseaseModal
          diseaseName={data.disease_name}
          onClose={() => setShowDiseaseModal(false)}
        />
      )}
    </div>
  );
}
