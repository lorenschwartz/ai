import { SentimentType } from './types';
import { z } from 'zod';

export interface Feedback {
  id: string;                    // UUID
  customerId: string;            // Foreign key
  orderId: string;               // Foreign key
  ratings: {
    overall: number;             // 1-5 stars
    foodQuality: number;         // 1-5 stars
    serviceSpeed: number;        // 1-5 stars
    aiInteraction: number;       // 1-5 stars
  };
  comments?: string;
  sentiment: SentimentType;
  createdAt: Date;
}

// Validation schema
export const FeedbackSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  orderId: z.string().uuid(),
  ratings: z.object({
    overall: z.number().int().min(1).max(5),
    foodQuality: z.number().int().min(1).max(5),
    serviceSpeed: z.number().int().min(1).max(5),
    aiInteraction: z.number().int().min(1).max(5)
  }),
  comments: z.string().max(1000).optional(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  createdAt: z.date()
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;

// Helper functions for Feedback operations
export class FeedbackValidator {
  static validate(feedback: unknown): FeedbackInput {
    return FeedbackSchema.parse(feedback);
  }

  static calculateAverageRating(feedback: Feedback): number {
    const { overall, foodQuality, serviceSpeed, aiInteraction } = feedback.ratings;
    return (overall + foodQuality + serviceSpeed + aiInteraction) / 4;
  }

  static detectSentiment(comments?: string): SentimentType {
    if (!comments) return "neutral";
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ["excellent", "great", "amazing", "fantastic", "love", "perfect", "wonderful", "delicious"];
    const negativeWords = ["terrible", "awful", "horrible", "disgusting", "hate", "worst", "bad", "disappointing"];
    
    const lowerComments = comments.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerComments.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerComments.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  static isPositive(feedback: Feedback): boolean {
    return feedback.sentiment === "positive" && this.calculateAverageRating(feedback) >= 4;
  }

  static requiresAttention(feedback: Feedback): boolean {
    return feedback.sentiment === "negative" || this.calculateAverageRating(feedback) <= 2;
  }

  static categorizeByRating(ratings: Feedback[]): {
    excellent: Feedback[];
    good: Feedback[];
    average: Feedback[];
    poor: Feedback[];
  } {
    return ratings.reduce((categories, feedback) => {
      const avgRating = this.calculateAverageRating(feedback);
      
      if (avgRating >= 4.5) {
        categories.excellent.push(feedback);
      } else if (avgRating >= 3.5) {
        categories.good.push(feedback);
      } else if (avgRating >= 2.5) {
        categories.average.push(feedback);
      } else {
        categories.poor.push(feedback);
      }
      
      return categories;
    }, {
      excellent: [] as Feedback[],
      good: [] as Feedback[],
      average: [] as Feedback[],
      poor: [] as Feedback[]
    });
  }
}