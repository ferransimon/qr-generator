'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogoUploader } from './logo-uploader';
import { ColorPicker } from './color-picker';
import { SizeSelector } from './size-selector';
import { QRCodeDisplay } from './qr-code-display';
import { qrGeneratorSchema, type QRGeneratorFormData } from '@/lib/validations';

export function QRGeneratorForm() {
  const t = useTranslations('QRGenerator');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [formData, setFormData] = useState<QRGeneratorFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QRGeneratorFormData>({
    resolver: zodResolver(qrGeneratorSchema),
    defaultValues: {
      url: '',
      logo: null,
      size: 512,
      fgColor: '#000000',
      bgColor: '#ffffff',
    },
  });

  const logo = watch('logo');
  const size = watch('size');
  const fgColor = watch('fgColor');
  const bgColor = watch('bgColor');

  const onSubmit = (data: QRGeneratorFormData) => {
    setFormData(data);
    setQrGenerated(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">{t('urlLabel')}</Label>
              <Input
                id="url"
                type="url"
                placeholder={t('urlPlaceholder')}
                {...register('url')}
              />
              {errors.url && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {t(`errors.${errors.url.message}`)}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <LogoUploader
              value={logo || null}
              onChange={(file) => setValue('logo', file)}
              error={errors.logo?.message}
            />

            <SizeSelector
              value={size}
              onChange={(value) => setValue('size', value)}
            />

            <ColorPicker
              label={t('foregroundColor')}
              value={fgColor}
              onChange={(value) => setValue('fgColor', value)}
            />

            <ColorPicker
              label={t('backgroundColor')}
              value={bgColor}
              onChange={(value) => setValue('bgColor', value)}
            />

            <Button type="submit" className="w-full" size="lg">
              {t('generate')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {qrGenerated && formData && (
        <QRCodeDisplay
          url={formData.url}
          logo={formData.logo || null}
          size={formData.size}
          fgColor={formData.fgColor}
          bgColor={formData.bgColor}
        />
      )}
    </div>
  );
}
