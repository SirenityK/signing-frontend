"use client";

import {
  ArrowLeftToLine,
  ArrowRightToLine,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./pdf.css";
import { Button } from "./ui/button";

if (typeof window !== "undefined")
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDF({ file }: { file: string | ArrayBuffer }) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [renderedPageNumber, setRenderedPageNumber] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // reset page number, avoid out of bounds
  }

  const isLoading = renderedPageNumber !== pageNumber;

  return (
    <Document
      className="my-4 grid justify-center"
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      <div className="outline dark:outline-slate-800">
        {/* This trick avoids flashing when changing pages */}
        {isLoading &&
          (renderedPageNumber ?? (
            <Page
              key={renderedPageNumber}
              className="prevPage"
              pageNumber={renderedPageNumber}
            />
          ))}
        <Page
          key={pageNumber}
          pageNumber={pageNumber}
          onRenderSuccess={() => setRenderedPageNumber(pageNumber)}
        />
        <div className="grid w-full grid-flow-col place-items-center">
          {numPages > 1 && (
            <div className="justify-self-start">
              <Button
                className="rounded-none"
                onClick={() => {
                  setPageNumber(1);
                }}
              >
                <ArrowLeftToLine />
              </Button>
              <Button
                className="justify-self-start rounded-none"
                onClick={() => {
                  if (pageNumber > 1) setPageNumber(pageNumber - 1);
                  else if (pageNumber == 1) setPageNumber(numPages);
                }}
              >
                <MoveLeft />
              </Button>
            </div>
          )}
          {numPages > 1 ? (
            <div className="flex justify-self-center px-4">
              <p>Página</p>
              <input
                className="mx-2 appearance-none px-1 outline-none"
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  setPageNumber(
                    e.target.valueAsNumber ? e.target.valueAsNumber : 1,
                  );
                }}
              />
              <p>de {numPages}</p>
            </div>
          ) : (
            <p>
              Página {pageNumber} de {numPages}
            </p>
          )}
          {numPages > 1 && (
            <div className="justify-self-end">
              <Button
                className="rounded-none"
                onClick={() => {
                  if (pageNumber < numPages) setPageNumber(pageNumber + 1);
                  else if (pageNumber == numPages) setPageNumber(1);
                }}
              >
                <MoveRight />
              </Button>
              <Button
                className="rounded-none"
                onClick={() => {
                  setPageNumber(numPages);
                }}
              >
                <ArrowRightToLine />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Document>
  );
}
