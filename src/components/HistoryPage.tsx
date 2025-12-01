import { useEffect, useState } from 'react';
import { Calendar, Search, Filter, Clock, Eye, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface HistoryPageProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

interface Scan {
  id: string;
  image_url: string;
  disease_name: string;
  confidence: number;
  severity: string;
  created_at: string;
  description: string;
  recommendations: string[];
}

export function HistoryPage({ user, onNavigate }: HistoryPageProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, [user]);

  useEffect(() => {
    filterResults();
  }, [searchTerm, filterSeverity, scans]);

  const loadHistory = async () => {
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
        setScans(data.scans || []);
        setFilteredScans(data.scans || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResults = () => {
    let filtered = scans;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((scan) =>
        scan.disease_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Severity filter
    if (filterSeverity !== 'all') {
      filtered = filtered.filter((scan) =>
        scan.severity.toLowerCase() === filterSeverity.toLowerCase()
      );
    }

    setFilteredScans(filtered);
  };

  const handleDelete = async (scanId: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-83197308/scans/${scanId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.ok) {
        setScans(scans.filter((scan) => scan.id !== scanId));
      } else {
        alert('Failed to delete scan');
      }
    } catch (error) {
      console.error('Error deleting scan:', error);
      alert('Failed to delete scan');
    }
  };

  const handleViewDetails = (scan: Scan) => {
    onNavigate('result', {
      scanId: scan.id,
      imageUrl: scan.image_url,
      disease_name: scan.disease_name,
      confidence: scan.confidence,
      description: scan.description,
      severity: scan.severity,
      recommendations: scan.recommendations,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-2 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Analysis History
          </h1>
          <p className="text-gray-600">
            Track your skin health journey and review past analyses
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by condition name..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Severity Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Severity Levels</option>
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="moderate">Moderate Severity</option>
                <option value="high">High Severity</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredScans.length} of {scans.length} results</span>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading your history...</p>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-purple-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-50 rounded-full mb-4">
              <Calendar className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="mb-2 text-gray-800">
              {scans.length === 0 ? 'No Scans Yet' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {scans.length === 0
                ? 'Start analyzing your skin to build your health history'
                : 'Try adjusting your search or filter criteria'}
            </p>
            {scans.length === 0 && (
              <button
                onClick={() => onNavigate('analyze')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Analyze Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScans.map((scan, index) => (
              <div
                key={scan.id}
                className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-2xl transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative aspect-video bg-gray-100">
                  <ImageWithFallback
                    src={scan.image_url}
                    alt={scan.disease_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor(scan.severity)}`}>
                      {scan.severity}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="mb-2 text-gray-800 truncate">{scan.disease_name}</h4>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Confidence</span>
                      <span className="text-purple-600">{scan.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${scan.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    {formatDate(scan.created_at)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(scan)}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
