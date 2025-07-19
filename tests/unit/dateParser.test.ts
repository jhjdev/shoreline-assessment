import {
  parseSevenDaysDate,
  useSevenDaysParser,
} from '../../src/hooks/dateParser';

describe('parseSevenDaysDate', () => {
  it('should format timepoint correctly', () => {
    const result = parseSevenDaysDate(20240324);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d+/); // matches format like "Friday, March 24"
  });

  it('should handle negative input by returning a date string', () => {
    const result = parseSevenDaysDate(-1);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d+/); // matches format like "Friday, March 24"
  });
});

describe('useSevenDaysParser (deprecated)', () => {
  it('should still work for backward compatibility', () => {
    const result = useSevenDaysParser(20240324);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d+/); // matches format like "Friday, March 24"
  });
});
