require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança e logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Bem-vindo à API da Clínica Veterinária Bem Estar Animal',
    versao: '1.0.0',
    documentacao: {
      clientes: '/api/clientes',
      animais: '/api/animais',
      prontuarios: '/api/prontuarios',
      agendamentos: '/api/agendamentos',
      produtos: '/api/produtos',
      status: '/api/status'
    },
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    erro: 'Rota não encontrada',
    mensagem: `A rota ${req.originalUrl} não existe nesta API`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}`);
  console.log(`📖 Documentação em http://localhost:${PORT}/api/status`);
});

module.exports = app;