
import React, { useState } from 'react';
import { UserInput } from '../types';

interface Props {
  initialData: UserInput;
  onGenerate: (data: UserInput) => void;
}

const FormScreen: React.FC<Props> = ({ initialData, onGenerate }) => {
  const [data, setData] = useState<UserInput>(initialData);
  const [newItem, setNewItem] = useState('');

  const addDish = () => {
    if (newItem.trim()) {
      setData({ ...data, nominatedDishes: [...data.nominatedDishes, newItem.trim()] });
      setNewItem('');
    }
  };

  const removeDish = (index: number) => {
    const next = [...data.nominatedDishes];
    next.splice(index, 1);
    setData({ ...data, nominatedDishes: next });
  };

  const toggleTaste = (taste: string) => {
    const current = data.tastes.includes(taste)
      ? data.tastes.filter(t => t !== taste)
      : [...data.tastes, taste];
    setData({ ...data, tastes: current });
  };

  const tastesOptions = ['川菜 (麻辣)', '鲁菜 (咸鲜)', '粤菜 (清淡)', '淮扬菜', '闽菜', '湘菜'];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 常驻首页顶部 */}
      <header className="flex-shrink-0 px-6 pt-12 pb-6 relative z-20 bg-background-dark shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-primary font-bold text-lg tracking-[0.2em] font-calligraphy mb-1">丙午马年</h2>
            <h1 className="text-5xl font-extrabold text-white leading-tight font-calligraphy">
              马上<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold">开饭</span>
            </h1>
          </div>
          <div className="bg-primary/10 p-3 rounded-full border border-primary/30">
            <span className="material-icons text-primary text-3xl">restaurant</span>
          </div>
        </div>
        <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-[85%] font-medium">
          定制您的专属除夕盛宴，万马奔腾开启吉祥丰年。
        </p>
      </header>

      {/* 可滚动区域 */}
      <main className="flex-1 overflow-y-auto px-6 space-y-8 pb-12">
        {/* Number of People */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="material-icons text-gold text-lg">groups</span>
            <h3 className="font-bold text-lg text-white">用餐人数</h3>
          </div>
          <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
            <button 
              onClick={() => setData({ ...data, peopleCount: Math.max(1, data.peopleCount - 1) })}
              className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center text-primary active:bg-primary/20"
            >
              <span className="material-icons">remove</span>
            </button>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary">{data.peopleCount.toString().padStart(2, '0')}</span>
              <span className="text-xs text-slate-400">位</span>
            </div>
            <button 
              onClick={() => setData({ ...data, peopleCount: data.peopleCount + 1 })}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform"
            >
              <span className="material-icons">add</span>
            </button>
          </div>
        </section>

        {/* Taste Preferences */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-icons text-gold text-lg">restaurant</span>
              <h3 className="font-bold text-lg text-white">口味偏好</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">可多选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tastesOptions.map(t => (
              <button 
                key={t}
                onClick={() => toggleTaste(t)}
                className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                  data.tastes.includes(t) 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : 'bg-primary/10 text-slate-300 border-primary/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Dietary Restrictions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-icons text-gold text-lg">warning_amber</span>
            <h3 className="font-bold text-lg text-white">忌口要求</h3>
          </div>
          <textarea 
            className="w-full bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm focus:ring-primary focus:border-primary placeholder-slate-600 text-white"
            placeholder="例如：不吃海鲜、花生过敏、需要素食选项..."
            rows={2}
            value={data.restrictions}
            onChange={(e) => setData({ ...data, restrictions: e.target.value })}
          />
        </section>

        {/* Nominated Dishes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-icons text-gold text-lg">auto_awesome</span>
              <h3 className="font-bold text-lg text-white">钦点菜品</h3>
            </div>
            <span className="text-xs text-slate-400">已添加: {data.nominatedDishes.length}</span>
          </div>
          <div className="space-y-2">
            {data.nominatedDishes.map((dish, i) => (
              <div key={i} className="flex items-center justify-between bg-primary/20 border border-primary/30 p-3 rounded-lg">
                <span className="text-sm font-medium text-slate-200">{dish}</span>
                <button onClick={() => removeDish(i)} className="text-primary hover:text-primary/70">
                  <span className="material-icons text-lg">cancel</span>
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <input 
                className="flex-1 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary text-white"
                placeholder="输入您心仪的特色菜..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDish()}
              />
              <button onClick={addDish} className="bg-primary text-white p-2 rounded-lg flex items-center justify-center active:scale-90 transition-transform">
                <span className="material-icons">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Creative Option */}
        <section className="bg-gradient-to-br from-primary/10 to-gold/10 p-5 rounded-2xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <h4 className="font-bold text-primary flex items-center gap-2">
                马年特色创意
                <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded tracking-tighter">必选</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">开启具有马年元素的吉祥别名与创意搭配。</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={data.horseCreative}
                onChange={() => setData({...data, horseCreative: !data.horseCreative})}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </section>

        {/* 生成按钮随上方一起滚动 */}
        <div className="pt-4 pb-12">
          <button 
            onClick={() => onGenerate(data)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/40 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span className="text-lg">生成年夜饭菜单</span>
            <span className="material-icons">auto_fix_high</span>
          </button>
          <p className="text-center text-[10px] mt-4 text-slate-500 uppercase tracking-widest font-bold">由 马上开饭 AI 引擎驱动</p>
        </div>
      </main>
    </div>
  );
};

export default FormScreen;
