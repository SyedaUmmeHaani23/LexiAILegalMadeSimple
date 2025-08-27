import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Upload, 
  Eye, 
  TrendingUp,
  Calendar,
  Shield,
  Activity
} from "lucide-react";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: documents } = useQuery<any[]>({
    queryKey: ["/api/documents"],
  });

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <Badge variant="secondary" className="bg-success-100 text-success-700 border-success-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Analyzed
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-warning-100 text-warning-700 border-warning-200">
          <Clock className="h-3 w-3 mr-1" />
          Processing
        </Badge>;
      case 'error':
        return <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Error
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen hero-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2" data-testid="text-dashboard-title">
            Document Dashboard
          </h1>
          <p className="text-muted-foreground" data-testid="text-dashboard-description">
            Manage and analyze your legal documents with AI-powered insights
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-feature">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                  <p className="text-3xl font-bold gradient-text" data-testid="text-total-documents">
                    {stats?.totalDocuments || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-feature">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Analyzed</p>
                  <p className="text-3xl font-bold text-success-600" data-testid="text-analyzed-documents">
                    {stats?.documentsAnalyzed || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-feature">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risks Found</p>
                  <p className="text-3xl font-bold text-danger-600" data-testid="text-risks-identified">
                    {stats?.risksIdentified || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-danger-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-feature">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Deadlines</p>
                  <p className="text-3xl font-bold text-warning-600" data-testid="text-pending-deadlines">
                    {stats?.pendingDeadlines || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Your uploaded legal documents and analysis status</CardDescription>
                </div>
                <Link href="/upload">
                  <Button className="btn-primary-gradient">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {!documents || documents.length === 0 ? (
                  <div className="text-center py-12" data-testid="text-no-documents">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Upload your first legal document to get started with AI analysis
                    </p>
                    <Link href="/upload">
                      <Button className="btn-primary-gradient">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`document-card-${doc.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <h3 className="font-medium text-gray-900" data-testid={`document-title-${doc.id}`}>
                                {doc.title}
                              </h3>
                              {getStatusBadge(doc.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <span>{doc.fileName}</span>
                              <span>{formatFileSize(doc.fileSize)}</span>
                              <span>{formatDate(doc.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.status === 'analyzed' && (
                              <Link href={`/documents/${doc.id}`}>
                                <Button variant="outline" size="sm" data-testid={`view-document-${doc.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Analysis
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/upload">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Document
                  </Button>
                </Link>
                <Link href="/chatbot">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-chat">
                    <Activity className="h-4 w-4 mr-2" />
                    Ask Legal Assistant
                  </Button>
                </Link>
                <Link href="/glossary">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-quick-glossary">
                    <Shield className="h-4 w-4 mr-2" />
                    Legal Glossary
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Analysis Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (stats.risksIdentified > 0 || stats.pendingDeadlines > 0) ? (
                  <div className="space-y-4">
                    {stats.risksIdentified > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-danger-700">
                            {stats.risksIdentified} risk{stats.risksIdentified > 1 ? 's' : ''} identified
                          </p>
                          <p className="text-xs text-gray-600">
                            Review your documents for potential issues
                          </p>
                        </div>
                      </div>
                    )}
                    {stats.pendingDeadlines > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-warning-700">
                            {stats.pendingDeadlines} deadline{stats.pendingDeadlines > 1 ? 's' : ''} found
                          </p>
                          <p className="text-xs text-gray-600">
                            Important dates to track
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Shield className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Upload documents to see insights
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    • Upload contracts, agreements, and legal forms for best results
                  </p>
                  <p className="text-gray-600">
                    • Use clear, high-quality scans for better text extraction
                  </p>
                  <p className="text-gray-600">
                    • Ask the AI assistant specific questions about your documents
                  </p>
                  <p className="text-gray-600">
                    • Review risk assessments and deadlines regularly
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}