import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const getFileIcon = () => {
    if (document.fileType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (document.fileType.includes('word')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'analyzed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (document.status) {
      case 'analyzed':
        return (
          <Badge className="bg-green-100 text-green-700" data-testid={`badge-status-${document.id}`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Analyzed
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-yellow-100 text-yellow-700" data-testid={`badge-status-${document.id}`}>
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700" data-testid={`badge-status-${document.id}`}>
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700" data-testid={`badge-status-${document.id}`}>
            Pending
          </Badge>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* File Icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {getFileIcon()}
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate" data-testid={`text-document-title-${document.id}`}>
                  {document.title}
                </h3>
                {getStatusBadge()}
              </div>
              
              <p className="text-sm text-gray-500 mb-2" data-testid={`text-document-filename-${document.id}`}>
                {document.fileName} • {formatFileSize(document.fileSize)}
              </p>
              
              <p className="text-xs text-gray-400" data-testid={`text-document-date-${document.id}`}>
                Uploaded {formatDate(document.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {document.status === 'analyzed' && (
              <Link href={`/dashboard`}>
                <Button 
                  size="sm" 
                  variant="outline"
                  data-testid={`button-view-${document.id}`}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              disabled
              data-testid={`button-download-${document.id}`}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar for Processing */}
        {document.status === 'processing' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Analyzing document...</span>
              <span>In progress</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
