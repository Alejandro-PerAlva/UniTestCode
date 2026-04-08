import fs from 'fs';

export const interceptMarsError = (data: Buffer): string => {
  let errStr = data.toString();
  if (errStr.includes("0x00000000")) {
      errStr += "\n\x1b[33m[PISTA]: MARS intentó saltar a 0. Asegúrate de haber escrito la etiqueta correcta a trasplantar.\x1b[0m\n";
  }
  return errStr;
};

// Función atómica para borrar archivos temporales sin lanzar errores si ya no existen
export const safeDeleteFile = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    // Si el archivo ya se borró o está bloqueado, ignoramos para no tirar el servidor
  }
};