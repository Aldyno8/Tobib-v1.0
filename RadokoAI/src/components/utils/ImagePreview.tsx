
import { Dialog, DialogTrigger, DialogContent} from "@/components/ui/dialog";

// @ts-ignore
const ImagePreview = ({ fileURL }) => (
  <Dialog>
    <DialogTrigger asChild>
      <img src={fileURL} alt="uploaded" className="w-20 h-auto rounded-lg cursor-pointer" />
    </DialogTrigger>
    <DialogContent className="p-10 max-w-2xl">
    <img src={fileURL} alt="enlarged" className="w-full h-auto" />
    </DialogContent>
  </Dialog>
);

export default ImagePreview;
