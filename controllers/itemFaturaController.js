const supabase = require('../config/supabase');

class ItemFaturaController {
  // Listar todos os itens de fatura
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('itens_fatura')
        .select(`
          *,
          faturas:id_fatura (
            id_fatura,
            valor_total,
            status_fatura
          ),
          produtos:id_produto (
            id_produto,
            nome,
            preco_venda
          )
        `)
        .order('id_item_fatura'); // Ou outra coluna para ordenação

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

  // Buscar item de fatura por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('itens_fatura')
        .select(`
          *,
          faturas:id_fatura (
            id_fatura,
            valor_total,
            status_fatura
          ),
          produtos:id_produto (
            id_produto,
            nome,
            preco_venda
          )
        `)
        .eq('id_item_fatura', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Item de fatura não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo item de fatura
  async criar(req, res) {
    try {
      const { 
        id_fatura, 
        id_produto, 
        descricao_servico, 
        quantidade, 
        valor_unitario 
      } = req.body; 

      if (!id_fatura || (!id_produto && !descricao_servico) || !quantidade || !valor_unitario) {
        return res.status(400).json({ erro: 'ID da fatura, produto/serviço, quantidade e valor unitário são obrigatórios' });
      }

      // Calcula valor_total_item se não for fornecido ou se o item for um produto
      const calculadoValorTotalItem = valor_unitario * quantidade;

      const dadosItemFatura = {
        id_fatura,
        id_produto: id_produto || null, // Pode ser null se for apenas descricao_servico
        descricao_servico: descricao_servico || null, // Pode ser null se for id_produto
        quantidade,
        valor_unitario,
        valor_total_item: calculadoValorTotalItem,
      };

      const { data, error } = await supabase
        .from('itens_fatura')
        .insert([dadosItemFatura])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Item de fatura criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar item de fatura
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        descricao_servico, 
        quantidade, 
        valor_unitario 
      } = req.body; 

      const calculadoValorTotalItem = valor_unitario * quantidade;

      const dadosAtualizacao = {
        descricao_servico,
        quantidade,
        valor_unitario,
        valor_total_item: calculadoValorTotalItem,
      };

      const { data, error } = await supabase
        .from('itens_fatura')
        .update(dadosAtualizacao)
        .eq('id_item_fatura', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Item de fatura não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Item de fatura atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir item de fatura
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('itens_fatura')
        .delete()
        .eq('id_item_fatura', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Item de fatura excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ItemFaturaController();