import { GoogleGenAI, Type } from "@google/genai";
import { DSInfo } from '../types';

const fetchDSInfo = async (dsName: string): Promise<DSInfo | null> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Provide a high-level description and detailed theory for the ${dsName} data structure.
    The theory section must include:
    1. A "Time Complexity" markdown table for major operations (e.g., Access, Search, Insertion, Deletion) covering Best, Average, and Worst cases.
    2. A "Space Complexity" description.
    3. A bulleted list of "Use Cases".
    4. A bulleted list of "Real-world Examples".
    Format the output as JSON using the provided schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A concise, high-level description of the data structure."
            },
            theory: {
              type: Type.OBJECT,
              properties: {
                timeComplexity: {
                  type: Type.STRING,
                  description: "A markdown table of time complexities (Best, Average, Worst)."
                },
                spaceComplexity: {
                  type: Type.STRING,
                  description: "The space complexity of the data structure."
                },
                useCases: {
                  type: Type.STRING,
                  description: "A markdown bulleted list of common use cases."
                },
                realWorldExamples: {
                  type: Type.STRING,
                  description: "A markdown bulleted list of real-world examples."
                }
              },
            }
          }
        },
      },
    });

    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    return data as DSInfo;

  } catch (error) {
    console.error(`Error fetching data for ${dsName}:`, error);
    return {
      description: "Error fetching description. Please check your API key and network connection.",
      theory: {
        timeComplexity: "N/A",
        spaceComplexity: "N/A",
        useCases: "N/A",
        realWorldExamples: "N/A"
      }
    };
  }
};

export default fetchDSInfo;
