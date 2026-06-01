const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const determineQuesType = (modelAnswer) => {
  const wordCount = countWords(modelAnswer);
  return wordCount > 30 ? 'broad' : 'short';
};

const generateQuestionGenerationPrompt = (subjectName, gradeName, questionCount, questionType) => {
  const prompt = questionType == "mcq" ? `# CRITICAL INSTRUCTION: STRICT ADHERENCE REQUIRED

You are an expert educational content creator specializing in ${subjectName} for ${gradeName} students.

## ABSOLUTE CONSTRAINTS

### 1. SUBJECT RESTRICTION
- ONLY create questions from ${subjectName} - ${gradeName}
- NO external/general knowledge

### 2. QUESTION TYPE
- ONLY MCQ (Multiple Choice Questions)
- Each question MUST have:
  - 4 options
  - 1 correct answer
- Model answer MUST be ≤ 30 words

### 3. QUANTITY
- EXACTLY ${questionCount} questions (no more, no less)

### 4. CATEGORY BALANCE
- 60% conceptual
- 40% numerical (basic calculations related to ${subjectName} )

### 5. DIFFICULTY → MARK LOGIC
| Difficulty | Marks |
|------------|--------|
| easy       | 1      |
| medium     | 2      |
| hard       | 3      |

### 6. SKILL SET (2-4 per question)
Choose from:
Analytical thinking, Problem solving, Critical thinking, Application, Comprehension, Analysis, Logical reasoning, Memory recall, Interpretation, Calculation, Definition recall, Explanation

## OUTPUT FORMAT (STRICT JSON)


{
  "questions": [
    {
      "quesText": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "string",
      "quesModelAnswer": "≤30 words explanation",
      "difficultyLevel": "easy|medium|hard",
      "quesCategory": "numerical|conceptual",
      "skillSet": ["skill1", "skill2"]
    }
  ]
}

## FINAL CHECK
- Total = ${questionCount}
- All MCQs
- 4 options each
- Correct answer present
- Answer ≤30 words` : `# CRITICAL INSTRUCTION: STRICT ADHERENCE REQUIRED

You are an expert educational content creator specializing in ${subjectName} for ${gradeName} students.

## ABSOLUTE CONSTRAINTS

### 1. SUBJECT RESTRICTION
- ONLY create questions from ${subjectName} - ${gradeName}
- NO external/general knowledge

### 2. QUESTION TYPE
- ONLY DESCRIPTIVE QUESTIONS
- NO MCQ, NO objective types

### 3. QUANTITY
- EXACTLY ${questionCount} questions

### 4. ANSWER LENGTH TYPES

#### SHORT:
- ≤ 30 words
- Marks:
  - easy → 1
  - medium → 2
  - hard → 3

#### BROAD:
- > 30 words
- Marks:
  - easy → 3
  - medium → 4
  - hard → 5

### 5. BALANCE REQUIREMENT
- ~50% SHORT answers
- ~50% BROAD answers

### 6. CATEGORY BALANCE
- 60% conceptual
- 40% numerical (basic sustainability calculations, resource usage, etc.)

### 7. SKILL SET (2-4 per question)
Choose from:
Analytical thinking, Problem solving, Critical thinking, Application, Comprehension, Analysis, Logical reasoning, Memory recall, Interpretation, Calculation, Explanation, Comparison

## OUTPUT FORMAT (STRICT JSON)

{
  "questions": [
    {
      "quesText": "string",
      "quesModelAnswer": "string (≤30 OR >30 words)",
      "difficultyLevel": "easy|medium|hard",
      "quesCategory": "numerical|conceptual",
      "skillSet": ["skill1", "skill2"]
    }
  ]
}

## FINAL CHECK
- Total = ${questionCount}
- All descriptive
- ~50% short / ~50% broad answers
- No MCQ fields included
`
  return prompt;
};


module.exports = {
  generateQuestionGenerationPrompt,
  countWords,
  determineQuesType
};