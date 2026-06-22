import { mockGradedPapers } from './mockData.js';
import { gradeStudentPaper } from './gemini.js?v=1.0.2';


// --- State Management ---
let state = {
  apiKey: localStorage.getItem('gradeai_api_key') || '',
  gradedPapers: [],
  keywords: [],
  currentFiles: {
    questionPaper: null, // { file, mimeType, base64Data, name }
    answerKey: null,      // { file, mimeType, base64Data, name }
    studentSheets: []     // Array of { file, mimeType, base64Data, name }
  },
  selectedSubject: 'Math'
};

// --- DOM Cache ---
const DOM = {
  demoBanner: document.getElementById('demo-banner'),
  bannerSettingsBtn: document.getElementById('banner-settings-btn'),
  settingsBtn: document.getElementById('settings-btn'),
  settingsDialog: document.getElementById('settings-dialog'),
  closeSettingsBtn: document.getElementById('close-settings-btn'),
  apiKeyInput: document.getElementById('api-key-input'),
  toggleApiKeyBtn: document.getElementById('toggle-api-key-btn'),
  clearApiKeyBtn: document.getElementById('clear-api-key-btn'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  settingsStatus: document.getElementById('settings-status'),
  
  // Setup forms
  subjectRadios: document.getElementsByName('subject'),
  questionPaperZone: document.getElementById('question-paper-zone'),
  questionPaperInput: document.getElementById('question-paper-input'),
  questionPaperPreview: document.getElementById('question-paper-preview'),
  answerKeyZone: document.getElementById('answer-key-zone'),
  answerKeyInput: document.getElementById('answer-key-input'),
  answerKeyPreview: document.getElementById('answer-key-preview'),
  studentSheetsZone: document.getElementById('student-sheets-zone'),
  studentSheetsInput: document.getElementById('student-sheets-input'),
  studentSheetsPreview: document.getElementById('student-sheets-preview'),
  studentNameInput: document.getElementById('student-name-input'),
  keywordInput: document.getElementById('keyword-input'),
  addKeywordBtn: document.getElementById('add-keyword-btn'),
  keywordsList: document.getElementById('keywords-list'),
  runGradingBtn: document.getElementById('run-grading-btn'),
  gradingLoader: document.getElementById('grading-loader'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  
  // Loader Stages
  stageOcr: document.getElementById('stage-ocr'),
  stageCrossref: document.getElementById('stage-crossref'),
  stageGrading: document.getElementById('stage-grading'),
  
  // Results panel
  metricsAvg: document.getElementById('metrics-avg'),
  metricsPass: document.getElementById('metrics-pass'),
  metricsCount: document.getElementById('metrics-count'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  papersGrid: document.getElementById('papers-grid'),
  emptyState: document.getElementById('empty-state'),
  
  // Report viewer modal
  reportDialog: document.getElementById('report-dialog'),
  reportStudentName: document.getElementById('report-student-name'),
  reportSubject: document.getElementById('report-subject'),
  reportDate: document.getElementById('report-date'),
  reportTotalScore: document.getElementById('report-total-score'),
  reportMaxScore: document.getElementById('report-max-score'),
  sheetViewport: document.getElementById('sheet-viewport'),
  closeReportBtn: document.getElementById('close-report-btn'),
  closeReportBtnFooter: document.getElementById('close-report-btn-footer'),
  exportPdfBtn: document.getElementById('export-pdf-btn'),
  
  // Report Tabs & content
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  gradingQuestionsList: document.getElementById('grading-questions-list'),
  ocrTextBox: document.getElementById('ocr-text-box'),
  overallFeedbackText: document.getElementById('overall-feedback-text'),
  
  // Adjustments panel
  overrideScoreSlider: document.getElementById('override-score-slider'),
  overrideScoreVal: document.getElementById('override-score-val'),
  overrideMaxVal: document.getElementById('override-max-val'),
  overrideComment: document.getElementById('override-comment')
};

// Current active graded paper in detailed view
let activePaper = null;

// --- Model Diagnostics Check ---
async function checkAllowedModels() {
  const container = document.getElementById('allowed-models-container');
  const list = document.getElementById('allowed-models-list');
  if (!container || !list) return;

  if (!state.apiKey) {
    container.hidden = true;
    return;
  }

  try {
    console.log("GradeAI: Querying supported Gemini models for your API Key...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${state.apiKey}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const models = data.models ? data.models.map(m => m.name.replace('models/', '')) : [];
      console.log("GradeAI: Authorized Gemini Models for your key:", models);
      
      container.hidden = false;
      list.innerHTML = '';
      
      if (models.length === 0) {
        list.innerHTML = '<li>No models available</li>';
      } else {
        // Filter out embedding/helper models to focus on generation models
        const generationModels = models.filter(m => !m.includes('embed') && !m.includes('aqa') && !m.includes('classifier'));
        
        generationModels.forEach(model => {
          const li = document.createElement('li');
          li.textContent = model;
          if (model.includes('1.5-flash') || model.includes('2.0-flash')) {
            li.style.color = 'var(--success)';
            li.style.fontWeight = '600';
          }
          list.appendChild(li);
        });
      }
    } else {
      console.warn("GradeAI: Could not fetch list of available models. HTTP Status:", response.status);
      container.hidden = false;
      list.innerHTML = `<li style="color:var(--danger)">Error: Failed to fetch models (HTTP ${response.status})</li>`;
    }
  } catch (e) {
    console.error("GradeAI: Network error listing models:", e);
    container.hidden = false;
    list.innerHTML = `<li style="color:var(--danger)">Network Error: ${e.message}</li>`;
  }
}

// --- Initialize App ---
function init() {
  loadPapersHistory();
  updateApiKeyNotice();
  setupEventListeners();
  renderPapersGrid();
  updateMetrics();
  checkAllowedModels();
}

// --- Load History / Defaults ---
function loadPapersHistory() {
  const localHistory = localStorage.getItem('gradeai_graded_papers');
  if (localHistory) {
    try {
      state.gradedPapers = JSON.parse(localHistory);
    } catch (e) {
      console.error("Error parsing graded papers from localStorage:", e);
      state.gradedPapers = [...mockGradedPapers];
    }
  } else {
    // Default to mock data on first load
    state.gradedPapers = [...mockGradedPapers];
    savePapersHistory();
  }
}

function savePapersHistory() {
  localStorage.setItem('gradeai_graded_papers', JSON.stringify(state.gradedPapers));
}

// --- API Config Utilities ---
function updateApiKeyNotice() {
  if (state.apiKey) {
    DOM.demoBanner.style.display = 'none';
    DOM.settingsStatus.innerHTML = '<span class="status-badge state-on">Gemini API Key Active</span>';
  } else {
    DOM.demoBanner.style.display = 'block';
    DOM.settingsStatus.innerHTML = '<span class="status-badge state-off">No Key Configured (Demo Mode)</span>';
  }
}

// --- File Reading Helpers ---
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

async function processUploadedFile(file) {
  const base64Data = await fileToBase64(file);
  return {
    name: file.name,
    mimeType: file.type,
    base64Data: base64Data,
    objectUrl: URL.createObjectURL(file)
  };
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Settings Dialog triggers
  DOM.settingsBtn.addEventListener('click', () => {
    DOM.apiKeyInput.value = state.apiKey;
    DOM.settingsDialog.showModal();
  });
  DOM.bannerSettingsBtn.addEventListener('click', () => {
    DOM.apiKeyInput.value = state.apiKey;
    DOM.settingsDialog.showModal();
  });
  DOM.closeSettingsBtn.addEventListener('click', () => DOM.settingsDialog.close());
  
  DOM.toggleApiKeyBtn.addEventListener('click', () => {
    if (DOM.apiKeyInput.type === 'password') {
      DOM.apiKeyInput.type = 'text';
      DOM.toggleApiKeyBtn.textContent = 'Hide';
    } else {
      DOM.apiKeyInput.type = 'password';
      DOM.toggleApiKeyBtn.textContent = 'Show';
    }
  });

  DOM.clearApiKeyBtn.addEventListener('click', () => {
    state.apiKey = '';
    localStorage.removeItem('gradeai_api_key');
    DOM.apiKeyInput.value = '';
    updateApiKeyNotice();
    alert("API Key cleared. Application set to Demo Mode.");
  });

  DOM.settingsDialog.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyVal = DOM.apiKeyInput.value.trim();
    state.apiKey = keyVal;
    if (keyVal) {
      localStorage.setItem('gradeai_api_key', keyVal);
      checkAllowedModels();
    } else {
      localStorage.removeItem('gradeai_api_key');
    }
    updateApiKeyNotice();
    DOM.settingsDialog.close();
  });

  // Subject selector change
  Array.from(DOM.subjectRadios).forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.selectedSubject = e.target.value;
    });
  });

  // Keywords manager
  DOM.keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeywordTag();
    }
  });
  DOM.addKeywordBtn.addEventListener('click', addKeywordTag);

  // Drag & drop setups
  setupDropZone(DOM.questionPaperZone, DOM.questionPaperInput, (fileDetails) => {
    state.currentFiles.questionPaper = fileDetails;
    renderFilePreview(DOM.questionPaperPreview, fileDetails.name, () => {
      state.currentFiles.questionPaper = null;
      DOM.questionPaperPreview.hidden = true;
      DOM.questionPaperZone.querySelector('.drop-zone-content').hidden = false;
    });
  });

  setupDropZone(DOM.answerKeyZone, DOM.answerKeyInput, (fileDetails) => {
    state.currentFiles.answerKey = fileDetails;
    renderFilePreview(DOM.answerKeyPreview, fileDetails.name, () => {
      state.currentFiles.answerKey = null;
      DOM.answerKeyPreview.hidden = true;
      DOM.answerKeyZone.querySelector('.drop-zone-content').hidden = false;
    });
  });

  setupMultiDropZone(DOM.studentSheetsZone, DOM.studentSheetsInput, (fileDetailsList) => {
    state.currentFiles.studentSheets = [...state.currentFiles.studentSheets, ...fileDetailsList];
    renderMultiFilePreview();
  });

  // Reset/Clear History
  DOM.clearHistoryBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset the history? This will restore default mock samples.")) {
      state.gradedPapers = [...mockGradedPapers];
      savePapersHistory();
      renderPapersGrid();
      updateMetrics();
    }
  });

  // Submit grading trigger
  DOM.runGradingBtn.addEventListener('click', handleGradingSubmission);

  // Tab switcher in detailed view
  DOM.tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      DOM.tabBtns.forEach(b => b.classList.remove('active'));
      DOM.tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Score override slider
  DOM.overrideScoreSlider.addEventListener('input', (e) => {
    const newVal = parseFloat(e.target.value);
    DOM.overrideScoreVal.textContent = newVal.toFixed(1);
    if (activePaper) {
      activePaper.totalScore = newVal;
      // Recalculate metrics on the fly
      DOM.reportTotalScore.textContent = newVal.toFixed(1);
      updateCardScore(activePaper.id, newVal);
    }
  });

  DOM.overrideComment.addEventListener('change', (e) => {
    if (activePaper) {
      activePaper.manualOverrideReason = e.target.value;
    }
  });

  // Close report viewer
  DOM.closeReportBtn.addEventListener('click', closeReportViewer);
  DOM.closeReportBtnFooter.addEventListener('click', closeReportViewer);
  DOM.exportPdfBtn.addEventListener('click', () => {
    window.print();
  });
}

