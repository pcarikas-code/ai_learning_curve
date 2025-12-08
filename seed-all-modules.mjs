import { drizzle } from "drizzle-orm/mysql2";
import { learningPaths, modules } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedAllModules() {
  console.log("Starting to seed all learning path modules...");

  // Get all learning paths
  const paths = await db.select().from(learningPaths);
  
  const mlPath = paths.find(p => p.slug === "machine-learning");
  const dlPath = paths.find(p => p.slug === "deep-learning");
  const nlpPath = paths.find(p => p.slug === "nlp");
  const cvPath = paths.find(p => p.slug === "computer-vision");

  // Machine Learning Modules
  if (mlPath) {
    console.log("Adding Machine Learning modules...");
    const mlModules = [
      {
        pathId: mlPath.id,
        title: "Introduction to Machine Learning",
        slug: "ml-introduction",
        description: "Understanding the fundamentals of machine learning, types of learning, and real-world applications.",
        content: "# Introduction to Machine Learning\n\nMachine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.\n\n## Key Concepts\n- Supervised Learning\n- Unsupervised Learning\n- Reinforcement Learning\n- Training and Testing Data\n- Model Evaluation",
        order: 1,
        estimatedMinutes: 45,
        difficulty: "beginner",
        objectives: JSON.stringify(["Understand what machine learning is", "Learn different types of ML", "Identify real-world applications"]),
        prerequisites: JSON.stringify(["Basic programming knowledge", "Understanding of AI fundamentals"]),
        published: true,
      },
      {
        pathId: mlPath.id,
        title: "Data Preprocessing and Feature Engineering",
        slug: "ml-data-preprocessing",
        description: "Learn how to prepare and transform data for machine learning models.",
        content: "# Data Preprocessing\n\nData preprocessing is a crucial step in the machine learning pipeline.\n\n## Topics Covered\n- Data Cleaning\n- Handling Missing Values\n- Feature Scaling\n- Feature Selection\n- Encoding Categorical Variables",
        order: 2,
        estimatedMinutes: 60,
        difficulty: "beginner",
        objectives: JSON.stringify(["Clean and prepare data", "Handle missing values", "Scale features appropriately"]),
        prerequisites: JSON.stringify(["Introduction to Machine Learning"]),
        published: true,
      },
      {
        pathId: mlPath.id,
        title: "Supervised Learning: Regression",
        slug: "ml-regression",
        description: "Master regression algorithms for predicting continuous values.",
        content: "# Regression Algorithms\n\nRegression is used to predict continuous numerical values.\n\n## Algorithms\n- Linear Regression\n- Polynomial Regression\n- Ridge and Lasso Regression\n- Support Vector Regression",
        order: 3,
        estimatedMinutes: 75,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Implement regression models", "Evaluate model performance", "Handle overfitting"]),
        prerequisites: JSON.stringify(["Data Preprocessing"]),
        published: true,
      },
      {
        pathId: mlPath.id,
        title: "Supervised Learning: Classification",
        slug: "ml-classification",
        description: "Learn classification algorithms for categorical predictions.",
        content: "# Classification Algorithms\n\nClassification predicts categorical labels.\n\n## Algorithms\n- Logistic Regression\n- Decision Trees\n- Random Forests\n- Support Vector Machines\n- K-Nearest Neighbors",
        order: 4,
        estimatedMinutes: 75,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Build classification models", "Compare algorithms", "Optimize hyperparameters"]),
        prerequisites: JSON.stringify(["Regression"]),
        published: true,
      },
      {
        pathId: mlPath.id,
        title: "Unsupervised Learning",
        slug: "ml-unsupervised",
        description: "Explore clustering and dimensionality reduction techniques.",
        content: "# Unsupervised Learning\n\nLearn from unlabeled data.\n\n## Techniques\n- K-Means Clustering\n- Hierarchical Clustering\n- PCA (Principal Component Analysis)\n- t-SNE\n- DBSCAN",
        order: 5,
        estimatedMinutes: 60,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Perform clustering", "Reduce dimensionality", "Discover patterns"]),
        prerequisites: JSON.stringify(["Classification"]),
        published: true,
      },
      {
        pathId: mlPath.id,
        title: "Model Evaluation and Validation",
        slug: "ml-evaluation",
        description: "Learn techniques to evaluate and validate machine learning models.",
        content: "# Model Evaluation\n\nEvaluate model performance properly.\n\n## Topics\n- Cross-Validation\n- Confusion Matrix\n- Precision, Recall, F1-Score\n- ROC Curves\n- Bias-Variance Tradeoff",
        order: 6,
        estimatedMinutes: 50,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Evaluate models correctly", "Use cross-validation", "Interpret metrics"]),
        prerequisites: JSON.stringify(["Classification", "Regression"]),
        published: true,
      },
      {
        pathId: mlPath.id,
        title: "Ensemble Methods",
        slug: "ml-ensemble",
        description: "Master ensemble techniques for improved predictions.",
        content: "# Ensemble Methods\n\nCombine multiple models for better performance.\n\n## Methods\n- Bagging\n- Boosting (AdaBoost, Gradient Boosting)\n- XGBoost\n- Stacking",
        order: 7,
        estimatedMinutes: 65,
        difficulty: "advanced",
        objectives: JSON.stringify(["Implement ensemble methods", "Understand boosting vs bagging", "Use XGBoost"]),
        prerequisites: JSON.stringify(["Classification", "Model Evaluation"]),
        published: true,
      },
    ];

    await db.insert(modules).values(mlModules);
    console.log(`Added ${mlModules.length} Machine Learning modules`);
  }

  // Deep Learning Modules
  if (dlPath) {
    console.log("Adding Deep Learning modules...");
    const dlModules = [
      {
        pathId: dlPath.id,
        title: "Introduction to Neural Networks",
        slug: "dl-neural-networks-intro",
        description: "Understand the fundamentals of artificial neural networks.",
        content: "# Neural Networks Basics\n\nNeural networks are the foundation of deep learning.\n\n## Topics\n- Perceptrons\n- Activation Functions\n- Forward Propagation\n- Backpropagation\n- Gradient Descent",
        order: 1,
        estimatedMinutes: 60,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Understand neural network architecture", "Learn forward and backward propagation", "Implement basic networks"]),
        prerequisites: JSON.stringify(["Machine Learning fundamentals"]),
        published: true,
      },
      {
        pathId: dlPath.id,
        title: "Deep Neural Networks",
        slug: "dl-deep-networks",
        description: "Build and train deep neural networks with multiple layers.",
        content: "# Deep Neural Networks\n\nGo deeper with multiple hidden layers.\n\n## Topics\n- Deep Architectures\n- Vanishing Gradient Problem\n- Batch Normalization\n- Dropout\n- Weight Initialization",
        order: 2,
        estimatedMinutes: 70,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Build deep networks", "Handle vanishing gradients", "Apply regularization"]),
        prerequisites: JSON.stringify(["Neural Networks Introduction"]),
        published: true,
      },
      {
        pathId: dlPath.id,
        title: "Convolutional Neural Networks (CNNs)",
        slug: "dl-cnns",
        description: "Master CNNs for image processing and computer vision tasks.",
        content: "# Convolutional Neural Networks\n\nSpecialized networks for image data.\n\n## Topics\n- Convolution Operations\n- Pooling Layers\n- CNN Architectures (LeNet, AlexNet, VGG, ResNet)\n- Transfer Learning",
        order: 3,
        estimatedMinutes: 80,
        difficulty: "advanced",
        objectives: JSON.stringify(["Understand convolutions", "Build CNN architectures", "Apply transfer learning"]),
        prerequisites: JSON.stringify(["Deep Neural Networks"]),
        published: true,
      },
      {
        pathId: dlPath.id,
        title: "Recurrent Neural Networks (RNNs)",
        slug: "dl-rnns",
        description: "Learn RNNs for sequential data and time series.",
        content: "# Recurrent Neural Networks\n\nNetworks for sequential data.\n\n## Topics\n- RNN Architecture\n- LSTM (Long Short-Term Memory)\n- GRU (Gated Recurrent Units)\n- Bidirectional RNNs\n- Sequence-to-Sequence Models",
        order: 4,
        estimatedMinutes: 75,
        difficulty: "advanced",
        objectives: JSON.stringify(["Build RNN models", "Implement LSTM and GRU", "Handle sequential data"]),
        prerequisites: JSON.stringify(["Deep Neural Networks"]),
        published: true,
      },
      {
        pathId: dlPath.id,
        title: "Transformers and Attention Mechanisms",
        slug: "dl-transformers",
        description: "Understand modern transformer architectures.",
        content: "# Transformers\n\nState-of-the-art architecture for many tasks.\n\n## Topics\n- Self-Attention\n- Multi-Head Attention\n- Transformer Architecture\n- BERT, GPT\n- Vision Transformers",
        order: 5,
        estimatedMinutes: 90,
        difficulty: "advanced",
        objectives: JSON.stringify(["Understand attention mechanisms", "Implement transformers", "Use pre-trained models"]),
        prerequisites: JSON.stringify(["RNNs"]),
        published: true,
      },
      {
        pathId: dlPath.id,
        title: "Generative Models",
        slug: "dl-generative",
        description: "Learn to generate new data with GANs and VAEs.",
        content: "# Generative Models\n\nCreate new data samples.\n\n## Topics\n- Autoencoders\n- Variational Autoencoders (VAEs)\n- Generative Adversarial Networks (GANs)\n- Diffusion Models",
        order: 6,
        estimatedMinutes: 85,
        difficulty: "advanced",
        objectives: JSON.stringify(["Build generative models", "Train GANs", "Generate synthetic data"]),
        prerequisites: JSON.stringify(["CNNs", "Deep Networks"]),
        published: true,
      },
      {
        pathId: dlPath.id,
        title: "Deep Learning Optimization",
        slug: "dl-optimization",
        description: "Advanced techniques for training deep networks.",
        content: "# Optimization Techniques\n\nImprove training efficiency and performance.\n\n## Topics\n- Advanced Optimizers (Adam, RMSprop)\n- Learning Rate Scheduling\n- Gradient Clipping\n- Mixed Precision Training\n- Distributed Training",
        order: 7,
        estimatedMinutes: 60,
        difficulty: "advanced",
        objectives: JSON.stringify(["Optimize training", "Use advanced optimizers", "Scale training"]),
        prerequisites: JSON.stringify(["Deep Networks"]),
        published: true,
      },
    ];

    await db.insert(modules).values(dlModules);
    console.log(`Added ${dlModules.length} Deep Learning modules`);
  }

  // Natural Language Processing Modules
  if (nlpPath) {
    console.log("Adding NLP modules...");
    const nlpModules = [
      {
        pathId: nlpPath.id,
        title: "NLP Fundamentals",
        slug: "nlp-fundamentals",
        description: "Introduction to natural language processing concepts.",
        content: "# NLP Fundamentals\n\nProcess and understand human language.\n\n## Topics\n- Text Preprocessing\n- Tokenization\n- Stemming and Lemmatization\n- Stop Words\n- Regular Expressions",
        order: 1,
        estimatedMinutes: 50,
        difficulty: "beginner",
        objectives: JSON.stringify(["Preprocess text data", "Tokenize text", "Clean text"]),
        prerequisites: JSON.stringify(["Python programming", "Basic ML"]),
        published: true,
      },
      {
        pathId: nlpPath.id,
        title: "Text Representation",
        slug: "nlp-text-representation",
        description: "Learn different methods to represent text as numbers.",
        content: "# Text Representation\n\nConvert text to numerical format.\n\n## Methods\n- Bag of Words\n- TF-IDF\n- Word Embeddings (Word2Vec, GloVe)\n- FastText",
        order: 2,
        estimatedMinutes: 60,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Create text representations", "Use word embeddings", "Compare methods"]),
        prerequisites: JSON.stringify(["NLP Fundamentals"]),
        published: true,
      },
      {
        pathId: nlpPath.id,
        title: "Language Models",
        slug: "nlp-language-models",
        description: "Build and use language models for text generation.",
        content: "# Language Models\n\nModel probability of word sequences.\n\n## Topics\n- N-gram Models\n- Neural Language Models\n- Transformer Language Models\n- GPT, BERT\n- Fine-tuning",
        order: 3,
        estimatedMinutes: 75,
        difficulty: "advanced",
        objectives: JSON.stringify(["Build language models", "Use pre-trained models", "Fine-tune for tasks"]),
        prerequisites: JSON.stringify(["Text Representation", "Transformers"]),
        published: true,
      },
      {
        pathId: nlpPath.id,
        title: "Text Classification",
        slug: "nlp-classification",
        description: "Classify text into categories (sentiment, topic, etc.).",
        content: "# Text Classification\n\nCategorize text documents.\n\n## Applications\n- Sentiment Analysis\n- Spam Detection\n- Topic Classification\n- Intent Recognition",
        order: 4,
        estimatedMinutes: 65,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Build text classifiers", "Perform sentiment analysis", "Evaluate performance"]),
        prerequisites: JSON.stringify(["Text Representation"]),
        published: true,
      },
      {
        pathId: nlpPath.id,
        title: "Named Entity Recognition",
        slug: "nlp-ner",
        description: "Extract entities like names, locations, and organizations.",
        content: "# Named Entity Recognition\n\nIdentify and classify named entities.\n\n## Topics\n- Entity Types\n- Sequence Labeling\n- CRF and BiLSTM-CRF\n- Transformer-based NER",
        order: 5,
        estimatedMinutes: 60,
        difficulty: "advanced",
        objectives: JSON.stringify(["Implement NER systems", "Extract entities", "Use pre-trained models"]),
        prerequisites: JSON.stringify(["Language Models"]),
        published: true,
      },
      {
        pathId: nlpPath.id,
        title: "Machine Translation",
        slug: "nlp-translation",
        description: "Build systems to translate between languages.",
        content: "# Machine Translation\n\nTranslate text between languages.\n\n## Topics\n- Sequence-to-Sequence Models\n- Attention Mechanisms\n- Transformer Translation\n- Evaluation Metrics (BLEU)",
        order: 6,
        estimatedMinutes: 70,
        difficulty: "advanced",
        objectives: JSON.stringify(["Build translation models", "Use attention", "Evaluate translations"]),
        prerequisites: JSON.stringify(["Language Models", "Transformers"]),
        published: true,
      },
      {
        pathId: nlpPath.id,
        title: "Question Answering and Chatbots",
        slug: "nlp-qa-chatbots",
        description: "Create systems that answer questions and converse.",
        content: "# Question Answering\n\nBuild intelligent QA systems.\n\n## Topics\n- Extractive QA\n- Generative QA\n- Dialogue Systems\n- Retrieval-Augmented Generation",
        order: 7,
        estimatedMinutes: 80,
        difficulty: "advanced",
        objectives: JSON.stringify(["Build QA systems", "Create chatbots", "Implement RAG"]),
        prerequisites: JSON.stringify(["Language Models", "NER"]),
        published: true,
      },
    ];

    await db.insert(modules).values(nlpModules);
    console.log(`Added ${nlpModules.length} NLP modules`);
  }

  // Computer Vision Modules
  if (cvPath) {
    console.log("Adding Computer Vision modules...");
    const cvModules = [
      {
        pathId: cvPath.id,
        title: "Computer Vision Fundamentals",
        slug: "cv-fundamentals",
        description: "Introduction to computer vision and image processing.",
        content: "# Computer Vision Basics\n\nTeach computers to see and understand images.\n\n## Topics\n- Image Representation\n- Color Spaces\n- Image Filtering\n- Edge Detection\n- Feature Extraction",
        order: 1,
        estimatedMinutes: 55,
        difficulty: "beginner",
        objectives: JSON.stringify(["Understand images", "Apply filters", "Detect edges"]),
        prerequisites: JSON.stringify(["Python programming", "Basic ML"]),
        published: true,
      },
      {
        pathId: cvPath.id,
        title: "Image Classification with CNNs",
        slug: "cv-classification",
        description: "Classify images using convolutional neural networks.",
        content: "# Image Classification\n\nCategorize images into classes.\n\n## Topics\n- CNN Architectures\n- Transfer Learning\n- Data Augmentation\n- Fine-tuning\n- Model Deployment",
        order: 2,
        estimatedMinutes: 70,
        difficulty: "intermediate",
        objectives: JSON.stringify(["Build image classifiers", "Use transfer learning", "Augment data"]),
        prerequisites: JSON.stringify(["CV Fundamentals", "CNNs"]),
        published: true,
      },
      {
        pathId: cvPath.id,
        title: "Object Detection",
        slug: "cv-object-detection",
        description: "Detect and localize objects in images.",
        content: "# Object Detection\n\nFind objects and their locations.\n\n## Algorithms\n- R-CNN Family\n- YOLO (You Only Look Once)\n- SSD (Single Shot Detector)\n- RetinaNet\n- EfficientDet",
        order: 3,
        estimatedMinutes: 80,
        difficulty: "advanced",
        objectives: JSON.stringify(["Implement object detection", "Use YOLO", "Evaluate detectors"]),
        prerequisites: JSON.stringify(["Image Classification"]),
        published: true,
      },
      {
        pathId: cvPath.id,
        title: "Image Segmentation",
        slug: "cv-segmentation",
        description: "Segment images at pixel level for detailed understanding.",
        content: "# Image Segmentation\n\nClassify every pixel in an image.\n\n## Types\n- Semantic Segmentation\n- Instance Segmentation\n- Panoptic Segmentation\n- U-Net, Mask R-CNN\n- DeepLab",
        order: 4,
        estimatedMinutes: 75,
        difficulty: "advanced",
        objectives: JSON.stringify(["Perform segmentation", "Use U-Net", "Segment instances"]),
        prerequisites: JSON.stringify(["Object Detection"]),
        published: true,
      },
      {
        pathId: cvPath.id,
        title: "Face Recognition and Analysis",
        slug: "cv-face-recognition",
        description: "Detect, recognize, and analyze faces in images.",
        content: "# Face Recognition\n\nIdentify and verify faces.\n\n## Topics\n- Face Detection\n- Face Alignment\n- Face Recognition\n- Facial Landmarks\n- Emotion Recognition",
        order: 5,
        estimatedMinutes: 65,
        difficulty: "advanced",
        objectives: JSON.stringify(["Detect faces", "Recognize individuals", "Analyze emotions"]),
        prerequisites: JSON.stringify(["Object Detection"]),
        published: true,
      },
      {
        pathId: cvPath.id,
        title: "Video Analysis",
        slug: "cv-video-analysis",
        description: "Process and understand video data.",
        content: "# Video Analysis\n\nExtend CV to temporal dimension.\n\n## Topics\n- Action Recognition\n- Object Tracking\n- Video Classification\n- Optical Flow\n- 3D CNNs",
        order: 6,
        estimatedMinutes: 70,
        difficulty: "advanced",
        objectives: JSON.stringify(["Analyze videos", "Track objects", "Recognize actions"]),
        prerequisites: JSON.stringify(["Object Detection", "Segmentation"]),
        published: true,
      },
      {
        pathId: cvPath.id,
        title: "Generative Computer Vision",
        slug: "cv-generative",
        description: "Generate and manipulate images with AI.",
        content: "# Generative CV\n\nCreate and edit images.\n\n## Topics\n- Image Generation (GANs)\n- Style Transfer\n- Image-to-Image Translation\n- Super Resolution\n- Stable Diffusion",
        order: 7,
        estimatedMinutes: 85,
        difficulty: "advanced",
        objectives: JSON.stringify(["Generate images", "Transfer styles", "Enhance resolution"]),
        prerequisites: JSON.stringify(["GANs", "Image Classification"]),
        published: true,
      },
    ];

    await db.insert(modules).values(cvModules);
    console.log(`Added ${cvModules.length} Computer Vision modules`);
  }

  console.log("All modules seeded successfully!");
}

seedAllModules()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding modules:", error);
    process.exit(1);
  });
