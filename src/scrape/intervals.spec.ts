// tslint:disable:no-duplicate-string
import { cleanTags, constructPoints, getPositionAndName } from './intervals';

describe('cleanTags()', () => {
  it('should parse input', () => {
    const pre = `
                                  1. [101]   2. [047]   3. [046]   Resultat
    1. Sssssss Ssss                1-06:01    1-13:34    1-19:07      39:20
                                   1-06:01    1-07:33    1-05:33           
    2. Sssssss Sssss               6-07:04    2-14:48    2-20:35      42:50
                                   6-07:04    2-07:44    2-05:47           `;

    expect(cleanTags(pre)).toEqual([
      ['1. [101]', '2. [047]', '3. [046]', 'Resultat'],
      ['1. Sssssss Ssss', '1-06:01', '1-13:34', '1-19:07', '39:20'],
      ['1-06:01', '1-07:33', '1-05:33'],
      ['2. Sssssss Sssss', '6-07:04', '2-14:48', '2-20:35', '42:50'],
      ['6-07:04', '2-07:44', '2-05:47'],
    ]);
  });

  it('should handle empty cells', () => {
    const pre = `
                                  1. [101]   2. [047]   3. [046]   Resultat
    1. Sssssss Ssss                1-06:01    1-13:34    1-19:07      39:20
                                   1-06:01               1-05:33           
    2. Sssssss Sssss                          2-14:48    2-20:35      42:50
                                   6-07:04    2-07:44                      `;

    expect(cleanTags(pre)).toEqual([
      ['1. [101]', '2. [047]', '3. [046]', 'Resultat'],
      ['1. Sssssss Ssss', '1-06:01', '1-13:34', '1-19:07', '39:20'],
      ['1-06:01', '', '1-05:33'],
      ['2. Sssssss Sssss', '', '2-14:48', '2-20:35', '42:50'],
      ['6-07:04', '2-07:44', ''],
    ]);
  });

  it('should handle empty rows in middle', () => {
    const pre = `
                                  1. [101]   2. [047]   3. [046]   Resultat
    1. Sssssss Ssss                                                   39:20
                                                                           
    2. Sssssss Sssss               6-07:04    2-14:48    2-20:35      42:50
                                   6-07:04    2-07:44    2-05:47           `;

    expect(cleanTags(pre)).toEqual([
      ['1. [101]', '2. [047]', '3. [046]', 'Resultat'],
      ['1. Sssssss Ssss', '', '', '', '39:20'],
      ['', '', ''],
      ['2. Sssssss Sssss', '6-07:04', '2-14:48', '2-20:35', '42:50'],
      ['6-07:04', '2-07:44', '2-05:47'],
    ]);
  });
});

describe('constructPoints()', () => {
  it('should parse points', () => {
    const row = ['1. [035]', '14. [031]', '15. [100]', 'Resultat'];

    expect(constructPoints(row)).toEqual([
      { position: 1, identifier: '035' },
      { position: 14, identifier: '031' },
      { position: 15, identifier: '100' },
    ]);
  });
});

describe('getPositionAndName()', () => {
  it('should handle position and name', () => {
    expect(getPositionAndName('1. John Doe')).toEqual({ position: 1, name: 'John Doe' });
  });

  it('should handle only name', () => {
    expect(getPositionAndName('John Doe')).toEqual({ position: null, name: 'John Doe' });
  });

  it('should handle long names', () => {
    expect(getPositionAndName('112. John Doe-mc asdf')).toEqual({
      name: 'John Doe-mc asdf',
      position: 112,
    });
  });
});