// --- Drag and Drop Logic ---
function setupDropZone(zoneEl, inputEl, callback) {
  zoneEl.addEventListener('click', () => inputEl.click());
  
  inputEl.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      const fileDetails = await processUploadedFile(e.target.files[0]);
      callback(fileDetails);
    }
  });

  zoneEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    zoneEl.classList.add('drag-over');
  });

  zoneEl.addEventListener('dragleave', () => {
    zoneEl.classList.remove('drag-over');
  });

  zoneEl.addEventListener('drop', async (e) => {
    e.preventDefault();
    zoneEl.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      const fileDetails = await processUploadedFile(e.dataTransfer.files[0]);
      callback(fileDetails);
    }
  });
}

function setupMultiDropZone(zoneEl, inputEl, callback) {
  zoneEl.addEventListener('click', () => inputEl.click());
  
  inputEl.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      const detailsList = [];
      for (const file of e.target.files) {
        detailsList.push(await processUploadedFile(file));
      }
      callback(detailsList);
    }
  });

  zoneEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    zoneEl.classList.add('drag-over');
  });

  zoneEl.addEventListener('dragleave', () => {
    zoneEl.classList.remove('drag-over');
  });

  zoneEl.addEventListener('drop', async (e) => {
    e.preventDefault();
    zoneEl.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
      const detailsList = [];
      for (const file of e.dataTransfer.files) {
        detailsList.push(await processUploadedFile(file));
      }
      callback(detailsList);
    }
  });
}

