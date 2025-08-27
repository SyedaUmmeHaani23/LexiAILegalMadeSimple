import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { User, FileText, MessageCircle, Calendar, Settings, LogOut } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const { data: documents } = useQuery<any[]>({
    queryKey: ["/api/documents"],
  });

  const { data: conversations } = useQuery<any[]>({
    queryKey: ["/api/chat/conversations"],
  });

  const { data: stats } = useQuery<{
    documentsAnalyzed: number;
    totalDocuments: number;
    risksIdentified: number;
    pendingDeadlines: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-profile-title">
            Your Profile
          </h1>
          <p className="text-gray-600" data-testid="text-profile-description">
            Manage your account settings and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="text-lg font-semibold bg-primary-100 text-primary-700">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl" data-testid="text-user-name">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || "User"
                  }
                </CardTitle>
                <CardDescription data-testid="text-user-email">
                  {user?.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Account Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Member since:</span>
                    <span className="font-medium" data-testid="text-member-since">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Recently"
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Account status:</span>
                    <Badge className="bg-success-100 text-success-700">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" className="w-full" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900" data-testid="text-documents-count">
                    {documents?.length || 0}
                  </h3>
                  <p className="text-sm text-gray-500">Documents Uploaded</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-success-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900" data-testid="text-analyzed-count">
                    {stats?.documentsAnalyzed || 0}
                  </h3>
                  <p className="text-sm text-gray-500">Documents Analyzed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900" data-testid="text-conversations-count">
                    {conversations?.length || 0}
                  </h3>
                  <p className="text-sm text-gray-500">AI Conversations</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest interactions with LexiAI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents && documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.slice(0, 5).map((doc: any) => (
                      <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-activity-document-${doc.id}`}>
                            Uploaded "{doc.title}"
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.createdAt).toLocaleDateString()} • {doc.status}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'analyzed' 
                            ? 'bg-success-100 text-success-700' 
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {doc.status === 'analyzed' ? 'Analyzed' : 'Processing'}
                        </div>
                      </div>
                    ))}
                    
                    {conversations && conversations.slice(0, 3).map((conv: any) => (
                      <div key={conv.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-activity-conversation-${conv.id}`}>
                            Started conversation "{conv.title}"
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(conv.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500" data-testid="text-no-activity">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">Upload a document to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
