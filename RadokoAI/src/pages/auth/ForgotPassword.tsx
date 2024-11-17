import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"



export default  function ForgotPassword() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="ml-auto inline-block text-sm underline cursor-pointer ">Forgot your password?</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Forgot your password?</DialogTitle>
          <DialogDescription>
           Enter the email address associated with your account and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4">

              <Input
                  id="Email"
                  placeholder={"Email address"}
                  type={"email"}
              />
            </div>

          </div>


        <DialogFooter>
          <Button type="submit">Reset password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
