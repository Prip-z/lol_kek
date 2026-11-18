import { useEffect, useState } from 'react';
import { assetUrl } from '../../shared/lib/assets';
import { cryptoRandomInt } from '../../shared/lib/random';

const BANNER_IMAGES = [
  'd097887dd6d1e64a2781b7901e448c84.jpg',
  'a14cdded9e1f82cad41681232b657e0a.jpg',
  '6f0ebf291422a4daab23c53759b1b5ea.jpg',
  'labaOneIcone.jpg', 
];

export function BannerRotator() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    cryptoRandomInt(BANNER_IMAGES.length)
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.hidden || BANNER_IMAGES.length < 2) return;

      setCurrentIndex((prevIndex) => {
        const step = cryptoRandomInt(BANNER_IMAGES.length - 1);
        return step >= prevIndex ? step + 1 : step;
      });
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-30 w-56 rounded-lg overflow-hidden border-2 border-amber-400 shadow-xl bg-black">
      <div className="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
        Горячее предложение рядом
      </div>
      <img
        src={assetUrl(BANNER_IMAGES[currentIndex])}
        alt="Реклама"
        className="w-full h-36 object-cover block"
      />
    </div>
  );
}