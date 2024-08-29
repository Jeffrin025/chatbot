
// import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import http from 'http';
// import { Server } from 'socket.io';
// import path from 'path';
// import pg from 'pg';


// const htmlPath = "C:\\expo\\sih\\index.html";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const port = 3000;


// const genAI = new GoogleGenerativeAI('AIzaSyBkCMJp9pjHLdQlzaAVIw2z6nowYQWYVQg');
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


// const pool = new pg.Pool({
//   user: 'postgres',          
//   host: 'localhost',       
//   database: 'sih',          
//   password: 'root',         
//   port: 5432,                
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(htmlPath));
// });

// async function handleQuery(prompt) {
//   let responseText = '';

//   switch (true) {
  
//     case /course\s+and\s+fee\s+strct\s+for\s+BTech\s+(?:of|for)\s+(.+)/i.test(prompt): { 
//       const match = prompt.match(/course\s+and\s+fee\s+strct\s+for\s+BTech\s+(?:of|for)\s+(.+)/i);
//       const collegeName = match ? match[1].trim() : '';
//       console.log(collegeName);
    
      
//       const queryText = `SELECT courseandfeestrctforbtech_be_course FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);
//       console.log(result);
    
//       if (result.rows.length > 0) {
//         responseText = `The BTech course and fee strct of ${collegeName} is ${result.rows[0].courseandfeestrctforbtech_be_course}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the BTech course and fee strct for ${collegeName}.`;
//       }
//       break;
//     }    
    
//     case /review (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/review (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT review FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The review for ${collegeName} is: ${result.rows[0].review}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the review for ${collegeName}.`;
//       }
//       break;
//     }

//     case /admission (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/admission (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT admission FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The admission details for ${collegeName} are: ${result.rows[0].admission}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the admission details for ${collegeName}.`;
//       }
//       break;
//     }

//     case /placement (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/placement (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT placement FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The placement details for ${collegeName} are: ${result.rows[0].placement}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the placement details for ${collegeName}.`;
//       }
//       break;
//     }

//     case /cutoff (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/cutoff (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT cutoff FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The cutoff for ${collegeName} is: ${result.rows[0].cutoff}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the cutoff for ${collegeName}.`;
//       }
//       break;
//     }

//     case /ranking (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/ranking (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT ranking FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The ranking for ${collegeName} is: ${result.rows[0].ranking}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the ranking for ${collegeName}.`;
//       }
//       break;
//     }

//     case /collegeDescription (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/collegeDescription (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT collegeDescription FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The description of ${collegeName} is: ${result.rows[0].collegeDescription}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the description for ${collegeName}.`;
//       }
//       break;
//     }

//     case /scholarship (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/scholarship (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT scholarship FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The scholarship details for ${collegeName} are: ${result.rows[0].scholarship}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the scholarship details for ${collegeName}.`;
//       }
//       break;
//     }

//     case /faculty (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/faculty (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT faculty FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The faculty details for ${collegeName} are: ${result.rows[0].faculty}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the faculty details for ${collegeName}.`;
//       }
//       break;
//     }

//     case /phoneNumber (of|for) (.+)/i.test(prompt): {
//       const match = prompt.match(/phoneNumber (of|for) (.+)/i);
//       const collegeName = match ? match[2] : '';
//       const queryText = `SELECT phoneNumber FROM collegecoursedetails WHERE college ILIKE $1;`;
//       const result = await pool.query(queryText, [collegeName]);

//       if (result.rows.length > 0) {
//         responseText = `The phone number for ${collegeName} is: ${result.rows[0].phoneNumber}.`;
//       } else {
//         responseText = `Sorry, I couldn't find the phone number for ${collegeName}.`;
//       }
//       break;
//     }

//     default: {
//       const aiResult = await model.generateContentStream(prompt);
//       responseText = '';

//       for await (const chunk of aiResult.stream) {
//         responseText += chunk.text();
//       }

//       responseText = responseText
//         .replace(/\*\*/g, '')  
//         .replace(/\*/g, '') 
//         .replace(/^\s+|\s+$/g, '')  
//         .trim();  
//       break;
//     }
//   }

//   return responseText;
// }

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('message', async (prompt) => {
//     if (!prompt) {
//       socket.emit('error', 'Prompt is required');
//       return;
//     }

//     try {
//       const responseText = await handleQuery(prompt);
//       socket.emit('message', { type: 'bot', text: responseText });
//     } catch (error) {
//       console.error(error);
//       socket.emit('error', 'An error occurred while generating content');
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });


// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';  // Corrected import statement
import pg from 'pg';


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

const genAI = new GoogleGenerativeAI('AIzaSyBkCMJp9pjHLdQlzaAVIw2z6nowYQWYVQg');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sih',
  password: 'root',
  port: 5432,
});

app.use(express.static('C:\\jaff\\sih\\public'));

app.get('/', (req, res) => {
  res.sendFile('C:\\jaff\\sih\\public\\index.html');
});

let latestPrompt = '';

async function detectLanguage(text) {
  try {
    const response = await axios.post('http://localhost:5000/detect-language', { text });
    return response.data.language;
  } catch (error) {
    console.error('Error detecting language:', error);
    throw new Error('Language detection failed');
  }
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
    return "yes";
  } else {
    return "no";
  }
}

