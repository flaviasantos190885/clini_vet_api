const supabase = require('../config/supabase');

class MovimentacaoEstoqueController {
  // Listar todas as movimentações de estoque
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .select(` // Abertura da template string
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
          usuarios:id_usuario_responsavel ( // Removido o comentário problemático aqui
            id_usuario,
            nome,
            email
          )
        `) // Fechamento da template string
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
        .select(` // Abertura da template string
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
          usuarios:id_usuario_responsavel ( // Removido o comentário problemático aqui
            id_usuario,
            nome,
            email
          )
        `) // Fechamento da template string
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
        id_lote: id_lote || null, 
        tipo_movimentacao,
        quantidade,
        data_movimentacao: new Date().toISOString(), 
        id_usuario_responsavel,
        observacoes,
      };

      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .insert([dadosMovimentacao])
        .select(` // Abertura da template string
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
          usuarios:id_usuario_responsavel ( // Removido o comentário problemático aqui
            id_usuario,
            nome,
            email
          )
        `); // Fechamento da template string

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

  // Atualizar movimentação de estoque
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
        data_movimentacao: new Date().toISOString(), 
      };

      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .update(dadosAtualizacao)
        .eq('id_movimentacao', id)
        .select(` // Abertura da template string
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
          usuarios:id_usuario_responsavel ( // Removido o comentário problemático aqui
            id_usuario,
            nome,
            email
          )
        `); // Fechamento da template string

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

  // Excluir movimentação de estoque
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