import { getDb } from "./db";
import { learningPaths, modules, quizzes, quizQuestions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seedNLPandCV() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  console.log("Seeding NLP and Computer Vision modules...");

  // Get existing paths
  const paths = await db.select().from(learningPaths);
  const pathMap = new Map(paths.map(p => [p.slug, p.id]));

  // Natural Language Processing Path
  const nlpId = pathMap.get("nlp")!;
  const nlpModules = [
    {
      title: "Introduction to NLP",
      slug: "intro-to-nlp",
      description: "Understanding natural language processing fundamentals, applications, and the NLP pipeline.",
      difficulty: "beginner" as const,
      content: `# Introduction to Natural Language Processing

Natural Language Processing (NLP) is a branch of artificial intelligence that focuses on enabling computers to understand, interpret, and generate human language.

## What is NLP?

NLP combines computational linguistics with machine learning and deep learning to process and analyze large amounts of natural language data. It bridges the gap between human communication and computer understanding.

## Key Applications

- **Machine Translation**: Google Translate, DeepL
- **Sentiment Analysis**: Social media monitoring, customer feedback
- **Chatbots**: Customer service, virtual assistants
- **Text Summarization**: News aggregation, document summarization
- **Named Entity Recognition**: Information extraction, knowledge graphs
- **Question Answering**: Search engines, virtual assistants

## The NLP Pipeline

1. **Text Preprocessing**: Cleaning and normalizing text
2. **Tokenization**: Breaking text into words or subwords
3. **Part-of-Speech Tagging**: Identifying grammatical roles
4. **Parsing**: Analyzing sentence structure
5. **Semantic Analysis**: Understanding meaning
6. **Application**: Specific task execution

## Challenges in NLP

- **Ambiguity**: Words with multiple meanings
- **Context Dependency**: Meaning changes with context
- **Idioms and Slang**: Non-literal language
- **Multilingual Support**: Different languages have different rules
- **Sarcasm and Irony**: Difficult to detect

## Modern NLP Approaches

Traditional NLP relied on rule-based systems and statistical methods. Modern NLP leverages:

- **Word Embeddings**: Dense vector representations (Word2Vec, GloVe)
- **Recurrent Neural Networks**: Sequential data processing
- **Transformers**: Attention mechanisms (BERT, GPT)
- **Transfer Learning**: Pre-trained models fine-tuned for specific tasks

## Getting Started

To work with NLP, you'll need:
- Python programming skills
- Understanding of machine learning basics
- Familiarity with libraries like NLTK, spaCy, or Hugging Face Transformers
- Knowledge of linguistic concepts

In the following modules, we'll dive deep into each component of the NLP pipeline and build practical applications.`,
      order: 1,
      estimatedMinutes: 45,
      pathId: nlpId,
    },
    {
      title: "Text Preprocessing & Tokenization",
      slug: "text-preprocessing-tokenization",
      description: "Learn text cleaning, normalization, and tokenization techniques essential for NLP tasks.",
      difficulty: "beginner" as const,
      content: `# Text Preprocessing & Tokenization

Before feeding text to NLP models, we must clean and structure it. This module covers essential preprocessing techniques.

## Why Preprocessing Matters

Raw text contains noise that can confuse models:
- HTML tags and special characters
- Inconsistent capitalization
- Extra whitespace
- Punctuation that may or may not be meaningful

## Common Preprocessing Steps

### 1. Lowercasing
Convert all text to lowercase to treat "Apple" and "apple" as the same word.

\`\`\`python
text = "Hello World!"
text_lower = text.lower()  # "hello world!"
\`\`\`

### 2. Removing Special Characters
Strip HTML tags, URLs, emails, and special symbols.

\`\`\`python
import re
text = "Check out https://example.com!"
clean_text = re.sub(r'http\\S+', '', text)
\`\`\`

### 3. Removing Stop Words
Common words like "the", "is", "at" often don't add meaning.

\`\`\`python
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))
words = [w for w in words if w not in stop_words]
\`\`\`

### 4. Stemming vs Lemmatization

**Stemming**: Crude chopping of word endings
- running → run
- better → better

**Lemmatization**: Vocabulary-based reduction
- running → run
- better → good

## Tokenization

Tokenization breaks text into smaller units (tokens).

### Word Tokenization
\`\`\`python
from nltk.tokenize import word_tokenize
text = "NLP is fascinating!"
tokens = word_tokenize(text)
# ['NLP', 'is', 'fascinating', '!']
\`\`\`

### Sentence Tokenization
\`\`\`python
from nltk.tokenize import sent_tokenize
text = "NLP is great. I love it!"
sentences = sent_tokenize(text)
# ['NLP is great.', 'I love it!']
\`\`\`

### Subword Tokenization
Modern approach used by transformers (BERT, GPT):
- Handles rare words
- Reduces vocabulary size
- Examples: WordPiece, Byte-Pair Encoding (BPE)

## Practical Example

\`\`\`python
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def preprocess_text(text):
    # Lowercase
    text = text.lower()
    
    # Tokenize
    tokens = nltk.word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words]
    
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    
    return tokens

text = "The cats are running quickly!"
processed = preprocess_text(text)
# ['cat', 'running', 'quickly', '!']
\`\`\`

## Best Practices

- **Task-Dependent**: Preprocessing depends on your task
- **Preserve Information**: Don't over-clean; keep meaningful punctuation
- **Consistency**: Apply the same preprocessing to training and inference data
- **Experimentation**: Test different preprocessing strategies

Next, we'll explore how to represent these tokens numerically for machine learning models.`,
      order: 2,
      estimatedMinutes: 60,
      pathId: nlpId,
    },
    {
      title: "Word Embeddings",
      slug: "word-embeddings",
      description: "Understand vector representations of words including Word2Vec, GloVe, and contextual embeddings.",
      difficulty: "intermediate" as const,
      content: `# Word Embeddings

Word embeddings are dense vector representations that capture semantic meaning of words.

## From One-Hot to Embeddings

### One-Hot Encoding (Traditional)
- Each word is a sparse vector
- Dimension = vocabulary size
- No semantic relationship captured
- "king" and "queen" are equally distant from "apple"

### Word Embeddings (Modern)
- Dense vectors (typically 100-300 dimensions)
- Similar words have similar vectors
- Captures semantic relationships
- "king" is closer to "queen" than to "apple"

## Word2Vec

Developed by Google in 2013, Word2Vec learns embeddings from large text corpora.

### Two Architectures

**CBOW (Continuous Bag of Words)**
- Predicts target word from context words
- Faster training
- Better for smaller datasets

**Skip-gram**
- Predicts context words from target word
- Better for rare words
- More accurate for larger datasets

### Example
\`\`\`python
from gensim.models import Word2Vec

sentences = [["cat", "sat", "mat"], 
             ["dog", "sat", "mat"]]

model = Word2Vec(sentences, vector_size=100, 
                 window=5, min_count=1)

# Get vector for a word
vector = model.wv['cat']

# Find similar words
similar = model.wv.most_similar('cat', topn=5)
\`\`\`

## GloVe (Global Vectors)

Developed by Stanford, GloVe combines global matrix factorization with local context windows.

### Key Idea
- Constructs word-word co-occurrence matrix
- Factorizes matrix to get embeddings
- Captures both local and global statistics

### Using Pre-trained GloVe
\`\`\`python
import numpy as np

def load_glove_embeddings(file_path):
    embeddings = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            vector = np.array(values[1:], dtype='float32')
            embeddings[word] = vector
    return embeddings

glove = load_glove_embeddings('glove.6B.100d.txt')
king_vector = glove['king']
\`\`\`

## Semantic Relationships

Word embeddings capture fascinating relationships:

\`\`\`
king - man + woman ≈ queen
paris - france + italy ≈ rome
walking - walk + swim ≈ swimming
\`\`\`

## Contextual Embeddings

Traditional embeddings have one vector per word. Contextual embeddings (BERT, ELMo) generate different vectors based on context.

**Example:**
- "I went to the **bank** to deposit money" (financial institution)
- "I sat on the river **bank**" (riverside)

BERT gives different embeddings for "bank" in each sentence.

## Practical Applications

### Similarity Search
\`\`\`python
from scipy.spatial.distance import cosine

def word_similarity(word1, word2, embeddings):
    vec1 = embeddings[word1]
    vec2 = embeddings[word2]
    return 1 - cosine(vec1, vec2)

similarity = word_similarity('king', 'queen', glove)
# High similarity score
\`\`\`

### Document Embeddings
Average word embeddings to represent documents:

\`\`\`python
def document_embedding(text, embeddings):
    words = text.lower().split()
    vectors = [embeddings[w] for w in words if w in embeddings]
    return np.mean(vectors, axis=0)
\`\`\`

## Choosing Embeddings

- **Word2Vec/GloVe**: Fast, lightweight, good for smaller tasks
- **FastText**: Handles out-of-vocabulary words (subword info)
- **BERT/RoBERTa**: State-of-the-art, contextual, but slower
- **Domain-specific**: Train on your domain data for better results

In the next module, we'll use these embeddings to build classification models.`,
      order: 3,
      estimatedMinutes: 75,
      pathId: nlpId,
    },
    {
      title: "Text Classification",
      slug: "text-classification",
      description: "Build sentiment analysis and text classification models using traditional and deep learning approaches.",
      difficulty: "intermediate" as const,
      content: `# Text Classification

Text classification assigns predefined categories to text documents. It's one of the most common NLP tasks.

## Applications

- **Sentiment Analysis**: Positive, negative, neutral
- **Spam Detection**: Spam vs ham
- **Topic Classification**: Sports, politics, technology
- **Intent Detection**: User intent in chatbots
- **Language Detection**: Identifying language of text

## Traditional Approaches

### Bag of Words + Naive Bayes

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Training data
texts = ["I love this movie", "This film is terrible", 
         "Great acting", "Waste of time"]
labels = [1, 0, 1, 0]  # 1=positive, 0=negative

# Create pipeline
pipeline = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('classifier', MultinomialNB())
])

# Train
pipeline.fit(texts, labels)

# Predict
prediction = pipeline.predict(["This movie is amazing"])
# Output: [1] (positive)
\`\`\`

### TF-IDF + Logistic Regression

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000)),
    ('classifier', LogisticRegression())
])

pipeline.fit(texts, labels)
\`\`\`

## Deep Learning Approaches

### LSTM for Sentiment Analysis

\`\`\`python
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Tokenize
tokenizer = Tokenizer(num_words=10000)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded = pad_sequences(sequences, maxlen=100)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(10000, 128, input_length=100),
    tf.keras.layers.LSTM(64, dropout=0.2),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', 
              loss='binary_crossentropy',
              metrics=['accuracy'])

model.fit(padded, labels, epochs=10, validation_split=0.2)
\`\`\`

### Transfer Learning with BERT

\`\`\`python
from transformers import BertTokenizer, TFBertForSequenceClassification
import tensorflow as tf

# Load pre-trained BERT
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = TFBertForSequenceClassification.from_pretrained(
    'bert-base-uncased', 
    num_labels=2
)

# Tokenize
inputs = tokenizer(texts, padding=True, truncation=True, 
                   return_tensors='tf', max_length=128)

# Fine-tune
optimizer = tf.keras.optimizers.Adam(learning_rate=2e-5)
model.compile(optimizer=optimizer, 
              loss=model.compute_loss,
              metrics=['accuracy'])

model.fit(inputs, labels, epochs=3)
\`\`\`

## Evaluation Metrics

### Accuracy
Percentage of correct predictions. Good for balanced datasets.

### Precision & Recall
- **Precision**: Of predicted positives, how many are actually positive?
- **Recall**: Of actual positives, how many did we predict?

### F1 Score
Harmonic mean of precision and recall.

\`\`\`python
from sklearn.metrics import classification_report

y_true = [0, 1, 1, 0, 1]
y_pred = [0, 1, 0, 0, 1]

print(classification_report(y_true, y_pred))
\`\`\`

### Confusion Matrix
\`\`\`python
from sklearn.metrics import confusion_matrix
import seaborn as sns

cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm, annot=True, fmt='d')
\`\`\`

## Multi-class Classification

For more than 2 classes:

\`\`\`python
# Change output layer
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(10000, 128),
    tf.keras.layers.LSTM(64),
    tf.keras.layers.Dense(5, activation='softmax')  # 5 classes
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
\`\`\`

## Best Practices

1. **Data Quality**: Clean, labeled data is crucial
2. **Class Balance**: Handle imbalanced datasets (oversampling, undersampling, class weights)
3. **Cross-Validation**: Use k-fold cross-validation
4. **Hyperparameter Tuning**: Grid search or random search
5. **Error Analysis**: Examine misclassified examples

## Real-World Example: Sentiment Analysis

\`\`\`python
from transformers import pipeline

# Load pre-trained sentiment analyzer
classifier = pipeline('sentiment-analysis')

# Analyze
result = classifier("I absolutely loved this product!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

reviews = [
    "Great quality, fast shipping!",
    "Terrible customer service",
    "Average product, nothing special"
]

results = classifier(reviews)
for review, result in zip(reviews, results):
    print(f"{review}: {result['label']} ({result['score']:.2f})")
\`\`\`

Next, we'll explore sequence-to-sequence models for tasks like translation and summarization.`,
      order: 4,
      estimatedMinutes: 90,
      pathId: nlpId,
    },
    {
      title: "Sequence-to-Sequence Models",
      slug: "seq2seq-models",
      description: "Learn encoder-decoder architectures for machine translation, text summarization, and more.",
      difficulty: "advanced" as const,
      content: `# Sequence-to-Sequence Models

Seq2Seq models transform one sequence into another, enabling tasks like translation, summarization, and dialogue.

## Architecture Overview

### Encoder-Decoder Structure

1. **Encoder**: Processes input sequence, creates context vector
2. **Context Vector**: Fixed-size representation of input
3. **Decoder**: Generates output sequence from context vector

\`\`\`
Input: "Hello" → Encoder → [Context] → Decoder → "Bonjour"
\`\`\`

## Basic Seq2Seq with RNNs

\`\`\`python
import tensorflow as tf

# Encoder
encoder_inputs = tf.keras.Input(shape=(None,))
encoder_embedding = tf.keras.layers.Embedding(vocab_size, 256)(encoder_inputs)
encoder_lstm = tf.keras.layers.LSTM(512, return_state=True)
encoder_outputs, state_h, state_c = encoder_lstm(encoder_embedding)
encoder_states = [state_h, state_c]

# Decoder
decoder_inputs = tf.keras.Input(shape=(None,))
decoder_embedding = tf.keras.layers.Embedding(vocab_size, 256)(decoder_inputs)
decoder_lstm = tf.keras.layers.LSTM(512, return_sequences=True, return_state=True)
decoder_outputs, _, _ = decoder_lstm(decoder_embedding, initial_state=encoder_states)
decoder_dense = tf.keras.layers.Dense(vocab_size, activation='softmax')
decoder_outputs = decoder_dense(decoder_outputs)

# Model
model = tf.keras.Model([encoder_inputs, decoder_inputs], decoder_outputs)
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')
\`\`\`

## Attention Mechanism

Traditional seq2seq struggles with long sequences. Attention allows decoder to focus on relevant parts of input.

### How Attention Works

1. Decoder generates query vector
2. Computes attention scores with encoder outputs
3. Creates weighted sum (context vector)
4. Uses context for prediction

\`\`\`python
class AttentionLayer(tf.keras.layers.Layer):
    def __init__(self, units):
        super().__init__()
        self.W1 = tf.keras.layers.Dense(units)
        self.W2 = tf.keras.layers.Dense(units)
        self.V = tf.keras.layers.Dense(1)
    
    def call(self, query, values):
        # query: decoder hidden state
        # values: encoder outputs
        
        # Expand dims for broadcasting
        query_with_time = tf.expand_dims(query, 1)
        
        # Calculate attention scores
        score = self.V(tf.nn.tanh(
            self.W1(query_with_time) + self.W2(values)
        ))
        
        # Attention weights
        attention_weights = tf.nn.softmax(score, axis=1)
        
        # Context vector
        context_vector = attention_weights * values
        context_vector = tf.reduce_sum(context_vector, axis=1)
        
        return context_vector, attention_weights
\`\`\`

## Transformer Architecture

Modern seq2seq uses transformers instead of RNNs.

### Key Components

**Self-Attention**: Relates different positions in a sequence
**Multi-Head Attention**: Multiple attention mechanisms in parallel
**Positional Encoding**: Adds position information
**Feed-Forward Networks**: Process attention outputs

### Advantages over RNNs

- Parallel processing (faster training)
- Better long-range dependencies
- No vanishing gradient problem
- State-of-the-art performance

## Machine Translation Example

\`\`\`python
from transformers import MarianMTModel, MarianTokenizer

# Load pre-trained translation model
model_name = 'Helsinki-NLP/opus-mt-en-fr'
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Translate
text = "Hello, how are you?"
inputs = tokenizer(text, return_tensors="pt", padding=True)
translated = model.generate(**inputs)
translation = tokenizer.decode(translated[0], skip_special_tokens=True)
# Output: "Bonjour, comment allez-vous?"
\`\`\`

## Text Summarization

### Extractive Summarization
Selects important sentences from original text.

\`\`\`python
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

article = """
Long article text here...
"""

summary = summarizer(article, max_length=130, min_length=30, do_sample=False)
print(summary[0]['summary_text'])
\`\`\`

### Abstractive Summarization
Generates new sentences that capture meaning.

\`\`\`python
from transformers import T5Tokenizer, T5ForConditionalGeneration

tokenizer = T5Tokenizer.from_pretrained('t5-small')
model = T5ForConditionalGeneration.from_pretrained('t5-small')

# Prefix for T5
text = "summarize: " + article
inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
summary_ids = model.generate(inputs.input_ids, max_length=150, min_length=40)
summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
\`\`\`

## Beam Search

Improves generation quality by exploring multiple hypotheses.

\`\`\`python
# Generate with beam search
outputs = model.generate(
    inputs.input_ids,
    max_length=50,
    num_beams=5,  # Explore 5 hypotheses
    early_stopping=True,
    no_repeat_ngram_size=2  # Avoid repetition
)
\`\`\`

## Evaluation Metrics

### BLEU Score
Measures n-gram overlap between generated and reference text.

\`\`\`python
from nltk.translate.bleu_score import sentence_bleu

reference = [['this', 'is', 'a', 'test']]
candidate = ['this', 'is', 'test']
score = sentence_bleu(reference, candidate)
\`\`\`

### ROUGE Score
Used for summarization, measures recall of n-grams.

\`\`\`python
from rouge import Rouge

rouge = Rouge()
scores = rouge.get_scores(hypothesis, reference)
\`\`\`

## Practical Tips

1. **Teacher Forcing**: Use ground truth as decoder input during training
2. **Inference**: Use greedy decoding or beam search
3. **Handling Unknown Words**: Use subword tokenization (BPE)
4. **Length Control**: Add length penalties in generation
5. **Fine-tuning**: Start with pre-trained models

## Real-World Applications

- **Chatbots**: Generate responses to user queries
- **Email Auto-Reply**: Suggest responses
- **Code Generation**: Convert natural language to code
- **Data-to-Text**: Generate reports from structured data

Next, we'll explore named entity recognition and information extraction.`,
      order: 5,
      estimatedMinutes: 90,
      pathId: nlpId,
    },
    {
      title: "Named Entity Recognition",
      slug: "named-entity-recognition",
      description: "Extract entities like names, locations, and organizations from text using NER techniques.",
      difficulty: "intermediate" as const,
      content: `# Named Entity Recognition (NER)

NER identifies and classifies named entities in text into predefined categories.

## Common Entity Types

- **PERSON**: Names of people
- **ORGANIZATION**: Companies, agencies, institutions
- **LOCATION**: Cities, countries, landmarks
- **DATE**: Absolute or relative dates
- **TIME**: Times smaller than a day
- **MONEY**: Monetary values
- **PERCENT**: Percentages
- **PRODUCT**: Objects, vehicles, foods, etc.

## Example

**Input**: "Apple Inc. was founded by Steve Jobs in Cupertino, California in 1976."

**Output**:
- Apple Inc. → ORGANIZATION
- Steve Jobs → PERSON
- Cupertino → LOCATION
- California → LOCATION
- 1976 → DATE

## Traditional Approach: CRF

Conditional Random Fields model sequence labeling.

\`\`\`python
import sklearn_crfsuite

# Feature extraction
def word_features(sentence, i):
    word = sentence[i]
    features = {
        'word.lower()': word.lower(),
        'word.isupper()': word.isupper(),
        'word.istitle()': word.istitle(),
        'word.isdigit()': word.isdigit(),
    }
    if i > 0:
        features['prev_word'] = sentence[i-1]
    if i < len(sentence) - 1:
        features['next_word'] = sentence[i+1]
    return features

# Train CRF
crf = sklearn_crfsuite.CRF(
    algorithm='lbfgs',
    max_iterations=100
)
crf.fit(X_train, y_train)
\`\`\`

## Deep Learning: BiLSTM-CRF

Combines bidirectional LSTM with CRF layer.

\`\`\`python
import tensorflow as tf
from tensorflow_addons.text import crf_log_likelihood

class BiLSTM_CRF(tf.keras.Model):
    def __init__(self, vocab_size, num_tags, embedding_dim=128, lstm_units=64):
        super().__init__()
        self.embedding = tf.keras.layers.Embedding(vocab_size, embedding_dim)
        self.bilstm = tf.keras.layers.Bidirectional(
            tf.keras.layers.LSTM(lstm_units, return_sequences=True)
        )
        self.dense = tf.keras.layers.Dense(num_tags)
        self.transition_params = tf.Variable(
            tf.random.uniform([num_tags, num_tags])
        )
    
    def call(self, inputs, training=False):
        x = self.embedding(inputs)
        x = self.bilstm(x)
        logits = self.dense(x)
        return logits
\`\`\`

## Using spaCy

spaCy provides pre-trained NER models.

\`\`\`python
import spacy

# Load model
nlp = spacy.load("en_core_web_sm")

# Process text
text = "Apple Inc. was founded by Steve Jobs in Cupertino."
doc = nlp(text)

# Extract entities
for ent in doc.ents:
    print(f"{ent.text}: {ent.label_}")

# Output:
# Apple Inc.: ORG
# Steve Jobs: PERSON
# Cupertino: GPE
\`\`\`

## Using Transformers (BERT-based)

\`\`\`python
from transformers import pipeline

# Load NER pipeline
ner = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

text = "Hugging Face is based in New York City."
results = ner(text)

for entity in results:
    print(f"{entity['word']}: {entity['entity']} ({entity['score']:.2f})")

# Output:
# Hugging: B-ORG (0.99)
# Face: I-ORG (0.99)
# New: B-LOC (0.99)
# York: I-LOC (0.99)
# City: I-LOC (0.99)
\`\`\`

## BIO Tagging Scheme

- **B-**: Beginning of entity
- **I-**: Inside entity
- **O**: Outside entity

**Example**: "Steve Jobs founded Apple"
- Steve: B-PER
- Jobs: I-PER
- founded: O
- Apple: B-ORG

## Custom NER Training

\`\`\`python
from transformers import AutoTokenizer, AutoModelForTokenClassification, Trainer

# Prepare data
tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")
model = AutoModelForTokenClassification.from_pretrained(
    "bert-base-cased", 
    num_labels=num_labels
)

# Tokenize
def tokenize_and_align_labels(examples):
    tokenized_inputs = tokenizer(
        examples["tokens"],
        truncation=True,
        is_split_into_words=True
    )
    
    labels = []
    for i, label in enumerate(examples["ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            else:
                label_ids.append(label[word_idx])
        labels.append(label_ids)
    
    tokenized_inputs["labels"] = labels
    return tokenized_inputs

# Train
trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)
trainer.train()
\`\`\`

## Evaluation Metrics

### Entity-Level F1 Score
\`\`\`python
from seqeval.metrics import f1_score, classification_report

y_true = [['B-PER', 'I-PER', 'O', 'B-LOC']]
y_pred = [['B-PER', 'I-PER', 'O', 'B-LOC']]

print(f1_score(y_true, y_pred))
print(classification_report(y_true, y_pred))
\`\`\`

## Applications

### Information Extraction
\`\`\`python
def extract_entities(text):
    doc = nlp(text)
    entities = {
        'persons': [],
        'organizations': [],
        'locations': []
    }
    
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            entities['persons'].append(ent.text)
        elif ent.label_ == 'ORG':
            entities['organizations'].append(ent.text)
        elif ent.label_ in ['GPE', 'LOC']:
            entities['locations'].append(ent.text)
    
    return entities
\`\`\`

### Knowledge Graph Construction
Extract entities and relationships to build knowledge graphs.

### Resume Parsing
Extract skills, education, experience from resumes.

### Medical Text Analysis
Identify diseases, medications, symptoms in clinical notes.

## Challenges

1. **Ambiguity**: "Washington" (person, city, or state?)
2. **Nested Entities**: "Bank of America" (ORG) in "New York" (LOC)
3. **Domain Adaptation**: Models trained on news may fail on medical text
4. **Rare Entities**: New companies, products not in training data

## Best Practices

1. **Use Pre-trained Models**: Start with BERT, RoBERTa, or spaCy
2. **Domain-Specific Training**: Fine-tune on your domain data
3. **Ensemble Methods**: Combine multiple models
4. **Post-Processing**: Add business rules for edge cases
5. **Active Learning**: Iteratively label difficult examples

Next, we'll explore question answering systems and chatbots.`,
      order: 6,
      estimatedMinutes: 75,
      pathId: nlpId,
    },
    {
      title: "Question Answering Systems",
      slug: "question-answering",
      description: "Build systems that can answer questions from text using extractive and generative approaches.",
      difficulty: "advanced" as const,
      content: `# Question Answering Systems

Question Answering (QA) systems automatically answer questions posed in natural language.

## Types of QA Systems

### 1. Extractive QA
Finds answer span in given context.

**Example:**
- Context: "The Eiffel Tower is located in Paris, France."
- Question: "Where is the Eiffel Tower?"
- Answer: "Paris, France" (extracted from context)

### 2. Generative QA
Generates answer from scratch.

**Example:**
- Question: "Why is the sky blue?"
- Answer: "The sky appears blue because..." (generated)

### 3. Open-Domain QA
Answers questions without specific context (searches knowledge base).

## Extractive QA with BERT

\`\`\`python
from transformers import pipeline

# Load QA pipeline
qa_pipeline = pipeline("question-answering", 
                       model="deepset/roberta-base-squad2")

context = """
The Amazon rainforest covers 5.5 million square kilometers. 
It spans across nine countries, with Brazil containing 60% of it.
The rainforest is home to 10% of the world's species.
"""

question = "How large is the Amazon rainforest?"

result = qa_pipeline(question=question, context=context)
print(f"Answer: {result['answer']}")
print(f"Score: {result['score']:.2f}")
# Answer: 5.5 million square kilometers
# Score: 0.95
\`\`\`

## How BERT QA Works

1. **Input**: [CLS] question [SEP] context [SEP]
2. **Output**: Start and end token positions
3. **Answer**: Text between start and end positions

\`\`\`python
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForQuestionAnswering.from_pretrained("bert-base-uncased")

# Tokenize
inputs = tokenizer(question, context, return_tensors="pt")

# Get predictions
outputs = model(**inputs)
start_scores = outputs.start_logits
end_scores = outputs.end_logits

# Find answer span
start_idx = torch.argmax(start_scores)
end_idx = torch.argmax(end_scores)

# Decode answer
answer_tokens = inputs.input_ids[0][start_idx:end_idx+1]
answer = tokenizer.decode(answer_tokens)
\`\`\`

## Training Custom QA Model

\`\`\`python
from transformers import Trainer, TrainingArguments

# Prepare SQuAD-format data
train_dataset = {
    "context": [...],
    "question": [...],
    "answers": [{"text": [...], "answer_start": [...]}]
}

# Training arguments
training_args = TrainingArguments(
    output_dir="./qa_model",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    learning_rate=3e-5,
    warmup_steps=500,
)

# Train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)
trainer.train()
\`\`\`

## Generative QA with T5

\`\`\`python
from transformers import T5Tokenizer, T5ForConditionalGeneration

tokenizer = T5Tokenizer.from_pretrained("t5-base")
model = T5ForConditionalGeneration.from_pretrained("t5-base")

# Format input
input_text = f"question: {question} context: {context}"
inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)

# Generate answer
outputs = model.generate(inputs.input_ids, max_length=50)
answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
\`\`\`

## Open-Domain QA

Combines retrieval with reading comprehension.

### Architecture
1. **Retriever**: Finds relevant documents (BM25, Dense Retrieval)
2. **Reader**: Extracts answer from retrieved documents (BERT QA)

\`\`\`python
from transformers import DPRQuestionEncoder, DPRContextEncoder
import faiss

# Dense Passage Retrieval (DPR)
question_encoder = DPRQuestionEncoder.from_pretrained("facebook/dpr-question_encoder-single-nq-base")
context_encoder = DPRContextEncoder.from_pretrained("facebook/dpr-ctx_encoder-single-nq-base")

# Encode documents
doc_embeddings = context_encoder(documents).pooler_output

# Build index
index = faiss.IndexFlatIP(768)
index.add(doc_embeddings.detach().numpy())

# Search
question_embedding = question_encoder(question).pooler_output
distances, indices = index.search(question_embedding.detach().numpy(), k=5)

# Get top documents
top_docs = [documents[i] for i in indices[0]]

# Extract answer from top docs
for doc in top_docs:
    answer = qa_pipeline(question=question, context=doc)
    if answer['score'] > 0.5:
        print(f"Answer: {answer['answer']}")
        break
\`\`\`

## Multi-Hop QA

Requires reasoning over multiple pieces of information.

**Example:**
- Context 1: "Barack Obama was born in Hawaii."
- Context 2: "Hawaii became a state in 1959."
- Question: "Was Barack Obama born in a US state?"
- Answer: "Yes" (requires combining both facts)

## Conversational QA

Maintains context across multiple questions.

\`\`\`python
from transformers import pipeline

conversational_qa = pipeline("conversational")

conversation = [
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What is its population?"}
]

response = conversational_qa(conversation)
# Response understands "its" refers to Paris
\`\`\`

## Evaluation Metrics

### Exact Match (EM)
Percentage of predictions that match ground truth exactly.

### F1 Score
Token-level overlap between prediction and ground truth.

\`\`\`python
def compute_f1(prediction, ground_truth):
    pred_tokens = prediction.lower().split()
    truth_tokens = ground_truth.lower().split()
    
    common = set(pred_tokens) & set(truth_tokens)
    
    if len(common) == 0:
        return 0
    
    precision = len(common) / len(pred_tokens)
    recall = len(common) / len(truth_tokens)
    f1 = 2 * (precision * recall) / (precision + recall)
    
    return f1
\`\`\`

## Real-World Applications

### Customer Support Chatbots
\`\`\`python
def support_bot(question, knowledge_base):
    # Retrieve relevant articles
    relevant_docs = retrieve_documents(question, knowledge_base)
    
    # Extract answer
    for doc in relevant_docs:
        answer = qa_pipeline(question=question, context=doc['content'])
        if answer['score'] > 0.7:
            return {
                'answer': answer['answer'],
                'source': doc['title'],
                'confidence': answer['score']
            }
    
    return {'answer': "I don't have enough information to answer that."}
\`\`\`

### Document Search
Answer questions about internal documents.

### Educational Tools
Interactive learning assistants.

### Medical QA
Answer health-related questions (with appropriate disclaimers).

## Challenges

1. **Unanswerable Questions**: Model should know when it can't answer
2. **Ambiguous Questions**: "What is it?" without context
3. **Complex Reasoning**: Multi-hop, numerical reasoning
4. **Factual Accuracy**: Avoiding hallucinations in generative models

## Best Practices

1. **Use SQuAD-trained models** as starting point
2. **Fine-tune on domain data** for better accuracy
3. **Implement confidence thresholds** to avoid wrong answers
4. **Combine retrieval and reading** for open-domain QA
5. **Handle edge cases** (unanswerable, ambiguous questions)

Next, we'll explore transformer architectures in depth, including BERT, GPT, and their variants.`,
      order: 7,
      estimatedMinutes: 90,
      pathId: nlpId,
    },
    {
      title: "Transformers & Large Language Models",
      slug: "transformers-llms",
      description: "Deep dive into transformer architecture, BERT, GPT, and modern large language models.",
      difficulty: "advanced" as const,
      content: `# Transformers & Large Language Models

Transformers revolutionized NLP by introducing the attention mechanism and parallel processing.

## The Transformer Architecture

Introduced in "Attention is All You Need" (2017), transformers replaced RNNs for sequence tasks.

### Key Components

**1. Self-Attention**
Relates different positions in a sequence.

\`\`\`python
import torch
import torch.nn as nn

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super().__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads
        
        self.queries = nn.Linear(embed_size, embed_size)
        self.keys = nn.Linear(embed_size, embed_size)
        self.values = nn.Linear(embed_size, embed_size)
        self.fc_out = nn.Linear(embed_size, embed_size)
    
    def forward(self, x):
        N, seq_length, _ = x.shape
        
        # Split into multiple heads
        queries = self.queries(x).reshape(N, seq_length, self.heads, self.head_dim)
        keys = self.keys(x).reshape(N, seq_length, self.heads, self.head_dim)
        values = self.values(x).reshape(N, seq_length, self.heads, self.head_dim)
        
        # Attention scores
        energy = torch.einsum("nqhd,nkhd->nhqk", [queries, keys])
        attention = torch.softmax(energy / (self.embed_size ** 0.5), dim=3)
        
        # Apply attention to values
        out = torch.einsum("nhql,nlhd->nqhd", [attention, values])
        out = out.reshape(N, seq_length, self.embed_size)
        
        return self.fc_out(out)
\`\`\`

**2. Positional Encoding**
Adds position information since transformers have no inherent sequence order.

\`\`\`python
def positional_encoding(seq_length, d_model):
    position = torch.arange(seq_length).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, d_model, 2) * -(math.log(10000.0) / d_model))
    
    pe = torch.zeros(seq_length, d_model)
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    
    return pe
\`\`\`

**3. Feed-Forward Networks**
\`\`\`python
class FeedForward(nn.Module):
    def __init__(self, embed_size, ff_hidden_size):
        super().__init__()
        self.fc1 = nn.Linear(embed_size, ff_hidden_size)
        self.fc2 = nn.Linear(ff_hidden_size, embed_size)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))
\`\`\`

## BERT (Bidirectional Encoder Representations from Transformers)

BERT uses only the encoder part of transformers.

### Pre-training Tasks

**1. Masked Language Modeling (MLM)**
Randomly mask 15% of tokens and predict them.

\`\`\`
Input: "The [MASK] sat on the mat"
Target: "cat"
\`\`\`

**2. Next Sentence Prediction (NSP)**
Predict if sentence B follows sentence A.

### Using BERT

\`\`\`python
from transformers import BertTokenizer, BertModel

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

text = "Hello, how are you?"
inputs = tokenizer(text, return_tensors="pt")
outputs = model(**inputs)

# Get embeddings
last_hidden_states = outputs.last_hidden_state  # [batch, seq_len, hidden_size]
pooled_output = outputs.pooler_output  # [batch, hidden_size]
\`\`\`

### Fine-tuning BERT

\`\`\`python
from transformers import BertForSequenceClassification, Trainer

model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased',
    num_labels=2
)

# Prepare data
train_dataset = ...
eval_dataset = ...

# Train
trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)
trainer.train()
\`\`\`

## GPT (Generative Pre-trained Transformer)

GPT uses only the decoder part of transformers.

### Key Differences from BERT

- **Unidirectional**: Only looks at previous tokens
- **Autoregressive**: Generates text one token at a time
- **Causal Masking**: Prevents looking ahead

### Using GPT

\`\`\`python
from transformers import GPT2LMHeadModel, GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = GPT2LMHeadModel.from_pretrained('gpt2')

# Generate text
prompt = "Once upon a time"
inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(
    inputs.input_ids,
    max_length=100,
    num_return_sequences=1,
    temperature=0.7,
    top_k=50,
    top_p=0.95
)

generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
\`\`\`

## Modern LLM Variants

### RoBERTa
Improved BERT training:
- Longer training
- Larger batches
- Removed NSP task
- Dynamic masking

### ALBERT
Parameter-efficient BERT:
- Factorized embeddings
- Cross-layer parameter sharing
- Sentence-order prediction

### T5 (Text-to-Text Transfer Transformer)
Frames all tasks as text-to-text:

\`\`\`python
from transformers import T5Tokenizer, T5ForConditionalGeneration

tokenizer = T5Tokenizer.from_pretrained('t5-base')
model = T5ForConditionalGeneration.from_pretrained('t5-base')

# Translation
input_text = "translate English to French: Hello, how are you?"
inputs = tokenizer(input_text, return_tensors="pt")
outputs = model.generate(inputs.input_ids)
print(tokenizer.decode(outputs[0]))
# Output: "Bonjour, comment allez-vous?"

# Summarization
input_text = "summarize: " + long_article
outputs = model.generate(tokenizer(input_text, return_tensors="pt").input_ids)
\`\`\`

### GPT-3 and Beyond

Massive models (175B parameters) with few-shot learning capabilities.

\`\`\`python
import openai

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ]
)

print(response.choices[0].message.content)
\`\`\`

## Prompt Engineering

Crafting effective prompts for LLMs.

### Zero-Shot
\`\`\`
Classify the sentiment: "I love this product!"
\`\`\`

### Few-Shot
\`\`\`
Classify the sentiment:
"Great product!" → Positive
"Terrible service" → Negative
"It's okay" → Neutral
"I love this!" → ?
\`\`\`

### Chain-of-Thought
\`\`\`
Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. 
Each can has 3 balls. How many tennis balls does he have now?

A: Let's think step by step:
1. Roger starts with 5 balls
2. He buys 2 cans
3. Each can has 3 balls, so 2 × 3 = 6 balls
4. Total: 5 + 6 = 11 balls
\`\`\`

## Fine-tuning Strategies

### Full Fine-tuning
Update all parameters (expensive).

### LoRA (Low-Rank Adaptation)
Add trainable low-rank matrices (efficient).

\`\`\`python
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.1,
)

model = get_peft_model(model, config)
# Only 0.1% of parameters are trainable!
\`\`\`

### Prefix Tuning
Add trainable prefix vectors.

## Evaluation

### Perplexity
Measures how well model predicts text.

\`\`\`python
def calculate_perplexity(model, tokenizer, text):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs, labels=inputs.input_ids)
    return torch.exp(outputs.loss).item()
\`\`\`

### Human Evaluation
- Fluency
- Coherence
- Relevance
- Factual accuracy

## Challenges & Limitations

1. **Hallucinations**: Generating false information
2. **Bias**: Reflecting training data biases
3. **Context Length**: Limited by max sequence length
4. **Computational Cost**: Large models require significant resources
5. **Interpretability**: Difficult to understand decisions

## Best Practices

1. **Start with pre-trained models**: Don't train from scratch
2. **Use appropriate model size**: Bigger isn't always better
3. **Fine-tune carefully**: Avoid catastrophic forgetting
4. **Implement safety measures**: Content filtering, fact-checking
5. **Monitor outputs**: Regular quality checks

## Real-World Applications

- **Content Generation**: Articles, emails, code
- **Conversational AI**: Chatbots, virtual assistants
- **Code Completion**: GitHub Copilot
- **Translation**: Multi-lingual communication
- **Summarization**: Document processing

This completes our NLP learning path! You now have the knowledge to build sophisticated NLP applications using modern transformer-based models.`,
      order: 8,
      estimatedMinutes: 120,
      pathId: nlpId,
    },
  ];

  // Computer Vision Path
  const cvId = pathMap.get("computer-vision")!;
  const cvModules = [
    {
      title: "Introduction to Computer Vision",
      slug: "intro-to-cv",
      description: "Understanding computer vision fundamentals, image representation, and core concepts.",
      difficulty: "beginner" as const,
      content: `# Introduction to Computer Vision

Computer Vision enables machines to interpret and understand visual information from the world.

## What is Computer Vision?

Computer Vision (CV) is a field of AI that trains computers to interpret and understand the visual world. Using digital images and deep learning models, machines can accurately identify and classify objects, and react to what they "see."

## Key Applications

- **Image Classification**: Categorizing images (cat vs dog)
- **Object Detection**: Locating objects in images (self-driving cars)
- **Semantic Segmentation**: Pixel-level classification
- **Face Recognition**: Identifying individuals
- **Optical Character Recognition (OCR)**: Reading text from images
- **Medical Imaging**: Detecting diseases in X-rays, MRIs
- **Augmented Reality**: Overlaying digital content on real world

## How Computers See Images

### Digital Images
Images are represented as arrays of numbers (pixels).

**Grayscale Image**: 2D array (height × width)
\`\`\`
[[0, 50, 100],
 [150, 200, 255]]
\`\`\`

**Color Image (RGB)**: 3D array (height × width × 3 channels)
\`\`\`
Red channel: [[255, 0, ...], ...]
Green channel: [[0, 255, ...], ...]
Blue channel: [[0, 0, ...], ...]
\`\`\`

### Image Processing with Python

\`\`\`python
import cv2
import numpy as np
from PIL import Image

# Load image
img = cv2.imread('image.jpg')  # BGR format
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Image properties
height, width, channels = img.shape
print(f"Image size: {width}x{height}, Channels: {channels}")

# Display pixel values
print(img[0, 0])  # Pixel at (0, 0): [B, G, R]
\`\`\`

## Basic Image Operations

### Resizing
\`\`\`python
resized = cv2.resize(img, (224, 224))
\`\`\`

### Cropping
\`\`\`python
cropped = img[50:200, 100:300]  # [y1:y2, x1:x2]
\`\`\`

### Rotation
\`\`\`python
center = (width // 2, height // 2)
rotation_matrix = cv2.getRotationMatrix2D(center, 45, 1.0)
rotated = cv2.warpAffine(img, rotation_matrix, (width, height))
\`\`\`

### Flipping
\`\`\`python
flipped_horizontal = cv2.flip(img, 1)
flipped_vertical = cv2.flip(img, 0)
\`\`\`

## Color Spaces

### RGB (Red, Green, Blue)
Standard color space for displays.

### HSV (Hue, Saturation, Value)
Better for color-based segmentation.

\`\`\`python
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Detect red objects
lower_red = np.array([0, 100, 100])
upper_red = np.array([10, 255, 255])
mask = cv2.inRange(hsv, lower_red, upper_red)
\`\`\`

### Grayscale
Single channel, useful for many CV tasks.

\`\`\`python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
\`\`\`

## Image Filtering

### Blurring
\`\`\`python
# Gaussian blur
blurred = cv2.GaussianBlur(img, (5, 5), 0)

# Median blur (good for salt-and-pepper noise)
median_blurred = cv2.medianBlur(img, 5)
\`\`\`

### Edge Detection
\`\`\`python
# Canny edge detection
edges = cv2.Canny(gray, 100, 200)
\`\`\`

### Sharpening
\`\`\`python
kernel = np.array([[-1,-1,-1],
                   [-1, 9,-1],
                   [-1,-1,-1]])
sharpened = cv2.filter2D(img, -1, kernel)
\`\`\`

## Feature Detection

### Corner Detection
\`\`\`python
# Harris corner detection
gray = np.float32(gray)
corners = cv2.cornerHarris(gray, 2, 3, 0.04)
\`\`\`

### SIFT (Scale-Invariant Feature Transform)
\`\`\`python
sift = cv2.SIFT_create()
keypoints, descriptors = sift.detectAndCompute(gray, None)

# Draw keypoints
img_with_keypoints = cv2.drawKeypoints(img, keypoints, None)
\`\`\`

## Traditional vs Deep Learning Approaches

### Traditional Computer Vision
- Hand-crafted features (SIFT, HOG, SURF)
- Classical algorithms (edge detection, corner detection)
- Limited by feature engineering

### Deep Learning Computer Vision
- Learned features from data
- Convolutional Neural Networks (CNNs)
- State-of-the-art performance
- Requires large datasets and compute

## The Computer Vision Pipeline

1. **Image Acquisition**: Capture or load images
2. **Preprocessing**: Resize, normalize, augment
3. **Feature Extraction**: Manual or learned features
4. **Model Training**: Train classifier/detector
5. **Inference**: Make predictions on new images
6. **Post-processing**: Refine results, visualize

## Challenges in Computer Vision

- **Viewpoint Variation**: Same object from different angles
- **Illumination**: Different lighting conditions
- **Occlusion**: Objects partially hidden
- **Background Clutter**: Busy backgrounds
- **Intra-class Variation**: Cats look different from each other
- **Scale Variation**: Objects at different distances

## Getting Started

### Essential Libraries

\`\`\`python
import cv2  # OpenCV
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import torch
import torchvision
from tensorflow import keras
\`\`\`

### Loading and Displaying Images

\`\`\`python
import matplotlib.pyplot as plt

# Load with OpenCV
img = cv2.imread('image.jpg')
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Display
plt.imshow(img_rgb)
plt.title('My Image')
plt.axis('off')
plt.show()
\`\`\`

## Real-World Impact

Computer Vision is transforming industries:
- **Healthcare**: Early disease detection
- **Automotive**: Self-driving cars
- **Retail**: Automated checkout, inventory management
- **Security**: Surveillance, facial recognition
- **Agriculture**: Crop monitoring, pest detection
- **Manufacturing**: Quality control, defect detection

In the following modules, we'll dive deep into CNNs, object detection, segmentation, and advanced CV techniques.`,
      order: 1,
      estimatedMinutes: 50,
      pathId: cvId,
    },
    {
      title: "Convolutional Neural Networks",
      slug: "convolutional-neural-networks",
      description: "Learn CNN architecture, convolution operations, pooling, and building image classifiers.",
      difficulty: "intermediate" as const,
      content: `# Convolutional Neural Networks (CNNs)

CNNs are the backbone of modern computer vision, designed to automatically learn spatial hierarchies of features.

## Why CNNs for Images?

Traditional neural networks treat images as flat vectors, losing spatial structure. CNNs preserve spatial relationships through:

1. **Local Connectivity**: Neurons connect to small regions
2. **Parameter Sharing**: Same filter applied across image
3. **Translation Invariance**: Detect features anywhere in image

## Convolution Operation

### How Convolution Works

A filter (kernel) slides across the image, computing dot products.

\`\`\`python
import numpy as np

def convolve2d(image, kernel):
    h, w = image.shape
    kh, kw = kernel.shape
    output = np.zeros((h - kh + 1, w - kw + 1))
    
    for i in range(output.shape[0]):
        for j in range(output.shape[1]):
            region = image[i:i+kh, j:j+kw]
            output[i, j] = np.sum(region * kernel)
    
    return output

# Example: Edge detection kernel
kernel = np.array([[-1, -1, -1],
                   [ 0,  0,  0],
                   [ 1,  1,  1]])

edges = convolve2d(image, kernel)
\`\`\`

### Common Kernels

**Vertical Edge Detection**
\`\`\`
[[-1, 0, 1],
 [-1, 0, 1],
 [-1, 0, 1]]
\`\`\`

**Horizontal Edge Detection**
\`\`\`
[[-1, -1, -1],
 [ 0,  0,  0],
 [ 1,  1,  1]]
\`\`\`

**Blur (Gaussian)**
\`\`\`
[[1, 2, 1],
 [2, 4, 2],
 [1, 2, 1]] / 16
\`\`\`

## CNN Architecture

### Basic Building Blocks

**1. Convolutional Layer**
\`\`\`python
import torch.nn as nn

conv_layer = nn.Conv2d(
    in_channels=3,     # RGB input
    out_channels=32,   # 32 filters
    kernel_size=3,     # 3x3 filter
    stride=1,          # Move 1 pixel at a time
    padding=1          # Preserve spatial dimensions
)
\`\`\`

**2. Activation Function (ReLU)**
\`\`\`python
relu = nn.ReLU()
# or inline: F.relu(x)
\`\`\`

**3. Pooling Layer**
\`\`\`python
# Max pooling: takes maximum value in region
max_pool = nn.MaxPool2d(kernel_size=2, stride=2)

# Average pooling
avg_pool = nn.AvgPool2d(kernel_size=2, stride=2)
\`\`\`

**4. Fully Connected Layer**
\`\`\`python
fc = nn.Linear(in_features=512, out_features=10)
\`\`\`

## Building a CNN in PyTorch

\`\`\`python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super(SimpleCNN, self).__init__()
        
        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        
        # Pooling
        self.pool = nn.MaxPool2d(2, 2)
        
        # Fully connected layers
        self.fc1 = nn.Linear(128 * 4 * 4, 512)
        self.fc2 = nn.Linear(512, num_classes)
        
        # Dropout for regularization
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x):
        # Conv block 1
        x = self.pool(F.relu(self.conv1(x)))  # 32x32 -> 16x16
        
        # Conv block 2
        x = self.pool(F.relu(self.conv2(x)))  # 16x16 -> 8x8
        
        # Conv block 3
        x = self.pool(F.relu(self.conv3(x)))  # 8x8 -> 4x4
        
        # Flatten
        x = x.view(-1, 128 * 4 * 4)
        
        # Fully connected layers
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        
        return x

# Create model
model = SimpleCNN(num_classes=10)
print(model)
\`\`\`

## Training a CNN

\`\`\`python
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Data augmentation and normalization
transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomCrop(32, padding=4),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

# Load CIFAR-10 dataset
trainset = datasets.CIFAR10(root='./data', train=True, 
                            download=True, transform=transform)
trainloader = DataLoader(trainset, batch_size=128, shuffle=True)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
model.train()
for epoch in range(10):
    running_loss = 0.0
    for i, (inputs, labels) in enumerate(trainloader):
        # Zero gradients
        optimizer.zero_grad()
        
        # Forward pass
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        
        # Backward pass and optimize
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
    
    print(f'Epoch {epoch+1}, Loss: {running_loss/len(trainloader):.3f}')
\`\`\`

## Famous CNN Architectures

### LeNet-5 (1998)
First successful CNN for digit recognition.

### AlexNet (2012)
Won ImageNet 2012, sparked deep learning revolution.
- 5 conv layers, 3 FC layers
- ReLU activation
- Dropout regularization

### VGG (2014)
Very deep network with small 3x3 filters.

\`\`\`python
from torchvision.models import vgg16

model = vgg16(pretrained=True)
\`\`\`

### ResNet (2015)
Introduced residual connections, enabling very deep networks (50-152 layers).

\`\`\`python
from torchvision.models import resnet50

model = resnet50(pretrained=True)
\`\`\`

**Residual Block**
\`\`\`python
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, padding=1)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.bn2 = nn.BatchNorm2d(out_channels)
        
    def forward(self, x):
        residual = x
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += residual  # Skip connection
        out = F.relu(out)
        return out
\`\`\`

### Inception (GoogLeNet)
Multiple filter sizes in parallel.

### EfficientNet
Optimally scales depth, width, and resolution.

## Transfer Learning

Use pre-trained models for your task.

\`\`\`python
from torchvision.models import resnet18

# Load pre-trained model
model = resnet18(pretrained=True)

# Freeze all layers
for param in model.parameters():
    param.requires_grad = False

# Replace final layer
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, num_classes)

# Only train final layer
optimizer = optim.Adam(model.fc.parameters(), lr=0.001)
\`\`\`

## Data Augmentation

Increase training data diversity.

\`\`\`python
from torchvision import transforms

augmentation = transforms.Compose([
    transforms.RandomRotation(15),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])
\`\`\`

## Batch Normalization

Normalizes layer inputs, accelerates training.

\`\`\`python
self.bn = nn.BatchNorm2d(num_features)
x = self.bn(x)
\`\`\`

## Regularization Techniques

### Dropout
\`\`\`python
self.dropout = nn.Dropout(0.5)
x = self.dropout(x)
\`\`\`

### L2 Regularization (Weight Decay)
\`\`\`python
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)
\`\`\`

### Early Stopping
Stop training when validation loss stops improving.

## Visualization

### Visualize Filters
\`\`\`python
import matplotlib.pyplot as plt

# Get first conv layer weights
weights = model.conv1.weight.data.cpu()

fig, axes = plt.subplots(4, 8, figsize=(12, 6))
for i, ax in enumerate(axes.flat):
    if i < weights.shape[0]:
        ax.imshow(weights[i, 0], cmap='gray')
    ax.axis('off')
plt.show()
\`\`\`

### Visualize Feature Maps
\`\`\`python
def visualize_feature_maps(model, image):
    activation = {}
    
    def get_activation(name):
        def hook(model, input, output):
            activation[name] = output.detach()
        return hook
    
    model.conv1.register_forward_hook(get_activation('conv1'))
    
    output = model(image)
    
    feature_maps = activation['conv1'].squeeze()
    
    fig, axes = plt.subplots(4, 8, figsize=(15, 8))
    for i, ax in enumerate(axes.flat):
        if i < feature_maps.shape[0]:
            ax.imshow(feature_maps[i].cpu(), cmap='viridis')
        ax.axis('off')
    plt.show()
\`\`\`

## Best Practices

1. **Start with pre-trained models**: Transfer learning saves time
2. **Use data augmentation**: Prevents overfitting
3. **Batch normalization**: Speeds up training
4. **Learning rate scheduling**: Reduce LR when plateau
5. **Monitor validation metrics**: Avoid overfitting

Next, we'll explore object detection - finding and localizing multiple objects in images.`,
      order: 2,
      estimatedMinutes: 90,
      pathId: cvId,
    },
  ];

  // Insert NLP modules
  console.log("Inserting NLP modules...");
  for (const module of nlpModules) {
    const [result] = await db.insert(modules).values(module);
    const moduleId = result.insertId;
    console.log(`Inserted module: ${module.title} (ID: ${moduleId})`);

    // Create quiz for this module
    const [quizResult] = await db.insert(quizzes).values({
      moduleId: moduleId,
      title: `${module.title} Quiz`,
      passingScore: 70,
    });
    const quizId = quizResult.insertId;

    // Add 5 questions per quiz
    const questions = generateQuizQuestions(module.title, module.slug);
    for (const question of questions) {
      await db.insert(quizQuestions).values({
        ...question,
        quizId: quizId,
      });
    }
    console.log(`Created quiz with 5 questions for ${module.title}`);
  }

  // Insert CV modules
  console.log("Inserting Computer Vision modules...");
  for (const module of cvModules) {
    const [result] = await db.insert(modules).values(module);
    const moduleId = result.insertId;
    console.log(`Inserted module: ${module.title} (ID: ${moduleId})`);

    // Create quiz for this module
    const [quizResult] = await db.insert(quizzes).values({
      moduleId: moduleId,
      title: `${module.title} Quiz`,
      passingScore: 70,
    });
    const quizId = quizResult.insertId;

    // Add 5 questions per quiz
    const questions = generateQuizQuestions(module.title, module.slug);
    for (const question of questions) {
      await db.insert(quizQuestions).values({
        ...question,
        quizId: quizId,
      });
    }
    console.log(`Created quiz with 5 questions for ${module.title}`);
  }

  console.log("✅ NLP and Computer Vision modules seeded successfully!");
}

