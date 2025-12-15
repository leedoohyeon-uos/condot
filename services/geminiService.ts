
import { GoogleGenAI, Type } from "@google/genai";
import { FolderCategory } from "../types";
import { PREDEFINED_KEYWORDS } from "../constants";

const apiKey = process.env.API_KEY || "";

// Helper to prevent empty key errors during development if env is missing
const getAI = () => {
  if (!apiKey) {
    console.warn("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeExperienceWithGemini = async (inputText: string) => {
  const ai = getAI();
  
  const prompt = `
    You are a career archivist expert. Analyze the following user experience text (in Korean) and structure it into a career data object.
    
    User Input: "${inputText}"

    Requirements:
    1. Identify a suitable category from this list: ${Object.values(FolderCategory).join(", ")}.
    2. Extract a title and date range (YYYY.MM - YYYY.MM). If year is unclear, estimate or use current year.
    3. Select relevant keywords from: ${PREDEFINED_KEYWORDS.join(", ")}.
    4. Create a structured portfolio content including:
       - Overview (One line summary)
       - Role (What the user did)
       - Skills Used
       - Outcomes (Results)
       - Learned (What they learned)
    5. All text output must be in Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            dateRange: { type: Type.STRING },
            year: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            category: { type: Type.STRING, enum: Object.values(FolderCategory) },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            content: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                role: { type: Type.STRING },
                skills_used: { type: Type.ARRAY, items: { type: Type.STRING } },
                outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                learned: { type: Type.STRING }
              },
              required: ["overview", "role", "skills_used", "outcomes", "learned"]
            }
          },
          required: ["title", "dateRange", "year", "summary", "category", "keywords", "content"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const modifyExperienceWithGemini = async (currentData: any, userInstruction: string) => {
  const ai = getAI();

  const prompt = `
    You are a career data assistant. 
    Update the following JSON data based on the user's specific instruction.
    Maintain the same JSON structure. Only modify the fields requested by the user or implied by the context.
    
    Current Data:
    ${JSON.stringify(currentData, null, 2)}

    User Instruction:
    "${userInstruction}"

    Return the updated JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            dateRange: { type: Type.STRING },
            year: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            category: { type: Type.STRING, enum: Object.values(FolderCategory) },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            content: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                role: { type: Type.STRING },
                skills_used: { type: Type.ARRAY, items: { type: Type.STRING } },
                outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                learned: { type: Type.STRING }
              },
              required: ["overview", "role", "skills_used", "outcomes", "learned"]
            }
          },
          required: ["title", "dateRange", "year", "summary", "category", "keywords", "content"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response generated for modification");
  } catch (error) {
    console.error("Gemini Modification Error:", error);
    throw error;
  }
};

export const generateCoverLetterWithGemini = async (jobPosting: string, experiences: any[], references: any[] = []) => {
  const ai = getAI();

  // Flatten experiences for context
  const experienceContext = experiences.map(exp => 
    `- Title: ${exp.title}\n- Category: ${exp.category}\n- Role: ${exp.content.role}\n- Outcome: ${exp.content.outcomes.join(", ")}\n- Learned: ${exp.content.learned}`
  ).join("\n\n");
  
  // Flatten references for RAG context
  const referenceContext = references.map(ref =>
    `- Company: ${ref.company}\n- Role: ${ref.jobRole}\n- Q: ${ref.question}\n- A: ${ref.answer.substring(0, 200)}...`
  ).join("\n\n");

  const prompt = `
    You are a professional career consultant. Write a cover letter (자기소개서) in Korean based on the user's experiences and the target job posting.
    
    Use the provided "Successful Reference Examples" (RAG Data) as a style guide for tone and structure, but do NOT copy their content.

    Target Job Posting:
    "${jobPosting}"

    User's Available Experiences Archive:
    ${experienceContext}
    
    Successful Reference Examples (Style Guide):
    ${referenceContext || "None provided."}

    Instructions:
    1. Analyze the job posting to understand the key requirements.
    2. Select the most relevant experiences from the user's archive to prove they fit the job.
    3. Write a structured cover letter with:
       - Introduction (Motivation)
       - Body Paragraphs (connecting experiences to job requirements)
       - Conclusion (Ambition)
    4. Tone: Professional, confident, and sincere.
    5. Length: Around 500-700 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "자기소개서 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini Cover Letter Error:", error);
    throw error;
  }
};

// --- New Functions for Recommendations & RAG ---

export const parseReferenceMaterial = async (rawText: string) => {
    const ai = getAI();
    const prompt = `
      Analyze the following text which contains a successful job application essay (cover letter).
      Extract the Company Name, Job Role, Question asked, the Answer text, and Key Capabilities demonstrated.
      
      Input Text:
      "${rawText}"
      
      Output JSON with fields: company, jobRole, question, answer, keyCapabilities (array of strings).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        company: { type: Type.STRING },
                        jobRole: { type: Type.STRING },
                        question: { type: Type.STRING },
                        answer: { type: Type.STRING },
                        keyCapabilities: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Reference Parse Error:", error);
        throw error;
    }
};

export const predictCareerPaths = async (experiences: any[]) => {
    const ai = getAI();
    const context = experiences.map(e => `${e.title} (${e.category}): ${e.keywords.join(", ")}`).join("\n");
    
    const prompt = `
      Based on the following career history of a university student, predict 3 potential future job roles they are well-suited for.
      For each role, provide a compatibility score (0-100), reasoning, and specific additional experiences they should acquire to secure this role.
      
      User History:
      ${context}
      
      Output JSON array of objects: { role, compatibility, reasoning, recommendedExperiences }.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING },
                            compatibility: { type: Type.NUMBER },
                            reasoning: { type: Type.STRING },
                            recommendedExperiences: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error("Prediction Error:", error);
        throw error;
    }
};

export const analyzeCareerGap = async (targetRole: string, experiences: any[]) => {
    const ai = getAI();
    const context = experiences.map(e => `${e.title}: ${e.keywords.join(", ")}`).join("\n");
    
    const prompt = `
      The user wants to become a "${targetRole}".
      Analyze their current experience list and identify what is missing compared to industry standards for this role.
      
      Current Experience:
      ${context}
      
      Output JSON: { targetRole, currentMatch (list of relevant things they have), missingSkills (list), actionPlan (list of concrete steps) }.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        targetRole: { type: Type.STRING },
                        currentMatch: { type: Type.ARRAY, items: { type: Type.STRING } },
                        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Gap Analysis Error:", error);
        throw error;
    }
};