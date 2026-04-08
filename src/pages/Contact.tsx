import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Contact Us</h1>
            <p className="text-sm text-muted-foreground">We'd love to hear from you</p>
          </div>
        </div>

        {sent ? (
          <div className="py-10 text-center">
            <span className="text-5xl">🎉</span>
            <h2 className="mt-4 font-display text-xl font-bold text-foreground">Thank you!</h2>
            <p className="mt-2 text-muted-foreground">Your message has been received. We'll respond shortly.</p>
            <Button onClick={() => setSent(false)} variant="outline" className="mt-6">Send Another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" required placeholder="Your name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" required placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="c-msg">Message</Label>
              <Textarea id="c-msg" required placeholder="How can we help?" className="mt-1" rows={4} />
            </div>
            <Button type="submit" className="w-full gradient-saffron text-primary-foreground border-0 gap-2 font-semibold">
              <Send size={16} /> Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
