"use client";
import { MessageTemplate } from "@/types/template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TemplateCardProps {
  template: MessageTemplate;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (id: string) => void;
  onSelect: (template: MessageTemplate) => void;
  isSelected: boolean;
}

export function TemplateCard({ template, onEdit, onDelete, onSelect, isSelected }: TemplateCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-elevated ${
        isSelected ? "ring-2 ring-primary shadow-elevated" : "shadow-card"
      }`}
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              Updated {new Date(template.updatedAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(template)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(template.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{template.message}</p>
      </CardContent>
    </Card>
  );
}
