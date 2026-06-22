// import { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { type Area } from 'react-easy-crop';
import 'react-image-crop/dist/ReactCrop.css';


const OUTPUT_SIZE = 500; // final image will always be 500x500px

export async function getCroppedImageFile(
  imageSrc: string,
  cropArea: Area,
  fileName = 'cropped-image.jpg'
): Promise<File> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.9);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}