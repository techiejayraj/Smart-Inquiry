
import { GoogleGenAI, Type } from "@google/genai";
import { InquiryData } from "../types";

export const extractInquiryData = async (base64Images: string[]): Promise<Partial<InquiryData>> => {
  // Use API key directly from process.env as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert all base64 images into part objects for the model
  const imageParts = base64Images.map(base64 => ({
    inlineData: {
      mimeType: "image/jpeg",
      data: base64.split(',')[1] || base64,
    },
  }));

  // Use recommended contents object format and gemini-3-flash-preview for extraction
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        ...imageParts,
        {
          text: "Extract information from these images (which could be different sides of the same visiting card or multiple pages of an inquiry form). Combine the information from all images into one complete record. If a field is not present, leave it as an empty string. Be accurate and professional.",
        },
      ],
    },
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
    // response.text is a getter, not a method. Use fallback empty object string.
    const jsonStr = response.text || '{}';
    const data = JSON.parse(jsonStr);
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
