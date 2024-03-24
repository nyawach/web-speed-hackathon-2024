import { fileTypeFromBuffer } from 'file-type';

const SUPPORTED_FILE_TYPE_LABEL_LIST = ['bmp', 'jpeg', 'png', 'webp'];
const SUPPORTED_MIME_TYPE_LIST = ['image/bmp', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jxl'];

export async function isSupportedImage(image: File): Promise<boolean> {
  const fileType = await fileTypeFromBuffer(await image.arrayBuffer());
  if (fileType) {
    return SUPPORTED_FILE_TYPE_LABEL_LIST.includes(fileType.ext);
  }

  const mimeType = image.type;
  return SUPPORTED_MIME_TYPE_LIST.includes(mimeType);
}
