import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File; title: string }) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', title);

      // Simulate progress updates for better user experience
      setUploadProgress(10);
      
      setTimeout(() => setUploadProgress(30), 200);
      setTimeout(() => setUploadProgress(60), 500);
      setTimeout(() => setUploadProgress(80), 1000);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      setUploadProgress(95);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: "Your document is being analyzed. You'll see results shortly.",
        variant: "default",
      });
      
      // Reset form
      setSelectedFile(null);
      setTitle("");
      setUploadProgress(100);
      
      // Invalidate documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      // Redirect to document view after a short delay
      setTimeout(() => {
        window.location.href = `/documents/${data.documentId}`;
      }, 2000);
    },
    onError: (error) => {
      // Since the app is completely free now, no limit errors should occur
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, Word documents (.docx, .doc), or text files only.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter a title.",
        variant: "destructive",
      });
      return;
    }

    setUploadProgress(10);
    uploadMutation.mutate({ file: selectedFile, title: title.trim() });
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-danger-500" />;
    } else if (file.type.includes('word')) {
      return <FileText className="h-8 w-8 text-primary-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen hero-background relative">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float-bubble"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 right-10 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl animate-float-bubble" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Enhanced Page Header */}
        <div className="mb-12 text-center animate-slide-in-up relative z-10">
          <h1 className="text-5xl font-black gradient-text-legal mb-6 animate-bounce-in bubble-effect" data-testid="text-upload-title">
            🚀 Upload Your Legal Document
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-semibold animate-slide-in-up leading-relaxed" data-testid="text-upload-description" style={{animationDelay: '0.2s'}}>
            ✨ Upload your legal documents for lightning-fast AI-powered analysis! Get crystal-clear insights on obligations, risks, and deadlines in seconds.
          </p>
          <div className="mt-6 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <p className="text-lg text-green-600 font-bold animate-sparkle">
              🎁 UNLIMITED documents are FREE - No signup required! Available in English, Hindi & Kannada!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Document Upload
                </CardTitle>
                <CardDescription>
                  Choose a PDF, Word document, or text file to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Rental Agreement, Employment Contract, etc."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="input-document-title"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">Select Document</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      {selectedFile ? (
                        <div className="flex items-center justify-center space-x-3">
                          {getFileIcon(selectedFile)}
                          <div className="text-left">
                            <p className="font-medium text-gray-900" data-testid="text-selected-file">
                              {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            Click to select a document or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">
                            Supports PDF, Word (.doc, .docx), and text files up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading and analyzing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Upload Success */}
                {uploadProgress === 100 && !uploadMutation.isPending && (
                  <div className="flex items-center space-x-2 text-success-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Upload successful! Redirecting to dashboard...</span>
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !title.trim() || uploadMutation.isPending}
                  className="w-full"
                  data-testid="button-upload-document"
                >
                  {uploadMutation.isPending ? "Uploading & Analyzing..." : "Upload & Analyze Document"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* What happens next */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚡ What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Document Upload</p>
                    <p className="text-xs text-gray-500">Your file is securely uploaded and stored</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI Analysis</p>
                    <p className="text-xs text-gray-500">Our AI extracts and analyzes key clauses</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Simplified Results</p>
                    <p className="text-xs text-gray-500">Get easy-to-understand explanations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported file types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-danger-500" />
                    <span className="text-sm text-gray-700">PDF Documents (.pdf)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary-500" />
                    <span className="text-sm text-gray-700">Word Documents (.doc, .docx)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Text Files (.txt)</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    Maximum file size: 10MB. For best results, ensure your document has clear, readable text.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your documents are processed securely with end-to-end encryption. We use industry-standard security practices and never share your data with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
