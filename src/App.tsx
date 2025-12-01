import React, { useState } from 'react';
import {
  Search,
  Users,
  MessageCircle,
  Repeat2,
  Heart,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  ArrowRight,
  BarChart3,
  Share2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Target,
  DollarSign,
  Ghost,
  PieChart,
  Download,
  CalendarCheck,
} from 'lucide-react';

// --- Types ---

interface Tweet {
  id: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  date: string;
  impressions: number;
  type: 'Hero' | 'Regular' | 'Zombie';
}

interface ProfileData {
  handle: string;
  name: string;
  followers: number;
  following: number;
  tweetsCount: number;
  joinedDate: string;
  bio: string;
  avatarColor: string;
}

interface OptimizationInsight {
  category: string;
  score: number;
  status: 'Excellent' | 'Good' | 'Needs Improvement';
  tips: string[];
  icon: React.ComponentType<{ className?: string }>;
}

interface AnalyticsData {
  profile: ProfileData;
  growthHistory: { date: string; followers: number }[];
  recentTweets: Tweet[];
  engagementRate: number;
  averageLikes: number;
  averageRetweets: number;
  topHashtags: string[];
  insights: OptimizationInsight[];
  estimatedMediaValue: number;
  wastedPotential: number;
  ghostFollowers: number;
  contentRoi: {
    hero: number;
    zombie: number;
  };
}

// --- Mock Data Generators ---

const generateRandomData = (seed: string): AnalyticsData => {
  let val = 0;
  for (let i = 0; i < seed.length; i++) val += seed.charCodeAt(i);

  const rand = () => {
    val = (val * 1664525 + 1013904223) % 4294967296;
    return val / 4294967296;
  };

  const baseFollowers = Math.floor(rand() * 50000) + 500;
  const isInfluencer = rand() > 0.8;
  const multiplier = isInfluencer ? 100 : 1;
  const totalFollowers = baseFollowers * multiplier;

  const profile: ProfileData = {
    handle: `@${seed}`,
    name: seed.charAt(0).toUpperCase() + seed.slice(1),
    followers: totalFollowers,
    following: Math.floor(rand() * 2000),
    tweetsCount: Math.floor(rand() * 15000),
    joinedDate: `Joined ${
      ['January', 'March', 'May', 'August', 'December'][Math.floor(rand() * 5)]
    } ${2010 + Math.floor(rand() * 14)}`,
    bio: isInfluencer
      ? 'Tech enthusiast 🚀 | Building the future | #Crypto #AI'
      : 'Just sharing my thoughts on the internet. ☕️',
    avatarColor: [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
    ][Math.floor(rand() * 5)],
  };

  // Generate Growth History (30 days)
  const growthHistory: { date: string; followers: number }[] = [];
  let currentFollowers = totalFollowers - Math.floor(rand() * 1000 * multiplier);

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = Math.floor((rand() - 0.3) * 50 * multiplier);
    currentFollowers += change;
    growthHistory.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      followers: currentFollowers,
    });
  }

  // Generate Recent Tweets with Type Classification (Hero/Zombie)
  const recentTweets: Tweet[] = [];
  const templates = [
    'Just launched a new feature! 🚀 Check it out.',
    'The weather is amazing today. ☀️',
    'Analysis of the current market trends shows interesting patterns. 📊',
    "Can't believe it's already Friday! #weekendvibes",
    'Working on something big. Stay tuned.',
    'Why is coffee so good? ☕️',
    'Big news coming soon... 👀',
    'Learning React is fun but challenging.',
  ];

  let totalImpressions = 0;

  for (let i = 0; i < 8; i++) {
    const impressions = Math.floor(rand() * 5000 * multiplier) + 500;
    const engagementRatio = rand() * 0.05 + 0.001;
    const totalEngagements = Math.floor(impressions * engagementRatio);

    let type: 'Hero' | 'Regular' | 'Zombie' = 'Regular';
    if (engagementRatio > 0.04) type = 'Hero';
    if (engagementRatio < 0.005) type = 'Zombie';

    recentTweets.push({
      id: `tweet-${i}`,
      content: templates[Math.floor(rand() * templates.length)],
      likes: Math.floor(totalEngagements * 0.7),
      retweets: Math.floor(totalEngagements * 0.2),
      replies: Math.floor(totalEngagements * 0.1),
      impressions,
      date: `${Math.floor(rand() * 24)}h ago`,
      type,
    });

    totalImpressions += impressions;
  }

  const totalLikes = recentTweets.reduce((acc, t) => acc + t.likes, 0);
  const totalRetweets = recentTweets.reduce((acc, t) => acc + t.retweets, 0);
  const engagementRate =
    ((totalLikes +
      totalRetweets +
      recentTweets.reduce((acc, t) => acc + t.replies, 0)) /
      totalImpressions) *
    100;

  const wastedPotential = Math.floor(rand() * 30) + 10;
  const ghostFollowers = Math.floor(rand() * 25) + 5;
  const heroContent = Math.floor(rand() * 15) + 5;

  const emv = (totalImpressions / 1000) * 5.5 * 30;

  const insights: OptimizationInsight[] = [
    {
      category: 'Content Quality',
      score: Math.floor(rand() * 40) + 60,
      status: 'Good',
      tips: [
        'Include more visual media.',
        'Thread your longer thoughts.',
        'Use 2-3 hashtags max.',
      ],
      icon: MessageCircle,
    },
    {
      category: 'Reach Efficiency',
      score: Math.floor(rand() * 50) + 40,
      status: 'Needs Improvement',
      tips: [
        'Try consistent morning slots.',
        'Engage with 5 large accounts daily.',
        'Reply faster.',
      ],
      icon: Zap,
    },
    {
      category: 'Audience Health',
      score: 100 - ghostFollowers,
      status: ghostFollowers < 15 ? 'Excellent' : 'Good',
      tips: [
        'Prune inactive accounts.',
        'Interact with Verified users.',
        'Welcome new followers.',
      ],
      icon: Target,
    },
  ];

  return {
    profile,
    growthHistory,
    recentTweets,
    engagementRate,
    averageLikes: Math.round(totalLikes / recentTweets.length),
    averageRetweets: Math.round(totalRetweets / recentTweets.length),
    topHashtags: ['#tech', '#growth', '#building'],
    insights,
    estimatedMediaValue: Math.round(emv),
    wastedPotential,
    ghostFollowers,
    contentRoi: {
      hero: heroContent,
      zombie: wastedPotential,
    },
  };
};

