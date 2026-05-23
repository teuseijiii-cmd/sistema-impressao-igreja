# sistema-impressao-igreja
Sistema web para organização e impressão de tarefas da igreja

ARQUIVO: 28. README.md<br/>
CAMINHO: README.md (raiz do projeto)<br/>
DESCRIÇÃO: Documentação principal do projeto

# Sistema de Impressão de Tarefas da Igreja

Sistema web moderno para organização e impressão automática de tarefas da equipe de mídia/logística da igreja.

## Funcionalidades

- Login com Google
- Upload automático de múltiplos arquivos
- Classificação inteligente de documentos (IA)
- Organização visual por categorias
- Impressão automática com opções de personalização
- Integração com Google Drive
- Painel administrativo
- Modo escuro
- Notificações

## Tecnologias

- **Frontend:** React + TailwindCSS + Vite<br/>
- **Backend:** Node.js + Express + TypeScript<br/>
- **Banco de Dados:** Supabase (PostgreSQL)<br/>
- **IA:** Claude API (classificação de documentos)<br/>
- **Impressão:** CUPS / Windows Print

## Como usar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Google Cloud (para Google Drive)

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-impressao-igreja.git
cd sistema-impressao-igreja

# Instale dependências do backend
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Instale dependências do frontend
cd ../frontend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env

# Execute o backend
cd ../backend
npm run dev

# Em outro terminal, execute o frontend
cd ../frontend
npm run dev
