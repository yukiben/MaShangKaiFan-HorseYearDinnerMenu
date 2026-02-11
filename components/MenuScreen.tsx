
import React, { useState } from 'react';
import { MenuData, Dish } from '../types';

interface Props {
  menu: MenuData;
  onViewPoster: () => void;
  onViewRecipe: (id: string) => void;
  onDeleteDish: (id: string) => void;
  onAddDish: () => void;
  onUpdateDish: (dish: Dish) => void;
}

const MenuScreen: React.FC<Props> = ({ menu, onViewPoster, onViewRecipe, onDeleteDish, onAddDish, onUpdateDish }) => {
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const categories: Dish['type'][] = ['appetizer', 'main', 'soup', 'staple', 'dessert'];
  const categoryNames = {
    appetizer: '精选凉菜',
    main: '丰盛热菜',
    soup: '温润汤羹',
    staple: '团圆主食',
    dessert: '马到甜头'
  };

  const saveEdit = () => {
    if (editingDish) {
      onUpdateDish(editingDish);
      setEditingDish(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="flex-shrink-0 sticky top-0 z-50 bg-background-dark/95 backdrop-blur-lg border-b border-primary/10 px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-primary font-calligraphy">马到成功</h1>
          <p className="text-[10px] text-primary/60 font-medium uppercase tracking-widest">丙午马年 · 除夕盛宴</p>
        </div>
        <button onClick={onViewPoster} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary active:scale-90 transition-transform shadow-inner">
          <span className="material-icons text-xl">wallpaper</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
        <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
          <p className="text-gray-300 text-sm leading-relaxed italic">“{menu.overallMeaning}”</p>
        </div>

        {categories.map(cat => {
          const dishes = menu.dishes.filter(d => d.type === cat);
          if (dishes.length === 0 && cat !== 'main') return null;
          return (
            <section key={cat} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">{categoryNames[cat]}</span>
                <div className="h-px flex-1 bg-primary/10"></div>
              </div>
              <div className="space-y-3">
                {dishes.map(dish => (
                  <div key={dish.id} className="group relative bg-[#2d1a1a] rounded-xl p-4 border border-primary/10 transition-all hover:border-primary/30 shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 cursor-pointer" onClick={() => onViewRecipe(dish.id)}>
                        <h3 className="text-base font-bold text-slate-100">{dish.name}</h3>
                        <p className="text-[10px] text-slate-500 italic mt-0.5">原名：{dish.originalName}</p>
                        <p className="text-[11px] text-primary/80 mt-2 flex items-center gap-1">
                          <span className="material-icons text-[12px]">star</span>
                          {dish.meaning}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setEditingDish(dish)}
                          className="text-slate-500 hover:text-gold p-1 transition-colors"
                        >
                          <span className="material-icons text-lg">edit</span>
                        </button>
                        <button 
                          onClick={() => onDeleteDish(dish.id)}
                          className="text-slate-600 hover:text-primary p-1 transition-colors"
                        >
                          <span className="material-icons text-lg">delete_outline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <button 
          onClick={onAddDish}
          className="w-full py-4 border-2 border-dashed border-primary/20 rounded-xl text-primary/60 font-bold flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-[0.98] transition-all mb-8 shadow-inner"
        >
          <span className="material-icons">add_circle_outline</span>
          <span>添加新菜品</span>
        </button>
      </main>

      {/* Simplified Edit Modal - Centered and smaller */}
      {editingDish && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#2d1a1a] w-full max-w-[320px] rounded-3xl border border-primary/30 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary font-calligraphy">修改菜品</h2>
              <button onClick={() => setEditingDish(null)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block tracking-wider">所属分类</label>
                <select 
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl text-white text-sm focus:ring-primary py-2.5 px-3 appearance-none cursor-pointer"
                  value={editingDish.type}
                  onChange={(e) => setEditingDish({...editingDish, type: e.target.value as any})}
                >
                  {Object.entries(categoryNames).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block tracking-wider">吉祥别名</label>
                <input 
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl text-white text-sm focus:ring-primary px-4 py-2.5 placeholder-slate-600"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({...editingDish, name: e.target.value})}
                  placeholder="如：马到成功"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block tracking-wider">菜品原名</label>
                <input 
                  className="w-full bg-primary/5 border border-primary/20 rounded-xl text-white text-sm focus:ring-primary px-4 py-2.5 placeholder-slate-600"
                  value={editingDish.originalName}
                  onChange={(e) => setEditingDish({...editingDish, originalName: e.target.value})}
                  placeholder="如：红烧肉"
                />
              </div>
            </div>

            <button 
              onClick={saveEdit}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-2xl shadow-lg mt-2 active:scale-95 transition-transform"
            >
              确定更新
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuScreen;
