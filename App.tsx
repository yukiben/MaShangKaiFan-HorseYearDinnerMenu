
import React, { useState } from 'react';
import { UserInput, MenuData, Dish } from './types';
import { generateMenu } from './geminiService';
import FormScreen from './components/FormScreen';
import MenuScreen from './components/MenuScreen';
import PosterScreen from './components/PosterScreen';
import PrepScreen from './components/PrepScreen';
import RecipeDetail from './components/RecipeDetail';

type Screen = 'home' | 'menu' | 'prep' | 'poster' | 'recipe';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [loading, setLoading] = useState(false);
  const [dinnerTime, setDinnerTime] = useState("19:30");
  const [userInput, setUserInput] = useState<UserInput>({
    peopleCount: 8,
    tastes: ['川菜 (麻辣)'],
    restrictions: '',
    nominatedDishes: ['红烧肉'],
    horseCreative: true
  });
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  const handleGenerate = async (input: UserInput) => {
    setLoading(true);
    setUserInput(input);
    try {
      const data = await generateMenu(input);
      setMenuData(data);
      setCurrentScreen('menu');
    } catch (error) {
      console.error("Menu generation failed:", error);
      alert("生成失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  const updateDish = (updatedDish: Dish) => {
    if (!menuData) return;
    const newDishes = menuData.dishes.map(d => d.id === updatedDish.id ? updatedDish : d);
    setMenuData({ ...menuData, dishes: newDishes });
  };

  const deleteDish = (id: string) => {
    if (!menuData) return;
    setMenuData({ ...menuData, dishes: menuData.dishes.filter(d => d.id !== id) });
  };

  const addDish = () => {
    if (!menuData) return;
    const newDish: Dish = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'main',
      name: '新添吉祥菜',
      originalName: '新菜品',
      meaning: '大吉大利',
      ingredients: [{ item: '主要食材', amount: '适量', category: 'other' }],
      steps: ['清洗食材', '下锅烹饪'],
      prepTime: 15,
      cookTime: 20
    };
    setMenuData({ ...menuData, dishes: [...menuData.dishes, newDish] });
  };

  const handleViewRecipe = (dishId: string) => {
    setSelectedDishId(dishId);
    setCurrentScreen('recipe');
  };

  const selectedDish = menuData?.dishes.find(d => d.id === selectedDishId);

  return (
    <div className="flex flex-col h-screen max-w-[430px] mx-auto bg-background-dark shadow-2xl relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
        {loading && (
          <div className="fixed inset-0 z-[200] glass-panel flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-primary calligraphy-title">名厨正在构思...</h2>
          </div>
        )}

        {currentScreen === 'home' && (
          <FormScreen initialData={userInput} onGenerate={handleGenerate} />
        )}

        {currentScreen === 'menu' && menuData && (
          <MenuScreen 
            menu={menuData} 
            onViewPoster={() => setCurrentScreen('poster')}
            onViewRecipe={handleViewRecipe}
            onDeleteDish={deleteDish}
            onAddDish={addDish}
            onUpdateDish={updateDish}
          />
        )}

        {currentScreen === 'prep' && menuData && (
          <PrepScreen 
            menu={menuData} 
            dinnerTime={dinnerTime}
            setDinnerTime={setDinnerTime}
          />
        )}

        {currentScreen === 'poster' && menuData && (
          <PosterScreen menu={menuData} onBack={() => setCurrentScreen('menu')} />
        )}

        {currentScreen === 'recipe' && selectedDish && (
          <RecipeDetail dish={selectedDish} onBack={() => setCurrentScreen('menu')} />
        )}
      </div>

      {/* Global Bottom Navigation - 常驻底部 */}
      {currentScreen !== 'poster' && currentScreen !== 'recipe' && (
        <nav className="flex-shrink-0 w-full bg-background-dark/95 backdrop-blur-xl border-t border-primary/10 px-6 pt-3 pb-8 flex justify-around items-center z-50">
          <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'home' ? 'text-primary' : 'text-slate-500'}`}>
            <span className="material-icons">home</span>
            <span className="text-[10px] font-bold">首页策划</span>
          </button>
          <button onClick={() => menuData ? setCurrentScreen('menu') : alert('请先生成菜单')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'menu' ? 'text-primary' : 'text-slate-500'}`}>
            <span className="material-icons">restaurant_menu</span>
            <span className="text-[10px] font-bold">吉祥菜单</span>
          </button>
          <button onClick={() => menuData ? setCurrentScreen('prep') : alert('请先生成菜单')} className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'prep' ? 'text-primary' : 'text-slate-500'}`}>
            <span className="material-icons">event_note</span>
            <span className="text-[10px] font-bold">备餐统筹</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
