/**
 * @module SocketUtilsTests
 * @description Unit tests for socket helper functions, including error interception and safe file deletion.
 */

import fs from 'fs';
import { interceptMarsError, safeDeleteFile } from '../../src/sockets/utils.js';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    unlink: jest.fn()
  }
}));

describe('Socket Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('interceptMarsError', () => {
    it('should return the original string if no memory access violation is detected', () => {
      const buffer = Buffer.from('Standard syntax error on line 5');
      const result = interceptMarsError(buffer);
      expect(result).toBe('Standard syntax error on line 5');
    });

    it('should append a troubleshooting hint if a null pointer jump is detected', () => {
      const buffer = Buffer.from('Error: jump to 0x00000000');
      const result = interceptMarsError(buffer);
      expect(result).toContain('jump to 0x00000000');
      expect(result).toContain('[PISTA]: MARS intentó saltar a 0');
    });
  });

  describe('safeDeleteFile', () => {
    it('should delete the file if it exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

      await safeDeleteFile('dummy/path.s');

      expect(fs.existsSync).toHaveBeenCalledWith('dummy/path.s');
      expect(fs.promises.unlink).toHaveBeenCalledWith('dummy/path.s');
    });

    it('should do nothing if the file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await safeDeleteFile('dummy/path.s');

      expect(fs.existsSync).toHaveBeenCalledWith('dummy/path.s');
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });

    it('should fail silently if fs.unlink throws an error', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockRejectedValue(new Error('Locked'));

      await expect(safeDeleteFile('dummy/path.s')).resolves.not.toThrow();
    });
  });
});