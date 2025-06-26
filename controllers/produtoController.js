const supabase = require('../config/supabase');

class ProdutoController {
  // Listar todos os produtos
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
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

  // Buscar produto por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id_produto', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo produto
  async criar(req, res) {
    try {
      const { 
        nome, 
        descricao, 
        preco_venda, 
        unidade_medida, 
        estoque_atual, 
        estoque_minimo 
      } = req.body;

      // Validação básica
      if (!nome || !preco_venda) {
        return res.status(400).json({ erro: 'Nome e preço de venda são obrigatórios' });
      }

      const dadosProduto = {
        nome,
        descricao,
        preco_venda,
        unidade_medida,
        estoque_atual: estoque_atual || 0,
        estoque_minimo: estoque_minimo || 0,
        data_cadastro: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('produtos')
        .insert([dadosProduto])
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Produto criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar produto
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        nome, 
        descricao, 
        preco_venda, 
        unidade_medida, 
        estoque_atual, 
        estoque_minimo 
      } = req.body;

      const dadosAtualizacao = {
        nome,
        descricao,
        preco_venda,
        unidade_medida,
        estoque_atual,
        estoque_minimo,
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('produtos')
        .update(dadosAtualizacao)
        .eq('id_produto', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir produto (soft delete)
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('produtos')
        .update({ ativo: false, data_atualizacao: new Date().toISOString() })
        .eq('id_produto', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      res.json({
        sucesso: true,
        mensagem: 'Produto excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Listar produtos com estoque baixo
  async listarEstoqueBaixo(req, res) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .filter('estoque_atual', 'lte', 'estoque_minimo')
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