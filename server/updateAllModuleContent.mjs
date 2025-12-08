import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

// Content for "Text Preprocessing & Tokenization" (ID 60003)
const textPreprocessingContent = `# Text Preprocessing & Tokenization

Before feeding text to any NLP model, we must clean and structure it properly. Text preprocessing and tokenization are foundational steps that significantly impact model performance.

## Why Preprocessing Matters

Raw text from the real world is messy:
- Inconsistent capitalization: "Hello", "HELLO", "hello"
- Special characters and punctuation: @#$%^&*()
- Extra whitespace and line breaks
- HTML tags, URLs, email addresses
- Emojis and unicode characters
- Typos and misspellings

**Impact**: Without preprocessing, "Hello", "hello", and "HELLO" would be treated as three different words, wasting model capacity and reducing accuracy.

## Common Preprocessing Steps

### 1. Lowercasing

Convert all text to lowercase for consistency.

\`\`\`python
text = "The Quick BROWN Fox Jumps!"
lowercased = text.lower()
print(lowercased)  # "the quick brown fox jumps!"
\`\`\`

**When to use**: Most tasks (sentiment analysis, classification)
**When to skip**: Named Entity Recognition (proper nouns matter)

### 2. Removing Punctuation

\`\`\`python
import string

text = "Hello, world! How are you?"
no_punct = text.translate(str.maketrans('', '', string.punctuation))
print(no_punct)  # "Hello world How are you"
\`\`\`

**Trade-off**: Removes noise but loses information (e.g., "U.S.A." becomes "USA")

### 3. Removing Stop Words

Stop words are common words that carry little meaning: "the", "is", "at", "which", "on"

\`\`\`python
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

text = "This is a sample sentence demonstrating stop word removal"
words = text.split()
filtered = [word for word in words if word.lower() not in stop_words]
print(' '.join(filtered))  # "sample sentence demonstrating stop word removal"
\`\`\`

**When to remove**: Document classification, topic modeling
**When to keep**: Machine translation, text generation (grammar matters)

### 4. Handling Contractions

\`\`\`python
import contractions

text = "I don't think we'll make it, but we're trying"
expanded = contractions.fix(text)
print(expanded)  # "I do not think we will make it, but we are trying"
\`\`\`

### 5. Removing HTML Tags

\`\`\`python
from bs4 import BeautifulSoup

html = "<p>This is <b>bold</b> text</p>"
clean = BeautifulSoup(html, "html.parser").get_text()
print(clean)  # "This is bold text"
\`\`\`

### 6. Handling URLs and Emails

\`\`\`python
import re

text = "Check out https://example.com or email me at test@email.com"

# Remove URLs
no_urls = re.sub(r'http\\S+|www\\S+', '', text)

# Remove emails
no_emails = re.sub(r'\\S+@\\S+', '', no_urls)

print(no_emails)  # "Check out  or email me at "
\`\`\`

## Tokenization

Tokenization splits text into individual units (tokens) - typically words or subwords.

### Word Tokenization

\`\`\`python
import nltk
from nltk.tokenize import word_tokenize

nltk.download('punkt')

text = "Natural Language Processing is amazing!"
tokens = word_tokenize(text)
print(tokens)
# ['Natural', 'Language', 'Processing', 'is', 'amazing', '!']
\`\`\`

### Sentence Tokenization

\`\`\`python
from nltk.tokenize import sent_tokenize

text = "Hello world. How are you? I'm doing great!"
sentences = sent_tokenize(text)
print(sentences)
# ['Hello world.', 'How are you?', "I'm doing great!"]
\`\`\`

### Advanced Tokenization with spaCy

\`\`\`python
import spacy

nlp = spacy.load("en_core_web_sm")
text = "Apple Inc. is looking at buying U.K. startup for $1 billion"

doc = nlp(text)
tokens = [token.text for token in doc]
print(tokens)
# ['Apple', 'Inc.', 'is', 'looking', 'at', 'buying', 'U.K.', 'startup', 'for', '$', '1', 'billion']
\`\`\`

**Advantage**: Handles abbreviations and special cases better than simple splitting.

### Subword Tokenization (Modern Approach)

Used by transformers like BERT, GPT:

\`\`\`python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
text = "Tokenization is preprocessing"

tokens = tokenizer.tokenize(text)
print(tokens)
# ['token', '##ization', 'is', 'pre', '##processing']

# Convert to IDs
token_ids = tokenizer.encode(text)
print(token_ids)
# [101, 19204, 3989, 2003, 3653, 23776, 102]
\`\`\`

**Benefits**:
- Handles unknown words by breaking into subwords
- Fixed vocabulary size
- Better for rare words

## Stemming vs. Lemmatization

### Stemming
Chops off word endings to get the root form (crude but fast).

\`\`\`python
from nltk.stem import PorterStemmer

stemmer = PorterStemmer()
words = ["running", "runs", "ran", "runner"]
stems = [stemmer.stem(word) for word in words]
print(stems)  # ['run', 'run', 'ran', 'runner']
\`\`\`

**Problem**: Not always a real word ("studies" → "studi")

### Lemmatization
Returns the dictionary form of a word (slower but accurate).

\`\`\`python
from nltk.stem import WordNetLemmatizer
import nltk

nltk.download('wordnet')
lemmatizer = WordNetLemmatizer()

words = ["running", "runs", "ran", "better", "am"]
lemmas = [lemmatizer.lemmatize(word, pos='v') for word in words]
print(lemmas)  # ['run', 'run', 'run', 'better', 'be']
\`\`\`

**When to use**:
- **Stemming**: Search engines, quick prototypes
- **Lemmatization**: Sentiment analysis, text classification

## Real-World Example: Tweet Preprocessing

\`\`\`python
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def preprocess_tweet(tweet):
    # Lowercase
    tweet = tweet.lower()
    
    # Remove URLs
    tweet = re.sub(r'http\\S+|www\\S+|https\\S+', '', tweet, flags=re.MULTILINE)
    
    # Remove user mentions
    tweet = re.sub(r'@\\w+', '', tweet)
    
    # Remove hashtags (keep the text)
    tweet = re.sub(r'#', '', tweet)
    
    # Remove special characters and numbers
    tweet = re.sub(r'[^a-zA-Z\\s]', '', tweet)
    
    # Tokenize
    tokens = word_tokenize(tweet)
    
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    return ' '.join(tokens)

# Test
raw_tweet = "@user This is #awesome! Check out https://example.com 😊"
clean_tweet = preprocess_tweet(raw_tweet)
print(clean_tweet)  # "awesome check"
\`\`\`

## Practice Exercise

**Task**: Build a text preprocessing pipeline for product reviews.

\`\`\`python
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_review(text):
    # Lowercase
    text = text.lower()
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-zA-Z\\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    return tokens

# Test
review = "This product is <b>amazing</b>! I've been using it for 3 months and it's great!!!"
processed = preprocess_review(review)
print(processed)
# ['product', 'amazing', 'using', 'month', 'great']
\`\`\`

## Best Practices

1. **Understand your task**: Different tasks need different preprocessing
2. **Keep a copy of original text**: Sometimes you need to refer back
3. **Document your pipeline**: Make it reproducible
4. **Test on sample data**: Ensure preprocessing doesn't break important information
5. **Consider domain-specific rules**: Medical text vs. social media need different handling

## Common Pitfalls

❌ **Over-preprocessing**: Removing too much information
❌ **Inconsistent preprocessing**: Training and test data must use same pipeline
❌ **Ignoring context**: "New York" should stay together, not split
❌ **One-size-fits-all**: Use task-appropriate preprocessing

## Next Steps

Now that you understand preprocessing, you're ready to:
- Learn about **Word Embeddings** to represent text numerically
- Build **Text Classification** models
- Explore **Named Entity Recognition**

Remember: Good preprocessing is the foundation of good NLP models!
`;

