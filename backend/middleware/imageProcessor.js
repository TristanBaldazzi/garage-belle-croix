import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processImage = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath);
    const name = path.basename(filePath, ext);
    const outputPath = path.join(dir, name + '.jpg');
    
    // Redimensionner et convertir en JPEG optimisé
    await sharp(filePath)
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outputPath);
    
    // Supprimer l'original si ce n'est pas déjà un JPEG
    if (ext !== '.jpg' && ext !== '.jpeg') {
      fs.unlinkSync(filePath);
    } else if (filePath !== outputPath) {
      fs.unlinkSync(filePath);
    }
    
    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

