'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useTranslations } from 'next-intl';

interface SizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const t = useTranslations('QRGenerator');

  const getSizeLabel = (size: number) => {
    if (size <= 300) return t('small');
    if (size <= 600) return t('medium');
    return t('large');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>{t('size')}</Label>
        <span className="text-sm text-muted-foreground">
          {getSizeLabel(value)} - {value}px
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={256}
        max={1024}
        step={64}
        className="w-full"
      />
    </div>
  );
}