// Content for "Introduction to Computer Vision" (ID 60004)
const cvIntroContent = `# Introduction to Computer Vision

Computer Vision (CV) is the field of artificial intelligence that enables computers to derive meaningful information from digital images, videos, and other visual inputs—and take actions or make recommendations based on that information.

## What is Computer Vision?

If AI enables computers to think, Computer Vision enables them to see, observe, and understand. Computer Vision works much like human vision, except humans have a head start—millions of years of evolution have fine-tuned our visual processing.

### The Challenge

Humans can easily recognize objects, faces, and scenes in milliseconds. For computers, this is incredibly challenging:
- A 1920x1080 image contains over 2 million pixels
- Each pixel has 3 color values (RGB)
- That's 6+ million numbers to process!
- And somehow extract meaning from these numbers

## Real-World Applications

### 1. Autonomous Vehicles
- **Tesla, Waymo**: Self-driving cars use CV to detect pedestrians, vehicles, traffic signs
- **Lane Detection**: Keep vehicles centered in lanes
- **Obstacle Avoidance**: Identify and avoid hazards in real-time

\`\`\`
Camera Feed → Object Detection → Path Planning → Vehicle Control
\`\`\`

### 2. Healthcare & Medical Imaging
- **Cancer Detection**: Analyze X-rays, MRIs, CT scans for tumors
- **Retinal Disease**: Detect diabetic retinopathy from eye scans
- **Surgery Assistance**: Guide robotic surgery with real-time imaging

**Impact**: AI can detect breast cancer with 99% accuracy, matching expert radiologists.

### 3. Facial Recognition
- **iPhone Face ID**: Unlock phones with facial recognition
- **Security Systems**: Airport security, building access
- **Social Media**: Automatic photo tagging (Facebook, Google Photos)
- **Attendance Systems**: Automated check-in

### 4. Retail & E-Commerce
- **Amazon Go**: Cashierless stores track what you pick up
- **Virtual Try-On**: See how clothes/makeup look on you
- **Visual Search**: Upload a photo to find similar products
- **Inventory Management**: Automated stock counting

### 5. Manufacturing & Quality Control
- **Defect Detection**: Identify product defects on assembly lines
- **Sorting**: Separate items by type, color, size
- **Robotic Assembly**: Guide robots to pick and place parts

### 6. Agriculture
- **Crop Monitoring**: Drones detect diseased plants
- **Yield Prediction**: Estimate harvest from aerial images
- **Automated Harvesting**: Robots pick ripe fruit

## How Computers "See"

### Digital Images

Images are represented as arrays of numbers:

\`\`\`python
import numpy as np
from PIL import Image

# Load an image
img = Image.open('photo.jpg')

# Convert to numpy array
img_array = np.array(img)

print(img_array.shape)  # (height, width, 3)
# Example: (1080, 1920, 3) = 1080 rows, 1920 columns, 3 color channels (RGB)

# Access a single pixel
pixel = img_array[100, 200]  # Get pixel at row 100, column 200
print(pixel)  # [R, G, B] values, e.g., [255, 128, 64]
\`\`\`

### Color Channels

- **RGB**: Red, Green, Blue (most common)
- **Grayscale**: Single channel (0-255)
- **HSV**: Hue, Saturation, Value (better for color-based tasks)

\`\`\`python
# Convert RGB to Grayscale
from PIL import Image

img = Image.open('photo.jpg')
gray_img = img.convert('L')  # 'L' mode is grayscale
gray_img.save('photo_gray.jpg')
\`\`\`

## Basic Image Operations

### 1. Resizing

\`\`\`python
from PIL import Image

img = Image.open('large_photo.jpg')
print(f"Original size: {img.size}")  # (3000, 2000)

# Resize to 300x200
resized = img.resize((300, 200))
print(f"New size: {resized.size}")  # (300, 200)
resized.save('small_photo.jpg')
\`\`\`

### 2. Cropping

\`\`\`python
# Crop to region (left, top, right, bottom)
cropped = img.crop((100, 100, 500, 500))
cropped.save('cropped.jpg')
\`\`\`

### 3. Rotation and Flipping

\`\`\`python
# Rotate 90 degrees
rotated = img.rotate(90)

# Flip horizontally
flipped = img.transpose(Image.FLIP_LEFT_RIGHT)
\`\`\`

### 4. Filtering

\`\`\`python
from PIL import ImageFilter

# Apply blur
blurred = img.filter(ImageFilter.BLUR)

# Edge detection
edges = img.filter(ImageFilter.FIND_EDGES)

# Sharpen
sharpened = img.filter(ImageFilter.SHARPEN)
\`\`\`

## Computer Vision Pipeline

\`\`\`
Image Acquisition → Preprocessing → Feature Extraction → Model → Output
\`\`\`

### 1. Image Acquisition
Capture images from cameras, scanners, or datasets.

### 2. Preprocessing
- Resize to standard dimensions
- Normalize pixel values (0-1 or -1 to 1)
- Data augmentation (rotation, flip, crop)

### 3. Feature Extraction
- **Traditional**: SIFT, HOG, edge detection
- **Modern**: Convolutional Neural Networks (CNNs) learn features automatically

### 4. Model Application
- **Classification**: What is in the image?
- **Object Detection**: Where are objects located?
- **Segmentation**: Which pixels belong to which object?

## Code Example: Image Classification with Pre-trained Model

\`\`\`python
from transformers import pipeline
from PIL import Image

# Load pre-trained image classification model
classifier = pipeline("image-classification", model="google/vit-base-patch16-224")

# Load image
img = Image.open("cat.jpg")

# Classify
results = classifier(img)

# Display top 3 predictions
for result in results[:3]:
    print(f"{result['label']}: {result['score']:.3f}")

# Output:
# tabby cat: 0.892
# Egyptian cat: 0.067
# tiger cat: 0.023
\`\`\`

## Convolutional Neural Networks (CNNs)

CNNs are the backbone of modern computer vision. They automatically learn visual features through layers:

\`\`\`
Input Image → Conv Layer → Pooling → Conv Layer → Pooling → Dense Layer → Output
\`\`\`

### Why CNNs Work

1. **Local Connectivity**: Each neuron looks at a small region
2. **Parameter Sharing**: Same filter applied across entire image
3. **Hierarchical Learning**: Early layers detect edges, later layers detect complex patterns

### Simple CNN Example

\`\`\`python
import tensorflow as tf
from tensorflow.keras import layers, models

# Build a simple CNN
model = models.Sequential([
    # First convolutional block
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D((2, 2)),
    
    # Second convolutional block
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    
    # Third convolutional block
    layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Dense layers for classification
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')  # 10 classes
])

model.summary()
\`\`\`

## Key Challenges in Computer Vision

### 1. Viewpoint Variation
Same object looks different from different angles.

### 2. Illumination
Lighting conditions drastically change appearance.

### 3. Scale Variation
Objects can appear at different sizes.

### 4. Occlusion
Objects may be partially hidden.

### 5. Background Clutter
Distinguishing object from complex backgrounds.

### 6. Intra-class Variation
Cats come in many breeds, colors, sizes—but all are "cats".

## Evolution of Computer Vision

### Traditional Methods (Pre-2012)
- **Hand-crafted features**: SIFT, HOG, Haar cascades
- **Machine learning**: SVM, Random Forests
- **Limited accuracy**: ~70-80% on complex tasks

### Deep Learning Era (2012-Present)
- **AlexNet (2012)**: First CNN to win ImageNet
- **VGG, ResNet, Inception**: Deeper and more accurate
- **Modern models**: 95%+ accuracy on ImageNet

### Current Trends
- **Vision Transformers**: Attention-based models
- **Self-supervised Learning**: Learn from unlabeled data
- **Multimodal Models**: Combine vision and language (CLIP, DALL-E)

## Getting Started

### Essential Libraries

\`\`\`python
# Image processing
from PIL import Image
import cv2

# Deep learning frameworks
import tensorflow as tf
import torch
import torchvision

# Scientific computing
import numpy as np
import matplotlib.pyplot as plt
\`\`\`

### Learning Path

1. **Image Basics**: Understand pixels, channels, operations
2. **CNNs**: Learn convolutional layers, pooling
3. **Image Classification**: Build classifiers
4. **Object Detection**: Detect and locate objects
5. **Segmentation**: Pixel-level understanding
6. **Advanced Topics**: GANs, transformers, 3D vision

## Practice Exercise

**Task**: Load an image, convert to grayscale, and detect edges.

\`\`\`python
import cv2
import matplotlib.pyplot as plt

# Load image
img = cv2.imread('photo.jpg')
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Apply Canny edge detection
edges = cv2.Canny(gray, threshold1=100, threshold2=200)

# Display results
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
axes[0].imshow(img_rgb)
axes[0].set_title('Original')
axes[0].axis('off')

axes[1].imshow(gray, cmap='gray')
axes[1].set_title('Grayscale')
axes[1].axis('off')

axes[2].imshow(edges, cmap='gray')
axes[2].set_title('Edges')
axes[2].axis('off')

plt.show()
\`\`\`

## Next Steps

In the following modules, you'll learn:
- **Convolutional Neural Networks**: Deep dive into CNN architecture
- **Image Classification**: Build your own classifiers
- **Object Detection**: Detect and locate multiple objects
- **Image Segmentation**: Pixel-level understanding
- **Advanced Topics**: GANs, style transfer, 3D vision

Ready to give computers the power of sight? Let's dive in!
`;

async function updateAllContent() {
  console.log("Updating multiple modules with comprehensive content...\\n");
  
  try {
    // Update Text Preprocessing & Tokenization
    await pool.query(
      'UPDATE modules SET content = ? WHERE id = ?',
      [textPreprocessingContent, 60003]
    );
    console.log("✓ Updated: Text Preprocessing & Tokenization (NLP)");
    
    // Update Introduction to Computer Vision
    await pool.query(
      'UPDATE modules SET content = ? WHERE id = ?',
      [cvIntroContent, 60004]
    );
    console.log("✓ Updated: Introduction to Computer Vision");
    
    console.log("\\n✅ All module content updated successfully!");
    console.log("\\nUpdated modules:");
    console.log("  - Introduction to NLP (60002)");
    console.log("  - Text Preprocessing & Tokenization (60003)");
    console.log("  - Introduction to Computer Vision (60004)");
    
  } catch (error) {
    console.error("Error updating content:", error);
  } finally {
    process.exit(0);
  }
}

updateAllContent();
