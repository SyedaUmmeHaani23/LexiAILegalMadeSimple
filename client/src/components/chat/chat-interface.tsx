import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send, FileText, Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  conversationId: string;
  conversationTitle: string;
  documentId?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function ChatInterface({ conversationId, conversationTitle, documentId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/conversations", conversationId, "messages"],
    enabled: !!conversationId,
  });

  const { data: documentData } = useQuery<any>({
    queryKey: ["/api/documents", documentId],
    enabled: !!documentId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/chat/conversations/${conversationId}/messages`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/conversations", conversationId, "messages"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/conversations"] 
      });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate(message.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Bot className="h-5 w-5 mr-2 text-blue-600" />
            {conversationTitle}
          </CardTitle>
          {documentId && documentData && (
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="h-4 w-4 mr-1" />
              <span data-testid="text-linked-document">
                {documentData.document?.title || "Document linked"}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages-container">
            {messagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading messages...</span>
              </div>
            ) : messages && messages.length > 0 ? (
              <>
                {messages.map((msg: ChatMessage) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    data-testid={`message-${msg.id}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap" data-testid={`text-message-content-${msg.id}`}>
                        {msg.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator for AI response */}
                {sendMessageMutation.isPending && (
                  <div className="flex items-start space-x-3 justify-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bot className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="text-no-messages-title">
                  Start a conversation
                </h3>
                <p className="text-gray-500 mb-6 max-w-md" data-testid="text-no-messages-description">
                  {documentId 
                    ? "Ask questions about your document and get instant answers from our AI legal assistant."
                    : "Chat with our AI legal assistant. Ask general legal questions or upload a document for specific guidance."
                  }
                </p>
                {documentId && (
                  <div className="text-sm text-gray-400 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Document context available</span>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                placeholder={
                  documentId 
                    ? "Ask about your document..." 
                    : "Ask a legal question..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sendMessageMutation.isPending}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            {/* Quick suggestions */}
            {messages?.length === 0 && documentId && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("What are the key obligations in this document?")}
                  disabled={sendMessageMutation.isPending}
                  data-testid="button-quick-question-obligations"
                >
                  Key obligations?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("What are the main risks I should be aware of?")}
                  disabled={sendMessageMutation.isPending}
                  data-testid="button-quick-question-risks"
                >
                  Main risks?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("Are there any important deadlines?")}
                  disabled={sendMessageMutation.isPending}
                  data-testid="button-quick-question-deadlines"
                >
                  Important deadlines?
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer Attribution */}
      <div className="border-t px-4 py-2 bg-gray-50">
        <p className="text-xs text-gray-500 text-center" data-testid="text-chat-attribution">
          Developed by Syeda Umme Haani | Contact: +91 7204409926 | Email: syedaummehaani23@gmail.com
        </p>
      </div>
    </Card>
  );
}
