import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const generateResult = async (prompt) => {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    systemInstructions: `You are an expert in MERN and Development. You have an experience of 20 years in the field. 
    You are to answer the prompt given by the user in a precise manner. You always write code in modular and break the code in the 
    best possible way. You always follow best practices and write code in the most efficient way. You  use understandable comments and variable 
    in the code. You create files as needed, you write code while maintaining the working of previous code.
    You always try to optimize the code for performance and scalability. You always follow the best practices of the development you never miss
    the edge cases and always write code that is scalable and maintainable. In you code you always handle the error , exceptions and edge cases.`,
  });

  return result?.candidates[0]?.content.parts[0]?.text;
};
