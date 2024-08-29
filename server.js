
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';  // Corrected import statement
import pg from 'pg';
import dotenv from 'dotenv';
import spellchecker from "spellchecker"

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.static('C:\\jaff\\sih\\public'));

app.get('/', (req, res) => {
  res.sendFile('C:\\jaff\\sih\\public\\index.html');
});

let latestPrompt = '';
const collegeRelatedKeywords = process.env.COLLEGE_RELATED_KEYWORDS.split(',').map(keyword => keyword.trim());
const collegeNames = [
  'IIT Gandhinagar', 'Harvard University', 'MIT', 'Stanford University', 'University of California'

];

async function detectLanguage(text) {
  try {
    const response = await axios.post('http://localhost:5000/detect-language', { text });
    return response.data.language;
  } catch (error) {
    console.error('Error detecting language:', error);
    throw new Error('Language detection failed');
  }
}

function correctText(text) {
  const placeholderMap = {};
  let processedText = text;


  collegeNames.forEach((college, index) => {
    const placeholder = `__PROPER_NOUN_${index}__`;
    placeholderMap[placeholder] = college;
    
 
    const regex = new RegExp(college, 'gi');
    processedText = processedText.replace(regex, placeholder);
  });

  const misspelledWords = spellchecker.checkSpelling(processedText);
  if (misspelledWords.length > 0) {
    misspelledWords.forEach(word => {
      const wordText = processedText.slice(word.start, word.end);

      const suggestions = spellchecker.getCorrectionsForMisspelling(wordText);
      if (suggestions.length > 0) {

        processedText = processedText.replace(wordText, suggestions[0]);
      }
    });
  }

  Object.keys(placeholderMap).forEach(placeholder => {
    const regex = new RegExp(placeholder, 'g');
    processedText = processedText.replace(regex, placeholderMap[placeholder]);
  });

  return processedText;
}
async function translateToEnglish(text) {
  try {
    const response = await axios.post('http://localhost:5000/translate-to-english', { text });
    return response.data.translated_text;
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Translation failed');
  }
}

async function translateToDetectedLanguage(text, detectedlanguage) {
  try {
    const response = await axios.post('http://localhost:5000/translate', {
      text,
      targetLanguage: detectedlanguage
    });
    return response.data.translated_text;
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Translation failed');
  }
}

async function findIntent(text) {
  try {
    const response = await axios.post('http://localhost:5000/predict-intent', { text });
    return response.data.intent;
  } catch (error) {
    console.error('Error predicting intent:', error);
    throw new Error('Intent prediction failed');
  }
}

function checkQuery(query) {
  
  const pattern = /\b(?:fee|structure)\b(?!.*\b(?:btech|mtech|me|be|pgdm|mba|phd|b\.tech|m\.tech|ph\.d)\b)/i;
  if (pattern.test(query)) {
    return "yes fee";
  } else {
    return "no fee";
  }
}
function extractCollegeName(prompt) {
  const lowerCasePrompt = prompt.toLowerCase();
  for (const college of collegeNames) {
    if (lowerCasePrompt.includes(college.toLowerCase())) {
      return college;
    }
  }
  return ''; 
}

async function fetchCollegeData(queryText, collegeName) {
  const result = await pool.query(queryText, [collegeName]);
  return result.rows;
}


