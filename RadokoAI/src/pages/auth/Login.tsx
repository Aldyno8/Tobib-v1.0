import { FormEvent, useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPassword from "@/pages/auth/ForgotPassword.tsx";
import { AuthContext } from "@/context/AuthContext.tsx";
import {
  Dialog,
  DialogContent, DialogDescription,

  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(AuthContext)!;
  const [credentials, setCredentials] = useState({ username_or_email: '', password: '' });
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);

       if (response?.error) {
            setDialogTitle('Login failed' )
            setDialogMessage(response.error );
            setDialogOpen(true);
            setTimeout(() => {
                setDialogOpen(false);
              }, 2000);
        }
      // @ts-ignore
      else {

         setDialogTitle('Success');
         setDialogMessage('Login successful!');
         setDialogOpen(true);
         setTimeout(() => {
           setDialogOpen(false);
           navigate('/advices');
         }, 2000);

       }


    } catch (error) {
      console.error("Login failed:", error);
      setDialogTitle('Error');
      setDialogMessage('Login failed. Please try again.');
      setDialogOpen(true);
      setTimeout(() => {
          setDialogOpen(false);
        }, 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <form className={"mt-10"} onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
            Entrez votre pseudo-nom ou votre adresse e-mail 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username_or_email">Pseudo ou  Email</Label>
                <Input
                  id="username_or_email"
                  type="text"
                  placeholder="Anicet ou anicet@example.com"
                  value={credentials.username_or_email}
                  onChange={(e) => setCredentials({ ...credentials, username_or_email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <ForgotPassword />
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute inset-y-0 right-0 flex items-center px-2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>

            </div>
            <div className="mt-4 text-center text-sm">
              Vous n'avez pas de compte ?{" "}
              <Link to={"/register"} className="underline">
                S'inscrire
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Dialog for success/error messages */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button style={{ display: 'none' }}>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>

        </DialogContent>
      </Dialog>
    </>
  );
}