function renderFilePreview(previewEl, name, onRemove) {
  const dropZoneContent = previewEl.parentElement.querySelector('.drop-zone-content');
  dropZoneContent.hidden = true;
  previewEl.hidden = false;
  previewEl.innerHTML = `
    <span class="file-name">📄 ${name}</span>
    <button type="button" class="remove-file-btn" style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:bold;">&times;</button>
  `;
  previewEl.querySelector('.remove-file-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    onRemove();
  });
}

function renderMultiFilePreview() {
  if (state.currentFiles.studentSheets.length === 0) {
    DOM.studentSheetsPreview.hidden = true;
    DOM.studentSheetsZone.querySelector('.drop-zone-content').hidden = false;
    return;
  }

  DOM.studentSheetsZone.querySelector('.drop-zone-content').hidden = true;
  DOM.studentSheetsPreview.hidden = false;
  DOM.studentSheetsPreview.innerHTML = '';

  state.currentFiles.studentSheets.forEach((file, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'preview-thumb';
    
    if (file.mimeType.startsWith('image/')) {
      thumb.innerHTML = `
        <img src="${file.objectUrl}">
        <button type="button" class="remove-btn" data-index="${index}">&times;</button>
      `;
    } else {
      thumb.innerHTML = `
        <span>PDF Pg ${index + 1}</span>
        <button type="button" class="remove-btn" data-index="${index}">&times;</button>
      `;
    }

    thumb.querySelector('.remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const removeIndex = parseInt(e.target.dataset.index);
      state.currentFiles.studentSheets.splice(removeIndex, 1);
      renderMultiFilePreview();
    });

    DOM.studentSheetsPreview.appendChild(thumb);
  });
}

