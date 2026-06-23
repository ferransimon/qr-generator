'use client';

import { QRGeneratorForm } from '@/components/qr-generator/qr-generator-form';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('QRGenerator');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <QRGeneratorForm />
      </main>

      <footer className="mt-auto border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {t('description')}
        </div>
      </footer>
    </div>
  );
}
