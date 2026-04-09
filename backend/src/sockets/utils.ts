/**
 * @module SocketUtilities
 * Provides helper functions for real-time socket operations, 
 * including file management and stream parsing.
 */

import fs from 'fs';

/**
 * Parses raw error buffers from the MARS simulator and appends user-friendly 
 * troubleshooting hints if specific memory access violations are detected.
 * * @param data - The raw stderr buffer stream emitted by the Java process.
 * @returns The parsed error string, potentially augmented with a Spanish hint for the user.
 */
export const interceptMarsError = (data: Buffer): string => {
  let errStr = data.toString();
  if (errStr.includes("0x00000000")) {
      errStr += "\n\x1b[33m[PISTA]: MARS intentó saltar a 0. Asegúrate de haber escrito la etiqueta correcta a trasplantar.\x1b[0m\n";
  }
  return errStr;
};

/**
 * Asynchronously attempts to delete a file at the specified path.
 * Fails silently to prevent server crashes if the file has already been deleted
 * or is currently locked by the operating system.
 * * @param filePath - The absolute path of the file to be removed.
 */
export const safeDeleteFile = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    // Fails silently to prevent race conditions during cleanup
  }
};