// --- Keyword Tags Management ---
function addKeywordTag() {
  const keyword = DOM.keywordInput.value.trim();
  if (keyword && !state.keywords.includes(keyword)) {
    state.keywords.push(keyword);
    renderKeywordsTags();
  }
  DOM.keywordInput.value = '';
}

function renderKeywordsTags() {
  DOM.keywordsList.innerHTML = '';
  state.keywords.forEach((word, index) => {
    const tag = document.createElement('span');
    tag.className = 'keyword-tag';
    tag.innerHTML = `
      ${word}
      <button type="button" data-index="${index}">&times;</button>
    `;
    tag.querySelector('button').addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      state.keywords.splice(idx, 1);
      renderKeywordsTags();
    });
    DOM.keywordsList.appendChild(tag);
  });
}

// --- Metrics Calculations ---
function updateMetrics() {
  const papers = state.gradedPapers;
  if (papers.length === 0) {
    DOM.metricsAvg.textContent = '-';
    DOM.metricsPass.textContent = '-';
    DOM.metricsCount.textContent = '0';
    return;
  }

  // Calculate Average Percentage
  let totalPctSum = 0;
  let passCount = 0;

  papers.forEach(p => {
    const scoreVal = p.totalScore;
    const maxVal = p.maxScore;
    const pct = scoreVal / maxVal;
    totalPctSum += pct;

    if (pct >= 0.5) { // 50% pass mark
      passCount++;
    }
  });

  const avgPct = totalPctSum / papers.length;
  const passRate = (passCount / papers.length) * 100;

  DOM.metricsAvg.textContent = `${(avgPct * 20).toFixed(1)}/20`; // scale to /20 reference visually
  DOM.metricsPass.textContent = `${Math.round(passRate)}%`;
  DOM.metricsCount.textContent = papers.length;
}

