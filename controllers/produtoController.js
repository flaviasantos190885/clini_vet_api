const supabase = require('../config/supabase');

class ProdutoController {
  // ... (métodos listar, buscarPorId, criar, atualizar, excluir - sem mudanças)

  // Listar produtos com estoque baixo (ou abaixo de um limite)
  async listarEstoqueBaixo(req, res) {
    try {
      // 1. Pegar o parâmetro 'limite_estoque' da query
      // Mudei o nome para 'limite_estoque' para evitar confusão com a coluna 'estoque_minimo'
      const { limite_estoque } = req.query; 

      // 2. Validação: O limite_estoque deve ser um número e ser fornecido
      if (!limite_estoque || isNaN(Number(limite_estoque))) {
        return res.status(400).json({ erro: 'O parâmetro limite_estoque deve ser um número válido.' });
      }

      const limiteNumerico = Number(limite_estoque); // Converte para número

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        // 3. Usar .lte() para comparar 'estoque_atual' com o limite_estoque numérico
        .lte('estoque_atual', limiteNumerico) // Agora compara com o número enviado
        .order('nome');

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.json({
        sucesso: true,
        dados: data,
        total: data.length
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ProdutoController();