const collegeRelatedKeywords = [
  'course', 'fee', 'admission', 'placement', 'cut-off', 
  'ranking', 'scholarship', 'faculty', 'phone number', 
  'description', 'review', 'btech', 'mtech', 'mba', 'phd',
  "course and fee strct for B.Tech/B.E",
  "course and fee strct for M.Tech/M.Tech",
  "course and fee strct for MBA/PGDM",
  "course and fee strct for Ph.D",
  "review",
  "admission",
  "placement",
  "cut-off",
  "ranking",
  "description",
  "scholarship",
  "faculty",
  "phone number"
];
const collegeNames = [
  'IIT Gandhinagar', 'Harvard University', 'MIT', 'Stanford University', 'University of California'

];

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



let intent;
if (containsCollegeKeywords) {
  intent = await findIntent(prompt);
  console.log('Detected intent:', intent);
} else {
  intent = undefined;
  console.log('No college-related keywords found. Intent set to:', intent);
}

const res = checkQuery(prompt)
console.log(res);
if(res=="yes"){
  intent = "fee"
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

  const collegeName = extractCollegeName(prompt);
  console.log('Extracted college name:', collegeName);

  switch (intent) {
    case "course and fee strct for b.tech/b.e": {
      const queryText = `SELECT courseandfeestructureforbtech_be_course FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The BTech course and fee strct of ${collegeName} is ${result.rows[0].courseandfeestructureforbtech_be_course}.`
        : `Sorry, I couldn't find the BTech course and fee strct for ${collegeName}.`;
      break;
    }
  
    case "course and fee strct for m.tech/m.e": {
      const queryText = `SELECT courseandfeestructureforme_mtech_course FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The M.E/M.Tech course and fee strct of ${collegeName} is ${result.rows[0].courseandfeestructureforme_mtech_course}.`
        : `Sorry, I couldn't find the M.E/M.Tech course and fee strct for ${collegeName}.`;
      break;
    }

    case "course and fee strct for mba/pgdm": {
      const queryText = `SELECT courseandfeestructureformba_pgdm_course FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The MBA/PGDM course and fee strct of ${collegeName} is ${result.rows[0].courseandfeestructureformba_pgdm_course}.`
        : `Sorry, I couldn't find the MBA/PGDM course and fee strct for ${collegeName}.`;
      break;
    }

    case "course and fee strct for ph.d": {
      const queryText = `SELECT courseandfeestructureforphdcourse FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The Ph.D course and fee strct of ${collegeName} is ${result.rows[0].courseandfeestructureforphdcourse}.`
        : `Sorry, I couldn't find the Ph.D course and fee strct for ${collegeName}.`;
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
        - **B.Tech/B.E**: ${fees.courseandfeestructureforbtech_be_course ? fees.courseandfeestructureforbtech_be_course : "Not available"}
        - **M.Tech/M.E**: ${fees.courseandfeestructureforme_mtech_course ? fees.courseandfeestructureforme_mtech_course : "Not available"}
        - **MBA/PGDM**: ${fees.courseandfeestructureformba_pgdm_course ? fees.courseandfeestructureformba_pgdm_course : "Not available"}
        - **Ph.D**: ${fees.courseandfeestructureforphdcourse ? fees.courseandfeestructureforphdcourse : "Not available"}
        `;
      } else {
        responseText = `Sorry, I couldn't find any fee details for ${collegeName}.`;
      }
      break;
    }
    case "review": {
      const queryText = `SELECT review FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The review of ${collegeName} is: ${result.rows[0].review}.`
        : `Sorry, I couldn't find the review for ${collegeName}.`;
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
      console.log("found")
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
      
      responseText=  result.rows.length > 0 
      ?`
        Here are the details for ${collegeName}:
        - **B.Tech/B.E Course & Fees**: ${details.courseandfeestructureforbtech_be_course}
        - **M.Tech/M.E Course & Fees**: ${details.courseandfeestructureforme_mtech_course}
        - **MBA/PGDM Course & Fees**: ${details.courseandfeestructureformba_pgdm_course}
        - **Ph.D Course & Fees**: ${details.courseandfeestructureforphdcourse}
        - **Review**: ${details.review}
        - **Admission Details**: ${details.admission}
        - **Placement Details**: ${details.placement}
        - **Cut-Off**: ${details.cutoff}
        - **Ranking**: ${details.ranking}
        - **Description**: ${details.collegedescription}
        - **Scholarship**: ${details.scholarship}
        - **Faculty Details**: ${details.faculty}
        - **Phone Number**: ${details.phone_number}
        `
     : `Sorry, I couldn't find detailed information for ${collegeName}.`;
      
      break;
    }
    
  
    case "faculty": {
      const queryText = `SELECT faculty FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The faculty details of ${collegeName} are: ${result.rows[0].faculty}.`
        : `Sorry, I couldn't find the faculty details for ${collegeName}.`;
      break;
    }

    case "phone number": {
      const queryText = `SELECT phone_number FROM collegecoursedetails WHERE college ILIKE $1;`;
      const result = await pool.query(queryText, [collegeName]);
      responseText = result.rows.length > 0
        ? `The phone number of ${collegeName} is ${result.rows[0].phone_number}.`
        : `Sorry, I couldn't find the phone number for ${collegeName}.`;
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
