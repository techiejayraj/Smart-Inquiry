
import { GoogleGenAI, Type } from "@google/genai";
import { InquiryData } from "../types";

export const extractInquiryData = async (base64Image: string): Promise<Partial<InquiryData>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "Extract information from this visiting card or inquiry form image. If a field is not present, leave it as an empty string. Be accurate and professional.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          contactPerson: { type: Type.STRING },
          contactNumber: { type: Type.STRING },
          emailId: { type: Type.STRING },
          inquiryRequirements: { type: Type.STRING },
          designation: { type: Type.STRING },
          website: { type: Type.STRING },
          corporateAddress: { type: Type.STRING },
          factoryAddress: { type: Type.STRING },
          telephoneNumber: { type: Type.STRING },
        },
        required: [
          "companyName", "contactPerson", "contactNumber", "emailId"
        ],
      },
    },
  });

  try {
    const data = JSON.parse(response.text);
    return {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Could not parse extracted data");
  }
};
