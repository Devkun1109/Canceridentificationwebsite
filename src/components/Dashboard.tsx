import { useEffect, useState } from 'react';
import { Upload, History, TrendingUp, Calendar, Clock, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface DashboardProps {
  user: any;
  onNavigate: (page: string) => void;
}

interface Scan {
  id: string;
  image_url: string;
  disease_name: string;
  confidence: number;
  created_at: string;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    thisMonth: 0,
    avgConfidence: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-83197308/scans/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const scans = data.scans || [];
        
        setRecentScans(scans.slice(0, 3));
        
        // Calculate stats
        const now = new Date();
        const thisMonth = scans.filter((scan: Scan) => {
          const scanDate = new Date(scan.created_at);
          return scanDate.getMonth() === now.getMonth() && scanDate.getFullYear() === now.getFullYear();
        });
        
        const avgConf = scans.length > 0
          ? scans.reduce((sum: number, scan: Scan) => sum + scan.confidence, 0) / scans.length
          : 0;

        setStats({
          totalScans: scans.length,
          thisMonth: thisMonth.length,
          avgConfidence: avgConf,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-2 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Monitor your skin health journey and track your progress over time.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                <History className="w-6 h-6 text-white" />
              </div>
              <span className="text-cyan-600 text-sm">All Time</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Scans</p>
            <p className="text-gray-800">{loading ? '...' : stats.totalScans}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-600 text-sm">This Month</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Scans This Month</p>
            <p className="text-gray-800">{loading ? '...' : stats.thisMonth}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-pink-600 text-sm">Average</span>
            </div>
            <p className="text-gray-500 text-sm mb-1">Avg Confidence</p>
            <p className="text-gray-800">{loading ? '...' : `${stats.avgConfidence.toFixed(1)}%`}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => onNavigate('analyze')}
            className="bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-left animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Quick Action</span>
            </div>
            <h3 className="mb-2">Start New Analysis</h3>
            <p className="text-white/80">
              Upload a new image to analyze potential skin conditions with AI
            </p>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-left border border-purple-100 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
                <History className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-teal-600 bg-teal-50 px-3 py-1 rounded-full">View All</span>
            </div>
            <h3 className="mb-2 text-gray-800">View Full History</h3>
            <p className="text-gray-600">
              Access all your previous scans and track changes over time
            </p>
          </button>
        </div>

        {/* Recent Scans */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800">Recent Scans</h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-purple-600 hover:text-purple-700 text-sm transition-colors"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4">Loading scans...</p>
            </div>
          ) : recentScans.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-4">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-4">No scans yet</p>
              <button
                onClick={() => onNavigate('analyze')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Your First Scan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentScans.map((scan, index) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onNavigate('history')}
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={scan.image_url}
                      alt="Scan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 truncate">{scan.disease_name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(scan.created_at)}
                      </span>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        scan.confidence >= 80
                          ? 'bg-green-50 text-green-600'
                          : scan.confidence >= 60
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {scan.confidence.toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Tip */}
        <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="text-amber-900 mb-2">Health Reminder</h4>
              <p className="text-amber-700 text-sm">
                This AI tool is designed to assist with early detection and awareness, but it should not replace professional medical advice. If you notice any concerning changes in your skin, please consult a dermatologist for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
