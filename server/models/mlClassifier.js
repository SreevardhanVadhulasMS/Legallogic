import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the JSON-exported model weights from the Python-trained pkl
const modelPath = path.join(__dirname, '../python_ml/viability_model.json');
const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));

const { vocabulary, idf, class_log_prior, feature_log_prob, classes } = model;

// --- TF-IDF Vectorizer (replicates sklearn's TfidfVectorizer) ---
function tokenize(text) {
  // Lowercase, split on non-alphanumeric, filter empty
  const words = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  // Build unigrams + bigrams (ngram_range=(1,2) as trained)
  const tokens = [...words];
  for (let i = 0; i < words.length - 1; i++) {
    tokens.push(`${words[i]} ${words[i + 1]}`);
  }
  return tokens;
}

function tfidfVector(text) {
  const tokens = tokenize(text);
  const tf = {};

  // Count term frequency
  for (const token of tokens) {
    if (vocabulary[token] !== undefined) {
      tf[token] = (tf[token] || 0) + 1;
    }
  }

  // Build sparse TF-IDF vector (only known vocab)
  const vector = new Array(idf.length).fill(0);
  for (const [token, count] of Object.entries(tf)) {
    const idx = vocabulary[token];
    vector[idx] = count * idf[idx];
  }

  // L2 normalize (sklearn default)
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < vector.length; i++) vector[i] /= norm;
  }

  return vector;
}

// --- Multinomial Naive Bayes log-probability scoring ---
function predict(text) {
  const vec = tfidfVector(text);

  // Compute log P(class) + sum(log P(feature|class) * feature) for each class
  const scores = classes.map((cls, ci) => {
    let score = class_log_prior[ci];
    for (let fi = 0; fi < vec.length; fi++) {
      if (vec[fi] !== 0) {
        score += feature_log_prob[ci][fi] * vec[fi];
      }
    }
    return { cls, score };
  });

  // Softmax to get probabilities
  const maxScore = Math.max(...scores.map(s => s.score));
  const exps = scores.map(s => Math.exp(s.score - maxScore));
  const total = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map(e => e / total);

  // Best class
  let bestIdx = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[bestIdx]) bestIdx = i;
  }

  return { prediction: classes[bestIdx], confidence: probs[bestIdx] };
}

// --- Main export ---
export const analyzeCaseViability = (text) => {
  if (!text || text.trim() === '') {
    return {
      viability: 50,
      status: 'needs-more',
      keyPoints: ['No facts provided']
    };
  }

  const { prediction, confidence } = predict(text);

  // Advanced Documentation Scanner 
  const t = text.toLowerCase();
  let foundStrong = [];
  let foundWeak = [];

  if (t.match(/contract|agreement|lease|deed|signed/i)) foundStrong.push('Written agreement or contract detected');
  if (t.match(/cctv|video|footage|camera/i)) foundStrong.push('Video/Camera evidence detected');
  if (t.match(/email|whatsapp|text|messages|chat/i)) foundStrong.push('Digital correspondence trail detected');
  if (t.match(/bank|receipt|statement|payment|cheque|invoice/i)) foundStrong.push('Financial records/receipts detected');
  if (t.match(/police|medical|report|record|notarized/i)) foundStrong.push('Official reports or notarized docs detected');
  if (t.match(/witness/i)) foundStrong.push('Witness testimony referenced');

  if (t.match(/verbal|oral|word against/i)) foundWeak.push('Case appears to rely on verbal or oral claims');
  if (t.match(/lost|missing|deleted/i)) foundWeak.push('Warning: Some critical evidence reported missing/deleted');
  if (t.match(/feeling|think|maybe|guess/i)) foundWeak.push('Contains ambiguous or speculative claims');

  // Map confidence probability to 0–98 viability score
  // We'll also boost the score slighty if they have a lot of hard evidence
  let evidenceBoost = Math.min(foundStrong.length * 2, 8); 
  let penalty = Math.min(foundWeak.length * 3, 9);
  
  let baseScore = 50;
  if (prediction === 'strong') baseScore = 80 + Math.round(confidence * 10);
  else if (prediction === 'ready') baseScore = 60 + Math.round(confidence * 10);
  else baseScore = 30 + Math.round(confidence * 15);

  let viabilityScore = Math.min(Math.max(baseScore + evidenceBoost - penalty, 5), 98);

  const confidencePct = Math.round(confidence * 100);

  // Construct Dynamic Keypoints
  let keyPoints = [];
  
  // 1. Give Model Confidence
  if (prediction === 'strong') {
    keyPoints.push(`Model confidence: ${confidencePct}% — Case documentation appears very strong`);
  } else if (prediction === 'ready') {
    keyPoints.push(`Model confidence: ${confidencePct}% — Case is viable but could use more concrete proof`);
  } else {
    keyPoints.push(`Model confidence: ${confidencePct}% — Case documentation currently appears weak or insufficient`);
  }

  // 2. Add found strengths
  foundStrong.forEach(str => keyPoints.push(`✅ Strength: ${str}`));

  // 3. Add found weaknesses
  foundWeak.forEach(wk => keyPoints.push(`⚠️ Weakness: ${wk}`));

  // 4. Fallback advice if no documents specificed
  if (foundStrong.length === 0) {
    keyPoints.push(`💡 Recommendation: Gather written contracts, emails, or witness statements to bolster your claim`);
  } else if (prediction === 'ready' && !t.match(/contract|agreement/i)) {
    keyPoints.push(`💡 Recommendation: Try to locate a formalized agreement if one exists`);
  }

  // Hard limit keypoints to keep UI clean
  keyPoints = keyPoints.slice(0, 5);

  return {
    viability: viabilityScore,
    status: prediction,
    keyPoints
  };
};
