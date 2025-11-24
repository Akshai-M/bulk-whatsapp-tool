"use client";
import { useState, useEffect } from "react";
import { MessageTemplate } from "@/types/template";
import { TemplateCard } from "@/components/TemplateCard";
import { TemplateDialog } from "@/components/TemplateDialog";
import { AITemplateChat } from "@/components/AITemplateChat";
import { SendMessagePanel } from "@/components/SendMessagePanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MessageSquare, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "whatsapp-templates";

const Index = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTemplates(JSON.parse(stored));
    }
  }, []);

  const saveTemplates = (newTemplates: MessageTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
  };

  const handleCreateTemplate = (templateData: Omit<MessageTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: MessageTemplate = {
      ...templateData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTemplates([...templates, newTemplate]);
    toast({
      title: "Template created",
      description: `"${newTemplate.name}" has been created successfully`,
    });
  };

  const handleUpdateTemplate = (templateData: Omit<MessageTemplate, "id" | "createdAt" | "updatedAt">) => {
    if (!editingTemplate) return;
    
    const updatedTemplates = templates.map((t) =>
      t.id === editingTemplate.id
        ? { ...t, ...templateData, updatedAt: new Date().toISOString() }
        : t
    );
    saveTemplates(updatedTemplates);
    
    if (selectedTemplate?.id === editingTemplate.id) {
      setSelectedTemplate(updatedTemplates.find(t => t.id === editingTemplate.id) || null);
    }
    
    toast({
      title: "Template updated",
      description: `"${templateData.name}" has been updated successfully`,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    saveTemplates(templates.filter((t) => t.id !== id));
    
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null);
    }
    
    toast({
      title: "Template deleted",
      description: `"${template?.name}" has been deleted`,
    });
  };

  const handleEditClick = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTemplate(undefined);
    }
  };

  const handleAISaveTemplate = (name: string, content: string) => {
    const newTemplate: MessageTemplate = {
      id: crypto.randomUUID(),
      name,
      message: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTemplates([...templates, newTemplate]);
    toast({
      title: "Template created",
      description: `"${name}" has been created successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-200/40">
      {/* Header */}
      <header className="bg-green-500 shadow-xl text-white">
        <div className="max-w-11/12 mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">WhatsApp Auto Message</h1>
                <p className="text-sm opacity-90">Manage and send message templates</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setAiChatOpen(true)}
                size="lg"
                className="shadow-lg bg-white text-green-800 rounded-lg  hover:bg-green-100"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Generate
              </Button>
              <Button
                onClick={() => {
                  setEditingTemplate(undefined);
                  setDialogOpen(true);
                }}
                size="lg"
                className="shadow-lg bg-white text-green-800 rounded-lg  hover:bg-green-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-11/12">
        <div className="grid lg:grid-cols-3 gap-6 ">
          {/* Templates Section */}
          <div className="lg:col-span-2 space-y-4 ">
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-semibold">Your Templates</h2>
              <span className="text-sm text-muted-foreground">
                {templates.length} {templates.length === 1 ? "template" : "templates"}
              </span>
            </div>
            
            {templates.length === 0 ? (
              <Card className="bg-white p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first message template to get started
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteTemplate}
                    onSelect={setSelectedTemplate}
                    isSelected={selectedTemplate?.id === template.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Send Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SendMessagePanel selectedTemplate={selectedTemplate} />
            </div>
          </div>
        </div>
      </main>

      {/* Template Dialog */}
      <TemplateDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        template={editingTemplate}
      />

      {/* AI Template Chat */}
      <AITemplateChat
        open={aiChatOpen}
        onOpenChange={setAiChatOpen}
        onSaveTemplate={handleAISaveTemplate}
      />
    </div>
  );
};

export default Index;
