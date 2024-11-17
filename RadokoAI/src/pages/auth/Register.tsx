import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormEvent, useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "@/context/AuthContext.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Register() {

  const { registerUser } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [smoker, setSmoker] = useState(false);
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsErrorDialogOpen(true);
      setTimeout(() => {
          setIsErrorDialogOpen(false);
        }, 2000);
      return;
    }
    const userData = {
      username,
      email,
      password,
      age,
      sex,
      weight,
      smoker: smoker ? "Y" : "N",
      exercise_frequency: exerciseFrequency,
      symptoms,
      medical_history: medicalHistory,
      profile_picture: profilePicture,
    };

    try {
        const result = await registerUser(userData);

        if (result?.error) {
            let errorMessage = 'Unknown error';
            if (result.error.email) {
                errorMessage = result.error.email[0];
            } else if (result.error.username) {
                errorMessage = result.error.username[0];
            }
            setErrorMessage(errorMessage);
            setIsErrorDialogOpen(true);
            setTimeout(() => {
                setIsErrorDialogOpen(false);
            }, 2000);
        } else {
            setIsSuccessDialogOpen(true);
            setTimeout(() => {
                setIsSuccessDialogOpen(false);
                navigate("/advices");
            }, 2000);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        setErrorMessage("Registration failed. Please try again.");
        setIsErrorDialogOpen(true);
        setTimeout(() => {
            setIsErrorDialogOpen(false);
        }, 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successful</DialogTitle>
            <DialogDescription>
              Your account has been created successfully. Redirecting to dashboard...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Failed</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <form className={"mt-14 h-screen lg:h-auto "} onSubmit={handleSubmit}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">S'inscrire</CardTitle>
            <CardDescription>
            Entrez vos informations pour créer un compte

            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">Pseudo</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Anicet" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <div className="grid gap-2 relative">
                <Label htmlFor="confirm-password">Confirmer votre mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Mot de passe de confirmation"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute inset-y-0 right-0 flex items-center px-2"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} placeholder="Age" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sex">Sex</Label>
                <Select id="sex" value={sex} onValueChange={setSex} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner votre genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Homme</SelectItem>
                    <SelectItem value="F">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Poids</Label>
                <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="60" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smoker">Fummeur </Label>
                <Checkbox id="smoker" checked={smoker} onCheckedChange={setSmoker} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exerciseFrequency">Fréquence d'exercice</Label>
                <Input id="exerciseFrequency" value={exerciseFrequency} onChange={(e) => setExerciseFrequency(e.target.value)} placeholder="2" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="symptoms">Symptômes</Label>
                <Input id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="fièvre, migraine, ..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medicalHistory">Antécédent médical</Label>
                <Input id="medicalHistory" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="cancer, sida, " />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile_picture">Photo de profile</Label>
                <Input id="profile_picture" type="file" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Créer une compte
            </Button>

            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link to={"/login"} className="underline">
                Se connecter
              </Link>
            </div>

          </CardContent>
        </Card>
      </form>
    </>
  );
}