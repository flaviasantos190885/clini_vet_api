const supabase = require('../config/supabase');

class LoteProdutoController {
  // Listar todos os lotes de produto
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('lotes_produto')
        .select(`
          *,
          produtos:id_produto (
            id_produto,
            nome,
            descricao,
            unidade_medida
          )
        `)
        .order('data_entrada', { ascending: false });

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

  // Buscar lote de produto por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('lotes_produto')
        .select(`
          *,
          produtos:id_produto (
            id_produto,
            nome,
            descricao,
            unidade_medida
          )
        `)
        .eq('id_lote', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Lote de produto não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo lote de produto
  async criar(req, res) {
    try {
      const { 
        id_produto, 
        numero_lote, 
        data_validade, 
        quantidade_inicial, 
        quantidade_disponivel // Pode ser igual a quantidade_inicial no POST
      } = req.body; 

      if (!id_produto || !numero_lote || !quantidade_inicial) {
        return res.status(400).json({ erro: 'ID do produto, número do lote e quantidade inicial são obrigatórios' });
      }

      const dadosLote = {
        id_produto,
        numero_lote,
        data_validade,
        quantidade_inicial,
        quantidade_disponivel: quantidade_disponivel !== undefined ? quantidade_disponivel : quantidade_inicial,
        data_entrada: new Date().toISOString(), // Gerado automaticamente
      };

      const { data, error } = await supabase
        .from('lotes_produto')
        .insert([dadosLote])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Lote de produto criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar lote de produto
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        numero_lote, 
        data_validade, 
        quantidade_inicial, 
        quantidade_disponivel 
      } = req.body; 

      const dadosAtualizacao = {
        numero_lote,
        data_validade,
        quantidade_inicial,
        quantidade_disponivel,
      };

      const { data, error } = await supabase
        .from('lotes_produto')
        .update(dadosAtualizacao)
        .eq('id_lote', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Lote de produto não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Lote de produto atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir lote de produto
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('lotes_produto')
        .delete()
        .eq('id_lote', id);

      if (error) {
        // Pode haver movimentacoes_estoque vinculadas
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Lote de produto excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new LoteProdutoController();