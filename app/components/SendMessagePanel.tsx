"use client";
import { useState } from "react";
import { MessageTemplate } from "@/types/template";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, Users, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendMessagePanelProps {
  selectedTemplate: MessageTemplate | null;
}

export function SendMessagePanel({ selectedTemplate }: SendMessagePanelProps) {
  const [sendMode, setSendMode] = useState<"single" | "bulk">("single");
  const [contacts, setContacts] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!selectedTemplate) {
      toast({
        title: "No template selected",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

    if (!contacts.trim()) {
      toast({
        title: "No contacts provided",
        description: "Please enter at least one phone number",
        variant: "destructive",
      });
      return;
    }

    const phoneNumbers = contacts
      .split("\n")
      .map((num) => num.trim().replace(/\D/g, ""))
      .filter((num) => num.length > 0);

    if (phoneNumbers.length === 0) {
      toast({
        title: "Invalid phone numbers",
        description: "Please enter valid phone numbers",
        variant: "destructive",
      });
      return;
    }

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(selectedTemplate.message);

    if (sendMode === "single" && phoneNumbers.length > 0) {
      // Open WhatsApp with single number
      const whatsappUrl = `https://wa.me/${phoneNumbers[0]}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
      
      toast({
        title: "Opening WhatsApp",
        description: "Message ready to send",
      });
    } else {
      // For bulk sending, open windows recursively to avoid popup blocking
      let currentIndex = 0;
      
      const openNext = () => {
        if (currentIndex < phoneNumbers.length) {
          const whatsappUrl = `https://wa.me/${phoneNumbers[currentIndex]}?text=${encodedMessage}`;
          const newWindow = window.open(whatsappUrl, "_blank");
          
          if (!newWindow) {
            toast({
              title: "Popup Blocked",
              description: "Please allow popups and try again",
              variant: "destructive",
            });
            return;
          }
          
          currentIndex++;
          
          // Open next after delay
          if (currentIndex < phoneNumbers.length) {
            setTimeout(openNext, 2000);
          } else {
            toast({
              title: "All Messages Opened",
              description: `Opened ${phoneNumbers.length} WhatsApp conversations`,
            });
          }
        }
      };
      
      openNext();
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Send Message
        </CardTitle>
        <CardDescription>
          {selectedTemplate ? `Using template: ${selectedTemplate.name}` : "Select a template to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Send Mode</Label>
          <RadioGroup value={sendMode} onValueChange={(value) => setSendMode(value as "single" | "bulk")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className="flex items-center gap-2 cursor-pointer font-normal">
                <User className="h-4 w-4" />
                Single Send
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bulk" id="bulk" />
              <Label htmlFor="bulk" className="flex items-center gap-2 cursor-pointer font-normal">
                <Users className="h-4 w-4" />
                Bulk Send
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacts">
            {sendMode === "single" ? "Phone Number" : "Phone Numbers"}
          </Label>
          <Textarea
            id="contacts"
            placeholder={
              sendMode === "single"
                ? "Enter phone number (e.g., +1234567890)"
                : "Enter phone numbers, one per line\n+1234567890\n+0987654321"
            }
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            rows={sendMode === "single" ? 2 : 6}
            className="resize-none font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {sendMode === "bulk" ? "One number per line" : "Include country code"}
          </p>
        </div>

        {selectedTemplate && (
          <div className="space-y-2">
            <Label>Message Preview</Label>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm whitespace-pre-wrap">{selectedTemplate.message}</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSend}
          disabled={!selectedTemplate || !contacts.trim()}
          className="w-full gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Send className="h-4 w-4 mr-2" />
          {sendMode === "single" ? "Send Message" : "Send to All"}
        </Button>
      </CardContent>
    </Card>
  );
}
