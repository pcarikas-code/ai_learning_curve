import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

// Comprehensive content for "Introduction to NLP" module
const nlpIntroContent = `# Introduction to Natural Language Processing

Natural Language Processing (NLP) is a fascinating intersection of computer science, artificial intelligence, and linguistics that enables computers to understand, interpret, and generate human language in meaningful ways.

## What is NLP?

NLP combines computational linguistics—rule-based modeling of human language—with statistical, machine learning, and deep learning models. These technologies enable computers to process human language in the form of text or voice data and understand its full meaning, complete with the speaker or writer's intent and sentiment.

## Real-World Applications

### 1. Virtual Assistants
- **Siri, Alexa, Google Assistant**: Use NLP to understand voice commands and respond naturally
- **Speech Recognition**: Converts spoken words into text
- **Intent Classification**: Determines what action the user wants to perform

### 2. Machine Translation
- **Google Translate**: Translates between 100+ languages
- **DeepL**: Provides context-aware translations
- **Real-time Subtitles**: YouTube, Zoom automatic captions

### 3. Sentiment Analysis
- **Social Media Monitoring**: Track brand sentiment on Twitter, Reddit
- **Customer Feedback**: Analyze product reviews automatically
- **Market Research**: Understand public opinion on topics

### 4. Text Summarization
- **News Aggregation**: Generate article summaries
- **Document Summarization**: Condense long reports
- **Email Threading**: Gmail's smart reply suggestions

### 5. Chatbots & Customer Service
- **Customer Support**: 24/7 automated assistance
- **E-commerce**: Product recommendations and queries
- **Healthcare**: Symptom checkers and appointment scheduling

## The NLP Pipeline

Understanding how NLP systems process text is crucial:

\`\`\`
Raw Text → Preprocessing → Tokenization → Feature Extraction → Model → Output
\`\`\`

### Step 1: Text Preprocessing
- **Lowercasing**: Convert all text to lowercase for consistency
- **Removing special characters**: Clean punctuation, numbers
- **Handling contractions**: "don't" → "do not"

### Step 2: Tokenization
Breaking text into individual units (tokens):
\`\`\`python
text = "Natural Language Processing is amazing!"
tokens = ["Natural", "Language", "Processing", "is", "amazing", "!"]
\`\`\`

### Step 3: Feature Extraction
Converting text to numerical representations:
- **Bag of Words**: Count word frequencies
- **TF-IDF**: Weight words by importance
- **Word Embeddings**: Dense vector representations

### Step 4: Model Application
Apply machine learning or deep learning models:
- **Classification**: Spam detection, sentiment analysis
- **Sequence-to-Sequence**: Translation, summarization
- **Generation**: Text completion, chatbots

## Code Example: Simple Sentiment Analysis

\`\`\`python
from transformers import pipeline

# Load pre-trained sentiment analysis model
classifier = pipeline('sentiment-analysis')

# Analyze text
texts = [
    "I love this product! It's amazing!",
    "This is the worst experience ever.",
    "The service was okay, nothing special."
]

for text in texts:
    result = classifier(text)[0]
    print(f"Text: {text}")
    print(f"Sentiment: {result['label']}, Score: {result['score']:.3f}\\n")
\`\`\`

**Output:**
\`\`\`
Text: I love this product! It's amazing!
Sentiment: POSITIVE, Score: 0.999

Text: This is the worst experience ever.
Sentiment: NEGATIVE, Score: 0.998

Text: The service was okay, nothing special.
Sentiment: NEUTRAL, Score: 0.876
\`\`\`

## Key Challenges in NLP

### 1. Ambiguity
Words can have multiple meanings depending on context:
- "I saw her duck" (verb: lower head, or noun: bird?)
- "Bank" (financial institution or river bank?)

### 2. Context Dependency
Meaning changes with context:
- "That's sick!" (negative in medical context, positive in slang)

### 3. Sarcasm and Irony
"Oh great, another meeting!" (likely negative despite "great")

### 4. Multilingual Support
- Different grammar rules across languages
- Idioms don't translate literally
- Cultural context matters

### 5. Data Quality
- Typos, slang, abbreviations
- Informal language on social media
- Domain-specific jargon

## Modern NLP Approaches

### Traditional Methods (Pre-2013)
- **Rule-based systems**: Hand-crafted grammar rules
- **Statistical methods**: N-grams, Hidden Markov Models
- **Bag of Words**: Simple word counting

### Deep Learning Era (2013-2017)
- **Word2Vec (2013)**: Dense word embeddings
- **RNNs & LSTMs**: Sequential processing
- **Attention Mechanisms**: Focus on relevant parts

### Transformer Era (2017-Present)
- **BERT (2018)**: Bidirectional understanding
- **GPT Series**: Powerful text generation
- **T5, BART**: Unified text-to-text models
- **Large Language Models**: ChatGPT, Claude, Llama

## Getting Started with NLP

### Essential Skills
1. **Python Programming**: Primary language for NLP
2. **Linear Algebra**: Understand vector operations
3. **Probability & Statistics**: For model understanding
4. **Linguistics Basics**: Parts of speech, syntax

### Popular Libraries
\`\`\`python
# Core NLP libraries
import nltk              # Natural Language Toolkit
import spacy             # Industrial-strength NLP
from transformers import pipeline  # Hugging Face transformers

# Data manipulation
import pandas as pd
import numpy as np

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
\`\`\`

### Learning Path
1. **Start with basics**: Tokenization, stemming, lemmatization
2. **Text classification**: Spam detection, sentiment analysis
3. **Named Entity Recognition**: Extract names, dates, locations
4. **Sequence models**: RNNs, LSTMs for text generation
5. **Transformers**: BERT, GPT for advanced applications

## Practice Exercise

**Task**: Build a simple text classifier to detect spam messages.

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split

# Sample data
messages = [
    "Win a free iPhone now!",
    "Meeting at 3pm tomorrow",
    "Claim your prize money today!",
    "Can you send me the report?",
    "Congratulations! You've won $1000!",
    "Let's grab coffee this weekend"
]
labels = [1, 0, 1, 0, 1, 0]  # 1=spam, 0=not spam

# Vectorize text
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(messages)

# Train classifier
classifier = MultinomialNB()
classifier.fit(X, labels)

# Test
test_messages = [
    "Free money waiting for you!",
    "Are you available for a call?"
]
X_test = vectorizer.transform(test_messages)
predictions = classifier.predict(X_test)

for msg, pred in zip(test_messages, predictions):
    label = "SPAM" if pred == 1 else "NOT SPAM"
    print(f"{msg} → {label}")
\`\`\`

## Next Steps

In the following modules, you'll learn:
- **Text Preprocessing**: Clean and prepare text data
- **Word Embeddings**: Represent words as vectors
- **Text Classification**: Build sentiment analyzers
- **Sequence Models**: Generate and translate text
- **Transformers**: Use state-of-the-art models

Ready to dive deeper into the world of NLP? Let's continue!
`;

async function updateContent() {
  console.log("Updating module content with comprehensive material...");
  
  // Update "Introduction to NLP" module (ID 60002)
  await pool.query(
    'UPDATE modules SET content = ? WHERE id = ?',
    [nlpIntroContent, 60002]
  );
  console.log("✓ Updated: Introduction to NLP");
  
  console.log("\\n✅ Module content updated successfully!");
  process.exit(0);
}

updateContent().catch(console.error);
