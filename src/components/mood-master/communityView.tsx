import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, ThumbsUp, User, 
  Smile, Frown, Activity, Coffee, Moon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UserStats {
  id: string;
  joinedDate: Date;
  postsCount: number;
  likesReceived: number;
  moodStats: {
    happy: number;
    neutral: number;
    sad: number;
  };
  activityStats: {
    exercise: number;
    meditation: number;
    sleep: number;
  };
}

interface Post {
  id: number;
  userId: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

const generateDummyUser = (id: number): UserStats => ({
  id: `Anonymous${id}`,
  joinedDate: new Date(Date.now() - Math.random() * 10000000000),
  postsCount: Math.floor(Math.random() * 50),
  likesReceived: Math.floor(Math.random() * 200),
  moodStats: {
    happy: Math.floor(Math.random() * 60) + 20,
    neutral: Math.floor(Math.random() * 30) + 10,
    sad: Math.floor(Math.random() * 20),
  },
  activityStats: {
    exercise: Math.floor(Math.random() * 30),
    meditation: Math.floor(Math.random() * 20),
    sleep: Math.floor(Math.random() * 8) + 4,
  }
});

const generateDummyPost = (id: number, userId: string): Post => ({
  id,
  userId,
  title: ["Finding peace in daily meditation", "How do you handle work stress?", "Share your self-care routine!", "Weekly gratitude thread", "Overcoming anxiety tips", "Balancing work and personal life"][Math.floor(Math.random() * 6)],
  content: "This is a sample post content. In a real app, this would be the user's actual post.",
  likes: Math.floor(Math.random() * 50),
  comments: Math.floor(Math.random() * 20),
  timestamp: new Date(Date.now() - Math.random() * 1000000000),
});

const CommunityView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [filter, setFilter] = useState<'latest' | 'popular'>('latest');
  const [newPost, setNewPost] = useState<{ title: string; content: string }>({ title: '', content: '' });

  useEffect(() => {
    // Generate dummy data
    const dummyUsers = Array(20).fill(null).map((_, i) => generateDummyUser(i + 1));
    setUsers(dummyUsers);

    const dummyPosts = Array(50).fill(null).map((_, i) => 
      generateDummyPost(i + 1, dummyUsers[Math.floor(Math.random() * dummyUsers.length)].id)
    );
    setPosts(dummyPosts);
  }, []);

  const handlePostSubmit = () => {
    if (newPost.title && newPost.content) {
      const post: Post = {
        id: posts.length + 1,
        userId: `Anonymous${Math.floor(Math.random() * 1000)}`,
        ...newPost,
        likes: 0,
        comments: 0,
        timestamp: new Date(),
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const filteredPosts = posts.sort((a, b) => {
    if (filter === 'latest') return b.timestamp.getTime() - a.timestamp.getTime();
    if (filter === 'popular') return b.likes - a.likes;
    return 0;
  });

  const UserStatsDialog: React.FC<{ user: UserStats }> = ({ user }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0">
          <User className="mr-2" />{user.id}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.id}&apos;s Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Joined: {user.joinedDate.toDateString()}</p>
          <p>Posts: {user.postsCount}</p>
          <p>Likes received: {user.likesReceived}</p>
          <div>
            <h4 className="font-medium mb-2">Mood Statistics</h4>
            <div className="flex justify-between">
              <span><Smile className="inline mr-1" /> {user.moodStats.happy}%</span>
              <span><Frown className="inline mr-1" /> {user.moodStats.sad}%</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Activity Statistics</h4>
            <div className="space-y-2">
              <div><Activity className="inline mr-1" /> Exercise: {user.activityStats.exercise} days/month</div>
              <div><Coffee className="inline mr-1" /> Meditation: {user.activityStats.meditation} days/month</div>
              <div><Moon className="inline mr-1" /> Avg. Sleep: {user.activityStats.sleep} hours</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-4 max-w-md mx-auto mb-20 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Community Support</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Start a New Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="Title" 
            value={newPost.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPost({...newPost, title: e.target.value})}
            className="mb-2"
          />
          <Textarea 
            placeholder="Share your thoughts..." 
            value={newPost.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({...newPost, content: e.target.value})}
            className="mb-2"
          />
          <Button onClick={handlePostSubmit}>Post</Button>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Community Posts</h3>
        <Select value={filter} onValueChange={(value: 'latest' | 'popular') => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter posts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <UserStatsDialog user={users.find(u => u.id === post.userId) || users[0]} />
                <span>{post.timestamp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button variant="ghost" onClick={() => handleLike(post.id)}>
                  <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes}
                </Button>
                <Button variant="ghost">
                  <MessageCircle className="mr-2 h-4 w-4" /> {post.comments}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;