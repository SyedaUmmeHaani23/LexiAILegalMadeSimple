import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Upload, FileText, MessageCircle, TrendingUp, ArrowRight, CheckCircle, AlertTriangle, Clock, Shield, Sparkles, Brain, Search, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: stats } = useQuery<{
    documentsAnalyzed: number;
    totalDocuments: number;
    risksIdentified: number;
    pendingDeadlines: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentDocuments } = useQuery<any[]>({
    queryKey: ["/api/documents"],
  });

  return (
    <div className="min-h-screen hero-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section with Floating Elements */}
        <div className="mb-12 text-center animate-slide-in-up relative">
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float-bubble"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '2s'}}></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black gradient-text-legal text-shadow-soft mb-6 animate-bounce-in bubble-effect" data-testid="text-welcome">
            ✨ Welcome back, {user?.firstName || user?.email}! 🚀
          </h1>
          <p className="text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto font-semibold animate-slide-in-up" data-testid="text-welcome-description" style={{animationDelay: '0.2s'}}>
            Transform complex legal documents into crystal-clear, actionable insights with our cutting-edge AI platform
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-success-600 bg-success-50 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-warning-600 bg-warning-50 px-4 py-2 rounded-full">
              <Users className="h-4 w-4" />
              <span>Trusted by 1000+</span>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions with Interactive Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Smart Document Analysis Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="card-outstanding cursor-pointer group animate-pulse-glow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-card-foreground mb-2">Smart Document Analysis</h3>
                  <p className="text-sm text-muted-foreground">AI-powered legal document insights</p>
                  <div className="mt-3 flex items-center justify-center text-primary-600 group-hover:text-primary-700">
                    <span className="text-xs font-medium">Click to learn more</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl animate-fade-in-scale">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Smart Document Analysis
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-success-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-success-700">Obligation Detection</h4>
                        <p className="text-sm text-muted-foreground">Automatically finds your responsibilities and commitments</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-danger-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-danger-700">Risk Identification</h4>
                        <p className="text-sm text-muted-foreground">Spots potential legal risks and unfavorable terms</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-warning-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-warning-700">Deadline Tracking</h4>
                        <p className="text-sm text-muted-foreground">Never miss important dates and deadlines</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-4">
                    <h4 className="font-semibold text-primary-700 mb-2">How it works:</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-center"><span className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 mr-2">1</span>Upload your document</li>
                      <li className="flex items-center"><span className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 mr-2">2</span>AI analyzes every clause</li>
                      <li className="flex items-center"><span className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 mr-2">3</span>Get color-coded insights</li>
                      <li className="flex items-center"><span className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 mr-2">4</span>Make informed decisions</li>
                    </ol>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Link href="/upload">
                    <Button className="btn-primary-gradient w-full" size="lg">
                      Start Document Analysis <Upload className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* AI Legal Assistant Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="card-outstanding cursor-pointer group animate-pulse-glow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-card-foreground mb-2">AI Legal Assistant</h3>
                  <p className="text-sm text-muted-foreground">Ask questions about your documents</p>
                  <div className="mt-3 flex items-center justify-center text-secondary-600 group-hover:text-secondary-700">
                    <span className="text-xs font-medium">Click to explore</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl animate-fade-in-scale">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  AI Legal Assistant
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="bg-secondary-50 rounded-xl p-6">
                  <h4 className="font-semibold text-secondary-700 mb-4">Chat with our AI about your legal documents:</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border-l-4 border-secondary-400">
                      <p className="text-sm font-medium">"What are the main risks in this contract?"</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border-l-4 border-primary-400">
                      <p className="text-sm font-medium">"When do I need to make the payment?"</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border-l-4 border-warning-400">
                      <p className="text-sm font-medium">"Can I cancel this agreement early?"</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Search className="h-6 w-6 text-primary-600" />
                    </div>
                    <h4 className="font-semibold">Instant Answers</h4>
                    <p className="text-xs text-muted-foreground">Get immediate responses to legal questions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-6 w-6 text-success-600" />
                    </div>
                    <h4 className="font-semibold">Context Aware</h4>
                    <p className="text-xs text-muted-foreground">Based on your specific documents</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Link href="/chatbot">
                    <Button className="btn-secondary-gradient w-full" size="lg">
                      Start Chatting <MessageCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Enhanced Statistics Cards */}
          <Card className="card-feature animate-fade-in-scale" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-400 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-1" data-testid="text-stats-documents">
                {stats?.documentsAnalyzed || 0}
              </h3>
              <p className="text-sm font-medium text-success-600 mb-2">Documents Analyzed</p>
              <div className="w-full bg-success-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-success-400 to-success-600 h-2 rounded-full" style={{width: `${Math.min(((stats?.documentsAnalyzed || 0) / 100) * 100, 100)}%`}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-feature animate-fade-in-scale" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-danger-400 to-danger-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-1" data-testid="text-stats-risks">
                {stats?.risksIdentified || 0}
              </h3>
              <p className="text-sm font-medium text-danger-600 mb-2">Risks Identified</p>
              <div className="w-full bg-danger-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-danger-400 to-danger-600 h-2 rounded-full" style={{width: `${Math.min(((stats?.risksIdentified || 0) / 50) * 100, 100)}%`}}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Documents
              </CardTitle>
              <CardDescription>
                Your latest uploaded and analyzed documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentDocuments && recentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {recentDocuments.slice(0, 5).map((doc: any) => (
                    <div key={doc.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-document-title-${doc.id}`}>
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.status === 'analyzed' ? 'Analyzed' : 'Processing'} • {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'analyzed' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-warning-100 text-warning-700'
                      }`}>
                        {doc.status === 'analyzed' ? 'Ready' : 'Processing'}
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full" data-testid="button-view-all-documents">
                        View All Documents
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4" data-testid="text-no-documents">No documents yet</p>
                  <Link href="/upload">
                    <Button data-testid="button-upload-first-document">Upload Your First Document</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Tips to make the most of LexiAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload your document</p>
                    <p className="text-xs text-gray-500">Supports PDF, Word, and text files</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review AI analysis</p>
                    <p className="text-xs text-gray-500">See obligations, risks, and deadlines</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ask questions</p>
                    <p className="text-xs text-gray-500">Chat with AI about your document</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">4</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Make informed decisions</p>
                    <p className="text-xs text-gray-500">Understand before you sign</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
