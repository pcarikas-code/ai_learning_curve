import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { modules, quizzes, quizQuestions } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

// NLP Module Quiz Questions
const nlpQuizData = [
  {
    moduleSlug: "nlp-fundamentals",
    title: "Text Preprocessing Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is tokenization in NLP?",
        options: ["Converting text to lowercase", "Breaking text into individual words or tokens", "Removing stop words", "Converting words to their base form"],
        correctAnswer: 1,
        explanation: "Tokenization is the process of breaking down text into smaller units called tokens, typically words or subwords."
      },
      {
        question: "Which technique removes common words like 'the', 'is', 'and' from text?",
        options: ["Stemming", "Lemmatization", "Stop word removal", "Tokenization"],
        correctAnswer: 2,
        explanation: "Stop word removal eliminates frequently occurring words that typically don't carry significant meaning for analysis."
      },
      {
        question: "What is the difference between stemming and lemmatization?",
        options: ["They are the same thing", "Stemming uses dictionary lookup while lemmatization uses rules", "Lemmatization produces valid words while stemming may not", "Stemming is more accurate than lemmatization"],
        correctAnswer: 2,
        explanation: "Lemmatization uses vocabulary and morphological analysis to return the dictionary form of a word, while stemming simply chops off word endings."
      },
      {
        question: "What does TF-IDF stand for?",
        options: ["Text Frequency-Inverse Document Frequency", "Term Frequency-Inverse Document Frequency", "Token Frequency-Index Document Frequency", "Text Feature-Inverse Data Frequency"],
        correctAnswer: 1,
        explanation: "TF-IDF stands for Term Frequency-Inverse Document Frequency, a numerical statistic that reflects how important a word is to a document."
      }
    ]
  },
  {
    moduleSlug: "nlp-text-representation",
    title: "Word Embeddings Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is the main advantage of word embeddings over one-hot encoding?",
        options: ["They are faster to compute", "They capture semantic relationships between words", "They require less memory", "They are easier to understand"],
        correctAnswer: 1,
        explanation: "Word embeddings represent words in dense vector space where semantically similar words are closer together, capturing meaning and relationships."
      },
      {
        question: "Which model introduced the concept of 'king - man + woman = queen'?",
        options: ["GloVe", "Word2Vec", "FastText", "BERT"],
        correctAnswer: 1,
        explanation: "Word2Vec popularized this concept, demonstrating that word embeddings can capture semantic relationships through vector arithmetic."
      },
      {
        question: "What are the two main architectures in Word2Vec?",
        options: ["Encoder and Decoder", "CBOW and Skip-gram", "Transformer and RNN", "CNN and LSTM"],
        correctAnswer: 1,
        explanation: "Word2Vec uses Continuous Bag of Words (CBOW) which predicts target word from context, and Skip-gram which predicts context from target word."
      },
      {
        question: "What is a key advantage of FastText over Word2Vec?",
        options: ["It's faster to train", "It can generate embeddings for out-of-vocabulary words", "It produces smaller embedding vectors", "It requires less training data"],
        correctAnswer: 1,
        explanation: "FastText represents words as bags of character n-grams, allowing it to generate embeddings for words not seen during training."
      }
    ]
  },
  {
    moduleSlug: "nlp-language-models",
    title: "Sequence Models Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What problem do LSTMs solve that vanilla RNNs struggle with?",
        options: ["Processing speed", "Vanishing gradient problem", "Memory requirements", "Training complexity"],
        correctAnswer: 1,
        explanation: "LSTMs use gates to control information flow, effectively addressing the vanishing gradient problem that makes vanilla RNNs difficult to train on long sequences."
      },
      {
        question: "What are the three main gates in an LSTM cell?",
        options: ["Input, Hidden, Output", "Forget, Input, Output", "Memory, Update, Reset", "Encoder, Decoder, Attention"],
        correctAnswer: 1,
        explanation: "LSTM cells have Forget gate (what to forget), Input gate (what to add), and Output gate (what to output from the cell state)."
      },
      {
        question: "What is the main advantage of bidirectional RNNs?",
        options: ["They train faster", "They can access both past and future context", "They require less memory", "They are easier to implement"],
        correctAnswer: 1,
        explanation: "Bidirectional RNNs process sequences in both forward and backward directions, allowing the model to have complete context at each position."
      },
      {
        question: "What is teacher forcing in sequence-to-sequence models?",
        options: ["Using a pre-trained teacher model", "Using ground truth as input during training instead of model predictions", "Forcing the model to learn faster", "Using multiple teachers for ensemble learning"],
        correctAnswer: 1,
        explanation: "Teacher forcing feeds the actual target output as the next input during training, rather than the model's own prediction, speeding up training."
      }
    ]
  },
  {
    moduleSlug: "nlp-classification",
    title: "Attention and Transformers Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is the key innovation of the attention mechanism?",
        options: ["Faster training", "Allowing the model to focus on relevant parts of the input", "Reducing model size", "Eliminating the need for embeddings"],
        correctAnswer: 1,
        explanation: "Attention allows models to dynamically focus on different parts of the input sequence, weighing their importance for each output."
      },
      {
        question: "What does 'self-attention' mean in Transformers?",
        options: ["The model pays attention to itself", "Attention within the same sequence", "Attention without external input", "Automated attention mechanism"],
        correctAnswer: 1,
        explanation: "Self-attention computes attention scores between all positions in the same sequence, allowing each token to attend to all other tokens."
      },
      {
        question: "Why do Transformers use positional encoding?",
        options: ["To reduce computation", "Because they process sequences in parallel and need position information", "To improve accuracy", "To handle variable-length sequences"],
        correctAnswer: 1,
        explanation: "Unlike RNNs, Transformers process all tokens in parallel, so positional encodings are added to give the model information about token positions."
      },
      {
        question: "What are the three components of multi-head attention?",
        options: ["Input, Hidden, Output", "Encoder, Decoder, Attention", "Query, Key, Value", "Forward, Backward, Bidirectional"],
        correctAnswer: 2,
        explanation: "Multi-head attention uses Query (what we're looking for), Key (what we're looking at), and Value (what we get) matrices to compute attention."
      },
      {
        question: "What is the main advantage of Transformers over RNNs?",
        options: ["Smaller model size", "Parallelizable computation", "Easier to implement", "Better for short sequences"],
        correctAnswer: 1,
        explanation: "Transformers can process all tokens in parallel, unlike RNNs which must process sequentially, enabling much faster training on modern hardware."
      }
    ]
  },
  {
    moduleSlug: "nlp-ner",
    title: "BERT and GPT Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What type of model is BERT?",
        options: ["Autoregressive", "Bidirectional encoder", "Decoder-only", "Seq2Seq"],
        correctAnswer: 1,
        explanation: "BERT is a bidirectional encoder that reads text in both directions simultaneously, unlike autoregressive models that read left-to-right."
      },
      {
        question: "What are the two pre-training tasks used by BERT?",
        options: ["Translation and summarization", "Masked Language Modeling and Next Sentence Prediction", "Question answering and classification", "Tokenization and embedding"],
        correctAnswer: 1,
        explanation: "BERT pre-trains on Masked Language Modeling (predicting masked words) and Next Sentence Prediction (determining if sentences are consecutive)."
      },
      {
        question: "How does GPT differ from BERT in architecture?",
        options: ["GPT is smaller", "GPT is autoregressive (decoder-only) while BERT is bidirectional (encoder-only)", "GPT uses CNN instead of Transformers", "GPT doesn't use attention"],
        correctAnswer: 1,
        explanation: "GPT uses a decoder-only architecture that generates text autoregressively (one token at a time), while BERT uses an encoder for bidirectional understanding."
      },
      {
        question: "What does 'fine-tuning' mean in the context of BERT?",
        options: ["Making the model smaller", "Training the pre-trained model on a specific downstream task", "Adjusting hyperparameters", "Removing unnecessary layers"],
        correctAnswer: 1,
        explanation: "Fine-tuning involves taking a pre-trained BERT model and training it further on a specific task with task-specific data."
      },
      {
        question: "What is the [CLS] token used for in BERT?",
        options: ["To mark the end of a sentence", "To represent the entire sequence for classification tasks", "To separate two sentences", "To mask words during training"],
        correctAnswer: 1,
        explanation: "The [CLS] (classification) token is added at the start of every input, and its final hidden state is used as the sequence representation for classification."
      }
    ]
  },
  {
    moduleSlug: "nlp-translation",
    title: "Text Generation Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is the purpose of temperature in text generation?",
        options: ["To speed up generation", "To control randomness in sampling", "To reduce model size", "To improve accuracy"],
        correctAnswer: 1,
        explanation: "Temperature scales the logits before sampling: lower values make the model more confident and deterministic, higher values increase randomness."
      },
      {
        question: "What is beam search?",
        options: ["A type of neural network", "A search algorithm that keeps top-k most likely sequences at each step", "A training technique", "A tokenization method"],
        correctAnswer: 1,
        explanation: "Beam search maintains multiple candidate sequences (beams) and explores the most promising ones, balancing between greedy and exhaustive search."
      },
      {
        question: "What problem does nucleus (top-p) sampling address?",
        options: ["Slow generation speed", "Selecting from a dynamic set of probable tokens rather than fixed top-k", "Memory constraints", "Training instability"],
        correctAnswer: 1,
        explanation: "Nucleus sampling selects from the smallest set of tokens whose cumulative probability exceeds p, adapting to the probability distribution dynamically."
      },
      {
        question: "What is the main challenge in evaluating generated text?",
        options: ["Computational cost", "Lack of objective metrics that correlate with human judgment", "Memory requirements", "Training time"],
        correctAnswer: 1,
        explanation: "Automatic metrics like BLEU don't always correlate well with human judgment of quality, making evaluation of generated text challenging."
      }
    ]
  },
  {
    moduleSlug: "nlp-qa-chatbots",
    title: "NLP Applications Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is sentiment analysis?",
        options: ["Analyzing sentence structure", "Determining the emotional tone of text", "Counting word frequencies", "Translating between languages"],
        correctAnswer: 1,
        explanation: "Sentiment analysis identifies and extracts subjective information, determining whether text expresses positive, negative, or neutral sentiment."
      },
      {
        question: "What is Named Entity Recognition (NER)?",
        options: ["Recognizing famous people", "Identifying and classifying named entities (people, organizations, locations) in text", "Naming variables in code", "Recognizing entity relationships"],
        correctAnswer: 1,
        explanation: "NER locates and classifies named entities in text into predefined categories like person names, organizations, locations, dates, etc."
      },
      {
        question: "What is the difference between extractive and abstractive summarization?",
        options: ["Extractive is faster", "Extractive selects existing sentences while abstractive generates new text", "Abstractive is more accurate", "They are the same"],
        correctAnswer: 1,
        explanation: "Extractive summarization selects and combines existing sentences from the source, while abstractive summarization generates new sentences that capture the meaning."
      },
      {
        question: "What is question answering in NLP?",
        options: ["Generating questions from text", "Building systems that can answer questions about given text or knowledge", "Answering multiple choice questions", "Creating FAQ pages"],
        correctAnswer: 1,
        explanation: "Question answering systems take a question and a context (or knowledge base) and generate or extract an answer to the question."
      },
      {
        question: "What is machine translation?",
        options: ["Translating machine code", "Automatically translating text from one language to another", "Converting speech to text", "Translating between programming languages"],
        correctAnswer: 1,
        explanation: "Machine translation uses algorithms and models to automatically translate text or speech from one natural language to another."
      }
    ]
  }
];

