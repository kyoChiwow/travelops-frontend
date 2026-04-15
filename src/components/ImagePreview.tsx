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

      <DialogContent className="max-w-3xl p-2">
        <img src={src} alt="full" className="w-full h-auto rounded-md" />
      </DialogContent>
    </Dialog>
  );
}
