import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImageFile } from './GetCroppedImage';

const CROP_SIZE = 300; // the fixed crop window size in px, shown on screen

export default function ImageUploadWithCrop({
  onCropComplete,
}: {
  onCropComplete: (file: File) => void;
}) {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // This only updates the PREVIEW source — not the final file your form will submit
  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('File input changed:', e.target.files);
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file);

    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onCropChange = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // This is where the swap happens — the ORIGINAL file is discarded,
  // and the cropped version becomes the file your form actually uses
  async function handleCropConfirm() {
    if (!croppedAreaPixels || !imgSrc) return;

    const croppedFile = await getCroppedImageFile(imgSrc, croppedAreaPixels);

    // Send the cropped file up to the parent — this REPLACES
    // whatever was originally selected in the <input type="file">
    onCropComplete(croppedFile);
    // Set image source to new cropped image for preview (optional)
    // setImgSrc(URL.createObjectURL(croppedFile));
    setImgSrc(''); // Clear the preview after cropping
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      {imgSrc && (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex flex-row items-center">
          <div className="relative flex items-center justify-center border border-gray-300" style={{ height: CROP_SIZE, width: CROP_SIZE }}>
            <Cropper
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropSize={{ width: CROP_SIZE, height: CROP_SIZE }}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropChange}
            />
          </div>
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />

          <button
            type="button"
            onClick={handleCropConfirm}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Confirm crop
          </button>
        </div>
      )}
    </div>
  );
}