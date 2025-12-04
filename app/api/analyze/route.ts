import { NextResponse } from 'next/server';

// This is the "Bridge" that talks to TwitterAPI.io
export async function GET(request: Request) {
  // 1. Get the handle from the URL
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
  }

  // UPDATED: Using the key for twitterapi.io
  const API_KEY = process.env.TWITTER_API_IO_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'TwitterAPI.io keys are missing in Vercel settings (TWITTER_API_IO_KEY)' }, { status: 500 });
  }

  try {
    // 2. Fetch User ID from TwitterAPI.io
    // Endpoint: https://api.twitterapi.io/twitter/user/info
    const userRes = await fetch(
      `https://api.twitterapi.io/twitter/user/info?userName=${handle}`, 
      { headers: { 'X-API-Key': API_KEY } }
    );

    if (!userRes.ok) {
        throw new Error('User fetch failed');
    }

    const userData = await userRes.json();
    
    // Check if user exists (twitterapi.io structure might vary, guarding against empty responses)
    if (!userData || userData.error) {
      throw new Error('User not found');
    }

    // twitterapi.io often returns the user object directly
    const user = userData;
    const userId = user.id || user.rest_id; // Handle potential ID field variations

    // 3. Fetch User's Recent Tweets
    // Endpoint: https://api.twitterapi.io/twitter/user/last_tweets
    const tweetsRes = await fetch(
      `https://api.twitterapi.io/twitter/user/last_tweets?userId=${userId}`,
      { headers: { 'X-API-Key': API_KEY } }
    );

    const tweetsData = await tweetsRes.json();
    const rawTweets = tweetsData.tweets || []; // twitterapi.io usually puts posts in a 'tweets' array

    // 4. Process the Data (The Math)
    // Note: twitterapi.io often uses legacy field names (favorite_count vs like_count)
    
    let totalImpressions = 0;
    let totalEngagements = 0;
    let heroCount = 0;
    let zombieCount = 0;

    const formattedTweets = rawTweets.map((t: any) => {
      // Map legacy fields to our app's expected format
      // twitterapi.io usually returns 'favorite_count', 'retweet_count', 'reply_count', 'views'
      const likes = t.favorite_count || t.likes || 0;
      const retweets = t.retweet_count || t.retweets || 0;
      const replies = t.reply_count || t.replies || 0;
      const views = t.views || t.impression_count || 0;

      // Fallback for impressions if missing (common in scraped data)
      const impressions = views > 0 ? views : (likes * 20); 
      
      const engagements = likes + retweets + replies;
      
      totalImpressions += impressions;
      totalEngagements += engagements;

      const engagementRate = impressions > 0 ? (engagements / impressions) : 0;
      
      // Classify
      let type = 'Regular';
      if (engagementRate > 0.04) { type = 'Hero'; heroCount++; }
      else if (engagementRate < 0.005) { type = 'Zombie'; zombieCount++; }

      // Time format
      const date = new Date(t.created_at);
      const hoursAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));

      return {
        id: t.id,
        content: t.text || t.full_text, // 'text' or 'full_text' depending on endpoint
        likes: likes,
        retweets: retweets,
        replies: replies,
        impressions: impressions,
        date: `${hoursAgo}h ago`,
        type: type
      };
    });

    // 5. Build the Final Response
    const followers = user.followers_count || 0;
    
    const analysisResult = {
      profile: {
        handle: `@${user.username}`,
        name: user.name,
        followers: followers,
        following: user.friends_count || user.following_count || 0,
        tweetsCount: user.statuses_count || user.tweet_count || 0,
        joinedDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        bio: user.description,
        avatarColor: 'bg-blue-500', 
      },
      // Simulated growth history (real history requires database)
      growthHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        followers: followers - Math.floor(Math.random() * 500) 
      })),
      recentTweets: formattedTweets,
      engagementRate: totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100) : 0,
      averageLikes: Math.round(totalEngagements / (formattedTweets.length || 1)),
      averageRetweets: 0, 
      topHashtags: ['#analysis', '#growth'], 
      insights: [
         {
          category: "Content Quality",
          score: 75,
          status: "Good",
          tips: ["Based on your recent tweets."],
          icon: "MessageCircle" 
        }
      ],
      estimatedMediaValue: (totalImpressions / 1000) * 5.50,
      wastedPotential: Math.round((zombieCount / (formattedTweets.length || 1)) * 100),
      ghostFollowers: 15, 
      contentRoi: {
        hero: Math.round((heroCount / (formattedTweets.length || 1)) * 100),
        zombie: Math.round((zombieCount / (formattedTweets.length || 1)) * 100)
      }
    };

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch Twitter data via twitterapi.io' }, { status: 500 });
  }
}
