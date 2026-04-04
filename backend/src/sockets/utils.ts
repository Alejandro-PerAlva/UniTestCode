export const interceptMarsError = (data: Buffer): string => {
  let errStr = data.toString();
  if (errStr.includes("0x00000000")) {
      errStr += "\n\x1b[33m[PISTA]: MARS intentó saltar a 0. Asegúrate de haber escrito la etiqueta correcta a trasplantar.\x1b[0m\n";
  }
  return errStr;
};