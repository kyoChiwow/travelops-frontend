import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function ImagePreview({ src }: { src: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt="preview"
          className="w-24 h-24 object-cover cursor-pointer rounded-md"
        />
      </DialogTrigger>

      <DialogContent className="xl:max-w-250! lg:max-w-200! p-2">
        <img src={src} alt="full" className="w-full h-auto rounded-md" />
      </DialogContent>
    </Dialog>
  );
}
