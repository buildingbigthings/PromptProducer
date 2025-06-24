import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { promptTemplates } from "@/data/templates";
import { DescriptionInput } from "@/components/shared/description-input";
import { Edit, Twitter, FeatherIcon, Megaphone, Mail, Plus, Lightbulb, Video, Code, User, Book, ChevronDown, ChevronUp, Calendar, ShoppingCart, Heart, Brain, Users, MapPin, Headphones } from "lucide-react";

const iconMap = {
  'edit': Edit,
  'twitter': Twitter,
  'feather-alt': FeatherIcon,
  'bullhorn': Megaphone,
  'envelope': Mail,
  'plus': Plus,
  'lightbulb': Lightbulb,
  'video': Video,
  'code': Code,
  'user': User,
  'book': Book,
  'headphones': Headphones,
  'calendar': Calendar,
  'shopping-cart': ShoppingCart,
  'heart': Heart,
  'brain': Brain,
  'megaphone': Megaphone,
  'list-ordered': Edit,
  'users': Users,
  'map-pin': MapPin
};

export default function Home() {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  
  // Split templates: first 12 vs remaining
  const visibleTemplates = promptTemplates.slice(0, 12);
  const hiddenTemplates = promptTemplates.slice(12);

  return (
    <div className="space-y-12">
      {/* Main Intro */}
      <div className="text-center">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          You can either start with a description or pick from categories below.
        </p>
      </div>

      {/* Open Prompt Mode Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Start with a Description</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what you need and we'll help you build the perfect prompt.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <DescriptionInput />
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center">
        <Separator className="flex-1" />
        <span className="px-6 text-gray-500 font-medium">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Category Selection Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose from Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a predefined category below for structured prompt generation.
          </p>
        </div>

        {/* Always visible categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTemplates.map((template) => {
            const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Edit;
            
            if (template.available) {
              return (
                <Link key={template.id} to={`/form/${template.id}`} className="group cursor-pointer">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <IconComponent className="text-white" size={20} />
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Available
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            }

            return (
              <Card key={template.id} className="bg-gray-50 border-2 border-gray-200 opacity-60 cursor-not-allowed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-white" size={20} />
                    </div>
                    <Badge variant="secondary" className="bg-gray-200 text-gray-500">
                      Coming Soon
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm">{template.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* More Categories Toggle Button */}
        {hiddenTemplates.length > 0 && (
          <div className="text-center pt-4">
            <Button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
            >
              {showMoreCategories ? (
                <>
                  <ChevronUp className="mr-2" size={16} />
                  Hide More Categories
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2" size={16} />
                  Show More Categories ({hiddenTemplates.length})
                </>
              )}
            </Button>
          </div>
        )}

        {/* Expandable categories section */}
        {showMoreCategories && hiddenTemplates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            {hiddenTemplates.map((template) => {
              const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Edit;
              
              if (template.available) {
                return (
                  <Link key={template.id} to={`/form/${template.id}`} className="group cursor-pointer">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-green-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                            <IconComponent className="text-white" size={20} />
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Available
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }

              return (
                <Card key={template.id} className="bg-gray-50 border-2 border-gray-200 opacity-60 cursor-not-allowed">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-500">
                        Coming Soon
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">{template.name}</h3>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* More Categories Placeholder - only show when expanded if there are no more templates */}
        {showMoreCategories && hiddenTemplates.length === 0 && (
          <Card className="bg-gray-50 border-2 border-gray-200 border-dashed opacity-40 cursor-not-allowed">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                  <Plus className="text-gray-500" size={20} />
                </div>
                <Badge variant="secondary" className="bg-gray-200 text-gray-500">
                  More Soon
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">More Categories</h3>
              <p className="text-gray-400 text-sm">
                Additional prompt categories will be added based on user feedback and demand.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
