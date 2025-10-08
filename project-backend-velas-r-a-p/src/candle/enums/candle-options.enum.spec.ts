import { CandleIntention, DecorateSpace, FeelingType, GiftOccasion } from './candle-options.enum';

describe('CandleOptions Enums', () => {
  describe('CandleIntention Enum', () => {
    it('should have the correct values', () => {
      expect(CandleIntention.DECORATE).toBe('decorate');
      expect(CandleIntention.FEEL).toBe('feel');
      expect(CandleIntention.GIFT).toBe('gift');
    });
  });

  describe('DecorateSpace Enum', () => {
    it('should have the correct values', () => {
      expect(DecorateSpace.LIVING_ROOM).toBe('living_room');
      expect(DecorateSpace.BEDROOM).toBe('bedroom');
      expect(DecorateSpace.BATHROOM).toBe('bathroom');
      expect(DecorateSpace.KITCHEN_DINING).toBe('kitchen_dining');
      expect(DecorateSpace.OFFICE_STUDY).toBe('office_study');
    });
  });

  describe('FeelingType Enum', () => {
    it('should have the correct values', () => {
      expect(FeelingType.RELAXED).toBe('relaxed');
      expect(FeelingType.ENERGETIC).toBe('energetic');
      expect(FeelingType.SENSUAL).toBe('sensual');
      expect(FeelingType.INSPIRED).toBe('inspired');
      expect(FeelingType.SECURE).toBe('secure');
      expect(FeelingType.NATURE_CONNECTED).toBe('nature_connected');
    });
  });

  describe('GiftOccasion Enum', () => {
    it('should have the correct values', () => {
      expect(GiftOccasion.THANKS).toBe('gratitude');
      expect(GiftOccasion.BIRTHDAY).toBe('birthday');
      expect(GiftOccasion.LOVE).toBe('love');
      expect(GiftOccasion.CONDOLENCES).toBe('condolences');
      expect(GiftOccasion.GOOD_NEWS).toBe('good_news');
      expect(GiftOccasion.FRIENDSHIP).toBe('friendship');
      expect(GiftOccasion.CHRISTMAS).toBe('christmas');
      expect(GiftOccasion.PROFESSIONAL).toBe('professional');
    });
  });
});