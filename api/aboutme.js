import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'aboutme.html');
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(htmlContent);
    } catch (error) {
        res.status(404).json({ error: 'File not found' });
    }
}