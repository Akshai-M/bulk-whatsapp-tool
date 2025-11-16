"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";

interface AITemplateChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveTemplate: (name: string, content: string) => void;
}

export function AITemplateChat({ open, onOpenChange, onSaveTemplate }: AITemplateChatProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // const { data, error } = await supabase.functions.invoke('generate-template', {
      //   body: { prompt: prompt.trim() }
      // });

      // if (error) throw error;

      // if (data?.error) {
      //   toast({
      //     title: "Error",
      //     description: data.error,
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // setGeneratedContent(data.content);
      // toast({
      //   title: "Content generated",
      //   description: "AI has generated your template content",
      // });
    } catch (error) {
      console.error("Error generating template:", error);
      toast({
        title: "Error",
        description: "Failed to generate template content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!templateName.trim() || !generatedContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a template name and generate content first",
        variant: "destructive",
      });
      return;
    }

    onSaveTemplate(templateName.trim(), generatedContent.trim());
    setPrompt("");
    setGeneratedContent("");
    setTemplateName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Template Generator
          </DialogTitle>
          <DialogDescription>
            Describe what kind of message template you want, and AI will generate it for you
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Create a welcome message for new customers"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="gradient-primary"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {generatedContent && (
            <>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm whitespace-pre-wrap">{generatedContent}</p>
              </Card>

              <div className="grid gap-2">
                <Input
                  placeholder="Template name (e.g., Welcome Message)"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <Button 
                  onClick={handleSave}
                  disabled={!templateName.trim()}
                  className="gradient-primary"
                >
                  Save as Template
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
