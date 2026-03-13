import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to projects.json
const projectsPath = path.join(__dirname, 'src', 'data', 'projects.json');
const uploadsDir = path.join(__dirname, 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware to check admin password
const authMiddleware = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get projects
app.get('/api/projects', (req, res) => {
  try {
    const data = fs.readFileSync(projectsPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects data' });
  }
});

// Update projects
app.post('/api/projects', authMiddleware, (req, res) => {
  try {
    const projects = req.body;
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    res.json({ message: 'Projects updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save projects data' });
  }
});

// Upload image
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
