require('dotenv').config();

const veterinarioRoutes = require('./routes/veterinarioRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vacinaRoutes = require('./routes/vacinaRoutes');
const prescricaoRoutes = require('./routes/prescricaoRoutes');
const faturaRoutes = require('./routes/faturaRoutes');
const itemFaturaRoutes = require('./routes/itemFaturaRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const atendimentoFaturaRoutes = require('./routes/atendimentoFaturaRoutes');
const loteProdutoRoutes = require('./routes/loteProdutoRoutes');
const movimentacaoEstoqueRoutes = require('./routes/movimentacaoEstoqueRoutes');
const anexoProntuarioRoutes = require('./routes/anexoProntuarioRoutes');

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
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vacinas', vacinaRoutes);
app.use('/api/prescricoes', prescricaoRoutes);
app.use('/api/faturas', faturaRoutes);
app.use('/api/itens-fatura', itemFaturaRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/atendimento-fatura', atendimentoFaturaRoutes);
app.use('/api/lotes-produto', loteProdutoRoutes);
app.use('/api/movimentacao-estoque', movimentacaoEstoqueRoutes);
app.use('/api/anexos-prontuario', anexoProntuarioRoutes);


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
      status: '/api/status',
      veterinarios: '/api/veterinarios',
      usuarios: '/api/usuarios',
      vacinas: '/api/vacinas',
      prescricoes: '/api/prescricoes',
      faturas: '/api/faturas',
      'itens-fatura': '/api/itens-fatura', // Note o uso de aspas por causa do hífen
      pagamentos: '/api/pagamentos',
      'atendimento-fatura': '/api/atendimento-fatura', // Aspas pelo hífen
      'lotes-produto': '/api/lotes-produto',           // Aspas pelo hífen
      'movimentacao-estoque': '/api/movimentacao-estoque', // Aspas pelo hífen
      'anexos-prontuario': '/api/anexos-prontuario'     // Aspas pelo hífen

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