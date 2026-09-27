import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json();

    const prompt = `You are an expert tech recruiter and ATS resume optimizer.
Rewrite the following resume to perfectly highlight the skills and keywords found in the target job description. 
Ensure the tone is professional, impactful, and truthful.

CURRENT RESUME:
${resume}

TARGET JOB DESCRIPTION:
${jobDescription}

Output the final tailored resume in clean text format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Failed to optimize resume' }, { status: 500 });
  }
}
