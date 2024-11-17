import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CloudDownload, Pencil, Pocket, UserRound, X} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useUserStore from "@/stores/userStore.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useToast} from "@/hooks/use-toast.ts";
import {Toaster} from "@/components/ui/toaster.tsx";


const UserProfile: React.FC = () => {
  const { user, fetchUserProfile, updateUserProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id:"",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
    website: "",
    role: "",
    date_of_birth: "",
    alternate_email: "",
    linkedin: "",
    profile_picture: null as string | File | null,
  });

  // New state to track the currently selected file
  const [tempProfilePicture, setTempProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      await fetchUserProfile();
    };
    fetchProfile();

  }, [fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });

    }
  }, [user]);



  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTempProfilePicture(e.target.files[0]); // Set the temporary file
    }
  };

  const handleFileSave = async () => {
    if (tempProfilePicture) {
      const updatedData = new FormData();
      updatedData.append('profile_picture', tempProfilePicture);

      try {
        await updateUserProfile(updatedData);
        setFormData({ ...formData, profile_picture: tempProfilePicture }); // Update the profile picture in formData
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Profile picture updated successfully.",
        });
      } catch (error) {
        console.error('Failed to update profile picture:', error);
        toast({
          title: "Error",
          description: "Failed to update profile picture. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (tempProfilePicture) {
        URL.revokeObjectURL(URL.createObjectURL(tempProfilePicture));
      }
    };
  }, [tempProfilePicture]);

  const handleSave = async () => {
    if (formData.username && formData.email) {
      const updatedData = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        if (value !== null) {
          if (key === 'profile_picture' && value instanceof File) {
            updatedData.append(key, value);
          } else if (key !== 'profile_picture') {
            updatedData.append(key, value as string);
          }
        }
      });

      try {
        await updateUserProfile(updatedData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
        });
      }
    } else {
      console.error('Validation failed: Missing required fields');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
    }
  };




  return (
    <div>
      <div className="px-4 space-y-6 md:px-6 mt-2 mb-2">
        <header className="space-y-1.5">
          <div className="flex items-center space-x-4" onClick={() => setIsDialogOpen(true)}>
            {formData.profile_picture ? (
              <img
                src={formData.profile_picture instanceof File ? URL.createObjectURL(formData.profile_picture) : formData.profile_picture}
                alt="you"
                className="w-24 h-24 border rounded-full object-cover cursor-pointer"
              />
            ) : (
              <UserRound className="w-24 h-24 border rounded-full" />
            )}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold">
                {formData.username || "You"}
              </h1>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>





            </div>
          </div>


        </div>

        <div className="mt-8  space-x-4">
          {isEditing ? (
              <div className="flex justify-end items-center space-x-4">
                <Button variant="destructive" onClick={handleEditToggle}>
                  <X/>
                </Button>
                <Button onClick={handleSave}>
                  <span className="mr-2">Save</span>
                  <Pocket/>
                </Button>
              </div>
          ) : (
              <div className={"flex justify-end"}>
                <Button size="lg" onClick={handleEditToggle} className={"space-x-2  "}>
                <span>Edit</span> <Pencil/>
              </Button>
              </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
            // When the dialog is closed, do not reset the profile picture
            setTempProfilePicture(formData.profile_picture instanceof File ? formData.profile_picture : null);
          }
          setIsDialogOpen(open);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change your profile picture</DialogTitle>
            </DialogHeader>
            <img
              src={
                tempProfilePicture
                  ? URL.createObjectURL(tempProfilePicture)
                  : formData.profile_picture
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-tl-lg rounded-tr-lg"
            />
            <div className="mt-4 flex flex-col items-start space-y-2">
              <Label
                htmlFor="profile_picture"
                className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2"
              >
                <CloudDownload />
                <span>Choose a new profile picture</span>
              </Label>
              <Input
                id="profile_picture"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="flex w-full justify-end mt-4">
              {tempProfilePicture && (
                  <Button onClick={handleFileSave} className={"space-x-2"}><span>Save</span> <Pocket /></Button>
              )}
            </div>
          </DialogContent>
        </Dialog>


      <Toaster/>
    </div>
  );
};

export default UserProfile;