
ARQUIVO: 11. backend/src/services/printerService.ts<br/>
CAMINHO: backend/src/services/printerService.ts<br/>
DESCRIÇÃO: Serviço de impressão automática

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

interface PrintOptions {
  color: boolean;<br/>
  duplex: boolean;<br/>
  copies: number;<br/>
  paperSize?: string;
}

export class PrinterService {
  private printerName: string;

  constructor() {
    this.printerName = process.env.PRINTER_NAME || 'DEFAULT';
  }

  async printFile(filePath: string, options: PrintOptions): Promise<boolean> {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Arquivo não encontrado: ${absolutePath}`);
    }

    // Comando CUPS (Linux) ou powershell (Windows)
    const command = process.platform === 'win32'
      ? this.buildWindowsCommand(absolutePath, options)
      : this.buildLinuxCommand(absolutePath, options);

    try {
      const { stdout, stderr } = await execPromise(command);
      console.log(`Impressão enviada: ${stdout}`);<br/>
      if (stderr) console.warn(`Aviso na impressão: ${stderr}`);
      return true;
    } catch (error) {
      console.error(`Erro ao imprimir: ${error}`);
      throw error;
    }
  }

  private buildWindowsCommand(filePath: string, options: PrintOptions): string {<br/>
    const colorArg = options.color ? '' : '/grayscale';<br/>
    const duplexArg = options.duplex ? '/duplex' : '/simplex';
    const copiesArg = `/copies ${options.copies}`;
    return `powershell -Command "Start-Process -FilePath '${filePath}' -Verb Print -ArgumentList '${colorArg} ${duplexArg} ${copiesArg}'"`;
  }

  private buildLinuxCommand(filePath: string, options: PrintOptions): string {<br/>
    const colorArg = options.color ? '' : '-o ColorModel=Gray';<br/>
    const duplexArg = options.duplex ? '-o sides=two-sided-long-edge' : '-o sides=one-sided';
    const copiesArg = `-n ${options.copies}`;
    return `lp -d "${this.printerName}" ${colorArg} ${duplexArg} ${copiesArg} "${filePath}"`;
  }

  async getPrinterStatus(): Promise<string> {
    try {
      const { stdout } = await execPromise('lpstat -p');
      return stdout;
    } catch (error) {
      return 'Impressora não encontrada';
    }
  }

  async getAvailablePrinters(): Promise<string[]> {
    try {
      const { stdout } = await execPromise('lpstat -a');
      return stdout.split('
').filter(line => line.trim()).map(line => line.split(' ')[0]);
    } catch {
      return [];
    }
  }
}

export const printerService = new PrinterService();
