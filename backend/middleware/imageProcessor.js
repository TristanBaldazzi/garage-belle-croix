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
    
    // Redimensionner et convertir en JPEG optimisé.
    // Traitement en mémoire : pour un .jpg, l'entrée et la sortie ont le même nom
    // (sharp refuse d'écrire directement dans le fichier qu'il lit).
    const buffer = await sharp(filePath)
      .rotate() // applique l'orientation EXIF des photos d'appareil / téléphone
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(outputPath, buffer);

    // Supprimer l'original s'il avait une autre extension (.png, .webp, .jpeg)
    if (filePath !== outputPath) {
      fs.unlinkSync(filePath);
    }
    
    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