function generateQuizQuestions(moduleTitle: string, moduleSlug: string) {
  // Generate contextually relevant questions based on module
  const questionBank: Record<string, any[]> = {
    "intro-to-nlp": [
      {
        question: "What does NLP stand for?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Natural Language Processing", "Neural Learning Process", "Network Layer Protocol", "New Language Parser"]),
        correctAnswer: "Natural Language Processing",
        explanation: "NLP stands for Natural Language Processing, a branch of AI focused on enabling computers to understand human language.",
        order: 1,
      },
      {
        question: "Which of the following is NOT a common NLP application?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Machine Translation", "Sentiment Analysis", "Image Classification", "Chatbots"]),
        correctAnswer: "Image Classification",
        explanation: "Image Classification is a Computer Vision task, not an NLP task.",
        order: 2,
      },
      {
        question: "What is the first step in the NLP pipeline?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Semantic Analysis", "Text Preprocessing", "Model Training", "Deployment"]),
        correctAnswer: "Text Preprocessing",
        explanation: "Text preprocessing (cleaning and normalizing text) is the first step in the NLP pipeline.",
        order: 3,
      },
      {
        question: "Which challenge is unique to NLP compared to other ML tasks?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Overfitting", "Ambiguity in language", "Data scarcity", "Computational cost"]),
        correctAnswer: "Ambiguity in language",
        explanation: "Language ambiguity (words with multiple meanings, context dependency) is a unique challenge in NLP.",
        order: 4,
      },
      {
        question: "Modern NLP primarily uses which type of models?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Rule-based systems", "Statistical methods", "Transformers and deep learning", "Regular expressions"]),
        correctAnswer: "Transformers and deep learning",
        explanation: "Modern NLP leverages transformers (like BERT, GPT) and deep learning for state-of-the-art performance.",
        order: 5,
      },
    ],
    "text-preprocessing-tokenization": [
      {
        question: "What is tokenization?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Converting text to lowercase", "Breaking text into smaller units", "Removing stop words", "Translating text"]),
        correctAnswer: "Breaking text into smaller units",
        explanation: "Tokenization is the process of breaking text into smaller units (tokens) like words or subwords.",
        order: 1,
      },
      {
        question: "What is the difference between stemming and lemmatization?",
        questionType: "multiple_choice",
        options: JSON.stringify(["No difference", "Stemming is vocabulary-based, lemmatization is rule-based", "Lemmatization is vocabulary-based, stemming is rule-based", "Both are the same algorithm"]),
        correctAnswer: "Lemmatization is vocabulary-based, stemming is rule-based",
        explanation: "Lemmatization uses vocabulary to reduce words to their base form, while stemming uses crude chopping rules.",
        order: 2,
      },
      {
        question: "Why remove stop words in NLP preprocessing?",
        questionType: "multiple_choice",
        options: JSON.stringify(["They are grammatically incorrect", "They don't add much meaning", "They cause errors", "They are too long"]),
        correctAnswer: "They don't add much meaning",
        explanation: "Stop words like 'the', 'is', 'at' are common words that often don't add meaningful information for analysis.",
        order: 3,
      },
      {
        question: "Which tokenization method is used by modern transformers like BERT?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Word tokenization", "Sentence tokenization", "Subword tokenization", "Character tokenization"]),
        correctAnswer: "Subword tokenization",
        explanation: "Modern transformers use subword tokenization (WordPiece, BPE) to handle rare words and reduce vocabulary size.",
        order: 4,
      },
      {
        question: "What is the purpose of lowercasing text?",
        questionType: "multiple_choice",
        options: JSON.stringify(["To make text readable", "To treat 'Apple' and 'apple' as the same word", "To remove punctuation", "To speed up processing"]),
        correctAnswer: "To treat 'Apple' and 'apple' as the same word",
        explanation: "Lowercasing ensures that words with different cases are treated as the same token.",
        order: 5,
      },
    ],
    "intro-to-cv": [
      {
        question: "How are color images represented in computers?",
        questionType: "multiple_choice",
        options: JSON.stringify(["1D array", "2D array", "3D array (height × width × channels)", "4D array"]),
        correctAnswer: "3D array (height × width × channels)",
        explanation: "Color images are represented as 3D arrays with dimensions for height, width, and color channels (RGB).",
        order: 1,
      },
      {
        question: "What is the purpose of edge detection in computer vision?",
        questionType: "multiple_choice",
        options: JSON.stringify(["To blur images", "To identify boundaries in images", "To change colors", "To resize images"]),
        correctAnswer: "To identify boundaries in images",
        explanation: "Edge detection identifies boundaries and discontinuities in images, which are important features for object recognition.",
        order: 2,
      },
      {
        question: "Which color space is better for color-based segmentation?",
        questionType: "multiple_choice",
        options: JSON.stringify(["RGB", "HSV", "Grayscale", "CMYK"]),
        correctAnswer: "HSV",
        explanation: "HSV (Hue, Saturation, Value) separates color information from intensity, making it better for color-based segmentation.",
        order: 3,
      },
      {
        question: "What is the main advantage of deep learning over traditional computer vision?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Faster processing", "Learned features from data", "Less data required", "Simpler implementation"]),
        correctAnswer: "Learned features from data",
        explanation: "Deep learning automatically learns features from data, eliminating the need for manual feature engineering.",
        order: 4,
      },
      {
        question: "Which challenge is common in computer vision?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Text ambiguity", "Viewpoint variation", "Grammar errors", "Spelling mistakes"]),
        correctAnswer: "Viewpoint variation",
        explanation: "Viewpoint variation (same object from different angles) is a common challenge in computer vision.",
        order: 5,
      },
    ],
    "convolutional-neural-networks": [
      {
        question: "What is the main advantage of CNNs over fully connected networks for images?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Faster training", "Preserve spatial structure", "Fewer parameters", "Better accuracy"]),
        correctAnswer: "Preserve spatial structure",
        explanation: "CNNs preserve spatial relationships in images through local connectivity and parameter sharing.",
        order: 1,
      },
      {
        question: "What does a convolution operation do?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Resizes the image", "Applies a filter across the image", "Converts to grayscale", "Removes noise"]),
        correctAnswer: "Applies a filter across the image",
        explanation: "Convolution slides a filter (kernel) across the image, computing dot products to extract features.",
        order: 2,
      },
      {
        question: "What is the purpose of pooling layers in CNNs?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Increase spatial dimensions", "Reduce spatial dimensions", "Add more filters", "Normalize values"]),
        correctAnswer: "Reduce spatial dimensions",
        explanation: "Pooling layers reduce spatial dimensions, decreasing computation and providing translation invariance.",
        order: 3,
      },
      {
        question: "Which architecture introduced residual connections?",
        questionType: "multiple_choice",
        options: JSON.stringify(["AlexNet", "VGG", "ResNet", "LeNet"]),
        correctAnswer: "ResNet",
        explanation: "ResNet introduced residual (skip) connections, enabling very deep networks by addressing vanishing gradients.",
        order: 4,
      },
      {
        question: "What is transfer learning in CNNs?",
        questionType: "multiple_choice",
        options: JSON.stringify(["Training from scratch", "Using pre-trained models for new tasks", "Transferring data between datasets", "Converting models between frameworks"]),
        correctAnswer: "Using pre-trained models for new tasks",
        explanation: "Transfer learning uses pre-trained models (trained on large datasets) as starting points for new tasks.",
        order: 5,
      },
    ],
  };

  // Return questions for the module, or generic questions if not found
  return questionBank[moduleSlug] || [
    {
      question: `What is a key concept in ${moduleTitle}?`,
      questionType: "multiple_choice",
      options: JSON.stringify(["Concept A", "Concept B", "Concept C", "Concept D"]),
      correctAnswer: "Concept A",
      explanation: `This tests understanding of ${moduleTitle}.`,
      order: 1,
    },
    {
      question: `Which technique is commonly used in ${moduleTitle}?`,
      questionType: "multiple_choice",
      options: JSON.stringify(["Technique 1", "Technique 2", "Technique 3", "Technique 4"]),
      correctAnswer: "Technique 1",
      explanation: `This question covers common techniques in ${moduleTitle}.`,
      order: 2,
    },
    {
      question: `What is the main goal of ${moduleTitle}?`,
      questionType: "multiple_choice",
      options: JSON.stringify(["Goal A", "Goal B", "Goal C", "Goal D"]),
      correctAnswer: "Goal A",
      explanation: `Understanding the main objectives of ${moduleTitle}.`,
      order: 3,
    },
    {
      question: `Which tool is most useful for ${moduleTitle}?`,
      questionType: "multiple_choice",
      options: JSON.stringify(["Tool 1", "Tool 2", "Tool 3", "Tool 4"]),
      correctAnswer: "Tool 1",
      explanation: `This tests knowledge of tools used in ${moduleTitle}.`,
      order: 4,
    },
    {
      question: `What challenge is common in ${moduleTitle}?`,
      questionType: "multiple_choice",
      options: JSON.stringify(["Challenge A", "Challenge B", "Challenge C", "Challenge D"]),
      correctAnswer: "Challenge A",
      explanation: `Understanding common challenges in ${moduleTitle}.`,
      order: 5,
    },
  ];
}

seedNLPandCV().catch(console.error);
