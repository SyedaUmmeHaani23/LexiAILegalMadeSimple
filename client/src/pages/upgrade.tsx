import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Check, Zap, Star, Crown, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function UpgradePage() {
  return (
    <div className="min-h-screen hero-background relative">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-float-bubble"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-32 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-16 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-6xl font-black gradient-text-legal mb-6 animate-bounce-in bubble-effect">
            ✨ Unlock Unlimited Legal AI Power
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-semibold animate-slide-in-up leading-relaxed" style={{animationDelay: '0.2s'}}>
            🚀 Ready to analyze unlimited documents? Upgrade to LexiAI Pro and get advanced features that save you thousands in legal fees!
          </p>
          <div className="mt-8 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <p className="text-lg text-green-600 font-bold animate-sparkle">
              🔥 Limited Time: 50% OFF for early users!
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 relative z-10">
          {/* Free Plan */}
          <Card className="card-outstanding animate-slide-left border-2 border-gray-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-gray-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Free Starter</CardTitle>
              <CardDescription className="text-lg">Perfect for trying out LexiAI</CardDescription>
              <div className="text-4xl font-black text-gray-900 mt-4">
                $0<span className="text-lg font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">3 document uploads</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Basic AI analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Email support</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Most Popular */}
          <Card className="card-outstanding animate-slide-in-up border-4 border-primary-500 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 text-sm font-bold">
              🔥 MOST POPULAR
            </div>
            <CardHeader className="text-center pt-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary-700">LexiAI Pro</CardTitle>
              <CardDescription className="text-lg">For professionals and businesses</CardDescription>
              <div className="text-5xl font-black text-primary-700 mt-4">
                <span className="line-through text-2xl text-gray-400">$49</span> $24<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-sm text-green-600 font-bold">50% OFF - Limited Time!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-bold">Unlimited document uploads</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-bold">Advanced AI analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-bold">Priority processing</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-bold">Export to PDF/Word</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-bold">24/7 premium support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-bold">Custom document templates</span>
                </div>
              </div>
              <Button className="w-full mt-6 btn-primary-gradient text-lg py-6 animate-pulse-glow hover:animate-wiggle">
                🚀 Upgrade to Pro Now
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="card-outstanding animate-slide-right border-2 border-purple-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-700">Enterprise</CardTitle>
              <CardDescription className="text-lg">For teams and organizations</CardDescription>
              <div className="text-4xl font-black text-purple-700 mt-4">
                Custom<span className="text-lg font-normal"> pricing</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Everything in Pro</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Team collaboration</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">API access</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Custom integrations</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Dedicated support</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mb-16 animate-fade-in-scale relative z-10">
          <h2 className="text-4xl font-bold text-center mb-8 gradient-text-legal">
            🎯 Why Upgrade to Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center animate-float-bubble">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process unlimited documents in seconds</p>
            </div>
            <div className="text-center animate-float-bubble" style={{animationDelay: '0.5s'}}>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Analysis</h3>
              <p className="text-gray-600">Advanced AI insights and recommendations</p>
            </div>
            <div className="text-center animate-float-bubble" style={{animationDelay: '1s'}}>
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Export Options</h3>
              <p className="text-gray-600">Download analysis as PDF or Word documents</p>
            </div>
            <div className="text-center animate-float-bubble" style={{animationDelay: '1.5s'}}>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Priority Support</h3>
              <p className="text-gray-600">Get help from legal AI experts 24/7</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16 animate-slide-in-up relative z-10">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">🚀 Ready to Unlock Unlimited Legal AI?</h2>
            <p className="text-xl mb-6">Join thousands of professionals who save hours every week!</p>
            <Button size="lg" variant="secondary" className="text-2xl px-12 py-6 animate-pulse-glow hover:animate-wiggle">
              Start Your Pro Trial - 50% OFF
            </Button>
            <p className="text-sm mt-4 opacity-90">
              30-day money-back guarantee • Cancel anytime • No setup fees
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}