import { hasKnownGeolocationIssues } from '../../src/services/weatherApi';

describe('weatherApi', () => {
  describe('hasKnownGeolocationIssues', () => {
    // Mock navigator and platform detection
    const mockNavigator = (userAgent: string) => {
      Object.defineProperty(window, 'navigator', {
        value: {
          userAgent,
          platform: 'MacIntel',
        },
        writable: true,
      });
    };

    it('should return true for Edge on macOS', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
      );
      const result = hasKnownGeolocationIssues();
      expect(result.hasIssues).toBe(true);
      expect(result.reason).toContain('Microsoft Edge on macOS');
    });

    it('should return false for Chrome on macOS', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      const result = hasKnownGeolocationIssues();
      expect(result.hasIssues).toBe(false);
      expect(result.reason).toBe('');
    });

    it('should return false for Firefox on macOS', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
      );
      const result = hasKnownGeolocationIssues();
      expect(result.hasIssues).toBe(false);
      expect(result.reason).toBe('');
    });

    it('should return false for Safari on macOS', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
      );
      const result = hasKnownGeolocationIssues();
      expect(result.hasIssues).toBe(false);
      expect(result.reason).toBe('');
    });
  });
});