// Computer Vision Module Quiz Questions
const cvQuizData = [
  {
    moduleSlug: "cv-fundamentals",
    title: "Image Fundamentals Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What are the three color channels in an RGB image?",
        options: ["Red, Green, Blue", "Red, Gray, Black", "Cyan, Magenta, Yellow", "Hue, Saturation, Value"],
        correctAnswer: 0,
        explanation: "RGB images use Red, Green, and Blue channels, with each pixel having three values representing the intensity of each color."
      },
      {
        question: "What is image resolution?",
        options: ["The file size of an image", "The number of pixels in an image (width × height)", "The color depth of an image", "The compression ratio"],
        correctAnswer: 1,
        explanation: "Image resolution refers to the number of pixels in an image, typically expressed as width × height (e.g., 1920×1080)."
      },
      {
        question: "What is a grayscale image?",
        options: ["An image with only black and white", "An image with shades of gray from black to white", "A compressed image", "A low-resolution image"],
        correctAnswer: 1,
        explanation: "Grayscale images have a single channel with pixel values representing intensity from black (0) to white (255)."
      },
      {
        question: "What does image normalization typically involve?",
        options: ["Resizing the image", "Scaling pixel values to a standard range like [0,1] or [-1,1]", "Converting to grayscale", "Removing noise"],
        correctAnswer: 1,
        explanation: "Normalization scales pixel values to a standard range, helping neural networks train more effectively and converge faster."
      }
    ]
  },
  {
    moduleSlug: "cv-classification",
    title: "Image Processing Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is the purpose of image filtering?",
        options: ["To compress images", "To modify or enhance images by applying mathematical operations", "To change image format", "To resize images"],
        correctAnswer: 1,
        explanation: "Image filtering applies convolution operations to modify images, such as blurring, sharpening, edge detection, or noise reduction."
      },
      {
        question: "What does a Gaussian blur filter do?",
        options: ["Sharpens edges", "Smooths the image by averaging nearby pixels with Gaussian weights", "Detects edges", "Increases contrast"],
        correctAnswer: 1,
        explanation: "Gaussian blur applies a weighted average using a Gaussian function, creating a smooth blurring effect that reduces noise and detail."
      },
      {
        question: "What is edge detection used for?",
        options: ["Compressing images", "Identifying boundaries where image brightness changes sharply", "Coloring images", "Resizing images"],
        correctAnswer: 1,
        explanation: "Edge detection identifies points in an image where brightness changes sharply, revealing object boundaries and important features."
      },
      {
        question: "What is image thresholding?",
        options: ["Resizing an image", "Converting a grayscale image to binary by comparing pixels to a threshold value", "Adjusting brightness", "Applying filters"],
        correctAnswer: 1,
        explanation: "Thresholding converts grayscale images to binary by setting pixels above a threshold to white and below to black, useful for segmentation."
      },
      {
        question: "What is histogram equalization?",
        options: ["Making all pixels equal", "Improving image contrast by redistributing pixel intensities", "Creating a histogram", "Reducing image size"],
        correctAnswer: 1,
        explanation: "Histogram equalization spreads out the most frequent intensity values, effectively increasing the global contrast of the image."
      }
    ]
  },
  {
    moduleSlug: "cv-face-recognition",
    title: "Convolutional Neural Networks Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is the main purpose of convolutional layers in CNNs?",
        options: ["To reduce image size", "To extract spatial features from images using learnable filters", "To classify images", "To normalize images"],
        correctAnswer: 1,
        explanation: "Convolutional layers apply learnable filters to detect patterns like edges, textures, and shapes at different levels of abstraction."
      },
      {
        question: "What does pooling do in a CNN?",
        options: ["Increases image resolution", "Reduces spatial dimensions while retaining important features", "Adds more layers", "Improves color accuracy"],
        correctAnswer: 1,
        explanation: "Pooling (like max pooling) downsamples feature maps, reducing computational cost and providing translation invariance."
      },
      {
        question: "What is the receptive field in a CNN?",
        options: ["The size of the input image", "The region of the input image that affects a particular neuron", "The number of filters", "The output size"],
        correctAnswer: 1,
        explanation: "The receptive field is the area of the input image that influences the activation of a particular neuron in deeper layers."
      },
      {
        question: "Why is padding used in convolutional layers?",
        options: ["To make images larger", "To preserve spatial dimensions and information at image borders", "To add more channels", "To speed up training"],
        correctAnswer: 1,
        explanation: "Padding adds pixels around the image border, allowing filters to process edge pixels properly and maintaining spatial dimensions."
      },
      {
        question: "What is the purpose of the fully connected layer at the end of a CNN?",
        options: ["To extract features", "To combine features and make final predictions", "To reduce overfitting", "To normalize outputs"],
        correctAnswer: 1,
        explanation: "Fully connected layers aggregate spatial features from convolutional layers and map them to output classes for classification."
      }
    ]
  },
  {
    moduleSlug: "cv-video-analysis",
    title: "CNN Architectures Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What innovation did AlexNet introduce?",
        options: ["Residual connections", "Successfully using deep CNNs with ReLU and dropout for ImageNet", "Inception modules", "Batch normalization"],
        correctAnswer: 1,
        explanation: "AlexNet (2012) demonstrated that deep CNNs with ReLU activation and dropout could achieve breakthrough performance on ImageNet classification."
      },
      {
        question: "What is the key innovation of ResNet?",
        options: ["Using more layers", "Skip connections (residual connections) that allow training very deep networks", "Smaller filters", "Faster training"],
        correctAnswer: 1,
        explanation: "ResNet introduced skip connections that add the input to the output of layers, solving the vanishing gradient problem in very deep networks."
      },
      {
        question: "What is an Inception module?",
        options: ["A type of pooling", "A module that applies multiple filter sizes in parallel", "A normalization technique", "A training algorithm"],
        correctAnswer: 1,
        explanation: "Inception modules apply 1×1, 3×3, and 5×5 convolutions in parallel, allowing the network to learn multi-scale features efficiently."
      },
      {
        question: "What makes MobileNet efficient for mobile devices?",
        options: ["Fewer layers", "Depthwise separable convolutions that reduce parameters and computation", "Smaller images", "Lower accuracy"],
        correctAnswer: 1,
        explanation: "MobileNet uses depthwise separable convolutions that split standard convolutions into depthwise and pointwise operations, dramatically reducing computation."
      }
    ]
  },
  {
    moduleSlug: "cv-object-detection",
    title: "Object Detection Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is the difference between image classification and object detection?",
        options: ["They are the same", "Classification identifies what's in an image; detection identifies what and where", "Detection is faster", "Classification is more accurate"],
        correctAnswer: 1,
        explanation: "Classification assigns labels to entire images, while object detection locates multiple objects with bounding boxes and classifies each one."
      },
      {
        question: "What is a bounding box in object detection?",
        options: ["A box around the entire image", "A rectangular box defined by coordinates that localizes an object", "A 3D box", "A circular region"],
        correctAnswer: 1,
        explanation: "A bounding box is a rectangle defined by coordinates (x, y, width, height) that indicates the location and size of a detected object."
      },
      {
        question: "What does IoU (Intersection over Union) measure?",
        options: ["Model accuracy", "The overlap between predicted and ground truth bounding boxes", "Training speed", "Number of objects"],
        correctAnswer: 1,
        explanation: "IoU measures the overlap between predicted and ground truth boxes, calculated as the area of intersection divided by the area of union."
      },
      {
        question: "What is the main difference between one-stage and two-stage detectors?",
        options: ["Number of classes", "One-stage detects objects directly; two-stage first proposes regions then classifies", "Training time", "Accuracy"],
        correctAnswer: 1,
        explanation: "Two-stage detectors (like R-CNN) first generate region proposals then classify them, while one-stage detectors (like YOLO) predict directly from the image."
      },
      {
        question: "What does YOLO stand for?",
        options: ["You Only Learn Once", "You Only Look Once", "Your Object Location Output", "Yielding Object Location Optimization"],
        correctAnswer: 1,
        explanation: "YOLO (You Only Look Once) is a real-time object detection system that processes the entire image in a single forward pass."
      }
    ]
  },
  {
    moduleSlug: "cv-segmentation",
    title: "Image Segmentation Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is semantic segmentation?",
        options: ["Detecting objects", "Classifying each pixel into a category", "Finding edges", "Counting objects"],
        correctAnswer: 1,
        explanation: "Semantic segmentation assigns a class label to every pixel in an image, creating a pixel-wise classification map."
      },
      {
        question: "What is the difference between semantic and instance segmentation?",
        options: ["They are the same", "Instance segmentation distinguishes between different objects of the same class", "Semantic is more accurate", "Instance is faster"],
        correctAnswer: 1,
        explanation: "Semantic segmentation treats all objects of the same class as one, while instance segmentation identifies and separates individual object instances."
      },
      {
        question: "What is the U-Net architecture known for?",
        options: ["Object detection", "Medical image segmentation with encoder-decoder structure and skip connections", "Image classification", "Face recognition"],
        correctAnswer: 1,
        explanation: "U-Net uses an encoder-decoder architecture with skip connections that combine low-level and high-level features, excelling at medical image segmentation."
      },
      {
        question: "What is the purpose of skip connections in U-Net?",
        options: ["To speed up training", "To preserve spatial information from encoder to decoder", "To reduce parameters", "To add more layers"],
        correctAnswer: 1,
        explanation: "Skip connections concatenate encoder features with decoder features, helping preserve fine-grained spatial details lost during downsampling."
      }
    ]
  },
  {
    moduleSlug: "cv-generative",
    title: "Computer Vision Applications Quiz",
    passingScore: 60,
    questions: [
      {
        question: "What is face recognition?",
        options: ["Detecting if a face is present", "Identifying whose face it is from a database", "Detecting facial features", "Counting faces"],
        correctAnswer: 1,
        explanation: "Face recognition identifies or verifies a person's identity by comparing facial features against a database of known faces."
      },
      {
        question: "What is optical character recognition (OCR)?",
        options: ["Recognizing objects", "Converting images of text into machine-readable text", "Detecting colors", "Measuring image quality"],
        correctAnswer: 1,
        explanation: "OCR technology extracts text from images or scanned documents, converting it into editable and searchable digital text."
      },
      {
        question: "What is image captioning?",
        options: ["Adding text to images", "Automatically generating textual descriptions of image content", "Labeling objects", "Translating image text"],
        correctAnswer: 1,
        explanation: "Image captioning combines computer vision and NLP to generate natural language descriptions of what's happening in an image."
      },
      {
        question: "What is style transfer in computer vision?",
        options: ["Changing image format", "Applying the artistic style of one image to the content of another", "Transferring images between devices", "Converting color schemes"],
        correctAnswer: 1,
        explanation: "Style transfer uses neural networks to apply the artistic style of one image (like a painting) to the content of another photograph."
      },
      {
        question: "What is pose estimation?",
        options: ["Estimating image size", "Detecting and tracking body joint positions", "Guessing camera position", "Measuring object distance"],
        correctAnswer: 1,
        explanation: "Pose estimation detects and tracks the positions of body joints and keypoints, enabling applications like motion capture and gesture recognition."
      }
    ]
  }
];

