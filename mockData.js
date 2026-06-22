export const mockGradedPapers = [
  {
    id: "mock-1",
    studentName: "Sarah Chen",
    subject: "Math",
    date: "2026-06-18",
    totalScore: 16.5,
    maxScore: 20,
    overallFeedback: "Sarah demonstrates a strong understanding of quadratic equations. She followed the correct steps in all problems, but made an arithmetic error in Question 2 while simplifying the discriminant, which led to an incorrect final root. Standard steps were followed correctly elsewhere.",
    questions: [
      {
        questionNumber: 1,
        questionText: "Solve for x: x^2 - 5x + 6 = 0 using factorization.",
        maxMarks: 5,
        score: 5.0,
        studentAnswerText: "x^2 - 5x + 6 = 0\nWe need factors of 6 that add up to -5.\nThese are -2 and -3.\nSo, x^2 - 2x - 3x + 6 = 0\nx(x - 2) - 3(x - 2) = 0\n(x - 2)(x - 3) = 0\nTherefore, x - 2 = 0 or x - 3 = 0\nx = 2 or x = 3\nRoots are 2 and 3.",
        keywordsFound: ["factors", "roots", "factorization"],
        keywordsMissed: [],
        sentenceFormationScore: 10,
        sentenceFormationFeedback: "Clear step-by-step logical layout.",
        stepBreakdown: [
          { step: "Identify factors (-2, -3)", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Factorize groups x(x-2) - 3(x-2)", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Set factors to zero (x-2)(x-3)", marks: 1.0, max: 1.0, status: "correct" },
          { step: "Find final roots x=2, x=3", marks: 1.0, max: 1.0, status: "correct" }
        ],
        evaluationFeedback: "Perfect score. All steps are written clearly and logically. The factorization is flawless.",
        markupCoords: [
          { type: "check", x: 20, y: 15, text: "Correct factors" },
          { type: "check", x: 40, y: 35, text: "Good grouping" },
          { type: "check", x: 80, y: 75, text: "x = 2, 3" }
        ]
      },
      {
        questionNumber: 2,
        questionText: "Solve for x using the quadratic formula: 2x^2 - 7x + 3 = 0",
        maxMarks: 5,
        score: 3.5,
        studentAnswerText: "2x^2 - 7x + 3 = 0\na = 2, b = -7, c = 3\nFormula: x = [-b ± sqrt(b^2 - 4ac)] / 2a\nx = [-(-7) ± sqrt((-7)^2 - 4(2)(3))] / 2(2)\nx = [7 ± sqrt(49 - 24)] / 4\nx = [7 ± sqrt(25)] / 4\nx = [7 ± 6] / 4\nCase 1: x = (7+6)/4 = 13/4\nCase 2: x = (7-6)/4 = 1/4\nRoots are 13/4 and 1/4.",
        keywordsFound: ["quadratic formula", "roots"],
        keywordsMissed: [],
        sentenceFormationScore: 8,
        sentenceFormationFeedback: "Steps are clear, but there is a calculations error.",
        stepBreakdown: [
          { step: "Identify coefficients a, b, c", marks: 1.0, max: 1.0, status: "correct" },
          { step: "Substitute into formula correctly", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Simplify discriminant sqrt(25) = 5", marks: 0.0, max: 1.5, status: "incorrect", comment: "Arithmetic mistake: sqrt(25) calculated as 6 instead of 5." },
          { step: "Calculate final roots from discriminant", marks: 1.0, max: 1.0, status: "partial", comment: "Roots are calculated correctly based on the incorrect discriminant value." }
        ],
        evaluationFeedback: "Partial credit awarded. The student set up the quadratic equation and substitution perfectly. However, they simplified sqrt(25) as 6 rather than 5, leading to incorrect roots (should be 3 and 1/2).",
        markupCoords: [
          { type: "check", x: 30, y: 20, text: "Correct substitutions" },
          { type: "error", x: 65, y: 48, text: "sqrt(25) is 5, not 6" },
          { type: "circle", x: 75, y: 55, text: "Incorrect roots" }
        ]
      },
      {
        questionNumber: 3,
        questionText: "Find the vertex and direction of opening of the parabola: y = -3x^2 + 12x - 5",
        maxMarks: 10,
        score: 8.0,
        studentAnswerText: "y = -3x^2 + 12x - 5\nSince a = -3 is negative, the parabola opens downwards.\nTo find vertex, use x = -b / 2a\nx = -12 / (2 * -3) = -12 / -6 = 2\nNow plug x = 2 into equation to find y:\ny = -3(2)^2 + 12(2) - 5\ny = -3(4) + 24 - 5\ny = -12 + 24 - 5\ny = 7\nSo vertex is (2, 7).\nParabola opens downwards.",
        keywordsFound: ["opens downwards", "vertex"],
        keywordsMissed: [],
        sentenceFormationScore: 9,
        sentenceFormationFeedback: "Logic is clear and well explained.",
        stepBreakdown: [
          { step: "Determine direction of opening (downwards)", marks: 2.0, max: 2.0, status: "correct" },
          { step: "State vertex formula x = -b/2a", marks: 2.0, max: 2.0, status: "correct" },
          { step: "Calculate vertex x-coordinate (x = 2)", marks: 2.0, max: 2.0, status: "correct" },
          { step: "Substitute x to find y-coordinate (y = 7)", marks: 2.0, max: 2.0, status: "correct" }
        ],
        evaluationFeedback: "Excellent work. All steps correct, vertex coordinates (2, 7) are accurate, and direction is correct.",
        markupCoords: [
          { type: "check", x: 25, y: 15, text: "Correct direction" },
          { type: "check", x: 50, y: 35, text: "x = 2 is correct" },
          { type: "check", x: 80, y: 70, text: "Vertex (2, 7) is correct" }
        ]
      }
    ],
    handwrittenPaperHtml: `<div class="handwritten-paper math-paper">
      <div class="line">Q1. Solve $x^2 - 5x + 6 = 0$ by factorization</div>
      <div class="line indent">factors of 6 that add to $-5$ are $-2, -3$ <span class="teacher-markup check">✓</span></div>
      <div class="line indent">$x^2 - 2x - 3x + 6 = 0$</div>
      <div class="line indent">$x(x - 2) - 3(x - 2) = 0$ <span class="teacher-markup check">✓</span></div>
      <div class="line indent">$(x - 2)(x - 3) = 0$</div>
      <div class="line indent">$x = 2$ or $x = 3$ <span class="teacher-markup check">✓</span></div>
      <br>
      <div class="line">Q2. Quadratic Formula: $2x^2 - 7x + 3 = 0$</div>
      <div class="line indent">$a=2, b=-7, c=3$</div>
      <div class="line indent">$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ <span class="teacher-markup check">✓</span></div>
      <div class="line indent">$x = \\frac{7 \\pm \\sqrt{49 - 4(2)(3)}}{4}$</div>
      <div class="line indent">$x = \\frac{7 \\pm \\sqrt{49 - 24}}{4} = \\frac{7 \\pm \\sqrt{25}}{4}$</div>
      <div class="line indent">$x = \\frac{7 \\pm 6}{4}$ <span class="teacher-markup error">✗ <span class="tooltip">√25 is 5, not 6</span></span></div>
      <div class="line indent">Case 1: $x = \\frac{7+6}{4} = \\frac{13}{4}$</div>
      <div class="line indent">Case 2: $x = \\frac{7-6}{4} = \\frac{1}{4}$</div>
      <br>
      <div class="line">Q3. Find vertex: $y = -3x^2 + 12x - 5$</div>
      <div class="line indent">Since $a = -3 < 0$, opens downwards. <span class="teacher-markup check">✓</span></div>
      <div class="line indent">Vertex $x = \\frac{-b}{2a} = \\frac{-12}{-6} = 2$ <span class="teacher-markup check">✓</span></div>
      <div class="line indent">$y = -3(2)^2 + 12(2) - 5$</div>
      <div class="line indent">$y = -12 + 24 - 5 = 7$ <span class="teacher-markup check">✓</span></div>
      <div class="line indent">Vertex $= (2, 7)$ <span class="teacher-markup check">✓</span></div>
    </div>`
  },
  {
    id: "mock-2",
    studentName: "Liam Patel",
    subject: "Science",
    date: "2026-06-18",
    totalScore: 13.0,
    maxScore: 15,
    overallFeedback: "Liam has a good grasp of the photosynthesis mechanism and ecosystems. His answers contain most of the required key terms. However, in Question 2, his sentence formation was slightly convoluted when explaining the conversion of light energy, and he missed the keyword 'chloroplast' in his description, referring to it generally as 'leaf cell'.",
    questions: [
      {
        questionNumber: 1,
        questionText: "Define photosynthesis and write its balanced chemical equation.",
        maxMarks: 5,
        score: 4.5,
        studentAnswerText: "Photosynthesis is the process used by plants to convert light energy into chemical energy. Plants take in carbon dioxide and water from the environment. Using sunlight, they turn this into glucose and release oxygen. The equation is:\n6CO2 + 6H2O + light -> C6H12O6 + 6O2",
        keywordsFound: ["light energy", "carbon dioxide", "water", "glucose", "oxygen"],
        keywordsMissed: ["chloroplast"],
        sentenceFormationScore: 9,
        sentenceFormationFeedback: "Highly coherent and scientifically accurate definition. Logical flow is clear.",
        stepBreakdown: [
          { step: "Define light-to-chemical energy conversion", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Identify reactants and products correctly", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Provide balanced chemical equation", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Mention location of reaction (chloroplast)", marks: 0.0, max: 0.5, status: "incorrect", comment: "Missed mentioning chloroplasts as the specific site of the reaction." }
        ],
        evaluationFeedback: "Strong answer. The chemical equation is balanced and correct. The definition is excellent, but he missed specifying 'chloroplasts' as the site of reaction.",
        markupCoords: [
          { type: "check", x: 40, y: 18, text: "Excellent definition" },
          { type: "check", x: 80, y: 55, text: "Balanced equation correct" },
          { type: "circle", x: 50, y: 40, text: "Where does this occur? (Chloroplasts)" }
        ]
      },
      {
        questionNumber: 2,
        questionText: "Explain the role of chlorophyll in photosynthesis.",
        maxMarks: 5,
        score: 4.0,
        studentAnswerText: "Chlorophyll is the green color in leaves. It is important because it catches the sunlight. Without it, the plant cannot get energy from the sun. It is located inside the plant cells in the green parts.",
        keywordsFound: ["green", "sunlight", "energy"],
        keywordsMissed: ["absorb", "pigment", "chloroplast", "photons"],
        sentenceFormationScore: 7,
        sentenceFormationFeedback: "Sentence formation is somewhat basic. Uses informal terms like 'green color' instead of 'pigment' and 'catches' instead of 'absorbs'.",
        stepBreakdown: [
          { step: "Identify chlorophyll as a pigment", marks: 0.5, max: 1.0, status: "partial", comment: "Called it 'green color' instead of 'pigment'." },
          { step: "Explain light absorption function", marks: 1.5, max: 1.5, status: "correct", comment: "Correctly stated it catches/absorbs sunlight." },
          { step: "Explain energy conversion role", marks: 1.0, max: 1.5, status: "partial", comment: "Stated energy is obtained but doesn't explain excitation or activation energy." },
          { step: "Mention chloroplast localization", marks: 1.0, max: 1.0, status: "correct" }
        ],
        evaluationFeedback: "Factual understanding is present, but terminology is weak. Recommending vocabulary practice: use 'pigment' instead of 'color', and 'absorbs' instead of 'catches'.",
        markupCoords: [
          { type: "underline", x: 20, y: 15, text: "Use 'pigment' instead of 'color'" },
          { type: "check", x: 55, y: 30, text: "Correct function described" },
          { type: "underline", x: 75, y: 32, text: "Use 'absorbs' instead of 'catches'" }
        ]
      },
      {
        questionNumber: 3,
        questionText: "Why are plants called producers in an ecosystem?",
        maxMarks: 5,
        score: 4.5,
        studentAnswerText: "Plants are called producers because they produce food. They make food for themselves and for other animals using sunlight in photosynthesis. Animals cannot make their own food so they have to eat plants or other animals, making them consumers.",
        keywordsFound: ["produce", "food", "photosynthesis", "consumers"],
        keywordsMissed: ["autotrophs"],
        sentenceFormationScore: 8,
        sentenceFormationFeedback: "Clear and straightforward explanation, good contrast between producers and consumers.",
        stepBreakdown: [
          { step: "Define producer role (making own organic food)", marks: 2.0, max: 2.0, status: "correct" },
          { step: "Connect to photosynthesis process", marks: 1.5, max: 1.5, status: "correct" },
          { step: "Contrast with consumers / autotroph reference", marks: 1.0, max: 1.5, status: "partial", comment: "Explained consumers well but did not use the scientific term 'autotroph'." }
        ],
        evaluationFeedback: "Good explanation. The distinction between producers and consumers is clear. Adding the term 'autotrophs' would make this a top-tier scientific response.",
        markupCoords: [
          { type: "check", x: 30, y: 15, text: "Correct producer definition" },
          { type: "check", x: 70, y: 40, text: "Good contrast with consumers" }
        ]
      }
    ],
    handwrittenPaperHtml: `<div class="handwritten-paper science-paper">
      <div class="line">Q1. Photosynthesis is the process used by plants to convert light energy into chemical energy. <span class="teacher-markup check">✓</span></div>
      <div class="line">Plants take in carbon dioxide and water from the air. Using sunlight, they turn this into glucose and release oxygen. <span class="teacher-markup circle">? <span class="tooltip">Where in the cell does this happen? (chloroplast)</span></span></div>
      <div class="line">Equation: $6CO_2 + 6H_2O + \\text{light} \\rightarrow C_6H_{12}O_6 + 6O_2$ <span class="teacher-markup check">✓</span></div>
      <br>
      <div class="line">Q2. Chlorophyll is the <span class="teacher-markup underline">green color <span class="tooltip">Use 'pigment'</span></span> in leaves. It is important because it <span class="teacher-markup underline">catches <span class="tooltip">Use 'absorbs'</span></span> the sunlight. <span class="teacher-markup check">✓</span></div>
      <div class="line">Without it, the plant cannot get energy from the sun. It is located inside the plant cells.</div>
      <br>
      <div class="line">Q3. Plants are producers because they produce food. They make food for themselves and others via photosynthesis. <span class="teacher-markup check">✓</span></div>
      <div class="line">Animals cannot make food so they must eat plants or others. They are consumers. <span class="teacher-markup check">✓</span></div>
    </div>`
  },
  {
    id: "mock-3",
    studentName: "Emma Watson",
    subject: "English",
    date: "2026-06-18",
    totalScore: 9.0,
    maxScore: 10,
    overallFeedback: "Emma wrote a highly expressive and vocabulary-rich descriptive essay. Her sentence structures are varied and sophisticated. She missed 1 point due to minor spelling errors ('quiet' instead of 'quite', 'crystaline' instead of 'crystalline') and one comma splice in the second paragraph.",
    questions: [
      {
        questionNumber: 1,
        questionText: "Write a short descriptive passage about a forest in autumn (100-150 words).",
        maxMarks: 10,
        score: 9.0,
        studentAnswerText: "The forest in autumn was quiet spectacular. A carpet of amber and gold leaves covered the damp ground, crunching softly under my boots. The crisp air was filled with the earthy scent of pine and decay, a gentle reminder of the cycle of seasons. Sunlight filtered through the thinning canopy, casting long, dancing shadows across the trunks of ancient oaks. A cold breeze rustled the branches, sending a shower of copper leaves spinning down. The brook hummed in the background, its waters crystaline and freezing. It was a peaceful sanctuary, I wished I could stay there forever.",
        keywordsFound: ["autumn", "leaves", "canopy", "crisp air", "gold", "amber", "sanctuary"],
        keywordsMissed: [],
        sentenceFormationScore: 9,
        sentenceFormationFeedback: "Outstanding descriptive style. Sentence structures are varied, engaging, and show a mature grasp of rhythm. One comma splice detected in the final sentence.",
        stepBreakdown: [
          { step: "Relevance & Theme (Autumn Forest)", marks: 3.0, max: 3.0, status: "correct" },
          { step: "Sensory Details & Imagery", marks: 3.0, max: 3.0, status: "correct" },
          { step: "Grammar & Spelling accuracy", marks: 1.5, max: 2.0, status: "partial", comment: "Spelling errors: 'quiet' instead of 'quite' and 'crystaline' instead of 'crystalline'." },
          { step: "Punctuation & Sentence structure", marks: 1.5, max: 2.0, status: "partial", comment: "Comma splice in: 'It was a peaceful sanctuary, I wished...'" }
        ],
        evaluationFeedback: "Beautiful prose. The spelling mistakes and the comma splice are the only detractors. Suggest replacing the comma splice with a semicolon or splitting into two sentences.",
        markupCoords: [
          { type: "underline", x: 25, y: 15, text: "Spelling: Should be 'quite' instead of 'quiet'" },
          { type: "underline", x: 65, y: 65, text: "Spelling: Crystalline has double 'l'" },
          { type: "error", x: 80, y: 80, text: "Comma splice: Use semicolon or split sentence" }
        ]
      }
    ],
    handwrittenPaperHtml: `<div class="handwritten-paper english-paper">
      <div class="line">The forest in autumn was <span class="teacher-markup underline">quiet <span class="tooltip">Spelling: Should be 'quite'</span></span> spectacular. A carpet of amber and gold leaves covered the damp ground, crunching softly under my boots. <span class="teacher-markup check">✓</span></div>
      <div class="line">The crisp air was filled with the earthy scent of pine and decay, a gentle reminder of the cycle of seasons. <span class="teacher-markup check">✓</span></div>
      <div class="line">Sunlight filtered through the thinning canopy, casting long, dancing shadows across the trunks of ancient oaks. <span class="teacher-markup check">✓</span></div>
      <div class="line">A cold breeze rustled the branches, sending a shower of copper leaves spinning down.</div>
      <div class="line">The brook hummed in the background, its waters <span class="teacher-markup underline">crystaline <span class="tooltip">Spelling: 'crystalline'</span></span> and freezing. <span class="teacher-markup check">✓</span></div>
      <div class="line">It was a peaceful <span class="teacher-markup underline">sanctuary, I <span class="tooltip">Comma splice. Use a semicolon ';' or period '.'</span></span> wished I could stay there forever. <span class="teacher-markup error">✗</span></div>
    </div>`
  },
  {
    id: "mock-4",
    studentName: "Kenji Sato",
    subject: "Social",
    date: "2026-06-18",
    totalScore: 7.0,
    maxScore: 10,
    overallFeedback: "Kenji's historical facts are mostly accurate regarding the causes of the French Revolution. However, his explanation of the estate system is brief, and his sentences are run-on, leading to a loss in clarity and sentence structure marks.",
    questions: [
      {
        questionNumber: 1,
        questionText: "Discuss the social causes of the French Revolution of 1789.",
        maxMarks: 10,
        score: 7.0,
        studentAnswerText: "The French Revolution happened in 1789 because people were very angry. French society was divided into three estates. The First Estate was the clergy, the Second Estate was the nobility, and the Third Estate was everyone else like peasants and doctors. The Third Estate had to pay all the taxes but the First and Second did not pay anything and they had all the power, which was unfair. The peasants were also starving because of bad harvests and high bread prices and the king did not help them so they attacked the Bastille prison in July 1789 to start the revolution.",
        keywordsFound: ["three estates", "First Estate", "Second Estate", "Third Estate", "taxes", "starving", "bread prices", "Bastille", "1789"],
        keywordsMissed: ["monarchy", "inequality", "bourgeoisie"],
        sentenceFormationScore: 6,
        sentenceFormationFeedback: "High rate of run-on sentences joined by 'and'. The narrative flows factually, but lacks structural and grammatical organization suitable for a history essay.",
        stepBreakdown: [
          { step: "Mention 1789 timeline and Bastille attack", marks: 2.0, max: 2.0, status: "correct" },
          { step: "Explain the three estates hierarchy", marks: 2.5, max: 3.0, status: "partial", comment: "Identified all estates correctly but did not mention the relative population percentages or the concept of the bourgeoisie." },
          { step: "Discuss tax inequality between estates", marks: 2.0, max: 2.0, status: "correct" },
          { step: "Explain economic hardship (bread prices, harvests)", marks: 0.5, max: 1.5, status: "partial", comment: "Briefly mentioned bad harvests but did not connect them to the treasury's bankruptcy or King Louis XVI's crisis." },
          { step: "Academic writing style & sentence structure", marks: 0.0, max: 1.5, status: "incorrect", comment: "Severe run-on sentences in paragraph middle. Needs structure (shorter sentences, bullet points or separate paragraphs)." }
        ],
        evaluationFeedback: "Factual content is good, showing that Kenji studied. The essay structure needs work. Advise splitting sentences that have multiple 'and' connections into individual statements to improve clarity.",
        markupCoords: [
          { type: "check", x: 25, y: 15, text: "Correct estate division" },
          { type: "check", x: 45, y: 30, text: "Correct tax point" },
          { type: "underline", x: 65, y: 55, text: "Run-on sentence. Split here." },
          { type: "check", x: 85, y: 75, text: "Bastille attack 1789 correct" }
        ]
      }
    ],
    handwrittenPaperHtml: `<div class="handwritten-paper social-paper">
      <div class="line">The French Revolution happened in 1789 because people were very angry. French society was divided into three estates. <span class="teacher-markup check">✓</span></div>
      <div class="line">The First Estate was the clergy, the Second Estate was the nobility, and the Third Estate was everyone else like peasants and doctors. <span class="teacher-markup check">✓</span></div>
      <div class="line">The Third Estate had to pay all the taxes but the First and Second did not pay anything and they had all the power, which was unfair. <span class="teacher-markup circle">! <span class="tooltip">Run-on sentence. Split this into two sentences.</span></span></div>
      <div class="line">The peasants were also starving because of bad harvests <span class="teacher-markup underline">and high bread prices and the king did not help them so <span class="tooltip">Avoid repeating 'and' / 'so' in long chains. Use full stops.</span></span> they attacked the Bastille prison in July 1789 to start the revolution. <span class="teacher-markup error">✗</span></div>
    </div>`
  }
];
