
import React from 'react';
import { MenuData, Dish } from '../types';

interface Props {
  menu: MenuData;
  onBack: () => void;
}

const PosterScreen: React.FC<Props> = ({ menu, onBack }) => {
  const categories: Dish['type'][] = ['appetizer', 'main', 'soup', 'staple', 'dessert'];
  const categoryNames = {
    appetizer: '精选凉菜',
    main: '丰盛热菜',
    soup: '温润汤羹',
    staple: '团圆主食',
    dessert: '马到甜点'
  };

  const totalDishes = menu.dishes.length;
  
  // Calculate adaptive font sizes and spacing to prevent truncation
  const getResponsiveClasses = () => {
    if (totalDishes > 12) {
      return {
        title: 'text-lg',
        original: 'text-[8px]',
        dishSpacing: 'space-y-1.5',
        sectionSpacing: 'space-y-4',
        iconSize: 'w-16 h-16',
        containerPadding: 'p-4'
      };
    } else if (totalDishes > 8) {
      return {
        title: 'text-xl',
        original: 'text-[9px]',
        dishSpacing: 'space-y-2.5',
        sectionSpacing: 'space-y-6',
        iconSize: 'w-20 h-20',
        containerPadding: 'p-6'
      };
    } else {
      return {
        title: 'text-2xl',
        original: 'text-[10px]',
        dishSpacing: 'space-y-4',
        sectionSpacing: 'space-y-10',
        iconSize: 'w-24 h-24',
        containerPadding: 'p-8'
      };
    }
  };

  const styles = getResponsiveClasses();

  const handleSaveImage = () => {
    alert('长按海报即可保存到手机相册 (模拟功能)');
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-hidden">
      <header className="flex-shrink-0 w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-primary/10 transition-colors text-primary active:scale-90">
          <span className="material-icons align-middle">arrow_back</span>
        </button>
        <h1 className="text-sm font-semibold tracking-wider text-primary/80 uppercase">海报预览</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center gap-6 py-4 px-6 overflow-y-auto">
        {/* Dynamic height container with adaptive sizing */}
        <div className={`relative w-full shadow-2xl shadow-primary/20 rounded-lg bg-gradient-to-br from-[#fff9f0] to-[#f7e8d0] text-slate-900 border-[10px] border-double border-[#331d1d] transition-all flex flex-col ${styles.containerPadding}`} style={{ minHeight: 'fit-content' }}>
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-10 h-10 border-t border-l border-primary/40"></div>
          <div className="absolute top-2 right-2 w-10 h-10 border-t border-r border-primary/40"></div>
          <div className="absolute bottom-2 left-2 w-10 h-10 border-b border-l border-primary/40"></div>
          <div className="absolute bottom-2 right-2 w-10 h-10 border-b border-r border-primary/40"></div>

          <div className="w-full flex flex-col items-center relative z-10 space-y-6">
            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="h-px w-6 bg-primary/30"></span>
                <p className="text-primary font-serif font-bold tracking-[0.2em] text-base">2026 丙午马年</p>
                <span className="h-px w-6 bg-primary/30"></span>
              </div>
              <h2 className="font-calligraphy text-5xl font-black text-[#1a0f0f] tracking-tighter">马上开饭</h2>
              <div className="w-10 h-0.5 bg-primary mx-auto mt-2 rounded-full"></div>
            </div>

            <div className={`${styles.iconSize} opacity-80 flex-shrink-0`}>
              <img 
                alt="Ink horse" 
                className="w-full h-full object-contain filter contrast-125" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB00WtMyscJ2zWxCKs20Anerkoni7d4DuDvEiqICumFl5Z8iJ2Meh3lW_QGA6t56PCvOG5gRmduVGiDkyor2AAtP9Ff-Og6JSj5PEtYMCFXWObqfqOP0M0HPpJ84CsOQggdBMoyuwHQxDnvTlSlb_F8DQ0UGfSZlDw02Gh9FDgeRK2cbE3U7ydvR2-Zk0xdi8xh3kMc69lwpQOq-QDN0LkCrFVXt4LdcdrsCqEbKElYdiYzDe17zk6jHtpVtlUigf8Pq5f2qC4PiZ1" 
              />
            </div>

            <div className={`w-full ${styles.sectionSpacing} pb-10`}>
              {categories.map(cat => {
                const dishes = menu.dishes.filter(d => d.type === cat);
                if (dishes.length === 0) return null;
                return (
                  <div key={cat} className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-px w-4 bg-primary/20"></span>
                      <p className="text-[9px] tracking-[0.2em] text-primary font-bold uppercase">{categoryNames[cat]}</p>
                      <span className="h-px w-4 bg-primary/20"></span>
                    </div>
                    <div className={`${styles.dishSpacing} text-center`}>
                      {dishes.map(d => (
                        <div key={d.id}>
                          <h3 className={`font-serif ${styles.title} font-bold text-[#1a0f0f] leading-none mb-0.5`}>{d.name}</h3>
                          <p className={`${styles.original} text-[#331d1d]/50 font-serif tracking-widest`}>{d.originalName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full flex items-end justify-between pt-6 border-t border-primary/20 mt-4">
              <div className="border border-primary/30 p-0.5 bg-white shadow-sm">
                <div className="w-12 h-12 bg-white flex items-center justify-center">
                  <span className="material-icons text-2xl text-[#331d1d]">qr_code_2</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-primary mb-0.5 uppercase tracking-tighter">马上开饭 AI 引擎策划</p>
                <p className="text-[8px] text-[#1a0f0f] opacity-60 font-serif">扫码生成您的专属年夜饭</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pb-8 flex-shrink-0">
          <button 
            onClick={handleSaveImage}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-icons">download</span>
            <span>保存高清海报</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default PosterScreen;
