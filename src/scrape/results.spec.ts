// tslint:disable:no-identical-functions
import {
  resolvePositionAndName,
  constructParticipant,
  constructStatistics,
  cleanTags,
} from './results';

describe('cleanTags()', () => {
  it('should parse rows correctly', () => {
    const pre = `1. John Doe     association     21.10     +50.20\r\n\r
    `;
    expect(cleanTags(pre)).toEqual([['1.', 'John Doe', 'association', '21.10', '+50.20']]);
  });
  it('should parse rows with firstname === 3 correctly', () => {
    const pre = `   - Jon Doee                    association               \r\n\r
    `;
    expect(cleanTags(pre)).toEqual([['- Jon Doee', 'association']]);
  });
});

describe('resolvePositionAndName()', () => {
  it('should handle normal cases', () => {
    const input = '1.';
    expect(resolvePositionAndName(input)).toEqual(['1']);
  });
  it('should handle if string instead of number', () => {
    const input = 'AAA aaaa aaaa';
    expect(resolvePositionAndName(input)).toEqual(['null', 'aaaa aaaa']);
  });
  it('should handle multiple names', () => {
    const input = 'AAA aaaa aaaa aaa aaaa';
    expect(resolvePositionAndName(input)).toEqual(['null', 'aaaa aaaa aaa aaaa']);
  });
  it('should handle if special char instead of number', () => {
    const input = ' - aaaa aaaa';
    expect(resolvePositionAndName(input)).toEqual(['null', 'aaaa aaaa']);
  });
  it('should handle if empty spaces instead of number', () => {
    const input = '   aaaa aaaa';
    expect(resolvePositionAndName(input)).toEqual(['null', 'aaaa aaaa']);
  });
  it('should handle if first name is 3 letters long', () => {
    const input = '- aaa aaaa';
    expect(resolvePositionAndName(input)).toEqual(['null', 'aaa aaaa']);
  });
  it('should remove extra whitespace', () => {
    const input = '- aaa  aaaa';
    expect(resolvePositionAndName(input)).toEqual(['null', 'aaa aaaa']);
  });
});

describe('constructParticipant()', () => {
  it('should handle normal', () => {
    const row = ['2', 'John Doe', 'association', '51:25', '+01:30'];
    expect(constructParticipant(row)).toEqual({
      association: 'association',
      diff: '+01:30',
      name: 'John Doe',
      position: 2,
      time: '51:25',
    });
  });

  it('should handle no association', () => {
    const row = ['2', 'John Doe', '51:25', '+01:30'];
    expect(constructParticipant(row)).toEqual({
      association: null,
      diff: '+01:30',
      name: 'John Doe',
      position: 2,
      time: '51:25',
    });
  });

  it('should handle first place', () => {
    const row = ['1', 'John Doe', 'association', '51:25'];
    expect(constructParticipant(row)).toEqual({
      association: 'association',
      diff: null,
      name: 'John Doe',
      position: 1,
      time: '51:25',
    });
  });

  it('should handle no position', () => {
    const row = ['null', 'John Doe', 'association', 'false'];
    expect(constructParticipant(row)).toEqual({
      association: 'association',
      diff: null,
      name: 'John Doe',
      position: null,
      time: null,
    });
  });

  it('should handle no position and no association', () => {
    const row = ['null', 'John Doe', 'false'];
    expect(constructParticipant(row)).toEqual({
      association: null,
      diff: null,
      name: 'John Doe',
      position: null,
      time: null,
    });
  });
});

describe('constructStatistics()', () => {
  it('should return statistics', () => {
    const row = ['(startade: 30', 'startade: 15', 'startade: 7)'];
    expect(constructStatistics(row)).toEqual({
      disqualified: 7,
      exited: 15,
      started: 30,
    });
  });
});
