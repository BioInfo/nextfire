import { processShillerData } from '../../../src/lib/database/dataLoader';
import { describe, it, expect } from '@jest/globals';

describe('Data Loader', () => {
  describe('processShillerData', () => {
    it('should correctly process valid Shiller data', () => {
      const mockRawData = [
        {
          Date: '1871.01',
          P: '4.44',
          D: '0.26',
          E: '0.40',
          CPI: '12.46',
          GS10: '5.32',
          'Real Price': '90.71',
          'Real Dividend': '5.31',
          'Real Earnings': '8.18'
        },
        {
          Date: '1872.01',
          P: '4.86',
          D: '0.28',
          E: '0.41',
          CPI: '12.65',
          GS10: '5.46',
          'Real Price': '97.66',
          'Real Dividend': '5.62',
          'Real Earnings': '8.24'
        }
      ];

      const processed = processShillerData(mockRawData);

      expect(processed).toHaveLength(2);
      expect(processed[0]).toEqual(expect.objectContaining({
        year: 1871,
        bondNominal: 5.32,
        inflationRate: 0 // First year inflation rate is 0
      }));
      expect(processed[1]).toEqual(expect.objectContaining({
        year: 1872,
        bondNominal: 5.46,
        inflationRate: expect.any(Number)
      }));
    });

    it('should handle missing or invalid data', () => {
      const mockRawData = [
        {
          Date: 'invalid',
          P: 'NaN',
          D: '0.26',
          E: '0.40',
          CPI: '12.46',
          GS10: '5.32',
          'Real Price': '90.71',
          'Real Dividend': '5.31',
          'Real Earnings': '8.18'
        },
        {
          Date: '1872.01',
          P: '4.86',
          D: '0.28',
          E: '0.41',
          CPI: 'invalid',
          GS10: '5.46',
          'Real Price': '97.66',
          'Real Dividend': '5.62',
          'Real Earnings': '8.24'
        }
      ];

      const processed = processShillerData(mockRawData);
      expect(processed).toHaveLength(0); // Should skip invalid data
    });

    it('should calculate inflation rate correctly', () => {
      const mockRawData = [
        {
          Date: '1871.01',
          P: '4.44',
          D: '0.26',
          E: '0.40',
          CPI: '10.00',
          GS10: '5.32',
          'Real Price': '90.71',
          'Real Dividend': '5.31',
          'Real Earnings': '8.18'
        },
        {
          Date: '1872.01',
          P: '4.86',
          D: '0.28',
          E: '0.41',
          CPI: '11.00',
          GS10: '5.46',
          'Real Price': '97.66',
          'Real Dividend': '5.62',
          'Real Earnings': '8.24'
        }
      ];

      const processed = processShillerData(mockRawData);
      expect(processed[1].inflationRate).toBe(10); // (11 - 10) / 10 * 100 = 10%
    });
  });
});