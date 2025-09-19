import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Loader2 } from "lucide-react";

interface AuthModalProps {
  children: React.ReactNode;
}

const AuthModal = ({ children }: AuthModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
   const [confirmationEmail, setConfirmationEmail] = useState("");
    const { signIn, signUp, resendConfirmation } = useAuth();
  const { toast } = useToast();

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(signInForm.email, signInForm.password);

      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("confirm")) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and confirm your account before signing in.",
            variant: "destructive",
          });
          setConfirmationEmail(signInForm.email);
          setShowConfirmation(true);
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (signUpForm.password.length < 8) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signUpForm.password)) {
      toast({
        title: "Password too weak",
        description: "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signUpForm.email, signUpForm.password, signUpForm.fullName);

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email for a confirmation link before signing in.",
        });
        setShowConfirmation(true);
        setConfirmationEmail(signUpForm.email);
        // Don't close modal, show confirmation resend option
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await resendConfirmation(confirmationEmail);
      if (error) {
        toast({
          title: "Resend failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent!",
          description: "We've sent you another confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Resend failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setShowConfirmation(false);
    setConfirmationEmail("");
    setSignUpForm({ email: "", password: "", fullName: "" });
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to Sweet Shop</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={showConfirmation ? "confirmation" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="confirmation" disabled={!showConfirmation}>Confirm Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader className="text-center pb-4">
                <User className="mx-auto h-8 w-8 text-primary" />
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Welcome back! Please sign in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader className="text-center pb-4">
                <User className="mx-auto h-8 w-8 text-primary" />
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join Sweet Shop and start your sweet journey!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choose a password"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters with uppercase, lowercase, and number.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmation" className="space-y-4">
            <Card>
              <CardHeader className="text-center pb-4">
                <User className="mx-auto h-8 w-8 text-primary" />
                <CardTitle>Confirm Your Email</CardTitle>
                <CardDescription>
                  We've sent a confirmation link to your email. Please check your inbox and click the link to activate your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResendConfirmation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirmation-email">Email</Label>
                    <Input
                      id="confirmation-email"
                      type="email"
                      placeholder="Enter your email"
                      value={confirmationEmail}
                      onChange={(e) => setConfirmationEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Resend Confirmation Email
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowConfirmation(false);
                      resetModal();
                    }}
                  >
                    Back to Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;