// --- Render Graded Submissions Grid ---
function renderPapersGrid() {
  const papers = state.gradedPapers;
  DOM.papersGrid.innerHTML = '';

  if (papers.length === 0) {
    DOM.emptyState.style.display = 'flex';
    return;
  } else {
    DOM.emptyState.style.display = 'none';
  }

  // Render cards in reverse chronological order
  [...papers].reverse().forEach(paper => {
    const card = document.createElement('div');
    card.className = `paper-card sub-${paper.subject.toLowerCase()}`;
    
    // Determine pass status tag
    const pct = paper.totalScore / paper.maxScore;
    let statusClass = 'status-pass';
    let statusText = 'Excellent';
    
    if (pct < 0.5) {
      statusClass = 'status-fail';
      statusText = 'Needs Work';
    } else if (pct < 0.75) {
      statusClass = 'status-warning';
      statusText = 'Average';
    }

    card.innerHTML = `
      <div class="card-top">
        <div>
          <div class="student-name">${escapeHtml(paper.studentName)}</div>
          <div class="submission-date">${paper.date}</div>
        </div>
        <span class="card-subject-badge">${paper.subject}</span>
      </div>
      <div class="card-bottom">
        <div class="score-display">
          <span class="score-num">${paper.totalScore.toFixed(1)}</span>
          <span class="score-total">/${paper.maxScore}</span>
        </div>
        <span class="status-tag ${statusClass}">${statusText}</span>
      </div>
    `;

    card.addEventListener('click', () => openReportViewer(paper));
    DOM.papersGrid.appendChild(card);
  });
}

function updateCardScore(paperId, newScore) {
  // Update score in local storage data and metrics, save, then redraw the dashboard
  const paperIndex = state.gradedPapers.findIndex(p => p.id === paperId);
  if (paperIndex !== -1) {
    state.gradedPapers[paperIndex].totalScore = newScore;
    savePapersHistory();
    updateMetrics();
    renderPapersGrid();
  }
}

// --- Submit & Grading Execution ---
async function handleGradingSubmission() {
  // Validation
  const hasStudentSheets = state.currentFiles.studentSheets.length > 0;
  const hasAnswerKey = state.currentFiles.answerKey !== null;

  if (!hasStudentSheets) {
    alert("Please upload at least one Student Answer Sheet.");
    return;
  }

  // Determine Student Name
  let studentName = DOM.studentNameInput.value.trim();
  if (!studentName) {
    studentName = "Evaluated Student";
  }

  // Setup loader visibility and button state
  DOM.runGradingBtn.disabled = true;
  DOM.runGradingBtn.querySelector('.btn-text').textContent = "Analyzing Papers...";
  DOM.runGradingBtn.querySelector('.spinner').hidden = false;
  DOM.gradingLoader.hidden = false;
  
  try {
    let result = null;
    
    if (!state.apiKey) {
      // API Key is missing: Execute Demo / Mock simulation
      result = await runGradingSimulation(studentName, state.selectedSubject);
    } else {
      // Live Gemini API Execution
      if (!hasAnswerKey) {
        alert("Live grading requires a Teacher's Answer Key. Please upload one or clear the API Key to use Demo Mode.");
        resetGradingButton();
        return;
      }
      
      result = await runLiveGrading(studentName);
    }

    // Success! Save to state, local history, and update
    state.gradedPapers.push(result);
    savePapersHistory();
    
    // Reset inputs
    resetSetupPanel();
    
    // Render
    renderPapersGrid();
    updateMetrics();

    // Auto open the newly graded sheet
    openReportViewer(result);

  } catch (error) {
    console.error("Grading execution error:", error);
    alert(`Grading failed: ${error.message}`);
  } finally {
    resetGradingButton();
  }
}

function resetGradingButton() {
  DOM.runGradingBtn.disabled = false;
  DOM.runGradingBtn.querySelector('.btn-text').textContent = "Correct Answer Sheets";
  DOM.runGradingBtn.querySelector('.spinner').hidden = true;
  DOM.gradingLoader.hidden = true;
  DOM.progressBarFill.style.width = '0%';
  DOM.stageOcr.className = 'stage';
  DOM.stageCrossref.className = 'stage';
  DOM.stageGrading.className = 'stage';
}

