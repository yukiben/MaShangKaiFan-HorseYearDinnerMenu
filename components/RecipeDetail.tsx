
import React, { useState, useEffect } from 'react';
import { Dish } from '../types';
import { generateDishImage } from '../geminiService';

interface Props {
  dish: Dish;
  onBack: () => void;
}

const RecipeDetail: React.FC<Props> = ({ dish, onBack }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    handleGenerateImage();
  }, [dish.id]);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    const url = await generateDishImage(dish.originalName);
    setImageUrl(url);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-primary/10">
        <button onClick={onBack} className="p-1 rounded-full text-primary">
          <span className="material-icons">arrow_back</span>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white line-clamp-1">{dish.name}</h2>
          <p className="text-[10px] text-primary/60 font-bold tracking-widest uppercase">匠心菜谱</p>
        </div>
        <button onClick={handleGenerateImage} className="p-2 bg-primary/10 text-primary rounded-lg" disabled={isGenerating}>
          <span className={`material-icons text-xl ${isGenerating ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </header>

      <main className="p-6 space-y-8">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-primary/20 group">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-primary">
              <span className="material-icons animate-spin text-4xl">palette</span>
              <p className="text-[10px] font-bold mt-2">正在绘制中...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={dish.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
              <span className="material-icons text-4xl">no_photography</span>
              <p className="text-[10px] mt-2">暂无插画</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-6">
            <h3 className="text-2xl font-black text-white font-calligraphy">{dish.name}</h3>
            <p className="text-gold text-[10px] font-bold mt-1 tracking-widest uppercase">寓意：{dish.meaning}</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-icons">shopping_basket</span>
            <h4 className="font-bold">食材配比</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dish.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-slate-300">{ing.item}</span>
                <span className="text-xs font-bold text-primary">{ing.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-icons">outdoor_grill</span>
            <h4 className="font-bold">烹饪步骤</h4>
          </div>
          <div className="space-y-6 relative">
            {dish.steps.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RecipeDetail;