async function handleQuery(prompt) {
  let responseText = '';
  const detectedlanguage = await detectLanguage(prompt);
  console.log(detectedlanguage);

  if (detectedlanguage != 'en') {
    prompt = await translateToEnglish(prompt);
    prompt = prompt.toLowerCase()
    console.log('Translated prompt:', prompt);
  }
  const combinedKeywords = [...collegeRelatedKeywords, ...collegeNames.map(name => name.toLowerCase())];
  const containsCollegeKeywords = combinedKeywords.some(keyword =>
  prompt.toLowerCase().includes(keyword)
);
const collegeName = extractCollegeName(prompt);
console.log('Extracted college name:', collegeName);

prompt = correctText(prompt)
console.log("corrected message ",prompt)
let intent;
if (containsCollegeKeywords) {
  intent = await findIntent(prompt);
  console.log('Detected intent:', intent);
} else {
  intent = undefined;
  console.log('No college-related keywords found. Intent set to:', intent);
}

const fee = checkQuery(prompt)
console.log(fee);
if(fee=="yes fee"){
  intent = "fee"
}
  
const collegeRegex = new RegExp(`\\b(${collegeNames.join('|')})\\b`, 'i'); 

if (/assistance/i.test(prompt) && collegeRegex.test(prompt)) {
    intent = "faculty and phone number";
    console.log("yes assistance ");
} else {
    console.log("no assiatance");
}
  switch (intent) {
    case "course and fee strct for b.tech/b.e": {
      const queryText = `SELECT courseandfeestructureforbtech_be_course FROM collegecoursedetails WHERE college ILIKE $1;`;
      try {
        const result = await fetchCollegeData(queryText, collegeName);
        responseText = result.length > 0
          ? `The BTech course and fee structure of ${collegeName} is ${result[0].courseandfeestructureforbtech_be_course}.`
          : `Sorry, I couldn't find the BTech course and fee structure for ${collegeName}.`;
      } catch (error) {
        console.error('Database error:', error);
        responseText = 'An error occurred while fetching data.';
      }
      break;
    }
  
    case "course and fee strct for m.tech/m.e": {
      const queryText = `SELECT courseandfeestructureforme_mtech_course FROM collegecoursedetails WHERE college ILIKE $1;`;
      try {
        const result = await fetchCollegeData(queryText, collegeName);
        responseText = result.length > 0
          ? `The M.E/M.Tech course and fee structure of ${collegeName} is ${result[0].courseandfeestructureforme_mtech_course}.`
          : `Sorry, I couldn't find the M.E/M.Tech course and fee structure for ${collegeName}.`;
      } catch (error) {
        console.error('Database error:', error);
        responseText = 'An error occurred while fetching data.';
      }
      break;
    }
  
    case "course and fee strct for mba/pgdm": {
      const queryText = `SELECT courseandfeestructureformba_pgdm_course FROM collegecoursedetails WHERE college ILIKE $1;`;
      try {
        const result = await fetchCollegeData(queryText, collegeName);
        responseText = result.length > 0
          ? `The MBA/PGDM course and fee structure of ${collegeName} is ${result[0].courseandfeestructureformba_pgdm_course}.`
          : `Sorry, I couldn't find the MBA/PGDM course and fee structure for ${collegeName}.`;
      } catch (error) {
        console.error('Database error:', error);
        responseText = 'An error occurred while fetching data.';
      }
      break;
    }
  
    case "course and fee strct for ph.d": {
      const queryText = `SELECT courseandfeestructureforphdcourse FROM collegecoursedetails WHERE college ILIKE $1;`;
      try {
        const result = await fetchCollegeData(queryText, collegeName);
        responseText = result.length > 0
          ? `The Ph.D course and fee structure of ${collegeName} is ${result[0].courseandfeestructureforphdcourse}.`
          : `Sorry, I couldn't find the Ph.D course and fee structure for ${collegeName}.`;
      } catch (error) {
        console.error('Database error:', error);
        responseText = 'An error occurred while fetching data.';
      }
      break;
    }
  
    case "review": {
      const queryText = `SELECT review FROM collegecoursedetails WHERE college ILIKE $1;`;
      try {
        const result = await fetchCollegeData(queryText, collegeName);
        responseText = result.length > 0
          ? `The review of ${collegeName} is: ${result[0].review}.`
          : `Sorry, I couldn't find the review for ${collegeName}.`;
      } catch (error) {
        console.error('Database error:', error);
        responseText = 'An error occurred while fetching data.';
      }
      break;
    }
  
    case "fee": {
      const queryText = `SELECT 
        courseandfeestructureforbtech_be_course, 
        courseandfeestructureforme_mtech_course, 
        courseandfeestructureformba_pgdm_course, 
        courseandfeestructureforphdcourse 
      FROM collegecoursedetails WHERE college ILIKE $1;`;
  
      const result = await pool.query(queryText, [collegeName]);
  
      if (result.rows.length > 0) {
        const fees = result.rows[0];
        responseText = `
        Here are the fee details for ${collegeName}:
        - **B.Tech/B.E**: ${fees.courseandfeestructureforbtech_be_course || "Not available"}
        - **M.Tech/M.E**: ${fees.courseandfeestructureforme_mtech_course || "Not available"}
        - **MBA/PGDM**: ${fees.courseandfeestructureformba_pgdm_course || "Not available"}
        - **Ph.D**: ${fees.courseandfeestructureforphdcourse || "Not available"}
        `;
      } else {
        responseText = `Sorry, I couldn't find any fee details for ${collegeName}.`;
      }
      break;
    }
  
    case "admission": {
      const queryText = `SELECT admission FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `Admission details for ${collegeName} are: ${result.rows[0].admission}.`
        : `Sorry, I couldn't find admission details for ${collegeName}.`;
      break;
    }
  
    case "placement": {
      const queryText = `SELECT placement FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `Placement details for ${collegeName} are: ${result.rows[0].placement}.`
        : `Sorry, I couldn't find placement details for ${collegeName}.`;
      break;
    }
  
    case "cut-off": {
      const queryText = `SELECT cutoff FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The cut-off for ${collegeName} is ${result.rows[0].cutoff}.`
        : `Sorry, I couldn't find the cut-off for ${collegeName}.`;
      break;
    }
  
    case "ranking": {
      const queryText = `SELECT ranking FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The ranking of ${collegeName} is ${result.rows[0].ranking}.`
        : `Sorry, I couldn't find the ranking for ${collegeName}.`;
      break;
    }
  
    case "description": {
      const queryText = `SELECT collegedescription FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The description of ${collegeName} is: ${result.rows[0].collegedescription}.`
        : `Sorry, I couldn't find the description for ${collegeName}.`;
      break;
    }
  
    case "scholarship": {
      const queryText = `SELECT scholarship FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `Scholarship details for ${collegeName} are: ${result.rows[0].scholarship}.`
        : `Sorry, I couldn't find scholarship details for ${collegeName}.`;
      break;
    }
  
    case "detail": {
      const queryText = `SELECT 
        courseandfeestructureforbtech_be_course, 
        courseandfeestructureforme_mtech_course, 
        courseandfeestructureformba_pgdm_course, 
        courseandfeestructureforphdcourse, 
        review, 
        admission, 
        placement, 
        cutoff, 
        ranking, 
        collegedescription, 
        scholarship, 
        faculty, 
        phone_number 
      FROM collegecoursedetails WHERE college ILIKE $1;`;
  
      const result = await pool.query(queryText, [collegeName]);
  
      if (result.rows.length > 0) {
        const details = result.rows[0];
        responseText = `
        Here are the details for ${collegeName}:
        - **B.Tech/B.E Course & Fees**: ${details.courseandfeestructureforbtech_be_course || "Not available"}
        - **M.Tech/M.E Course & Fees**: ${details.courseandfeestructureforme_mtech_course || "Not available"}
        - **MBA/PGDM Course & Fees**: ${details.courseandfeestructureformba_pgdm_course || "Not available"}
        - **Ph.D Course & Fees**: ${details.courseandfeestructureforphdcourse || "Not available"}
        - **Review**: ${details.review || "Not available"}
        - **Admission Details**: ${details.admission || "Not available"}
        - **Placement Details**: ${details.placement || "Not available"}
        - **Cut-Off**: ${details.cutoff || "Not available"}
        - **Ranking**: ${details.ranking || "Not available"}
        - **Description**: ${details.collegedescription || "Not available"}
        - **Scholarship**: ${details.scholarship || "Not available"}
        - **Faculty Details**: ${details.faculty || "Not available"}
        - **Phone Number**: ${details.phone_number || "Not available"}
        `;
      } else {
        responseText = `Sorry, I couldn't find detailed information for ${collegeName}.`;
      }
      break;
    }
  
    case "faculty and phone number": {
      const queryText = `SELECT faculty, phonenumber FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
  
      if (result.rows.length > 0) {
        const faculty = result.rows[0].faculty || "Not available";
        const phoneNumber = result.rows[0].phonenumber || "Not available";
  
        responseText = `The faculty details of ${collegeName} are: ${faculty}. The phone number is: ${phoneNumber}.`;
      } else {
        responseText = `Sorry, I couldn't find the details for ${collegeName}.`;
      }
      break;
    }
  
    default: {
      const aiResult = await model.generateContentStream(prompt);
      responseText = '';
  
      for await (const chunk of aiResult.stream) {
        responseText += chunk.text();
      }
  
      responseText = responseText
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/^\s+|\s+$/g, '')
        .trim();
      break;
    }
  }


  if (detectedlanguage != 'en') {
    console.log(detectedlanguage);
    responseText = await translateToDetectedLanguage(responseText, detectedlanguage);
    console.log('Translated response text:', responseText);
  }

  return responseText;
  
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (prompt) => {
    latestPrompt = prompt;

    if (!prompt) {
      socket.emit('error', 'Prompt is required');
      return;
    }

    try {
      console.log(prompt.toLowerCase())
      const responseText = await handleQuery(prompt.toLowerCase());
      socket.emit('message', { type: 'bot', text: responseText });
    } catch (error) {
      console.error('Error handling query:', error);
      socket.emit('error', 'Sorry, something went wrong.');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
