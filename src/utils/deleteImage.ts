import { supabase } from "../lib/supabase";

/**
 * Deleta uma imagem do Supabase Storage
 * @param url URL pública salva no banco
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    if (!url) return false;

    // Extrai o nome do arquivo da URL pública
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    const { error } = await supabase.storage
      .from("aniversariantes")
      .remove([fileName]);

    if (error) {
      console.error("Erro ao deletar imagem:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Erro inesperado ao deletar imagem:", err);
    return false;
  }
}
