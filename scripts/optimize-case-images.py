"""Generate delivery images without changing the original Figma exports."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
original_bytes = delivery_bytes = 0
count = 0
for source in sorted((root / 'public' / 'cases').rglob('*.png')):
    target = source.with_name(source.stem + '-full.webp')
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image.thumbnail((2560, 2560), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=92, method=6)
    original_bytes += source.stat().st_size
    delivery_bytes += target.stat().st_size
    count += 1
print(f'{count} images: {original_bytes / 1048576:.1f} MB -> {delivery_bytes / 1048576:.1f} MB ({100 * (1 - delivery_bytes / original_bytes):.1f}% smaller)')
