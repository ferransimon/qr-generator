export async function generateQRWithLogo(
  sourceCanvas: HTMLCanvasElement,
  displayCanvas: HTMLCanvasElement,
  logoFile: File | null,
  size: number
): Promise<string> {
  const ctx = displayCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Clear the display canvas
  ctx.clearRect(0, 0, size, size);

  // Draw the QR code from source canvas to display canvas
  ctx.drawImage(sourceCanvas, 0, 0, size, size);

  // If no logo, return the QR code as is
  if (!logoFile) {
    return displayCanvas.toDataURL('image/png');
  }

  // Load and draw the logo
  const logoImage = await loadImageFromFile(logoFile);
  const logoSize = size * 0.2;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;
  const padding = 10;

  // Draw white background behind logo
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(
    logoX - padding,
    logoY - padding,
    logoSize + padding * 2,
    logoSize + padding * 2
  );

  // Draw the logo
  ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

  return displayCanvas.toDataURL('image/png');
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
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
