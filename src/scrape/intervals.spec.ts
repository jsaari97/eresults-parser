// tslint:disable:no-duplicate-string
import { cleanTags, constructPoints, getPositionAndName } from './intervals';

describe('cleanTags()', () => {
  it('should return right stuff', () => {
    const pre = `1. John Doe 1-02.30 - 2-07.22\r\n\r 1-05.30 2-20.56Ingen sluttid\r\n
    \r 1-05.30 2-20.56 Ingen sluttid\r\n\r 1-05.30 2-20.56   Ingen sluttid\r\n\r
    2. John-Doe Doe 1-05.30 2-20.56 Ingen sluttid\r\n\r
    2. John-Doe Doe-Doe 1-05.30 2-20.56 Ingen sluttid`;
    expect(cleanTags(pre)).toEqual([
      ['1. John Doe', '1-02.30', '-', '2-07.22'],
      ['1-05.30', '2-20.56', 'Ingen sluttid'],
      ['1-05.30', '2-20.56', 'Ingen sluttid'],
      ['1-05.30', '2-20.56', 'Ingen sluttid'],
      ['2. John-Doe Doe', '1-05.30', '2-20.56', 'Ingen sluttid'],
      [],
      ['2. John-Doe Doe-Doe', '1-05.30', '2-20.56', 'Ingen sluttid']
    ]);
  });

  it('should handle empty rows correctly', () => {
    const pre = `21. Ssss Ssss                             -          -          -          -Ingen sluttid\r\n\r
    -          -          -          -`;

    expect(cleanTags(pre)).toEqual([
      ['21. Ssss Ssss', '-', '-', '-', '-', 'Ingen sluttid'],
      ['-', '-', '-', '-']
    ]);
  });

  it('should handle empty rows in middle', () => {
    const pre =
      '9. Sss Sss-Ssss     3-04:26    5-09:13      59:44\r\n        3-04:26   12-04:47           \r\n  10. Ssss Ssssss       1:00:29\r\n    \r\n  11. Sss Ssss           19-05:29   20-10:46    1:00:37\r\n    19-05:29   20-05:17     \r\n';

    expect(cleanTags(pre)).toEqual([
      ['9. Sss Sss-Ssss', '3-04:26', '5-09:13', '59:44'],
      ['3-04:26', '12-04:47'],
      ['10. Ssss Ssssss', '1:00:29'],
      [],
      ['11. Sss Ssss', '19-05:29', '20-10:46', '1:00:37'],
      ['19-05:29', '20-05:17']
    ]);
  });
});

describe('constructPoints()', () => {
  it('should parse points', () => {
    const row = ['1. [035]', '14. [031]', '15. [100] Resultat'];

    expect(constructPoints(row)).toEqual([
      { position: 1, identifier: '035' },
      { position: 14, identifier: '031' },
      { position: 15, identifier: '100' }
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
      position: 112
    });
  });
});
