import { z } from "zod";

export const createProductZodValidationObject = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(5000),
  fileUrls: z.array(z.string().url()),
  previewImageUrl: z.string().trim().min(1),
  price: z.number().positive(),
  stock: z.number().positive(),
  shippingTimeDays: z.number().positive(),
  categories: z.array(z.string().trim().min(1)),
});
