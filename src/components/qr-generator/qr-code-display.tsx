'use client';

import { useRef, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { generateQRWithLogo, downloadQRCode, copyQRToClipboard, shareViaWhatsApp } from '@/lib/qr-utils';

interface QRCodeDisplayProps {
  url: string;
  logo: File | null;
  size: number;
  fgColor: string;
  bgColor: string;
}

export function QRCodeDisplay({ url, logo, size, fgColor, bgColor }: QRCodeDisplayProps) {
  const t = useTranslations('QRGenerator');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        try {
          const dataUrl = await generateQRWithLogo(canvasRef.current, logo);
          setQrDataUrl(dataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    if (url) {
      setTimeout(generateQR, 100);
    }
  }, [url, logo, size, fgColor, bgColor]);

  const handleDownload = () => {
    if (qrDataUrl) {
      downloadQRCode(qrDataUrl);
    }
  };

  const handleCopy = async () => {
    try {
      await copyQRToClipboard(qrDataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = () => {
    shareViaWhatsApp(url);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <QRCodeCanvas
              ref={canvasRef}
              value={url}
              size={size}
              level="H"
              fgColor={fgColor}
              bgColor={bgColor}
              className="border-2 border-border rounded-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={handleDownload} disabled={!qrDataUrl}>
              <Download className="mr-2 h-4 w-4" />
              {t('download')}
            </Button>

            <Button onClick={handleCopy} disabled={!qrDataUrl} variant="outline">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t('copied')}
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  {t('copy')}
                </>
              )}
            </Button>

            <Button onClick={handleShare} disabled={!qrDataUrl} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {t('share')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
