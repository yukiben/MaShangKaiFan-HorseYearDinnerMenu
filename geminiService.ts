
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, MenuData, Dish } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMenu = async (input: UserInput): Promise<MenuData> => {
  const prompt = `
    你是一位精通中国年夜饭文化的米其林大厨。请为2026丙午马年设计一套名为“马上开饭”的年夜饭菜单。
    
    需求：
    - 用餐人数：${input.peopleCount}人
    - 口味偏好：${input.tastes.join(', ')}
    - 忌口：${input.restrictions || '无'}
    - 必选菜品/食材：${input.nominatedDishes.join(', ')}
    - 马年创意：${input.horseCreative ? '需要包含马年特色别名和创意' : '普通吉祥菜品'}
    
    规则：
    1. 根据人数生成6-12道菜（包括凉菜、热菜、汤、主食、甜点）。
    2. 每道菜必须有一个马年相关的吉祥别名。
    3. 返回JSON格式。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['appetizer', 'main', 'soup', 'staple', 'dessert'] },
                name: { type: Type.STRING },
                originalName: { type: Type.STRING },
                meaning: { type: Type.STRING },
                prepTime: { type: Type.NUMBER },
                cookTime: { type: Type.NUMBER },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      category: { type: Type.STRING, enum: ['meat', 'vegetable', 'seafood', 'pantry', 'other'] }
                    },
                    required: ['item', 'amount', 'category']
                  }
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['id', 'type', 'name', 'originalName', 'meaning', 'ingredients', 'steps', 'prepTime', 'cookTime']
            }
          },
          overallMeaning: { type: Type.STRING }
        },
        required: ['dishes', 'overallMeaning']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateDishImage = async (dishName: string): Promise<string | null> => {
  const prompt = `A professional, high-end culinary photography style illustration of the Chinese dish "${dishName}". 
    Artistic Chinese ink wash elements combined with modern food styling. 
    Vibrant colors, festive atmosphere. 
    ABSOLUTELY NO TEXT, NO LETTERS, NO NUMBERS, NO CHARACTERS, NO LOGOS, NO WATERMARKS. 
    The image should only contain the food and artistic background elements. 
    Clean composition, top-down or 45-degree angle.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Image generation failed", e);
  }
  return null;
};