function resetSetupPanel() {
  state.currentFiles = { questionPaper: null, answerKey: null, studentSheets: [] };
  state.keywords = [];
  DOM.studentNameInput.value = '';
  DOM.questionPaperPreview.hidden = true;
  DOM.questionPaperZone.querySelector('.drop-zone-content').hidden = false;
  DOM.answerKeyPreview.hidden = true;
  DOM.answerKeyZone.querySelector('.drop-zone-content').hidden = false;
  DOM.studentSheetsPreview.hidden = true;
  DOM.studentSheetsZone.querySelector('.drop-zone-content').hidden = false;
  renderKeywordsTags();
}

// --- Live Grading API Orchestration ---
async function runLiveGrading(studentName) {
  // Update progress stages dynamically
  updateStageProgress(DOM.stageOcr, 20);
  
  await sleep(1000);
  updateStageProgress(DOM.stageCrossref, 50);
  
  await sleep(1000);
  updateStageProgress(DOM.stageGrading, 80);
  
  // call the api wrapper
  const result = await gradeStudentPaper({
    apiKey: state.apiKey,
    subject: state.selectedSubject,
    questionPaperFile: state.currentFiles.questionPaper,
    answerKeyFile: state.currentFiles.answerKey,
    studentName: studentName,
    studentAnswerFiles: state.currentFiles.studentSheets,
    keywords: state.keywords
  });

  DOM.progressBarFill.style.width = '100%';
  DOM.stageGrading.className = 'stage done';
  await sleep(500);

  // Set unique ID for the submission
  result.id = `graded-${Date.now()}`;
  
  // Ensure OCR extracted representation is attached, if not present
  if (!result.handwrittenPaperHtml && state.currentFiles.studentSheets.length > 0) {
    // Save image reference URLs to display in the student paper viewer
    result.uploadedImageUrls = state.currentFiles.studentSheets
      .filter(f => f.mimeType.startsWith('image/'))
      .map(f => f.objectUrl);
  }

  return result;
}

// --- Demo Grading Simulation ---
async function runGradingSimulation(studentName, subject) {
  updateStageProgress(DOM.stageOcr, 30);
  await sleep(1200);
  
  updateStageProgress(DOM.stageCrossref, 60);
  await sleep(1200);
  
  updateStageProgress(DOM.stageGrading, 90);
  await sleep(1000);
  
  DOM.progressBarFill.style.width = '100%';
  DOM.stageGrading.className = 'stage done';
  await sleep(400);

  // Select mock data corresponding to subject, clone it, and assign new name
  let targetMock = mockGradedPapers.find(p => p.subject === subject);
  if (!targetMock) {
    targetMock = mockGradedPapers[0]; // fallback to math
  }

  // Deep clone
  const cloned = JSON.parse(JSON.stringify(targetMock));
  cloned.id = `mock-sim-${Date.now()}`;
  cloned.studentName = studentName;
  cloned.date = new Date().toISOString().split('T')[0];
  
  return cloned;
}

function updateStageProgress(stageEl, pct) {
  // Mark previous stages as done
  if (stageEl === DOM.stageOcr) {
    DOM.stageOcr.className = 'stage active';
  } else if (stageEl === DOM.stageCrossref) {
    DOM.stageOcr.className = 'stage done';
    DOM.stageCrossref.className = 'stage active';
  } else if (stageEl === DOM.stageGrading) {
    DOM.stageOcr.className = 'stage done';
    DOM.stageCrossref.className = 'stage done';
    DOM.stageGrading.className = 'stage active';
  }
  DOM.progressBarFill.style.width = `${pct}%`;
}

