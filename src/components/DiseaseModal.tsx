import { X, Info, AlertTriangle, Stethoscope, BookOpen } from 'lucide-react';

interface DiseaseModalProps {
  diseaseName: string;
  onClose: () => void;
}

// Disease information database
const diseaseInfo: Record<string, any> = {
  'Melanoma': {
    overview: 'Melanoma is the most serious type of skin cancer. It develops in melanocytes, the cells that produce melanin (the pigment that gives skin its color).',
    causes: [
      'Excessive UV exposure from sun or tanning beds',
      'Fair skin, light hair, and light eyes',
      'History of sunburns',
      'Family history of melanoma',
      'Large number of moles or atypical moles',
    ],
    symptoms: [
      'New, unusual growth or change in existing mole',
      'Asymmetrical mole shape',
      'Irregular or poorly defined borders',
      'Multiple colors within the mole',
      'Diameter larger than 6mm',
      'Evolving size, shape, or color',
    ],
    treatment: 'Treatment typically involves surgical removal. In advanced cases, may include immunotherapy, targeted therapy, chemotherapy, or radiation.',
    prevention: [
      'Use broad-spectrum sunscreen (SPF 30+)',
      'Avoid peak sun hours (10am-4pm)',
      'Wear protective clothing',
      'Avoid tanning beds',
      'Regular skin self-examinations',
      'Annual dermatologist check-ups',
    ],
  },
  'Basal Cell Carcinoma': {
    overview: 'Basal cell carcinoma is the most common form of skin cancer. It begins in the basal cells, which produce new skin cells as old ones die.',
    causes: [
      'Chronic sun exposure',
      'Fair skin',
      'Radiation therapy',
      'Exposure to arsenic',
      'Weakened immune system',
    ],
    symptoms: [
      'Pearly or waxy bump',
      'Flat, flesh-colored or brown scar-like lesion',
      'Bleeding or scabbing sore that heals and returns',
      'Pink growth with raised edges',
    ],
    treatment: 'Usually treated with surgical excision, Mohs surgery, curettage and electrodesiccation, or topical medications for superficial lesions.',
    prevention: [
      'Daily use of sunscreen',
      'Protective clothing and hats',
      'Seek shade during peak hours',
      'Regular skin examinations',
      'Avoid tanning beds',
    ],
  },
  'Actinic Keratosis': {
    overview: 'Actinic keratosis is a rough, scaly patch on the skin caused by years of sun exposure. It is considered precancerous.',
    causes: [
      'Long-term sun exposure',
      'Fair skin, light hair, light eyes',
      'Age over 40',
      'Weakened immune system',
      'History of frequent/intense sun exposure',
    ],
    symptoms: [
      'Rough, dry, or scaly patch of skin',
      'Flat to slightly raised patch',
      'Color variations (pink, red, brown)',
      'Itching or burning sensation',
      'Size typically less than 1 inch',
    ],
    treatment: 'May include cryotherapy (freezing), topical medications, chemical peels, or photodynamic therapy.',
    prevention: [
      'Daily sunscreen application',
      'Protective clothing',
      'Avoid tanning beds',
      'Regular dermatology screenings',
      'Vitamin supplements (consult doctor)',
    ],
  },
  'Default': {
    overview: 'This is a skin condition that requires professional medical evaluation for accurate diagnosis and treatment.',
    causes: [
      'Various factors may contribute to skin conditions',
      'Genetic predisposition',
      'Environmental factors',
      'UV exposure',
      'Immune system factors',
    ],
    symptoms: [
      'Changes in skin appearance',
      'Unusual growths or lesions',
      'Color changes',
      'Texture changes',
    ],
    treatment: 'Treatment varies based on the specific condition. Consult a dermatologist for proper diagnosis and treatment plan.',
    prevention: [
      'Protect skin from sun exposure',
      'Maintain good skin hygiene',
      'Regular dermatologist check-ups',
      'Healthy lifestyle habits',
    ],
  },
};

export function DiseaseModal({ diseaseName, onClose }: DiseaseModalProps) {
  const info = diseaseInfo[diseaseName] || diseaseInfo['Default'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Detailed Information</p>
              <h2 className="text-white">{diseaseName}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overview */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-cyan-600" />
              <h3 className="text-gray-800">Overview</h3>
            </div>
            <p className="text-gray-600 bg-cyan-50 p-4 rounded-xl">{info.overview}</p>
          </div>

          {/* Causes */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="text-gray-800">Common Causes & Risk Factors</h4>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <ul className="space-y-2">
                {info.causes.map((cause: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-purple-600" />
              <h4 className="text-gray-800">Common Symptoms</h4>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <ul className="space-y-2">
                {info.symptoms.map((symptom: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Treatment */}
          <div className="mb-6">
            <h4 className="mb-3 text-gray-800">Treatment Options</h4>
            <p className="text-gray-600 bg-green-50 p-4 rounded-xl text-sm">{info.treatment}</p>
          </div>

          {/* Prevention */}
          <div className="mb-6">
            <h4 className="mb-3 text-gray-800">Prevention Strategies</h4>
            <div className="bg-blue-50 rounded-xl p-4">
              <ul className="space-y-2">
                {info.prevention.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">
              <strong>Important:</strong> This information is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified dermatologist or healthcare provider for proper evaluation and personalized treatment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
