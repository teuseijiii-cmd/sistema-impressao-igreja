
ARQUIVO: 25. backend/start.sh<br/>
CAMINHO: backend/start.sh<br/>
DESCRIÇÃO: Script de inicialização do backend

#!/bin/bash

# Verificar se as variáveis de ambiente necessárias existem
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias."
  exit 1
fi

# Executar migrações do banco de dados (se houver)
# npx prisma migrate deploy

# Iniciar servidor
npm start
