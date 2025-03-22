import { useSevenDaysParser } from '../hooks/dateParser';

describe('useSevenDaysParser', () => {
  it('should format timepoint correctly', () => {
    const result = useSevenDaysParser(20240324);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d+/); // matches format like "Friday, March 24"
  });

  it('should handle negative input by returning a date string', () => {
    const result = useSevenDaysParser(-1);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d+/); // matches format like "Friday, March 24"
  });
});
