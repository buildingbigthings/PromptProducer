import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import Home from './pages/Home';
import BlogForm from './pages/forms/BlogForm';
import EmailForm from './pages/forms/EmailForm';
import SocialForm from './pages/forms/SocialForm';
import CreativeWritingForm from './pages/forms/CreativeWritingForm';
import MarketingCopyForm from './pages/forms/MarketingCopyForm';
import IdeaGenerationForm from './pages/forms/IdeaGenerationForm';
import ScriptsForm from './pages/forms/ScriptsForm';
import CodeHelpForm from './pages/forms/CodeHelpForm';
import ResumeCVForm from './pages/forms/ResumeCVForm';
import LessonPlansForm from './pages/forms/LessonPlansForm';
import ImageGenerationForm from './pages/forms/ImageGenerationForm';
import VideoGenerationForm from './pages/forms/VideoGenerationForm';
import CustomerSupportForm from './pages/forms/CustomerSupportForm';
import CustomPromptForm from './pages/forms/CustomPromptForm';
import PromptHistory from "@/pages/prompt-history";
import OurWhy from './pages/info/OurWhy';
import UseCases from './pages/info/UseCases';
import Pricing from './pages/info/Pricing';
import FAQs from './pages/info/FAQs';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/form/blog-posts" element={<BlogForm />} />
                <Route path="/form/emails" element={<EmailForm />} />
                <Route path="/form/social-media" element={<SocialForm />} />
                <Route path="/form/creative-writing" element={<CreativeWritingForm />} />
                <Route path="/form/marketing-copy" element={<MarketingCopyForm />} />
                <Route path="/form/idea-generation" element={<IdeaGenerationForm />} />
                <Route path="/form/scripts" element={<ScriptsForm />} />
                <Route path="/form/code-help" element={<CodeHelpForm />} />
                <Route path="/form/resumes-cvs" element={<ResumeCVForm />} />
                <Route path="/form/lesson-plans" element={<LessonPlansForm />} />
                <Route path="/form/image-generation" element={<ImageGenerationForm />} />
                <Route path="/form/video-generation" element={<VideoGenerationForm />} />
                <Route path="/form/customer-support" element={<CustomerSupportForm />} />
                <Route path="/form/custom" element={<CustomPromptForm />} />
                <Route path="/history" element={<PromptHistory />} />
                <Route path="/our-why" element={<OurWhy />} />
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