// --- Detailed Evaluation Viewer (Modal Dialog) ---
function openReportViewer(paper) {
  activePaper = paper;
  
  // Populate header details
  DOM.reportStudentName.textContent = paper.studentName;
  DOM.reportSubject.textContent = paper.subject;
  DOM.reportDate.textContent = paper.date;
  DOM.reportTotalScore.textContent = paper.totalScore.toFixed(1);
  DOM.reportMaxScore.textContent = paper.maxScore;
  
  // Style subject badge accordingly
  DOM.reportSubject.className = 'badge';
  DOM.reportSubject.style.backgroundColor = `var(--sub-${paper.subject.toLowerCase()})`;

  // Reset tab selection to first tab
  DOM.tabBtns.forEach(b => b.classList.remove('active'));
  DOM.tabContents.forEach(c => c.classList.remove('active'));
  DOM.tabBtns[0].classList.add('active');
  DOM.tabContents[0].classList.add('active');

  // RENDER LEFT: Student Sheet
  renderStudentSheetViewer(paper);

  // RENDER RIGHT: Grading Details Tab
  renderGradingBreakdownTab(paper);

  // RENDER RIGHT: OCR Tab
  renderOcrTab(paper);

  // RENDER RIGHT: Feedback & Adjustment Slider
  renderFeedbackTab(paper);

  // Show detailed dialog modal
  DOM.reportDialog.showModal();
}

function closeReportViewer() {
  DOM.reportDialog.close();
  activePaper = null;
}

function renderStudentSheetViewer(paper) {
  DOM.sheetViewport.innerHTML = '';

  if (paper.handwrittenPaperHtml) {
    // If it's a preset mock dataset, use the high-fidelity lined notebook simulation
    DOM.sheetViewport.innerHTML = paper.handwrittenPaperHtml;
  } else if (paper.uploadedImageUrls && paper.uploadedImageUrls.length > 0) {
    // If live uploaded images are available, display them side-by-side or stacked
    const container = document.createElement('div');
    container.className = 'uploaded-sheet-preview';
    
    paper.uploadedImageUrls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'uploaded-sheet-img';
      container.appendChild(img);
    });

    // Add visual SVG/HTML overlays representing AI corrections based on coordinates
    // We can distribute the markup coords onto the sheet dynamically
    if (paper.questions && paper.questions.length > 0) {
      const overlay = document.createElement('div');
      overlay.className = 'sheet-canvas-overlay';
      
      let markerIndex = 0;
      paper.questions.forEach((q, qIdx) => {
        if (q.markupCoords && q.markupCoords.length > 0) {
          q.markupCoords.forEach((coord, coordIdx) => {
            const marker = document.createElement('div');
            // Use simulated random yet deterministic positions to spread corrections across the image
            const topVal = 10 + (qIdx * 20) + (coordIdx * 8) + (Math.sin(qIdx + coordIdx) * 3);
            const leftVal = 25 + (coordIdx * 15) + (Math.cos(qIdx) * 8);

            marker.className = `overlay-marker ${coord.type || 'check'}`;
            marker.style.top = `${Math.min(90, Math.max(5, topVal))}%`;
            marker.style.left = `${Math.min(90, Math.max(5, leftVal))}%`;
            
            let symbol = '✓';
            if (coord.type === 'error') symbol = '✗';
            else if (coord.type === 'circle') symbol = '!';
            else if (coord.type === 'underline') symbol = '?';

            marker.innerHTML = `
              ${symbol}
              <span class="tooltip">Q${q.questionNumber}: ${coord.text}</span>
            `;
            overlay.appendChild(marker);
            markerIndex++;
          });
        }
      });
      container.appendChild(overlay);
    }

    DOM.sheetViewport.appendChild(container);
  } else {
    // Fallback if no images are stored
    DOM.sheetViewport.innerHTML = `
      <div class="empty-state">
        <p>No handwritten image captured.</p>
        <span class="help-text">Review the grading breakdown tab for the full textual analysis.</span>
      </div>
    `;
  }
}

