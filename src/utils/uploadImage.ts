import { supabase } from "../lib/supabase";
import { compressImage } from "./compressImage";

/**
 * Faz upload da imagem para o Supabase Storage
 * - Comprime antes de enviar
 * - Retorna a URL pública
 */
export async function uploadImage(file: File): Promise<string | null> {
  try {
    // 🔹 Comprime antes de subir
    const compressedFile = await compressImage(file);

    // 🔹 Cria um nome único para o arquivo
    const fileExt = compressedFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // 🔹 Envia para o bucket "aniversariantes"
    const { error } = await supabase.storage
      .from("aniversariantes")
      .upload(fileName, compressedFile, {
        cacheControl: "3600",
        upsert: false, // não sobrescreve arquivos com mesmo nome
      });

    if (error) {
      console.error("Erro no upload:", error);
      return null;
    }

    // 🔹 Gera a URL pública
    const { data } = supabase.storage
      .from("aniversariantes")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error("Erro ao processar upload:", err);
    return null;
  }
}
