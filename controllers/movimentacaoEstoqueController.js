const supabase = require('../config/supabase');

class MovimentacaoEstoqueController {
  // Listar todas as movimentações de estoque
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .select(`
          *,
          produtos:id_produto (
            id_produto,
            nome,
            unidade_medida
          ),
          lotes_produto:id_lote (
            id_lote,
            numero_lote,
            data_validade
          ),
          usuarios:id_usuario_responsavel ( // Assumindo que id_usuario_responsavel referencia usuarios.id_usuario
            id_usuario,
            nome,
            email
          )
        `)
        .order('data_movimentacao', { ascending: false });

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

  // Buscar movimentação de estoque por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .select(`
          *,
          produtos:id_produto (
            id_produto,
            nome,
            unidade_medida
          ),
          lotes_produto:id_lote (
            id_lote,
            numero_lote,
            data_validade
          ),
          usuarios:id_usuario_responsavel (
            id_usuario,
            nome,
            email
          )
        `)
        .eq('id_movimentacao', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Movimentação de estoque não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar nova movimentação de estoque
  async criar(req, res) {
    try {
      const { 
        id_produto, 
        id_lote, 
        tipo_movimentacao, 
        quantidade, 
        id_usuario_responsavel, 
        observacoes 
      } = req.body; 

      if (!id_produto || !tipo_movimentacao || !quantidade || !id_usuario_responsavel) {
        return res.status(400).json({ erro: 'ID do produto, tipo, quantidade e usuário responsável são obrigatórios' });
      }

      const dadosMovimentacao = {
        id_produto,
        id_lote: id_lote || null, // Lote pode ser opcional para algumas movimentações
        tipo_movimentacao,
        quantidade,
        data_movimentacao: new Date().toISOString(), // Gerado automaticamente
        id_usuario_responsavel,
        observacoes,
      };

      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .insert([dadosMovimentacao])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Movimentação de estoque criada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar movimentação de estoque (CUIDADO: Atualizar estoque é complexo)
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        tipo_movimentacao, 
        quantidade, 
        id_usuario_responsavel, 
        observacoes 
      } = req.body; 

      const dadosAtualizacao = {
        tipo_movimentacao,
        quantidade,
        id_usuario_responsavel,
        observacoes,
        data_movimentacao: new Date().toISOString(), // Atualiza a data da movimentação
      };

      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .update(dadosAtualizacao)
        .eq('id_movimentacao', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Movimentação de estoque não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Movimentação de estoque atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir movimentação de estoque (CUIDADO: Excluir afeta o estoque total)
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('movimentacao_estoque')
        .delete()
        .eq('id_movimentacao', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Movimentação de estoque excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new MovimentacaoEstoqueController();