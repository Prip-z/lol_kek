import { assetUrl } from '@/shared/lib/assets';
import { BannerRotator } from '@/features/ads/BannerRotator';

type PageId = 'home' | 'laba1' | 'laba2' | 'laba3';

interface SidebarProps {
  currentPage: PageId;
  onChangePage: (page: PageId) => void;
}

export function Sidebar({ currentPage, onChangePage }: SidebarProps) {
  return (
    <aside className="bg-sidebar w-70 h-screen flex flex-col justify-start shrink-0 overflow-hidden">
      <button
        type="button"
        onClick={() => onChangePage('home')}
        className={`text-xl py-3 text-white border-b border-black hover:bg-hover-button cursor-pointer ${
          currentPage === 'home' ? 'bg-hover-button font-bold' : ''
        }`}
      >
        Домой, Уолтер
      </button>

      <button
        type="button"
        onClick={() => onChangePage('laba1')}
        className={`gap-5 flex flex-row justify-center items-center text-xl py-2 text-white border-b border-black hover:bg-hover-button cursor-pointer ${
          currentPage === 'laba1' ? 'bg-hover-button font-bold' : ''
        }`}
      >
        <img
          className="w-15 h-15 object-cover"
          src={assetUrl('labaOneIcon.jpg')}
          alt="Первая лаба"
        />
        <span>Первая лаба</span>
      </button>

      <BannerRotator />
    </aside>
  );
}

export default Sidebar;