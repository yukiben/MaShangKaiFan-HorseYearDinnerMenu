
import React, { useState, useEffect, useMemo } from 'react';
import { MenuData, Dish, Ingredient } from '../types';

interface Props {
  menu: MenuData;
  dinnerTime: string;
  setDinnerTime: (time: string) => void;
}

const PrepScreen: React.FC<Props> = ({ menu, dinnerTime, setDinnerTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timelineTasks = useMemo(() => {
    const [dHours, dMins] = dinnerTime.split(':').map(Number);
    const dTime = new Date();
    dTime.setHours(dHours, dMins, 0, 0);

    const meatItems = menu.dishes.filter(d => d.ingredients.some(i => i.category === 'meat' || i.category === 'seafood'));
    const stapleItems = menu.dishes.filter(d => d.type === 'staple');
    const veggieItems = menu.dishes.filter(d => d.type === 'main' && d.ingredients.every(i => i.category !== 'meat' && i.category !== 'seafood'));

    const tasks = [
      { 
        offset: -240, 
        title: '食材集结与清点', 
        desc: `核对 ${menu.dishes.length} 道佳肴所需：${Array.from(new Set(menu.dishes.flatMap(d => d.ingredients.map(i => i.item)))).slice(0,5).join('、')}等。` 
      },
      { 
        offset: -150, 
        title: '复杂主菜预处理', 
        desc: `开始处理 ${meatItems.map(m => m.originalName).slice(0, 2).join('和')}，进行焯水、腌制与慢火炖煮。` 
      },
      { 
        offset: -90, 
        title: '汤品与主食入锅', 
        desc: `${stapleItems.length > 0 ? stapleItems[0].originalName + '：' : ''}开始蒸煮，确保此时香气渐浓。` 
      },
      { 
        offset: -45, 
        title: '凉菜切配与摆盘', 
        desc: `精细化处理 ${menu.dishes.filter(d => d.type === 'appetizer').map(a => a.originalName).join('、')}，点缀马年装饰。` 
      },
      { 
        offset: -15, 
        title: '猛火快炒阶段', 
        desc: `突击完成 ${veggieItems.length > 0 ? veggieItems.map(v => v.originalName).join('、') : '最后热菜'}，确保热气腾腾。` 
      },
      { 
        offset: 0, 
        title: '马到成功 · 开饭！', 
        desc: `全家入座，共享 "${menu.dishes.map(d => d.name).slice(0,2).join('...')}" 等团圆美味。` 
      },
    ].map(task => {
      const scheduled = new Date(dTime.getTime() + task.offset * 60000);
      return {
        ...task,
        scheduledTime: scheduled,
        timeStr: scheduled.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: scheduled < currentTime ? 'past' : (Math.abs(scheduled.getTime() - currentTime.getTime()) < 15 * 60000 ? 'current' : 'future')
      };
    });
    return tasks;
  }, [dinnerTime, currentTime, menu]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-dark">
      {/* 备餐统筹部 板块常驻顶部 */}
      <header className="flex-shrink-0 px-6 pt-10 pb-6 bg-gradient-to-b from-primary/10 to-transparent shadow-xl relative z-20">
        <h1 className="text-2xl font-bold text-primary mb-2 font-calligraphy">备餐统筹部</h1>
        <div className="flex items-center justify-between bg-[#2d1a1a] p-4 rounded-2xl border border-primary/20 shadow-inner">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">设定开餐时间</p>
            <input 
              type="time" 
              value={dinnerTime} 
              onChange={(e) => setDinnerTime(e.target.value)}
              className="bg-transparent text-2xl font-black text-white focus:outline-none border-none p-0 cursor-pointer"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">当前时刻</p>
            <p className="text-lg font-bold text-gold">{currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
          </div>
        </div>
      </header>

      {/* 可滚动列表 */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-20">
        <div className="relative border-l-2 border-primary/20 ml-4 pl-8 py-4 space-y-10">
          {timelineTasks.map((task, idx) => (
            <div key={idx} className={`relative transition-all duration-500 ${task.status === 'past' ? 'opacity-40 scale-95' : task.status === 'current' ? 'scale-105' : 'opacity-80'}`}>
              <div className={`absolute -left-[42px] top-1 w-6 h-6 rounded-full border-4 border-background-dark flex items-center justify-center
                ${task.status === 'past' ? 'bg-slate-500' : task.status === 'current' ? 'bg-primary animate-pulse shadow-[0_0_15px_rgba(234,42,51,0.5)]' : 'bg-slate-800'}`}>
                {task.status === 'past' && <span className="material-icons text-[12px] text-white">check</span>}
                {task.status === 'current' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              
              <div className={`p-4 rounded-xl border transition-all ${task.status === 'current' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-black ${task.status === 'current' ? 'text-primary' : 'text-slate-400'}`}>{task.timeStr}</span>
                  {task.status === 'current' && <span className="bg-primary text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">进行中</span>}
                </div>
                <h3 className={`text-lg font-bold ${task.status === 'current' ? 'text-white' : 'text-slate-200'}`}>{task.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PrepScreen;
