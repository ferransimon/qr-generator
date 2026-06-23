import { z } from 'zod';

export const qrGeneratorSchema = z.object({
  url: z.string().min(1, 'required').url('invalidUrl'),
  logo: z.instanceof(File).optional().nullable()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      'fileSize'
    )
    .refine(
      (file) => !file || ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'].includes(file.type),
      'fileType'
    ),
  size: z.number().min(256).max(1024),
  fgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
});

export type QRGeneratorFormData = z.infer<typeof qrGeneratorSchema>;
