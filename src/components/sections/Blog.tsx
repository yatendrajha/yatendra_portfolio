import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Search, Calendar, User, ArrowRight, Loader2, Filter, MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

const categories = ["All", "Product", "Fintech", "Technology and Innovation", "AI", "Automation"];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
}

export default function Blog() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [comments, setComments] = React.useState<any[]>([]);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    }, (error) => {
      console.error("Error loading blogs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!selectedPost) {
      setComments([]);
      return;
    }

    const q = query(
      collection(db, 'comments'),
      where('blogId', '==', selectedPost.id),
      where('status', '==', 'approved'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'comments');
    });

    return () => unsubscribe();
  }, [selectedPost]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !newComment.trim() || !selectedPost) return;

    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, 'comments'), {
        blogId: selectedPost.id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        content: newComment.trim(),
        status: 'pending', // Requires moderation
        timestamp: serverTimestamp()
      });
      setNewComment("");
      alert("Comment submitted for moderation!");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'comments');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
      >
        <Button 
          variant="ghost" 
          onClick={() => setSelectedPost(null)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
        >
          ← Back to Feed
        </Button>
        
        <article className="bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-sm border border-white/20 space-y-8">
          <div className="space-y-4">
            <Badge className="bg-blue-50/50 text-blue-600 border-none rounded-full px-4 py-1">
              {selectedPost.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1C1C1E]">
              {selectedPost.title}
            </h1>
            <div className="flex items-center gap-6 text-[#8E8E93] text-sm font-medium">
              <span className="flex items-center gap-2"><User size={16} /> {selectedPost.author}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {selectedPost.date}</span>
            </div>
          </div>
          
          <div className="prose prose-blue max-w-none text-[#1C1C1E] leading-relaxed">
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
          </div>

          <div className="pt-12 border-t border-white/20 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" />
                Comments ({comments.length})
              </h3>
            </div>

            {auth.currentUser ? (
              <form onSubmit={handlePostComment} className="space-y-4">
                <Textarea 
                  placeholder="Share your thoughts..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="rounded-2xl border-white/20 bg-white/40 focus:bg-white transition-all min-h-[100px]"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmittingComment || !newComment.trim()}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isSubmittingComment ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="mr-2" />}
                  Post Comment
                </Button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-blue-600 font-medium">Please log in to join the conversation.</p>
              </div>
            )}

            <div className="space-y-6">
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-white/40 border border-white/20 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {comment.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{comment.userName}</p>
                      <p className="text-[10px] text-[#8E8E93]">{comment.timestamp?.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-[#1C1C1E] text-sm leading-relaxed">{comment.content}</p>
                </motion.div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-[#8E8E93] py-8">No approved comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </article>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1C1C1E]">Insights & Updates</h2>
          <p className="text-[#8E8E93] max-w-md">
            Daily thoughts on product strategy, fintech trends, and the future of AI.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
          <Input 
            placeholder="Search posts..." 
            className="pl-12 py-6 rounded-2xl border-white/20 bg-white/40 backdrop-blur-md focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === cat 
                ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                : "bg-white/40 backdrop-blur-md text-[#8E8E93] hover:bg-white/60 border border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-[#8E8E93] font-medium">Fetching latest insights from the web...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card 
                  className="group rounded-[2.5rem] border-none shadow-sm bg-white/60 backdrop-blur-md hover:bg-white/80 hover:shadow-xl transition-all duration-500 cursor-pointer h-full flex flex-col"
                  onClick={() => setSelectedPost(post)}
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-blue-50/50 text-blue-600 border-none rounded-full px-3">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-[#8E8E93] font-medium">{post.date}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#1C1C1E] group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-between">
                    <p className="text-[#8E8E93] leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-blue-600 font-bold text-sm gap-2 group-hover:gap-4 transition-all">
                      Read Article <ArrowRight size={16} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-white/40">
          <p className="text-[#8E8E93] text-lg">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