function renderGradingBreakdownTab(paper) {
  DOM.gradingQuestionsList.innerHTML = '';
  
  if (!paper.questions || paper.questions.length === 0) {
    DOM.gradingQuestionsList.innerHTML = `<p>No question breakdown details available.</p>`;
    return;
  }

  paper.questions.forEach(q => {
    const item = document.createElement('div');
    item.className = 'question-grade-item';

    // RENDER: Keywords badges
    let keywordsHtml = '';
    if ((q.keywordsFound && q.keywordsFound.length > 0) || (q.keywordsMissed && q.keywordsMissed.length > 0)) {
      keywordsHtml = `
        <div class="keywords-feedback-row">
          <span class="card-label">Keyword Verification</span>
          <div class="keywords-badge-container">
            ${(q.keywordsFound || []).map(k => `<span class="badge badge-green">✓ ${k}</span>`).join('')}
            ${(q.keywordsMissed || []).map(k => `<span class="badge badge-red">✗ ${k}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // RENDER: Sentence analysis (English / languages) or step evaluation (Math)
    let extraAnalysisHtml = '';
    if (paper.subject === 'Math' && q.stepBreakdown && q.stepBreakdown.length > 0) {
      extraAnalysisHtml = `
        <div class="step-breakdown-row mb-3">
          <span class="card-label">Step-by-Step Resolution Check</span>
          <div class="step-checklist">
            ${q.stepBreakdown.map(step => {
              let icon = '✓';
              let classVal = 'correct';
              if (step.status === 'incorrect') { icon = '✗'; classVal = 'incorrect'; }
              else if (step.status === 'partial') { icon = '⚠'; classVal = 'partial'; }
              
              return `
                <div class="step-item ${classVal}">
                  <div class="step-left">
                    <span class="step-marker">${icon}</span>
                    <div>
                      <span>${step.step}</span>
                      ${step.comment ? `<span class="step-comment">${step.comment}</span>` : ''}
                    </div>
                  </div>
                  <div class="step-marks"><span>${step.marks}</span> / ${step.max}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (q.sentenceFormationScore !== undefined) {
      extraAnalysisHtml = `
        <div class="language-analysis-grid">
          <div class="metric-rating">
            <span class="num">${q.sentenceFormationScore}</span>
            <span class="label">Structure /10</span>
          </div>
          <div class="metric-desc">
            <span class="card-label">Syntax & Flow Feedback</span>
            <span class="evaluation-desc">${q.sentenceFormationFeedback || 'Structure is factually aligned.'}</span>
          </div>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="question-head">
        <h4>Question ${q.questionNumber}: ${escapeHtml(q.questionText)}</h4>
        <div class="question-score-badge">
          <span>${q.score.toFixed(1)}</span> / ${q.maxMarks}
        </div>
      </div>
      
      <div class="extracted-answer-card">
        <span class="card-label">Extracted Student Response Text</span>
        <div class="student-answer-body">${escapeHtml(q.studentAnswerText || '')}</div>
      </div>

      ${extraAnalysisHtml}
      ${keywordsHtml}

      <div class="evaluation-comment pt-2">
        <span class="card-label">Evaluator Correction Rationale</span>
        <p class="evaluation-desc">${q.evaluationFeedback || 'Correctly marked based on key constraints.'}</p>
      </div>
    `;

    DOM.gradingQuestionsList.appendChild(item);
  });
}

function renderOcrTab(paper) {
  // Collect OCR of all questions
  let fullOcrText = "";
  if (paper.questions && paper.questions.length > 0) {
    fullOcrText = paper.questions.map(q => {
      return `[QUESTION ${q.questionNumber} ANSWER OCR]:\n${q.studentAnswerText || 'No text extracted.'}`;
    }).join('\n\n==================================================\n\n');
  } else {
    fullOcrText = "No OCR data available.";
  }
  DOM.ocrTextBox.textContent = fullOcrText;
}

function renderFeedbackTab(paper) {
  DOM.overallFeedbackText.textContent = paper.overallFeedback || "Evaluation completed successfully.";
  
  // Set up override slider parameters
  DOM.overrideScoreSlider.max = paper.maxScore;
  DOM.overrideScoreSlider.value = paper.totalScore;
  DOM.overrideScoreVal.textContent = paper.totalScore.toFixed(1);
  DOM.overrideMaxVal.textContent = paper.maxScore;
  DOM.overrideComment.value = paper.manualOverrideReason || '';
}

// --- General Utility Helpers ---
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Run App ---
document.addEventListener('DOMContentLoaded', init);