async function seedQuizzes() {
  console.log("Starting NLP and CV quiz seeding...");
  
  const allQuizData = [...nlpQuizData, ...cvQuizData];
  
  for (const quizData of allQuizData) {
    console.log(`\nProcessing quiz for module: ${quizData.moduleSlug}`);
    
    // Get module by slug
    const moduleResults = await db.select().from(modules).where(eq(modules.slug, quizData.moduleSlug)).limit(1);
    
    if (moduleResults.length === 0) {
      console.log(`  ⚠️  Module not found: ${quizData.moduleSlug}`);
      continue;
    }
    
    const module = moduleResults[0];
    console.log(`  ✓ Found module: ${module.title} (ID: ${module.id})`);
    
    // Check if quiz already exists
    const existingQuiz = await db.select().from(quizzes).where(eq(quizzes.moduleId, module.id)).limit(1);
    
    if (existingQuiz.length > 0) {
      console.log(`  ⚠️  Quiz already exists for this module, skipping...`);
      continue;
    }
    
    // Create quiz
    const quizResult = await db.insert(quizzes).values({
      moduleId: module.id,
      title: quizData.title,
      passingScore: quizData.passingScore,
    });
    
    const quizId = Number(quizResult[0].insertId);
    console.log(`  ✓ Created quiz (ID: ${quizId})`);
    
    // Create questions
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      await db.insert(quizQuestions).values({
        quizId: quizId,
        question: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        order: i + 1,
      });
    }
    
    console.log(`  ✓ Created ${quizData.questions.length} questions`);
  }
  
  console.log("\n✅ Quiz seeding completed!");
}

seedQuizzes().catch(console.error);
