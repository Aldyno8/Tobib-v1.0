import { forwardRef, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

const Logout = forwardRef((props, ref) => {
    const { logoutUser } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState<string>('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const response = await logoutUser();

            if (response) {
                setDialogType('success');
                setDialogMessage('Déconnexion réussie.');
                setIsDialogOpen(true);

                setTimeout(() => {
                    setIsDialogOpen(false);
                    navigate('/'); // Redirection après 2 secondes
                }, 2000);
            } else {
                setDialogType('error');
                setDialogMessage('La déconnexion a échoué. Veuillez réessayer.');
                setIsDialogOpen(true);

                setTimeout(() => {
                    setIsDialogOpen(false);
                    setIsLoggingOut(false); // Réactiver le bouton après l'échec
                }, 2000);
            }

        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error);
            setDialogType('error');
            setDialogMessage('Une erreur est survenue. Veuillez réessayer.');
            setIsDialogOpen(true);

            setTimeout(() => {
                setIsDialogOpen(false);
                setIsLoggingOut(false);
            }, 2000);
        }
    };

    return (
        <>
            <Button
                ref={ref} {...props}
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant={"outline"}
                className="text-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? 'Loading...' : 'Logout'}</span>
            </Button>

            {/* Dialog de succès ou d'erreur */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === 'success' ? 'Success' : 'Error'}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogMessage}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
});

export default Logout;