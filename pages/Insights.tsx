// In pages/Insights.tsx
import React, { useState, useEffect } from 'react';
import { PageHeader, Spinner } from '../components/ui';
// --- ADD ---
import { Sparkles, TrendingUp, TrendingDown, BookOpen, Clock, Smile } from 'lucide-react'; // Added icons
import { getStudySuggestions } from '../services/geminiService';
// UPDATED: Import getProductivityReport which includes strengths/weaknesses
import { getProductivityReport } from '../services/analyticsService';
import { useAuth } from '../contexts/AuthContext';
// --- MOCK DATA TYPE (adjust based on actual analyticsService implementation if needed) ---
interface SessionData {
  tool: string;
  courseId: string | null;
  duration: number; // seconds
}
interface MoodData {
    mood: string; // e.g., 'Happy', 'Calm'
    timestamp: Date;
}
interface ProductivityReport {
    totalStudyTime: number;
    quizAccuracy: number;
    totalQuizzes: number;
    correctQuizzes: number;
    strengths: { topic: string; accuracy: number; count: number }[];
    weaknesses: { topic: string; accuracy: number; count: number }[];
    completedPomodoros: number;
    sessions: SessionData[]; // Assuming sessions are included or fetched separately
    // You might need a separate function in analyticsService to get detailed mood history
    moodHistory?: MoodData[];
}
// --- END MOCK DATA TYPE ---
// --- END ADD ---

// --- NEW: Topic Mastery Component ---
const TopicMastery: React.FC<{ strengths: ProductivityReport['strengths']; weaknesses: ProductivityReport['weaknesses'] }> = ({ strengths, weaknesses }) => {
    if (strengths.length === 0 && weaknesses.length === 0) {
        return null; // Don't render if no data
    }

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl ring-1 ring-slate-700">
            <h3 className="text-xl font-bold text-slate-100 flex items-center mb-4">
                <BookOpen className="w-6 h-6 mr-3 text-violet-400" /> Topic Mastery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-lg text-emerald-400 mb-2 flex items-center gap-2"><TrendingUp size={18} /> Strengths</h4>
                    {strengths.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                            {strengths.map(s => (
                                <li key={s.topic}>{s.topic} ({s.accuracy}%)</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400 text-sm italic">Take more quizzes to identify strengths!</p>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-red-400 mb-2 flex items-center gap-2"><TrendingDown size={18} /> Areas for Review</h4>
                    {weaknesses.length > 0 ? (
                         <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                            {weaknesses.map(w => (
                                <li key={w.topic}>{w.topic} ({w.accuracy}%)</li>
                            ))}
                        </ul>
                    ) : (
                         <p className="text-slate-400 text-sm italic">No specific weaknesses identified yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- NEW: Placeholder Chart Components ---
const StudyTimeChart: React.FC<{ sessions: SessionData[] }> = ({ sessions }) => {
    // In a real implementation, use sessions data to render a chart (e.g., using Chart.js or Recharts)
    // showing time spent per tool or course.
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl ring-1 ring-slate-700 min-h-[200px] flex flex-col">
            <h3 className="text-xl font-bold text-slate-100 flex items-center mb-4">
                 <Clock className="w-6 h-6 mr-3 text-yellow-400" /> Study Time Breakdown
            </h3>
            <div className="flex-1 flex items-center justify-center text-slate-500 italic">
                {/* Placeholder text */}
                Study time chart will be displayed here.
                {/* [Image of a pie chart showing study time distribution] */}
            </div>
        </div>
    );
};

const MoodTrendChart: React.FC<{ moodHistory?: MoodData[] }> = ({ moodHistory }) => {
    // In a real implementation, use moodHistory data to render a chart
    // showing mood frequency over time.
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl ring-1 ring-slate-700 min-h-[200px] flex flex-col">
            <h3 className="text-xl font-bold text-slate-100 flex items-center mb-4">
                 <Smile className="w-6 h-6 mr-3 text-cyan-400" /> Mood Trends
            </h3>
             <div className="flex-1 flex items-center justify-center text-slate-500 italic">
                {/* Placeholder text */}
                Mood trend chart will be displayed here.
                {/* [Image of a bar chart showing mood frequency over the week] */}
             </div>
        </div>
    );
};

// --- ADD THIS NEW COMPONENT ---
const WeeklyAiSummary: React.FC = () => {
  const { currentUser } = useAuth();
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        // Fetch the report data to pass to the AI
        const report = await getProductivityReport(); // Fetches data including strengths/weaknesses
        const reportJson = JSON.stringify({ // Create a JSON string suitable for the AI
            totalStudyTime: report.totalStudyTime,
            quizAccuracy: report.quizAccuracy,
            strengths: report.strengths,
            weaknesses: report.weaknesses,
            completedPomodoros: report.completedPomodoros,
        });

        const aiSuggestion = await getStudySuggestions(reportJson);
        setSuggestion(aiSuggestion);
      } catch (error) {
        console.error("Error fetching AI summary:", error);
        setSuggestion("Couldn't generate your weekly summary. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [currentUser]);

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl ring-1 ring-slate-700">
      <h3 className="text-xl font-bold text-slate-100 flex items-center mb-4">
        <Sparkles className="w-6 h-6 mr-3 text-sky-400" />
        Your AI-Powered Weekly Report
      </h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <Spinner />
        </div>
      ) : (
        <p className="text-slate-300 whitespace-pre-wrap">{suggestion}</p>
      )}
    </div>
  );
};
// --- END ADD ---


const Insights: React.FC = () => {
    const [reportData, setReportData] = useState<ProductivityReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch the main productivity report
                // You might need additional fetches here for detailed session/mood history for charts
                const report = await getProductivityReport();
                // Placeholder for fetching detailed mood history (implement in analyticsService if needed)
                // const moodHistory = await getMoodHistory();
                setReportData({ ...report /*, moodHistory */ });
            } catch (error) {
                console.error("Error fetching insights data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner />
            </div>
        );
    }

    if (!reportData) {
        return <p className="text-center text-slate-400">Could not load insights data.</p>;
    }

    return (
        <div className="space-y-8"> {/* Increased spacing */}
            <PageHeader title="Insights" subtitle="Track your progress, mood, and study habits over time." />

            <WeeklyAiSummary />

            {/* Display Topic Mastery */}
            <TopicMastery strengths={reportData.strengths} weaknesses={reportData.weaknesses} />

            {/* Grid for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Increased gap */}
                {/* Placeholder Chart for Study Time */}
                <StudyTimeChart sessions={reportData.sessions} />

                {/* Placeholder Chart for Mood Trends */}
                <MoodTrendChart moodHistory={reportData.moodHistory} />
            </div>

            {/* You could add more sections here like Pomodoro tracker, activity feed etc. */}

        </div>
    );
};

export default Insights;