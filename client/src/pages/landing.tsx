import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Brain, FileText, MessageCircle, Shield, Sparkles, Users, ArrowRight, CheckCircle, Clock, Zap, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen hero-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float-bubble"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-10 right-10 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '0.5s'}}></div>
          </div>

          <h1 className="text-7xl font-black gradient-text-legal mb-6 animate-bounce-in bubble-effect">
            LexiAI
          </h1>
          <p className="text-3xl text-gray-700 mb-6 animate-slide-in-up font-bold" style={{animationDelay: '0.2s'}}>
            ✨ Legal Made Simple ✨
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-in-up leading-relaxed" style={{animationDelay: '0.4s'}}>
            🚀 Transform complex legal documents into crystal-clear, actionable insights with cutting-edge AI. 
            Understand your rights, risks, and obligations—no expensive lawyer required!
          </p>
          
          {/* Animated Call-to-Action */}
          <div className="mt-10 animate-slide-in-up" style={{animationDelay: '0.6s'}}>
            <Link href="/signup" data-testid="button-get-started">
              <Button size="lg" className="btn-primary-gradient text-xl px-12 py-6 animate-pulse-glow hover:animate-wiggle">
                🎯 Get Started FREE - UNLIMITED Documents!
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-3 animate-sparkle">
              No credit card needed • Completely FREE • English, Hindi & Kannada support
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center space-x-4 mt-8">
            <div className="flex items-center space-x-2 text-sm text-success-600 bg-success-50 px-4 py-2 rounded-full animate-float-bubble">
              <Shield className="h-4 w-4" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-full animate-float-bubble" style={{animationDelay: '0.3s'}}>
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-warning-600 bg-warning-50 px-4 py-2 rounded-full animate-float-bubble" style={{animationDelay: '0.6s'}}>
              <Users className="h-4 w-4" />
              <span>Trusted by 10,000+</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="card-outstanding animate-slide-left">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-gentle-float">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-card-foreground mb-3">Smart Document Analysis</h3>
              <p className="text-muted-foreground">AI-powered analysis that identifies obligations, risks, and deadlines in seconds</p>
            </CardContent>
          </Card>

          <Card className="card-outstanding animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-gentle-float" style={{animationDelay: '0.5s'}}>
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-card-foreground mb-3">AI Legal Assistant</h3>
              <p className="text-muted-foreground">Chat with our AI legal expert to get instant answers about your documents</p>
            </CardContent>
          </Card>

          <Card className="card-outstanding animate-slide-right" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-gentle-float" style={{animationDelay: '1s'}}>
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-card-foreground mb-3">Plain English Summaries</h3>
              <p className="text-muted-foreground">Complex legal jargon translated into clear, actionable insights</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-16 animate-fade-in-scale">
          <h2 className="text-5xl font-bold gradient-text-legal mb-8">
            🔥 How It Works - Simple as 1-2-3
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-slide-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                1
              </div>
              <h3 className="font-bold text-xl mb-2">Upload Document</h3>
              <p className="text-gray-600">Simply drag & drop your legal document (PDF, Word, or text file)</p>
            </div>
            <div className="animate-slide-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
                2
              </div>
              <h3 className="font-bold text-xl mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our advanced AI analyzes every clause, identifying key information</p>
            </div>
            <div className="animate-slide-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">
                3
              </div>
              <h3 className="font-bold text-xl mb-2">Get Insights</h3>
              <p className="text-gray-600">Receive clear, actionable insights and recommendations instantly</p>
            </div>
          </div>
        </div>

        {/* Multilingual Support Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 mb-8 animate-fade-in-scale">
          <h2 className="text-4xl font-bold text-center mb-8 gradient-text-legal">
            🌍 Multilingual AI Legal Assistant
          </h2>
          <p className="text-xl text-center text-gray-600 mb-6 max-w-4xl mx-auto">
            LexiAI speaks your language! Our AI provides legal analysis and insights in English, Hindi, and Kannada, 
            making legal documents accessible to users across India.
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {['English', 'Hindi (हिंदी)', 'Kannada (ಕನ್ನಡ)'].map((lang) => (
              <span key={lang} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-3xl p-8 mb-16 animate-fade-in-scale">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text-legal">
            ⚡ Why Choose LexiAI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center animate-float-bubble">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Get results in seconds, not hours</p>
            </div>
            <div className="text-center animate-float-bubble" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">99% Accurate</h3>
              <p className="text-gray-600">Trusted by legal professionals worldwide</p>
            </div>
            <div className="text-center animate-float-bubble" style={{animationDelay: '0.6s'}}>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Save Time</h3>
              <p className="text-gray-600">Reduce legal review time by 90%</p>
            </div>
            <div className="text-center animate-float-bubble" style={{animationDelay: '0.9s'}}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Cost Effective</h3>
              <p className="text-gray-600">Save thousands on legal fees</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center animate-slide-in-up">
          <h2 className="text-4xl font-bold mb-6 gradient-text-legal">
            🚀 Ready to Transform Your Legal Documents?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who save hours every week with LexiAI
          </p>
          <Link href="/upload">
            <Button size="lg" className="btn-primary-gradient text-2xl px-16 py-8 animate-pulse-glow hover:animate-wiggle" data-testid="button-start-now">
              🚀 Start Your FREE Analysis Now - UNLIMITED!
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Unlimited document uploads • No credit card required • English, Hindi & Kannada • Start in 30 seconds
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}