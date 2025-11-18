import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/**
 * Renders each page of a PDF file into a base64 encoded JPEG image.
 * @param file The PDF file to process.
 * @returns A promise that resolves to an array of base64 encoded image strings.
 */
export const renderPdfPagesAsImages = async (file: File): Promise<string[]> => {
  const fileReader = new FileReader();
  
  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file"));
      }
      
      const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
      
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const imagePromises: Promise<string>[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const pagePromise = pdf.getPage(i).then(async (page: any) => {
            const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR quality
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            if (!context) {
              throw new Error('Could not get canvas context');
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            // Return the image as a data URL (base64)
            return canvas.toDataURL('image/jpeg', 0.95); // High quality JPEG
          });
          imagePromises.push(pagePromise);
        }

        const images = await Promise.all(imagePromises);
        resolve(images.filter(img => img)); // Filter out any potential nulls/undefined
      } catch (error) {
        console.error("Error processing PDF to images:", error);
        reject(new Error("Could not process PDF into images. It might be corrupted or in an unsupported format."));
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error("Error reading file."));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
};
