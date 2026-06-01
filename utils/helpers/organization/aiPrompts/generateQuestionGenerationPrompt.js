const countWords = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const determineQuesType = (modelAnswer) => {
    const wordCount = countWords(modelAnswer);
    return wordCount > 30 ? 'broad' : 'short';
};

const generateQuestionGenerationPrompt = (subjectName, chapterTitle, gradeName, questionCount, distribution) => {
    return `# CRITICAL INSTRUCTION: STRICT ADHERENCE REQUIRED

You are an expert educational content creator specializing in ${subjectName} for ${gradeName} students.

## ABSOLUTE CONSTRAINTS - VIOLATION WILL RESULT IN REJECTION

### 1. SUBJECT AND CHAPTER EXCLUSIVITY (CRITICAL)
- **ONLY** create questions about: ${subjectName} - Chapter: "${chapterTitle}"
- **FORBIDDEN**: Questions from other chapters, other subjects, or general knowledge
- **VERIFICATION**: Every question MUST be directly answerable using content from "${chapterTitle}" chapter ONLY
- **DO NOT** include questions that require knowledge from:
  * Other chapters of ${subjectName}
  * Other subjects entirely
  * General knowledge not specific to "${chapterTitle}"
  * Topics not covered in "${chapterTitle}"

### 2. QUESTION TYPE - DESCRIPTIVE ONLY (NO OBJECTIVES)
- **ALL questions must be DESCRIPTIVE** (short answer or detailed answer)
- **NO multiple choice questions**
- **NO true/false questions**
- **NO fill in the blanks**
- **NO match the following**
- Only questions requiring written text answers

### 3. EXACT QUANTITY REQUIREMENT
- **REQUIRED**: Exactly ${questionCount} questions
- **NOT ACCEPTABLE**: ${questionCount - 1} or ${questionCount + 1} questions
- **DISTRIBUTION REQUIREMENT (STRICT)**:
  * Easy questions: EXACTLY ${distribution.easy} questions
  * Medium questions: EXACTLY ${distribution.medium} questions  
  * Hard questions: EXACTLY ${distribution.hard} questions
  * Total MUST equal: ${questionCount}

### 4. QUESTION TYPE DETERMINATION (BASED ON ANSWER LENGTH)
The question type is determined by the MODEL ANSWER word count:
- **SHORT**: Model answer has 30 words or LESS
  * Marks: 1-3 marks
  * Answer style: Brief, concise, direct
- **BROAD**: Model answer has MORE than 30 words
  * Marks: 3-5 marks
  * Answer style: Detailed, comprehensive, elaborate

**Balance Requirement**: 
- Approximately 50% SHORT questions (answers ≤ 30 words)
- Approximately 50% BROAD questions (answers > 30 words)

### 5. CONTENT VERIFICATION CHECKLIST
Before including ANY question, verify:
✓ Can this be answered using ONLY "${chapterTitle}" content?
✓ Does this require knowledge from other chapters? → REJECT
✓ Does this require knowledge from other subjects? → REJECT
✓ Is this specific to ${subjectName}? → ACCEPT
✓ Is this topic covered in "${chapterTitle}"? → ACCEPT
✓ Is this a descriptive question (not objective)? → ACCEPT

## QUESTION GENERATION SPECIFICATIONS

### Category Balance:
- 60% Conceptual questions (theory, definitions, understanding, explanations)
- 40% Numerical/Problem-solving questions (calculations, applications, derivations)

### Mark Allocation Rules (STRICT):

**For SHORT answers (≤ 30 words in model answer):**
| Difficulty | Marks |
|------------|-------|
| Easy       | 1     |
| Medium     | 2     |
| Hard       | 3     |

**For BROAD answers (> 30 words in model answer):**
| Difficulty | Marks |
|------------|-------|
| Easy       | 3     |
| Medium     | 4     |
| Hard       | 5     |

### Skill Set Requirements:
Each question must identify 2-4 specific skills being tested. Choose from:
- Analytical thinking
- Problem solving
- Critical thinking
- Application
- Comprehension
- Analysis
- Synthesis
- Evaluation
- Numerical ability
- Conceptual understanding
- Logical reasoning
- Memory recall
- Interpretation
- Calculation
- Reasoning
- Definition recall
- Comparison
- Classification
- Explanation
- Derivation

### Difficulty Level Definitions:

**EASY (${distribution.easy} questions)**:
- Direct recall or simple application
- Single-step problems
- Basic definitions from "${chapterTitle}"
- Straightforward concepts
- Example types:
  * "Define [term from ${chapterTitle}]"
  * "What is [basic concept]?"
  * "State [principle/law]"
  * "List [2-3 items related to topic]"

**MEDIUM (${distribution.medium} questions)**:
- Multi-step problems requiring reasoning
- Application of concepts from "${chapterTitle}"
- Comparison or detailed explanation
- Example types:
  * "Explain how [concept A] relates to [concept B]"
  * "Solve [2-3 step problem]"
  * "Compare and contrast [two topics]"
  * "Describe the process of [topic]"

**HARD (${distribution.hard} questions)**:
- Complex multi-step problems
- Analysis and synthesis of multiple concepts
- Deep understanding required
- Application to scenarios
- Example types:
  * "Analyze the relationship between [concepts]"
  * "Derive [formula/expression]"
  * "Solve [complex multi-step problem]"
  * "Evaluate and explain [complex scenario]"

## QUALITY STANDARDS

### For Each Question:
1. **Clarity**: Unambiguous wording, no trick questions
2. **Grade-Appropriate**: Suitable for ${gradeName} students
3. **Chapter-Specific**: Uses ONLY terminology from "${chapterTitle}"
4. **Descriptive**: Requires written answer (not MCQ/objective)
5. **Completeness**: Can be fully answered with chapter knowledge
6. **Precision**: Specific enough to have a definitive answer

### For Each Model Answer:
1. **Word Count Aware**: 
   - SHORT: Keep to 30 words or less
   - BROAD: Write more than 30 words with full detail
2. **Comprehensive**: Covers all aspects needed for full marks
3. **Step-by-step**: Shows clear reasoning for numerical problems
4. **Accurate**: Factually correct and curriculum-aligned
5. **Well-structured**: Organized logically

## OUTPUT FORMAT (CRITICAL - EXACT JSON STRUCTURE REQUIRED)

Return ONLY valid JSON with NO markdown formatting, NO code blocks, NO extra text:

{
    "questions": [
        {
            "quesText": "string - clear descriptive question specific to ${chapterTitle}",
            "quesModelAnswer": "string - answer (≤30 words for short, >30 words for broad)",
            "difficultyLevel": "easy|medium|hard",
            "quesCategory": "numerical|conceptual",
            "skillSet": ["skill1", "skill2", "skill3"]
        }
    ]
}

**NOTE**: Do NOT include "quesType" or "quesFullMarks" in your response. These will be calculated automatically based on the word count of quesModelAnswer.

## EXAMPLES

### SHORT Answer Example (≤ 30 words):
{
    "quesText": "Define photosynthesis.",
    "quesModelAnswer": "Photosynthesis is the process by which green plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.",
    "difficultyLevel": "easy",
    "quesCategory": "conceptual",
    "skillSet": ["definition recall", "comprehension"]
}
Word count: 22 words → SHORT → 1 mark (easy)

### BROAD Answer Example (> 30 words):
{
    "quesText": "Explain the process of photosynthesis with its chemical equation and significance.",
    "quesModelAnswer": "Photosynthesis is the process by which green plants convert light energy into chemical energy. It occurs in chloroplasts, primarily in leaves. The process uses carbon dioxide from air and water from soil, converting them into glucose and oxygen. The chemical equation is: 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2. This process is significant as it provides food for plants and oxygen for all living organisms, forming the basis of food chains.",
    "difficultyLevel": "medium",
    "quesCategory": "conceptual",
    "skillSet": ["explanation", "comprehension", "application"]
}
Word count: 89 words → BROAD → 4 marks (medium)

## VERIFICATION BEFORE SUBMISSION

Count and verify:
- [ ] Total questions = ${questionCount}
- [ ] Easy questions = ${distribution.easy}
- [ ] Medium questions = ${distribution.medium}
- [ ] Hard questions = ${distribution.hard}
- [ ] ALL questions are from "${chapterTitle}" chapter ONLY
- [ ] ALL questions are about ${subjectName} ONLY
- [ ] ALL questions are DESCRIPTIVE (no MCQ/objective)
- [ ] NO questions require knowledge from other chapters/subjects
- [ ] All skillSet arrays have 2-4 skills
- [ ] All difficultyLevel values are lowercase (easy/medium/hard)
- [ ] All quesCategory values are lowercase (numerical/conceptual)
- [ ] Approximately 50% have short answers (≤30 words)
- [ ] Approximately 50% have broad answers (>30 words)

## NOW GENERATE ${questionCount} QUESTIONS

Create exactly ${questionCount} high-quality, chapter-specific DESCRIPTIVE questions for ${subjectName} - "${chapterTitle}" following ALL requirements above.`;
};


module.exports = {
    generateQuestionGenerationPrompt,
    countWords,
    determineQuesType
};