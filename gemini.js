/**
 * GradeAI Gemini API Connector
 * Interfaces directly with the Google Gemini 1.5 Flash API.
 */

export async function gradeStudentPaper({
  apiKey,
  subject,
  questionPaperFile, // { mimeType, base64Data } (Optional)
  answerKeyFile,     // { mimeType, base64Data } (Required)
  studentName,       // string
  studentAnswerFiles, // Array of { mimeType, base64Data } (Required)
  keywords = []      // Array of strings
}) {
  if (!apiKey) {
    throw new Error("Gemini API key is required.");
  }

  // We will configure a fallback chain of endpoints in the fetch loop below.


  // Build the prompt instruction
  const keywordsStr = keywords.length > 0 ? keywords.map(k => `"${k}"`).join(", ") : "None specified. Please auto-detect relevant academic/scientific keywords based on the answer key.";
  
  let subjectRubric = "";
  if (subject === "Math") {
    subjectRubric = `
    - Math step-checking: Read the mathematical calculations step-by-step.
    - Check intermediate steps for algebraic and arithmetic correctness.
    - If a student makes an arithmetic error but followed the correct logic/formula, award partial marks for the correct parts and deduct points only for the error.
    - Explicitly list the steps evaluated in the "stepBreakdown" array.`;
  } else if (subject === "Science" || subject === "Social") {
    subjectRubric = `
    - Factual accuracy & keywords: Check if the student's answer covers the core concepts in the Answer Key. Look specifically for these target keywords: ${keywordsStr}. Also auto-detect other crucial technical terms from the answer key.
    - Sentence formation: Evaluate the quality of sentence structure, clarity of explanation, and logical flow.
    - Feedback: Note where incorrect scientific/social terms were used (e.g. 'green color' instead of 'chlorophyll pigment', or 'king' instead of 'monarchy' or 'Louis XVI') and recommend improvements.`;
  } else {
    // English or Languages
    subjectRubric = `
    - Grammar, spelling & vocabulary: Evaluate spelling, grammar, vocabulary, punctuation, and sentence structures.
    - Coherence & relevance: Rate how well the passage flows, its descriptive/critical quality, and how relevant it is to the question.
    - Feedback: Identify spelling errors, run-on sentences, comma splices, or incorrect syntax. Suggest corrections.`;
  }

  const promptText = `
You are an expert teacher and exam corrector grading a ${subject} paper for a student named "${studentName}".
Analyze the attached files:
1. Question Paper: (Provided if attached. Otherwise, infer the questions from the Answer Key)
2. Teacher's Answer Key: (This is the absolute reference for correct answers and marks allocation)
3. Student's Answer Sheet: (This contains the handwritten/typed answers from the student)

Your task is to:
1. Perform OCR on the Student's Answer Sheet to extract their written answers.
2. Cross-reference the student's answers with the Teacher's Answer Key and Question Paper.
3. Apply the following subject-specific grading rubric:
${subjectRubric}
4. Allocate marks for each question. The total sum of scores of all questions must equal "totalScore". The maxScore must match the sum of all question maxMarks from the Answer Key.

You must output a single JSON object. Do not include markdown code block formatting (like \`\`\`json ... \`\`\`) in the response, just return the raw JSON string.

Strictly adhere to the following JSON structure:
{
  "studentName": "${studentName}",
  "subject": "${subject}",
  "date": "${new Date().toISOString().split('T')[0]}",
  "totalScore": 14.5,
  "maxScore": 20,
  "overallFeedback": "Detailed summary of the student's performance, highlighting strengths and major areas for improvement.",
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Full text of the question",
      "maxMarks": 5,
      "score": 4.5,
      "studentAnswerText": "The text extracted from the student's answer sheet for this question.",
      "keywordsFound": ["keyword1", "keyword2"], // Keywords found in the student's response
      "keywordsMissed": ["keyword3"], // Keywords from target list or answer key that were missing
      "sentenceFormationScore": 9, // Rate from 1 to 10 based on grammar and sentence structure
      "sentenceFormationFeedback": "Detailed evaluation of their writing, grammar, sentence structure, or spelling.",
      "stepBreakdown": [
        {
          "step": "Identify factors",
          "marks": 1.5,
          "max": 1.5,
          "status": "correct" // "correct", "incorrect", "partial"
          "comment": "Identified factors -2 and -3 correctly"
        }
      ],
      "evaluationFeedback": "Specific feedback explaining the marks allocated and where points were lost.",
      "markupCoords": [
        {
          "type": "check", // Choose from: "check" (correct), "error" (incorrect/mistake), "underline" (suggestion/spelling error), "circle" (missing item/focus area)
          "text": "Correction tooltip comment"
        }
      ]
    }
  ]
}
`;

  // Construct request parts
  const parts = [];

  // Add files
  if (questionPaperFile && questionPaperFile.base64Data) {
    parts.push({
      inlineData: {
        mimeType: questionPaperFile.mimeType,
        data: questionPaperFile.base64Data
      }
    });
    // Add text describing this part
    parts.push({ text: "This file is the Question Paper." });
  }

  if (answerKeyFile && answerKeyFile.base64Data) {
    parts.push({
      inlineData: {
        mimeType: answerKeyFile.mimeType,
        data: answerKeyFile.base64Data
      }
    });
    parts.push({ text: "This file is the Teacher's Answer Key." });
  }

  studentAnswerFiles.forEach((file, index) => {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.base64Data
      }
    });
    parts.push({ text: `This file is Page ${index + 1} of the Student's Answer Sheet.` });
  });

  // Add the final text prompt
  parts.push({ text: promptText });

  const requestBody = {
    contents: [
      {
        parts: parts
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  ];

  let lastError = null;

  for (const endpointUrl of endpoints) {
    try {
      const modelFriendlyName = endpointUrl.match(/\/models\/([^:]+):/)[1];
      const apiVersion = endpointUrl.includes('/v1beta/') ? 'v1beta' : 'v1';
      console.log(`GradeAI: Attempting grading with ${modelFriendlyName} (${apiVersion})...`);

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Request Failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response candidates returned from Gemini API.");
      }

      const jsonText = data.candidates[0].content.parts[0].text;
      
      // Clean up response text if Gemini ignored instructions and wrapped it in markdown code blocks
      let cleanJson = jsonText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      console.log(`GradeAI: Grading successful using ${modelFriendlyName} (${apiVersion}).`);
      return JSON.parse(cleanJson);
    } catch (error) {
      const modelFriendlyName = endpointUrl.match(/\/models\/([^:]+):/)[1];
      const apiVersion = endpointUrl.includes('/v1beta/') ? 'v1beta' : 'v1';
      console.warn(`GradeAI: Endpoint ${modelFriendlyName} (${apiVersion}) failed. Trying next fallback... Error:`, error.message);
      lastError = error;
    }
  }

  // If we get here, all endpoints failed
  throw new Error(`Grading failed after trying all fallback endpoints. Last error: ${lastError ? lastError.message : "Unknown error"}`);
}
