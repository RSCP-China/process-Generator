import { GoogleGenAI, Type } from "@google/genai";
import { type ChartData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise title for the entire process chart."
        },
        roles: {
            type: Type.ARRAY,
            description: "The list of roles or departments involved, acting as the rows of the matrix.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The name of the role (e.g., 'Sales Team')." },
                    description: { type: Type.STRING, description: "A brief, one-sentence description of the role's responsibility." }
                },
                required: ["title", "description"]
            }
        },
        steps: {
            type: Type.ARRAY,
            description: "The sequential steps of the process, acting as the columns of the matrix.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The name of the step (e.g., '1. Kick-off')." },
                    description: { type: Type.STRING, description: "A brief, one-sentence description of the step's purpose." }
                },
                required: ["title", "description"]
            }
        },
        tasks: {
            type: Type.ARRAY,
            description: "A 2D array representing the matrix. The outer array corresponds to roles (rows), and the inner array corresponds to steps (columns). Each cell contains a task object or null if no task exists for that intersection.",
            items: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    nullable: true,
                    properties: {
                        description: { type: Type.STRING, description: "A concise description of the task at the intersection of a role and a step." },
                        icon: {
                            type: Type.STRING,
                            description: "The most appropriate icon for the task.",
                            enum: ["TASK", "COMMUNICATION", "DECISION", "APPROVAL", "DATA"]
                        }
                    },
                    required: ["description", "icon"]
                }
            }
        }
    },
    required: ["title", "roles", "steps", "tasks"]
};

export const generateProcessChart = async (prompt: string, image: { data: string; mimeType: string } | null): Promise<ChartData> => {
    const systemInstruction = `你是一位业务流程分析师。你的任务是根据用户的流程描述，将其转换为结构化的矩阵式流程图。
- 识别关键角色（执行者/部门）并列出。这些将作为矩阵的行。
- 识别流程中的主要顺序步骤。这些将作为矩阵的列。
- 为每个角色和步骤的交叉点定义具体的任务。如果某个角色在特定步骤中没有任务，则该值应为 null。
- 确保 'tasks' 中的内部数组数量与角色数量相匹配，并且每个内部数组的长度与步骤数量相匹配。
- 为整个流程提供一个标题。
- 输出必须是符合所提供 schema 的有效 JSON 对象。`;

    let requestContents: any;

    if (image) {
         const imagePart = {
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        };

        const textPart = {
            text: `分析提供的白板草图图片。它展示了一个矩阵式流程图。提取角色、步骤和任务以生成结构化的流程图。角色位于行，步骤位于列。如果用户提供了额外的文本，请将其用作上下文：“${prompt}”。根据提供的 schema 生成一个 JSON 对象。`
        };
        
        requestContents = { parts: [imagePart, textPart] };
    } else {
        requestContents = `为以下描述生成一个流程图：“${prompt}”`;
    }


    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: requestContents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText) as ChartData;
        return parsedData;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("未能从 AI 获得有效响应。请检查您的提示并重试。");
    }
};