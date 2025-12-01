import { ArrowRight, Shield, Clock, Users, CheckCircle, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 opacity-50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-purple-600">AI-Powered Skin Analysis</span>
              </div>
              <h1 className="mb-6 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Early Detection Saves Lives
              </h1>
              <p className="mb-8 text-gray-600 max-w-xl mx-auto lg:mx-0">
                Get instant AI-powered skin disease analysis from the comfort of your home. Our advanced technology helps you identify potential skin conditions early, connecting you with healthcare professionals for proper diagnosis and treatment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <p className="text-cyan-600">1M+</p>
                  <p className="text-gray-500 text-sm">Scans Analyzed</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-600">98%</p>
                  <p className="text-gray-500 text-sm">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-pink-600">24/7</p>
                  <p className="text-gray-500 text-sm">Available</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse-soft"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=600&fit=crop"
                    alt="Medical professional examining skin"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose SkinCare AI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with medical expertise to provide you with reliable skin health insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Accurate Analysis',
                description: 'Advanced AI models trained on millions of dermatological images',
                color: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: Clock,
                title: 'Instant Results',
                description: 'Get your analysis in seconds, anytime, anywhere',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Users,
                title: 'Expert Network',
                description: 'Connect with nearby dermatologists for professional care',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: CheckCircle,
                title: 'Track Progress',
                description: 'Monitor your skin health over time with detailed history',
                color: 'from-teal-500 to-teal-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-purple-50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="mb-3 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Image',
                description: 'Take a clear photo of the affected skin area and upload it securely'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our advanced AI analyzes the image and identifies potential conditions'
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'Receive detailed results and find nearby dermatologists for consultation'
              }
            ].map((step, index) => (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-2xl transition-all">
                  <div className="text-6xl bg-gradient-to-br from-cyan-500 to-purple-600 bg-clip-text text-transparent opacity-20 mb-4">
                    {step.step}
                  </div>
                  <h4 className="mb-3 text-gray-800">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-white">Ready to Take Control of Your Skin Health?</h2>
          <p className="mb-8 text-white/90">
            Join thousands of users who trust SkinCare AI for early detection and peace of mind.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-purple-600 rounded-full hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Start Your Free Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}