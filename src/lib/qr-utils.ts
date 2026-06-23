export async function generateQRWithLogo(
  canvasElement: HTMLCanvasElement,
  logoFile: File | null
): Promise<string> {
  const canvas = canvasElement;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  if (!logoFile) {
    return canvas.toDataURL('image/png');
  }

  const logoImage = await loadImage(logoFile);
  const size = canvas.width;
  const logoSize = size * 0.2;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;
  const padding = 10;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(
    logoX - padding,
    logoY - padding,
    logoSize + padding * 2,
    logoSize + padding * 2
  );

  ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

  return canvas.toDataURL('image/png');
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadQRCode(dataUrl: string, filename: string = 'qrcode.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function copyQRToClipboard(dataUrl: string): Promise<void> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}

export function shareViaWhatsApp(url: string) {
  const message = encodeURIComponent(`Check out this URL: ${url}`);
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
}
