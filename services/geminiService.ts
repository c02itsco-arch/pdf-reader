import { GoogleGenAI, Type, Part } from "@google/genai";
import { Asset } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_API_KEY is not defined in environment variables. Please check your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            assetId: {
                type: Type.STRING,
                description: 'รหัสทรัพย์สิน (Asset ID)',
            },
            model: {
                type: Type.STRING,
                description: 'รุ่น, โมเดล, หรือยี่ห้อ (Model or Brand)',
            },
            serialNumber: {
                type: Type.STRING,
                description: 'Serial Number หรือ S/N',
            },
            location: {
                type: Type.STRING,
                description: 'สถานที่ติดตั้ง เช่น กฟส. [ชื่อ] หรือ กฟภ. [ชื่อ]',
            },
            category: {
                type: Type.STRING,
                description: 'หมวดหมู่ของอุปกรณ์ (เช่น Monitor, PC, Printer, UPS, Laptop)',
            }
        },
        required: ['assetId', 'model', 'serialNumber', 'location', 'category'],
    },
};

export const analyzeAssetDocuments = async (images: string[]): Promise<Asset[]> => {
  try {
    const imageParts: Part[] = images.map(imageData => {
        const base64Data = imageData.split(',')[1];
        return {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
            }
        };
    });

    if (imageParts.length === 0) {
        throw new Error("No images provided for analysis.");
    }

    const textPart: Part = {
        text: `จากรูปภาพเอกสารทรัพย์สินต่อไปนี้ กรุณาอ่านข้อความในภาพ (OCR) และสกัดข้อมูลของทรัพย์สินแต่ละรายการ:
        1. รหัสทรัพย์สิน
        2. รุ่น / โมเดล / ยี่ห้อ
        3. Serial Number (SN)
        4. สถานที่ (เช่น กฟส. หรือ กฟภ.)
        5. หมวดหมู่ (Category): กรุณาจัดหมวดหมู่ของทรัพย์สินแต่ละรายการให้ชัดเจน โดยใช้ค่าที่เป็นไปได้ เช่น "PC", "Monitor", "Printer", "Laptop", "UPS", "Network Device", หรือ "Other" หากไม่สามารถระบุได้
        
        รวบรวมข้อมูลทั้งหมดลงในอาร์เรย์ JSON เดียว หากไม่พบข้อมูลส่วนใดสำหรับทรัพย์สินรายการใดรายการหนึ่ง ให้ใช้ค่าเป็น "N/A"
        `
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [textPart, ...imageParts] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    
    if (!Array.isArray(parsedData)) {
      throw new Error("API response is not an array.");
    }
    
    // Simple validation and mapping
    return parsedData.map((item: any) => ({
      assetId: item.assetId ?? 'N/A',
      model: item.model ?? 'N/A',
      serialNumber: item.serialNumber ?? 'N/A',
      location: item.location ?? 'N/A',
      category: item.category ?? 'Uncategorized'
    }));

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('ไม่สามารถประมวลผลเอกสารกับ Gemini API ได้');
  }
};
