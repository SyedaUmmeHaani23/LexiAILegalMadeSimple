import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Search, BookOpen, Scale } from "lucide-react";

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: glossaryTerms, isLoading } = useQuery<any[]>({
    queryKey: ["/api/glossary"],
  });

  // Sample data if no terms exist yet
  const sampleTerms = [
    {
      id: "1",
      term: "Indemnity",
      definition: "A legal obligation to compensate another party for harm, loss, or damage they may suffer.",
      simplifiedDefinition: "Protection against loss, damage, or legal responsibility. If something goes wrong, one party agrees to cover the costs.",
      category: "contract",
      examples: ["Insurance policies", "Service agreements", "Employment contracts"]
    },
    {
      id: "2", 
      term: "Force Majeure",
      definition: "Unforeseeable circumstances that prevent a party from fulfilling a contract.",
      simplifiedDefinition: "Events beyond anyone's control (like natural disasters, wars) that make it impossible to fulfill contract obligations.",
      category: "contract",
      examples: ["Natural disasters", "Government actions", "Pandemics"]
    },
    {
      id: "3",
      term: "Liquidated Damages",
      definition: "A predetermined amount of compensation for breach of contract specified in the contract itself.",
      simplifiedDefinition: "A pre-agreed penalty amount that you'll pay if you break the contract. This amount is decided when signing, not later.",
      category: "contract",
      examples: ["Early lease termination fees", "Construction delay penalties", "Service cancellation charges"]
    },
    {
      id: "4",
      term: "Breach of Contract",
      definition: "Failure to perform any duty or obligation specified in a contract without legal excuse.",
      simplifiedDefinition: "Breaking a promise you made in a contract. This could be not paying on time, not delivering services, or not following the rules.",
      category: "contract",
      examples: ["Missing payment deadlines", "Not delivering promised services", "Violating contract terms"]
    },
    {
      id: "5",
      term: "Jurisdiction",
      definition: "The authority of a court to hear and decide a particular type of case.",
      simplifiedDefinition: "Which court has the power to make decisions about your case. This is usually based on location or type of legal issue.",
      category: "legal",
      examples: ["State courts", "Federal courts", "Local magistrates"]
    },
    {
      id: "6",
      term: "Arbitration",
      definition: "A method of alternative dispute resolution where disputes are resolved by neutral third parties outside of court.",
      simplifiedDefinition: "Settling disagreements outside of court with a neutral person (arbitrator) who makes a binding decision.",
      category: "legal",
      examples: ["Employment disputes", "Consumer complaints", "Commercial disagreements"]
    }
  ];

  const terms = glossaryTerms && glossaryTerms.length > 0 ? glossaryTerms : sampleTerms;

  const filteredTerms = terms?.filter((term: any) =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.simplifiedDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categoryColors: Record<string, string> = {
    contract: "bg-blue-100 text-blue-700",
    property: "bg-green-100 text-green-700", 
    corporate: "bg-purple-100 text-purple-700",
    legal: "bg-orange-100 text-orange-700",
    default: "bg-gray-100 text-gray-700"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" data-testid="text-glossary-title">
                Legal Glossary
              </h1>
              <p className="text-gray-600" data-testid="text-glossary-description">
                Simple explanations of common legal terms
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search legal terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-terms"
            />
          </div>
        </div>

        {/* Terms Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map((term: any) => (
              <Card key={term.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900" data-testid={`text-term-${term.id}`}>
                        {term.term}
                      </CardTitle>
                      {term.category && (
                        <Badge 
                          className={`mt-2 ${categoryColors[term.category] || categoryColors.default}`}
                          data-testid={`badge-category-${term.id}`}
                        >
                          {term.category}
                        </Badge>
                      )}
                    </div>
                    <Scale className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Simplified Definition */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Simple Explanation:</h4>
                    <p className="text-gray-700" data-testid={`text-simple-definition-${term.id}`}>
                      {term.simplifiedDefinition}
                    </p>
                  </div>

                  {/* Legal Definition */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Definition:</h4>
                    <p className="text-gray-600 text-sm" data-testid={`text-legal-definition-${term.id}`}>
                      {term.definition}
                    </p>
                  </div>

                  {/* Examples */}
                  {term.examples && term.examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Common Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {term.examples.map((example: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="text-xs"
                            data-testid={`badge-example-${term.id}-${index}`}
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="text-no-results-title">
                No terms found
              </h3>
              <p className="text-gray-500" data-testid="text-no-results-description">
                Try adjusting your search or browse all terms
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {terms && terms.length > 0 && (
          <div className="mt-12 text-center">
            <Card>
              <CardContent className="py-6">
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-total-terms">
                      {terms.length}
                    </p>
                    <p className="text-gray-500">Legal Terms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-categories-count">
                      {new Set(terms.map((t: any) => t.category).filter(Boolean)).size}
                    </p>
                    <p className="text-gray-500">Categories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-filtered-count">
                      {filteredTerms.length}
                    </p>
                    <p className="text-gray-500">Showing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
