import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Target, Info, MessageCircle, DollarSign, BookOpen, Smile } from "lucide-react";

interface PromptGoalsProps {
  onGoalChange: (goal: string | null) => void;
  className?: string;
}

const promptGoals = [
  {
    id: 'inform',
    label: 'Inform',
    description: 'Educate and provide clear information',
    icon: Info,
    color: 'bg-blue-500 hover:bg-blue-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'persuade',
    label: 'Persuade',
    description: 'Convince and influence decisions',
    icon: MessageCircle,
    color: 'bg-orange-500 hover:bg-orange-600',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'entertain',
    label: 'Entertain',
    description: 'Engage and delight the audience',
    icon: Smile,
    color: 'bg-pink-500 hover:bg-pink-600',
    borderColor: 'border-pink-200',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'sell',
    label: 'Sell',
    description: 'Drive sales and conversions',
    icon: DollarSign,
    color: 'bg-green-500 hover:bg-green-600',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50'
  },
  {
    id: 'educate',
    label: 'Educate',
    description: 'Teach and develop skills',
    icon: BookOpen,
    color: 'bg-purple-500 hover:bg-purple-600',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50'
  }
];

export function PromptGoals({ onGoalChange, className = '' }: PromptGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleGoalSelect = (goalId: string) => {
    const newGoal = selectedGoal === goalId ? null : goalId;
    setSelectedGoal(newGoal);
    onGoalChange(newGoal);
  };

  return (
    <Card className={`border border-purple-200 bg-purple-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-purple-900 flex items-center">
          <Target className="mr-2" size={18} />
          Prompt Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-purple-800 mb-3 block">
            What do you want your AI result to do?
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {promptGoals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.id;
              
              return (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${isSelected 
                      ? `${goal.borderColor} ${goal.bgColor} ring-2 ring-purple-300` 
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      p-2 rounded-full text-white
                      ${isSelected ? goal.color : 'bg-gray-400'}
                    `}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`
                        font-medium text-sm
                        ${isSelected ? 'text-purple-900' : 'text-gray-900'}
                      `}>
                        {goal.label}
                      </h4>
                      <p className={`
                        text-xs mt-1 leading-relaxed
                        ${isSelected ? 'text-purple-700' : 'text-gray-600'}
                      `}>
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedGoal && (
          <div className="pt-3 border-t border-purple-200">
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
                Goal: {promptGoals.find(g => g.id === selectedGoal)?.label}
              </Badge>
            </div>
          </div>
        )}

        <div className="text-xs text-purple-600 leading-relaxed">
          <strong>Why goals matter:</strong> Defining your goal helps the AI understand the desired outcome and adjust tone, structure, and content accordingly for maximum effectiveness.
        </div>
      </CardContent>
    </Card>
  );
}