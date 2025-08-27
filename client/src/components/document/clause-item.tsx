import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ClauseItemProps {
  clause: {
    id: string;
    originalText: string;
    simplifiedText: string;
    clauseType: "obligation" | "risk" | "deadline" | "neutral";
    riskLevel?: "low" | "medium" | "high";
    explanation: string;
    actionableAdvice: string;
    position: number;
  };
}

export default function ClauseItem({ clause }: ClauseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getClauseTypeConfig = () => {
    switch (clause.clauseType) {
      case 'obligation':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          dotColor: 'bg-green-500',
          badgeClass: 'bg-green-100 text-green-700',
          panelClass: 'bg-green-50 border-green-200',
          titleClass: 'text-green-800',
          textClass: 'text-green-700',
          label: 'Obligation'
        };
      case 'risk':
        const riskLabel = clause.riskLevel === 'high' ? 'High Risk' : 
                          clause.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk';
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          dotColor: 'bg-red-500',
          badgeClass: 'bg-red-100 text-red-700',
          panelClass: 'bg-red-50 border-red-200',
          titleClass: 'text-red-800',
          textClass: 'text-red-700',
          label: riskLabel
        };
      case 'deadline':
        return {
          icon: <Clock className="h-4 w-4" />,
          dotColor: 'bg-yellow-500',
          badgeClass: 'bg-yellow-100 text-yellow-700',
          panelClass: 'bg-yellow-50 border-yellow-200',
          titleClass: 'text-yellow-800',
          textClass: 'text-yellow-700',
          label: 'Deadline'
        };
      default:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          dotColor: 'bg-gray-500',
          badgeClass: 'bg-gray-100 text-gray-700',
          panelClass: 'bg-gray-50 border-gray-200',
          titleClass: 'text-gray-800',
          textClass: 'text-gray-700',
          label: 'Info'
        };
    }
  };

  const config = getClauseTypeConfig();

  const toggleExplanation = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className="clause-item border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
      data-clause-type={clause.clauseType}
      data-testid={`clause-item-${clause.id}`}
    >
      <div className="p-4 flex items-start space-x-3">
        {/* Type Indicator Dot */}
        <span className={`w-4 h-4 ${config.dotColor} rounded-full mt-1 flex-shrink-0`}></span>
        
        <div className="flex-1">
          {/* Original Clause Text */}
          <p className="text-gray-900 leading-relaxed mb-3" data-testid={`text-clause-original-${clause.id}`}>
            {clause.originalText}
          </p>
          
          {/* Badges and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={config.badgeClass} data-testid={`badge-clause-type-${clause.id}`}>
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExplanation}
                className="text-blue-600 hover:text-blue-700 font-medium h-auto p-1"
                data-testid={`button-toggle-explanation-${clause.id}`}
              >
                {isExpanded ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Hide explanation
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Explain this clause
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Explanation Panel */}
          {isExpanded && (
            <div 
              className={`mt-3 p-4 ${config.panelClass} border rounded-lg explanation-panel`}
              data-testid={`explanation-panel-${clause.id}`}
            >
              {/* Simplified Version */}
              <div className="mb-3">
                <h4 className={`font-medium ${config.titleClass} mb-2`}>
                  Simplified version:
                </h4>
                <p className={`text-sm ${config.textClass}`} data-testid={`text-clause-simplified-${clause.id}`}>
                  {clause.simplifiedText}
                </p>
              </div>

              {/* What this means for you */}
              <div className="mb-3">
                <h4 className={`font-medium ${config.titleClass} mb-2`}>
                  What this means for you:
                </h4>
                <p className={`text-sm ${config.textClass}`} data-testid={`text-clause-explanation-${clause.id}`}>
                  {clause.explanation}
                </p>
              </div>

              {/* Actionable Advice */}
              {clause.actionableAdvice && (
                <div>
                  <h4 className={`font-medium ${config.titleClass} mb-2`}>
                    Recommended action:
                  </h4>
                  <p className={`text-sm ${config.textClass}`} data-testid={`text-clause-advice-${clause.id}`}>
                    {clause.actionableAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
