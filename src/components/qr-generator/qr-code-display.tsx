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
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      if (qrCanvasRef.current && displayCanvasRef.current) {
        try {
          // Wait a bit for QRCodeCanvas to render
          await new Promise(resolve => setTimeout(resolve, 50));

          const dataUrl = await generateQRWithLogo(qrCanvasRef.current, displayCanvasRef.current, logo, size);
          setQrDataUrl(dataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    if (url) {
      generateQR();
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
            {/* Hidden QR code canvas for generation */}
            <div className="hidden">
              <QRCodeCanvas
                ref={qrCanvasRef}
                value={url}
                size={size}
                level="H"
                fgColor={fgColor}
                bgColor={bgColor}
              />
            </div>

            {/* Display canvas with logo overlay */}
            <canvas
              ref={displayCanvasRef}
              width={size}
              height={size}
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
