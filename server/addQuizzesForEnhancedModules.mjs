import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

async function addQuizzes() {
  console.log("Adding quizzes for enhanced modules...\\n");
  
  try {
    // Quiz for "Introduction to NLP" (Module 60002)
    const [nlpQuiz] = await pool.query(
      'INSERT INTO quizzes (module_id, title, description, passing_score, time_limit) VALUES (?, ?, ?, ?, ?)',
      [60002, 'Introduction to NLP Quiz', 'Test your understanding of NLP fundamentals, applications, and the NLP pipeline.', 70, 15]
    );
    const nlpQuizId = nlpQuiz.insertId;
    console.log(`✓ Created quiz for "Introduction to NLP" (ID: ${nlpQuizId})`);
    
    // Questions for Introduction to NLP
    const nlpQuestions = [
      {
        question: 'What is the primary goal of Natural Language Processing (NLP)?',
        options: JSON.stringify([
          'To create new programming languages',
          'To enable computers to understand, interpret, and generate human language',
          'To translate binary code to text',
          'To optimize computer hardware performance'
        ]),
        correctAnswer: 1,
        explanation: 'NLP aims to bridge the gap between human language and computer understanding, enabling machines to process and generate natural language meaningfully.'
      },
      {
        question: 'Which of the following is NOT a real-world application of NLP?',
        options: JSON.stringify([
          'Virtual assistants like Siri and Alexa',
          'Machine translation (Google Translate)',
          'Image compression algorithms',
          'Sentiment analysis of social media posts'
        ]),
        correctAnswer: 2,
        explanation: 'Image compression is a computer vision task, not an NLP application. NLP focuses on text and language processing.'
      },
      {
        question: 'What is tokenization in NLP?',
        options: JSON.stringify([
          'Encrypting text for security',
          'Breaking text into individual units (words or subwords)',
          'Converting text to uppercase',
          'Removing all punctuation from text'
        ]),
        correctAnswer: 1,
        explanation: 'Tokenization is the process of splitting text into smaller units called tokens, typically words or subwords, which is a fundamental preprocessing step in NLP.'
      },
      {
        question: 'Which NLP technique is used by modern transformers like BERT and GPT?',
        options: JSON.stringify([
          'Rule-based systems only',
          'Bag of Words',
          'Subword tokenization and attention mechanisms',
          'Simple word counting'
        ]),
        correctAnswer: 2,
        explanation: 'Modern transformers use subword tokenization (like WordPiece or BPE) combined with attention mechanisms to understand context and relationships in text.'
      },
      {
        question: 'What is a major challenge in NLP?',
        options: JSON.stringify([
          'Text is always perfectly formatted',
          'Words have only one meaning',
          'Ambiguity and context dependency of language',
          'All languages follow the same grammar rules'
        ]),
        correctAnswer: 2,
        explanation: 'Language ambiguity and context dependency are major challenges in NLP. Words can have multiple meanings, and understanding requires considering context, sarcasm, idioms, and cultural nuances.'
      }
    ];
    
    for (let i = 0; i < nlpQuestions.length; i++) {
      await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nlpQuizId, nlpQuestions[i].question, 'multiple_choice', nlpQuestions[i].options, nlpQuestions[i].correctAnswer, nlpQuestions[i].explanation, i + 1]
      );
    }
    console.log(`  Added ${nlpQuestions.length} questions\\n`);
    
    // Quiz for "Text Preprocessing & Tokenization" (Module 60003)
    const [prepQuiz] = await pool.query(
      'INSERT INTO quizzes (module_id, title, description, passing_score, time_limit) VALUES (?, ?, ?, ?, ?)',
      [60003, 'Text Preprocessing & Tokenization Quiz', 'Test your knowledge of text cleaning, tokenization, stemming, and lemmatization techniques.', 70, 15]
    );
    const prepQuizId = prepQuiz.insertId;
    console.log(`✓ Created quiz for "Text Preprocessing & Tokenization" (ID: ${prepQuizId})`);
    
    // Questions for Text Preprocessing & Tokenization
    const prepQuestions = [
      {
        question: 'Why is lowercasing important in text preprocessing?',
        options: JSON.stringify([
          'It makes text easier to read',
          'It treats "Hello", "hello", and "HELLO" as the same word',
          'It removes all punctuation',
          'It increases processing speed'
        ]),
        correctAnswer: 1,
        explanation: 'Lowercasing ensures that words with different capitalization are treated as the same word, reducing vocabulary size and improving model efficiency.'
      },
      {
        question: 'What are stop words in NLP?',
        options: JSON.stringify([
          'Words that stop the program from running',
          'Common words with little semantic meaning like "the", "is", "at"',
          'Words that are misspelled',
          'Words in foreign languages'
        ]),
        correctAnswer: 1,
        explanation: 'Stop words are common words that carry little meaningful information and are often removed in tasks like document classification to reduce noise.'
      },
      {
        question: 'What is the difference between stemming and lemmatization?',
        options: JSON.stringify([
          'They are the same thing',
          'Stemming chops word endings crudely; lemmatization returns dictionary forms',
          'Stemming is faster but less accurate; lemmatization is slower but more accurate',
          'Both B and C are correct'
        ]),
        correctAnswer: 3,
        explanation: 'Stemming uses crude rules to chop endings (fast but may produce non-words), while lemmatization uses vocabulary and morphological analysis to return proper dictionary forms (slower but accurate).'
      },
      {
        question: 'Which tokenization approach is used by modern transformers like BERT?',
        options: JSON.stringify([
          'Simple whitespace splitting',
          'Word-level tokenization only',
          'Subword tokenization (WordPiece, BPE)',
          'Character-level tokenization only'
        ]),
        correctAnswer: 2,
        explanation: 'Modern transformers use subword tokenization methods like WordPiece or Byte-Pair Encoding (BPE) to handle unknown words by breaking them into known subword units.'
      },
      {
        question: 'When should you NOT remove stop words?',
        options: JSON.stringify([
          'Document classification',
          'Machine translation and text generation',
          'Topic modeling',
          'Search engine indexing'
        ]),
        correctAnswer: 1,
        explanation: 'Stop words should be kept in tasks where grammar and sentence structure matter, such as machine translation and text generation, as they provide important contextual information.'
      }
    ];
    
    for (let i = 0; i < prepQuestions.length; i++) {
      await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [prepQuizId, prepQuestions[i].question, 'multiple_choice', prepQuestions[i].options, prepQuestions[i].correctAnswer, prepQuestions[i].explanation, i + 1]
      );
    }
    console.log(`  Added ${prepQuestions.length} questions\\n`);
    
    // Quiz for "Introduction to Computer Vision" (Module 60004)
    const [cvQuiz] = await pool.query(
      'INSERT INTO quizzes (module_id, title, description, passing_score, time_limit) VALUES (?, ?, ?, ?, ?)',
      [60004, 'Introduction to Computer Vision Quiz', 'Test your understanding of computer vision fundamentals, applications, and CNNs.', 70, 15]
    );
    const cvQuizId = cvQuiz.insertId;
    console.log(`✓ Created quiz for "Introduction to Computer Vision" (ID: ${cvQuizId})`);
    
    // Questions for Introduction to Computer Vision
    const cvQuestions = [
      {
        question: 'What is Computer Vision?',
        options: JSON.stringify([
          'A type of camera lens',
          'AI that enables computers to derive meaning from images and videos',
          'A graphics design software',
          'A method to improve human eyesight'
        ]),
        correctAnswer: 1,
        explanation: 'Computer Vision is the field of AI that enables computers to extract meaningful information from visual inputs like images and videos, and take actions based on that information.'
      },
      {
        question: 'How are digital images represented in computers?',
        options: JSON.stringify([
          'As text files',
          'As audio waves',
          'As arrays of numbers (pixels with RGB values)',
          'As compressed ZIP files'
        ]),
        correctAnswer: 2,
        explanation: 'Digital images are represented as multi-dimensional arrays of numbers, where each pixel has RGB (Red, Green, Blue) color values, typically ranging from 0-255.'
      },
      {
        question: 'Which of the following is a real-world application of Computer Vision?',
        options: JSON.stringify([
          'Autonomous vehicles detecting pedestrians',
          'Medical imaging for cancer detection',
          'Facial recognition systems',
          'All of the above'
        ]),
        correctAnswer: 3,
        explanation: 'Computer Vision has numerous real-world applications including autonomous driving, medical diagnosis, facial recognition, quality control in manufacturing, and many more.'
      },
      {
        question: 'What is a Convolutional Neural Network (CNN)?',
        options: JSON.stringify([
          'A type of database',
          'A neural network architecture designed for processing grid-like data such as images',
          'A programming language',
          'A type of camera'
        ]),
        correctAnswer: 1,
        explanation: 'CNNs are specialized neural networks designed for processing visual data. They use convolutional layers to automatically learn spatial hierarchies of features from images.'
      },
      {
        question: 'What is a major challenge in Computer Vision?',
        options: JSON.stringify([
          'All images look exactly the same',
          'Computers process images too quickly',
          'Viewpoint variation, illumination changes, and occlusion',
          'Images are always perfectly clear'
        ]),
        correctAnswer: 2,
        explanation: 'Computer Vision faces challenges like viewpoint variation (same object from different angles), illumination changes (lighting conditions), occlusion (objects partially hidden), and background clutter.'
      }
    ];
    
    for (let i = 0; i < cvQuestions.length; i++) {
      await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question, question_type, options, correct_answer, explanation, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [cvQuizId, cvQuestions[i].question, 'multiple_choice', cvQuestions[i].options, cvQuestions[i].correctAnswer, cvQuestions[i].explanation, i + 1]
      );
    }
    console.log(`  Added ${cvQuestions.length} questions\\n`);
    
    console.log("✅ All quizzes and questions added successfully!");
    console.log(`\\nSummary:`);
    console.log(`  - 3 quizzes created`);
    console.log(`  - 15 questions added (5 per quiz)`);
    
  } catch (error) {
    console.error("Error adding quizzes:", error);
  } finally {
    process.exit(0);
  }
}

addQuizzes();
