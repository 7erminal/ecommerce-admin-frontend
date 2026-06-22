import { useMemo, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImageFile } from './GetCroppedImage';

type ImageQueueItem = {
  id: string;
  src: string;
  name: string;
};

type CroppedImageItem = {
  id: string;
  file: File;
  previewUrl: string;
};

const CROP_SIZE = 300;

export default function MultiImageUploadWithCrop({
  onImagesChange,
}: {
  onImagesChange: (files: File[]) => void;
}) {
  const [queue, setQueue] = useState<ImageQueueItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImages, setCroppedImages] = useState<CroppedImageItem[]>([]);

  const activeItem = useMemo(() => queue.find((item) => item.id === activeId) || null, [queue, activeId]);

  const emitImages = (items: CroppedImageItem[]) => {
    onImagesChange(items.map((item) => item.file));
  };

  function onSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);
    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<ImageQueueItem>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
              resolve({ id, src: reader.result as string, name: file.name });
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((newItems) => {
      setQueue((prev) => {
        const updated = [...prev, ...newItems];
        if (!activeId && updated.length > 0) {
          setActiveId(updated[0].id);
        }
        return updated;
      });
    });

    e.target.value = '';
  }

  function onCropChange(_: Area, areaPixels: Area) {
    setCroppedAreaPixels(areaPixels);
  }

  async function handleCropConfirm() {
    if (!activeItem || !croppedAreaPixels) return;

    const croppedFile = await getCroppedImageFile(activeItem.src, croppedAreaPixels);
    const namedFile = new File([croppedFile], activeItem.name, { type: croppedFile.type });
    const previewUrl = URL.createObjectURL(namedFile);

    setCroppedImages((prev) => {
      const updated = [
        ...prev,
        {
          id: activeItem.id,
          file: namedFile,
          previewUrl,
        },
      ];
      emitImages(updated);
      return updated;
    });

    setQueue((prev) => {
      const updated = prev.filter((item) => item.id !== activeItem.id);
      setActiveId(updated.length > 0 ? updated[0].id : null);
      return updated;
    });

    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  function removeCroppedImage(id: string) {
    setCroppedImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const updated = prev.filter((item) => item.id !== id);
      emitImages(updated);
      return updated;
    });
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onSelectFiles}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      {activeItem ? (
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative flex items-center justify-center border border-gray-300"
            style={{ height: CROP_SIZE, width: CROP_SIZE }}
          >
            <Cropper
              image={activeItem.src}
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
            Confirm crop and add image
          </button>

          <p className="text-xs text-gray-500">
            Pending images: {queue.length}
          </p>
        </div>
      ) : null}

      {croppedImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {croppedImages.map((item) => (
            <div key={item.id} className="relative">
              <img src={item.previewUrl} alt="Cropped" className="w-full h-24 object-cover rounded-md border border-gray-200" />
              <button
                type="button"
                onClick={() => removeCroppedImage(item.id)}
                className="absolute top-1 right-1 text-xs bg-white border border-gray-300 rounded px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
