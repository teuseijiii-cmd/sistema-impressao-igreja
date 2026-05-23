import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

export class GoogleDriveService {
  private drive: any;
  private auth: OAuth2Client;

  constructor() {
    this.auth = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async listFiles(folderId: string): Promise<any[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime)',
        orderBy: 'modifiedTime desc'
      });
      return response.data.files;
    } catch (error) {
      console.error('Erro ao listar arquivos do Drive:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string, destination: string): Promise<string> {
    try {
      const destPath = path.resolve(destination);
      const dest = fs.createWriteStream(destPath);
      
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      return new Promise((resolve, reject) => {
        response.data
          .on('end', () => resolve(destPath))
          .on('error', reject)
          .pipe(dest);
      });
    } catch (error) {
      console.error('Erro ao baixar arquivo do Drive:', error);
      throw error;
    }
  }

  async uploadFile(filePath: string, folderId: string): Promise<any> {
    try {
      const fileMetadata = {
        name: path.basename(filePath),
        parents: [folderId]
      };

      const media = {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(filePath)
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, mimeType, size'
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload no Drive:', error);
      throw error;
    }
  }

  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : []
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Erro ao criar pasta no Drive:', error);
      throw error;
    }
  }

  async getFolderContents(folderId: string): Promise<any[]> {
    return this.listFiles(folderId);
  }

  async watchFolder(folderId: string): Promise<void> {
    // Implementar webhook para detectar novos arquivos
    console.log(`Observando pasta ${folderId}`);
  }
}

export const googleDriveService = new GoogleDriveService();
