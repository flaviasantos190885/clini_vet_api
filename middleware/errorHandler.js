const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Erro de validação do Supabase
  if (err.code && err.message) {
    return res.status(400).json({
      sucesso: false,
      erro: err.message,
      codigo: err.code
    });
  }

  // Erro genérico
  res.status(500).json({
    sucesso: false,
    erro: 'Erro interno do servidor',
    mensagem: 'Algo deu errado. Tente novamente mais tarde.'
  });
};

module.exports = errorHandler;