import imageCompression from "browser-image-compression";

/**
 * Comprime uma imagem antes do upload
 * - Reduz tamanho sem perder muita qualidade
 * - Retorna um File pronto para ser lido/salvo
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // limite de 1MB
    maxWidthOrHeight: 800, // redimensiona se passar de 800px
    useWebWorker: true, // usa Web Worker para não travar a UI
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Erro ao comprimir imagem:", error);
    return file; // fallback: retorna original se der erro
  }
}
