"use client";

import PDF from "@/components/pdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Signature, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function Home() {
  let reader: FileReader;
  const upTrig = useRef<HTMLButtonElement>(null);
  if (typeof window !== "undefined") reader = new FileReader();

  const [pdfData, setPDFData] = useState<typeof reader.result>(null);

  return (
    <div className="h-screen content-center">
      <div className="flex justify-center gap-2">
        <Dialog>
          <DialogTrigger asChild ref={upTrig}>
            <Button className="text-xl">
              <Upload />
              <Separator className="m-2" orientation="vertical" />
              Subir PDF
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex place-items-center gap-1">
                <FileText />
                Subir un documento
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <Input
                onChange={(e) => {
                  reader.onload = () => {
                    setPDFData(reader.result);
                    upTrig.current?.click(); // close dialog
                  };
                  if (e.target.files) {
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                accept="application/pdf"
                id="pdf"
                type="file"
              />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-xl">
              <Signature />
              <Separator className="m-2" orientation="vertical" />
              Firmar PDF
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Acción</DialogTitle>
              <DialogDescription>
                Sube primero tu documento para poder continuar con la firma.
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="pdf">Picture</Label>
            <Input id="pdf" type="file" />
          </DialogContent>
        </Dialog>
      </div>
      {pdfData && <PDF file={pdfData} />}
    </div>
  );
}
