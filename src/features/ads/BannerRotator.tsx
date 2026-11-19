import { useEffect, useState } from 'react';
import { assetUrl } from '@/shared/lib/assets';
import { cryptoRandomInt } from '@/shared/lib/random';

const bannerModules = import.meta.glob<string>(
  [
    '/src/assets/banner/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,gif,GIF}',
    '/src/assets/banners/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,gif,GIF}',
  ],
  { eager: true, import: 'default' }
);

const BANNER_IMAGES = [
  assetUrl('d097887dd6d1e64a2781b7901e448c84.jpg'),
  ...Object.values(bannerModules),
];

export function BannerRotator() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    cryptoRandomInt(BANNER_IMAGES.length)
  );

  useEffect(() => {
    if (BANNER_IMAGES.length < 2) return;

    const intervalId = window.setInterval(() => {
      if (document.hidden) return;

      setCurrentIndex((prevIndex) => {
        const step = cryptoRandomInt(BANNER_IMAGES.length - 1);
        return step >= prevIndex ? step + 1 : step;
      });
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-auto w-full h-52 max-h-52 overflow-hidden shrink-0 border-t border-black bg-black">
      <img
        src={BANNER_IMAGES[currentIndex]}
        alt="Мем в сайдбаре"
        className="w-full h-full object-cover block"
      />
    </div>
  );
}