// --- Components ---

const MetricCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  highlight = false,
}: {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}) => (
  <div
    className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 ${
      highlight
        ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200'
        : 'bg-white border-slate-200'
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-100' : 'bg-slate-50'}`}>
        <Icon className={`w-5 h-5 ${highlight ? 'text-blue-600' : 'text-slate-600'}`} />
      </div>
      {trend && (
        <div
          className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up'
              ? 'bg-green-100 text-green-700'
              : trend === 'down'
              ? 'bg-red-100 text-red-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {trend === 'up' ? '+2.4%' : '-0.8%'}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <div className={`text-2xl font-bold ${highlight ? 'text-blue-900' : 'text-slate-900'}`}>
      {value}
    </div>
    {subtext && <div className="text-xs text-slate-400 mt-2">{subtext}</div>}
  </div>
);

const InsightCard = ({ insight }: { insight: OptimizationInsight }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-lg ${
            insight.status === 'Excellent'
              ? 'bg-green-100 text-green-600'
              : insight.status === 'Good'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          <insight.icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{insight.category}</h4>
          <span
            className={`text-xs font-medium ${
              insight.status === 'Excellent'
                ? 'text-green-600'
                : insight.status === 'Good'
                ? 'text-blue-600'
                : 'text-orange-600'
            }`}
          >
            {insight.status} ({insight.score}/100)
          </span>
        </div>
      </div>
      <div className="w-12 h-12 relative flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className={`${
              insight.status === 'Excellent'
                ? 'text-green-500'
                : insight.status === 'Good'
                ? 'text-blue-500'
                : 'text-orange-500'
            }`}
            strokeDasharray={113}
            strokeDashoffset={113 - (113 * insight.score) / 100}
          />
        </svg>
      </div>
    </div>
    <div className="mt-2 space-y-3 flex-grow">
      {insight.tips.map((tip, idx) => (
        <div key={idx} className="flex items-start text-sm text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
          <span>{tip}</span>
        </div>
      ))}
    </div>
  </div>
);

const CustomLineChart = ({ data }: { data: { date: string; followers: number }[] }) => {
  const maxVal = Math.max(...data.map((d) => d.followers));
  const minVal = Math.min(...data.map((d) => d.followers));
  const range = maxVal - minVal || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * 1000;
      const y = 200 - ((d.followers - minVal) / range) * 150 - 25;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-grow w-full overflow-hidden">
        <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,200 ${points} L1000,200 Z`} fill="url(#gradient)" />
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
};

const TweetCard = ({ tweet }: { tweet: Tweet }) => (
  <div
    className={`border-b border-slate-100 p-4 hover:bg-slate-50 transition-colors last:border-0 ${
      tweet.type === 'Hero'
        ? 'bg-green-50/50 hover:bg-green-50'
        : tweet.type === 'Zombie'
        ? 'bg-red-50/50 hover:bg-red-50'
        : ''
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center space-x-2">
        {tweet.type === 'Hero' && (
          <span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Hero Post
          </span>
        )}
        {tweet.type === 'Zombie' && (
          <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            Zombie Post
          </span>
        )}
      </div>
      <span className="text-xs text-slate-400">{tweet.date}</span>
    </div>
    <p className="text-slate-800 text-sm mb-3 line-clamp-2">{tweet.content}</p>
    <div className="flex items-center space-x-6 text-xs text-slate-500">
      <div className="flex items-center space-x-1">
        <Heart className="w-3.5 h-3.5" />
        <span>{tweet.likes.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Repeat2 className="w-3.5 h-3.5" />
        <span>{tweet.retweets.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Activity className="w-3.5 h-3.5" />
        <span>{tweet.impressions.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

// New Component: ROI Matrix

const ROICard = ({
  title,
  percentage,
  description,
  type,
}: {
  title: string;
  percentage: number;
  description: string;
  type: 'hero' | 'waste';
}) => (
  <div
    className={`flex flex-col p-4 rounded-xl border ${
      type === 'hero' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
    }`}
  >
    <div className="flex items-center mb-2">
      <div
        className={`p-1.5 rounded-lg mr-2 ${
          type === 'hero' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}
      >
        {type === 'hero' ? <Target className="w-4 h-4" /> : <Ghost className="w-4 h-4" />}
      </div>
      <h4
        className={`font-bold text-sm ${
          type === 'hero' ? 'text-green-900' : 'text-red-900'
        }`}
      >
        {title}
      </h4>
    </div>
    <div className="mb-2">
      <span
        className={`text-2xl font-bold ${
          type === 'hero' ? 'text-green-800' : 'text-red-800'
        }`}
      >
        {percentage}%
      </span>
      <span
        className={`text-xs ml-2 ${
          type === 'hero' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        of total posts
      </span>
    </div>
    <p
      className={`text-xs ${
        type === 'hero' ? 'text-green-700' : 'text-red-700'
      }`}
    >
      {description}
    </p>
  </div>
);

// New Component: 30-Day Action Plan

const ActionPlan = () => {
  const plan = [
    {
      week: 1,
      title: 'Triage & Audit',
      color: 'blue',
      tasks: [
        'Verify Engagement Model: Confirm baseline metrics and target ROAS (Return on Audience Spend).',
        "Immediate Clean-up: Block all known bot/spam followers (reducing 'Ghost' count).",
        "High-Volume Content Identification: Pinpoint the top 3 'Hero' posts from the last 90 days.",
      ],
    },
    {
      week: 2,
      title: 'Waste Reduction & Reallocation',
      color: 'orange',
      tasks: [
        "Zombie Pruning: Identify and archive/delete the bottom 10% of 'Zombie' posts to clean profile.",
        'Content Re-clustering: Group past successful content by theme/format (e.g., threads, polls, images).',
        'Schedule Guardrails: Implement a posting cadence based on peak engagement times.',
      ],
    },
    {
      week: 3,
      title: 'Build & Test Loop',
      color: 'purple',
      tasks: [
        'Format Probing: Launch structured tests on new formats (e.g., short video clips, specific threads).',
        "Topic Deep Dive: Double down on the topics that yielded 'Hero' content in Week 1.",
        'High-Intent Outreach: Actively engage with key industry accounts to drive quality mentions.',
      ],
    },
    {
      week: 4,
      title: 'Scale & Review',
      color: 'green',
      tasks: [
        'Verify Lift vs. Baseline: Measure net follower growth and EMV increase vs. the starting point.',
        'Scale Winners: Increase the volume of the highest performing content format/topic.',
        'Lock Next-Month Strategy: Finalize the new content calendar and testing framework for the next cycle.',
      ],
    },
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center mb-6">
        <CalendarCheck className="w-6 h-6 mr-3 text-blue-600" />
        <h3 className="text-xl font-bold text-slate-900">30-Day X Growth Blueprint</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        A clear, product-first timeline to cut wasted effort and scale your proven content
        assets.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plan.map((step) => (
          <div
            key={step.week}
            className={`p-4 rounded-xl border-t-4 border-${step.color}-400 bg-slate-50 shadow-md`}
          >
            <div className={`text-sm font-bold text-${step.color}-700 mb-2`}>
              Week {step.week}
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">{step.title}</h4>
            <ul className="space-y-3 text-sm text-slate-600 list-none pl-0">
              {step.tasks.map((task, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight
                    className={`w-4 h-4 mr-2 mt-1 flex-shrink-0 text-${step.color}-500`}
                  />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookCallCTA = ({ data }: { data: AnalyticsData }) => (
  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-lg overflow-hidden relative border border-slate-700">
    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

    <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="max-w-xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <Zap className="w-3 h-3 mr-1.5" />
          Limited Strategy Sessions Available
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Turn your{' '}
          <span className="text-red-400">{data.wastedPotential}% wasted potential</span>{' '}
          into revenue.
        </h3>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed">
          Stop guessing. Get a custom 1-on-1 implementation plan to fix your &quot;Zombie&quot;
          content and scale your &quot;Hero&quot; posts in 30 days.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            <span>Content Audit</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            <span>Growth Roadmap</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            <span>Revenue Model</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full md:w-auto flex flex-col items-center text-center flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h4 className="font-bold text-slate-900 text-lg mb-1">Book Your Audit</h4>
        <p className="text-slate-500 text-sm mb-4">30-minute expert strategy call</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mb-3 group">
          Select a Time{' '}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="text-xs text-slate-400">
          Next available: <span className="text-green-600 font-medium">Tomorrow, 10:00 AM</span>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError('');
    setData(null);

    setTimeout(() => {
      try {
        const mockData = generateRandomData(searchTerm.replace('@', '').toLowerCase());
        setData(mockData);
      } catch (err) {
        setError('Failed to analyze profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">X-Ray Analytics</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-xs font-medium text-slate-500">
              Powered by Simulated Data
            </div>
            <button className="text-xs font-medium bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center hover:bg-slate-800 transition-colors">
              <Download className="w-3 h-3 mr-1.5" /> Export PDF
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Analyze any X profile
          </h1>
          <p className="text-lg text-slate-500 mb-8">
            Identify wasted reach, find your &quot;Hero&quot; content, and calculate your
            account&apos;s media value.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter handle (e.g. elonmusk)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading || !searchTerm}
                className="absolute right-2 top-2 bottom-2 bg-black hover:bg-slate-800 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? 'Scanning...' : 'Analyze'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-sm text-red-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {error}
            </div>
          )}
        </div>

        {data && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ${data.profile.avatarColor}`}
              >
                {data.profile.name.charAt(0)}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                  <h2 className="text-2xl font-bold">{data.profile.name}</h2>
                  <span className="text-slate-500">{data.profile.handle}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-medium">
                    Verified Analysis
                  </span>
                </div>
                <p className="text-slate-600 mb-3 max-w-2xl">{data.profile.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" /> {data.profile.joinedDate}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" />{' '}
                    {data.profile.following.toLocaleString()} Following
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Est. Media Value"
                value={`$${data.estimatedMediaValue.toLocaleString()}`}
                subtext="Monthly equivalent ad spend"
                icon={DollarSign}
                highlight
              />
              <MetricCard
                title="Engagement Rate"
                value={`${data.engagementRate.toFixed(2)}%`}
                subtext="Industry avg: 1.5%"
                icon={Activity}
                trend={data.engagementRate > 1.5 ? 'up' : 'down'}
              />
              <MetricCard
                title="Avg. Likes"
                value={data.averageLikes.toLocaleString()}
                subtext="Per tweet (last 30d)"
                icon={Heart}
              />
              <MetricCard
                title="Total Followers"
                value={`${
                  (data.profile.followers /
                    (data.profile.followers > 1_000_000 ? 1_000_000 : 1_000)).toFixed(1) +
                  (data.profile.followers > 1_000_000 ? 'M' : 'K')
                }`}
                subtext="Total audience size"
                icon={Users}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Content Audit</h3>
                <p className="text-sm text-slate-500 mb-4">Where is your effort going?</p>
                <div className="space-y-3">
                  <ROICard
                    title="Hero Content"
                    percentage={data.contentRoi.hero}
                    description="Tweets driving 80% of your total engagement."
                    type="hero"
                  />
                  <ROICard
                    title="Zombie Content"
                    percentage={data.contentRoi.zombie}
                    description="Tweets with near-zero engagement. Wasted effort."
                    type="waste"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Audience Quality</h3>
                <p className="text-sm text-slate-500 mb-4">Who is actually listening?</p>

                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#f1f5f9"
                        strokeWidth="20"
                        fill="transparent"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#ef4444"
                        strokeWidth="20"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * data.ghostFollowers) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">
                        {data.ghostFollowers}%
                      </span>
                      <span className="text-xs text-slate-500">Ghosts</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-slate-600 mt-4">
                    {data.ghostFollowers > 15
                      ? "High 'Ghost' count. Your reach is being suppressed by inactive followers."
                      : 'Healthy audience. Most of your followers are active real users.'}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1 px-1">Top Priorities</h3>
                <div className="space-y-3 h-full overflow-y-auto max-h-[340px] pr-1">
                  {data.insights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </div>
              </div>
            </div>

            <ActionPlan />
            <BookCallCTA data={data} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Audience Growth</h3>
                  <p className="text-sm text-slate-500">Net follower change over time</p>
                </div>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 text-slate-600 bg-transparent">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              <div className="h-64">
                <CustomLineChart data={data.growthHistory} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Content Performance Matrix
                  </h3>
                  <p className="text-sm text-slate-500">Identifying your wins and losses</p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div>
                {data.recentTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


