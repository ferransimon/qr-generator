'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LogoUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function LogoUploader({ value, onChange, error }: LogoUploaderProps) {
  const t = useTranslations('QRGenerator');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleClear = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="logo-upload">
        {t('uploadLogo')} <span className="text-muted-foreground">{t('logoOptional')}</span>
      </Label>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            id="logo-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('logo-upload')?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {value ? value.name : t('uploadLogo')}
          </Button>
        </div>

        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Logo preview"
            className="h-24 w-24 object-contain border-2 border-border rounded-lg"
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${error}`)}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
