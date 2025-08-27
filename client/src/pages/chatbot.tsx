import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useLocation } from "wouter";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Plus,
  FileText,
  Sparkles,
  Clock,
  Trash2
} from "lucide-react";

export default function ChatbotPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations } = useQuery<any[]>({
    queryKey: ["/api/chat/conversations"],
  });

  const { data: documents } = useQuery<any[]>({
    queryKey: ["/api/documents"],
  });

  const { data: messages } = useQuery<any[]>({
    queryKey: [`/api/chat/conversations/${selectedConversation}/messages`],
    enabled: !!selectedConversation,
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data: { title: string; documentId?: string }) => {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create conversation');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/conversations"] });
      setSelectedConversation(data.id);
      toast({
        title: "Success",
        description: "New conversation started!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      if (!selectedConversation) throw new Error('No conversation selected');
      
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/chat/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [`/api/chat/conversations/${selectedConversation}/messages`] 
      });
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render the main content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (!selectedConversation) {
      // Create a new conversation first
      createConversationMutation.mutate({
        title: message.substring(0, 50) + (message.length > 50 ? "..." : "")
      });
      // Store the message to send after conversation is created
      setTimeout(() => {
        sendMessageMutation.mutate({ content: message.trim() });
      }, 500);
    } else {
      sendMessageMutation.mutate({ content: message.trim() });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    // Clear current selection to start fresh
    setSelectedConversation(null);
    setMessage("");
    createConversationMutation.mutate({
      title: "New Conversation"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen hero-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2" data-testid="text-chatbot-title">
            AI Legal Assistant
          </h1>
          <p className="text-muted-foreground" data-testid="text-chatbot-description">
            Ask questions about your legal documents and get clear, helpful answers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-300px)]">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button 
                  size="sm" 
                  onClick={startNewConversation}
                  disabled={createConversationMutation.isPending}
                  data-testid="button-new-conversation"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-450px)]">
                  <div className="space-y-2 p-4">
                    {!conversations || conversations.length === 0 ? (
                      <div className="text-center py-8" data-testid="text-no-conversations">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          No conversations yet. Start chatting!
                        </p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                            selectedConversation === conv.id
                              ? 'bg-primary-50 border-primary-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedConversation(conv.id)}
                          data-testid={`conversation-${conv.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {conv.title}
                              </h4>
                              {conv.documentId && (
                                <div className="flex items-center mt-1">
                                  <FileText className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-500">Document linked</span>
                                </div>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(conv.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Sparkles className="h-5 w-5 mr-2 text-primary-500" />
                          AI Legal Assistant
                        </CardTitle>
                        <CardDescription>
                          Ask me anything about your legal documents
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-success-100 text-success-700 border-success-200">
                        <Bot className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 px-6">
                      <div className="space-y-4 py-4">
                        {!messages || messages.length === 0 ? (
                          <div className="text-center py-8" data-testid="text-no-messages">
                            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
                            <p className="text-gray-500 mb-4 max-w-md mx-auto">
                              Ask questions about your legal documents, contracts, or get general legal advice.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                              <div 
                                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setMessage("What are the key risks in my contract?")}
                              >
                                <p className="text-sm font-medium text-gray-900">What are the key risks in my contract?</p>
                              </div>
                              <div 
                                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setMessage("When do I need to make payments?")}
                              >
                                <p className="text-sm font-medium text-gray-900">When do I need to make payments?</p>
                              </div>
                              <div 
                                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setMessage("Can I terminate this agreement early?")}
                              >
                                <p className="text-sm font-medium text-gray-900">Can I terminate this agreement early?</p>
                              </div>
                              <div 
                                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setMessage("What are my main obligations?")}
                              >
                                <p className="text-sm font-medium text-gray-900">What are my main obligations?</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                              data-testid={`message-${msg.id}`}
                            >
                              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                  msg.role === 'user' 
                                    ? 'bg-primary-100 text-primary-600 ml-3' 
                                    : 'bg-gray-100 text-gray-600 mr-3'
                                }`}>
                                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`p-3 rounded-lg ${
                                  msg.role === 'user'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                  <div className="flex items-center mt-2">
                                    <Clock className="h-3 w-3 mr-1 opacity-60" />
                                    <span className="text-xs opacity-60">{formatTime(msg.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        {sendMessageMutation.isPending && (
                          <div className="flex justify-start">
                            <div className="flex max-w-[80%]">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 mr-3">
                                <Bot className="h-4 w-4" />
                              </div>
                              <div className="p-3 rounded-lg bg-gray-100">
                                <div className="flex items-center space-x-2">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                  <span className="text-xs text-gray-500">AI is thinking...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="border-t bg-white p-4">
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <Input
                            placeholder="Ask a question about your legal documents..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={sendMessageMutation.isPending}
                            className="min-h-[44px]"
                            data-testid="input-chat-message"
                          />
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || sendMessageMutation.isPending}
                          className="btn-primary-gradient px-4 py-2 h-[44px]"
                          data-testid="button-send-message"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center" data-testid="text-select-conversation">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500 mb-4">
                      Choose an existing conversation or start a new one
                    </p>
                    <Button onClick={startNewConversation} className="btn-primary-gradient">
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Conversation
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}