import { supabase } from "../lib/supabase";

/**
 * Extrai <bucket> e <path> de uma URL pública/assinada do Supabase.
 * Suporta:
 *  - .../storage/v1/object/public/<bucket>/<path>
 *  - .../storage/v1/object/authenticated/<bucket>/<path>
 *  - Em último caso, tenta usar apenas o "filename" final.
 */
function parseStorageUrl(url: string): { bucket: string; path: string } | null {
  try {
    // Tenta public/authenticated
    const m = url.match(/\/storage\/v1\/object\/(public|authenticated)\/([^/]+)\/(.+)$/);
    if (m) {
      const bucket = m[2];
      const path = decodeURIComponent(m[3]); // mantém subpastas se houver
      return { bucket, path };
    }

    // Fallback: usa bucket fixo e só o filename (último segmento)
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    if (!filename) return null;

    return { bucket: "aniversariantes", path: filename };
  } catch {
    return null;
  }
}

/**
 * Deleta uma imagem do Supabase Storage a partir da URL salva no banco.
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    if (!url) return false;

    const parsed = parseStorageUrl(url);
    if (!parsed) {
      console.error("Não foi possível extrair bucket/path da URL:", url);
      return false;
    }

    const { bucket, path } = parsed;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error("Erro ao deletar imagem do Storage:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Erro inesperado ao deletar imagem:", err);
    return false;
  }
}
