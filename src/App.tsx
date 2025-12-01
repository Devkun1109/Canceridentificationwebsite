import { useState, useEffect } from 'react';
import { getSupabaseClient } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ForgotPassword } from './components/ForgotPassword';
import { Dashboard } from './components/Dashboard';
import { AnalyzePage } from './components/AnalyzePage';
import { ResultPage } from './components/ResultPage';
import { HistoryPage } from './components/HistoryPage';
import { ProfileSettings } from './components/ProfileSettings';

type Page = 'landing' | 'auth' | 'forgot-password' | 'dashboard' | 'analyze' | 'result' | 'history' | 'profile';

interface User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        // Get user profile
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-83197308/user/${data.session.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: userData.name || '',
            accessToken: data.session.access_token,
          });
          setCurrentPage('dashboard');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: Page, data?: any) => {
    if (page === 'result' && data) {
      setResultData(data);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-4 animate-pulse">
            <span className="text-3xl">🩺</span>
          </div>
          <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading SkinCare AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user && (
        <Navbar
          isLoggedIn={!!user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          userName={user.name}
        />
      )}

      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => handleNavigate('auth')} />
      )}

      {currentPage === 'auth' && (
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onForgotPassword={() => handleNavigate('forgot-password')}
        />
      )}

      {currentPage === 'forgot-password' && (
        <ForgotPassword onBack={() => handleNavigate('auth')} />
      )}

      {currentPage === 'dashboard' && user && (
        <Dashboard user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'analyze' && user && (
        <AnalyzePage user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'result' && user && resultData && (
        <ResultPage data={resultData} onNavigate={handleNavigate} />
      )}

      {currentPage === 'history' && user && (
        <HistoryPage user={user} onNavigate={handleNavigate} />
      )}

      {currentPage === 'profile' && user && (
        <ProfileSettings user={user} onUpdateUser={handleUpdateUser} />
      )}

      {/* Footer */}
      {currentPage === 'landing' && (
        <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🩺</span>
                </div>
                <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  SkinCare AI
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                AI-Powered Skin Disease Identification
              </p>
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} SkinCare AI. For educational and informational purposes only.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}