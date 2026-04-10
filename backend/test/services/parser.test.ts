/**
 * @module ParserServiceTests
 * @description Unit tests for the MIPS assembly code normalization and transpilation pipeline.
 */

import { normalizeSpimToMars } from '../../src/services/parser.js';

describe('Parser Service: normalizeSpimToMars', () => {
  it('should return an empty string if input is falsy', () => {
    expect(normalizeSpimToMars('')).toBe('');
    expect(normalizeSpimToMars(null as any)).toBe('');
  });

  it('should clean basic syntax (NBSP, $s8 to $fp, empty comments, split 64-bit words)', () => {
    const input = `move $s8, $sp\n\xA0addi $t0, 1;\n.word 0x123456789ABCDEF0`;
    const result = normalizeSpimToMars(input);
    
    expect(result).toContain('move $fp, $sp');
    expect(result).toContain(' addi'); 
    expect(result).not.toContain(';'); 
    expect(result).toContain('.word 0x12345678, 0x9ABCDEF0');
  });

  it('should inject the standardized print_matriz subroutine when detected', () => {
    const input = `print_matriz:\nsome old code\nprint_matriz__MARCAFIN:`;
    const result = normalizeSpimToMars(input);
    expect(result).toContain('str_matTiene'); 
  });

  it('should resolve IDE constants into their numeric values', () => {
    const input = `MAX_LIMIT = 50\naddi $t0, MAX_LIMIT`;
    const result = normalizeSpimToMars(input);
    // Evaluates both the constant resolution AND the addi shortcut expansion
    expect(result).toContain('addi $t0, $t0, 50');
    expect(result).not.toContain('MAX_LIMIT = 50');
  });

  it('should expand short-hand addi instructions', () => {
    const input = `addi $t0, 5`;
    const result = normalizeSpimToMars(input);
    expect(result).toContain('addi $t0, $t0, 5');
  });

  it('should extract inline floating-point loads into the .data section', () => {
    const input = `li.s $f0, 3.14\nli.d $f2, -1.5e2`;
    const result = normalizeSpimToMars(input);
    
    expect(result).toContain('.data');
    expect(result).toContain('.float 3.14');
    expect(result).toContain('.double -1.5e2');
    expect(result).toMatch(/l\.s \$f0, _auto_float_/);
    expect(result).toMatch(/l\.d \$f2, _auto_double_/);
  });

  it('should fix double-precision unaligned memory access', () => {
    const input = `l.d $f0, 8($sp)\ns.d $f2, ($a0)`;
    const result = normalizeSpimToMars(input);
    
    expect(result).toContain('lwc1 $f0, 8($sp)');
    expect(result).toContain('lwc1 $f1, 12($sp)');
    
    expect(result).toContain('swc1 $f2, 0($a0)');
    expect(result).toContain('swc1 $f3, 4($a0)');
  });

  it('should inject .text and jump instruction if main label is present', () => {
    const input = `main: \n addi $t0, $t0, 1`;
    const result = normalizeSpimToMars(input);
    expect(result).toMatch(/^\n\.text\nj main\n/);
  });
});