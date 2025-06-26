const supabase = require('../config/supabase');

class AtendimentoFaturaController {
  // Listar todos os atendimentos de fatura
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('atendimento_fatura')
        .select(`
          *,
          prontuarios:id_prontuario (
            id_prontuario,
            data_atendimento,
            tipo_atendimento
          ),
          faturas:id_fatura (
            id_fatura,
            valor_total,
            status_fatura
          )
        `)
        .order('id_atendimento_fatura'); // Ou outra coluna para ordenação

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

  // Buscar atendimento de fatura por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('atendimento_fatura')
        .select(`
          *,
          prontuarios:id_prontuario (
            id_prontuario,
            data_atendimento,
            tipo_atendimento
          ),
          faturas:id_fatura (
            id_fatura,
            valor_total,
            status_fatura
          )
        `)
        .eq('id_atendimento_fatura', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Atendimento de fatura não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo atendimento de fatura
  async criar(req, res) {
    try {
      const { 
        id_prontuario, 
        id_fatura 
      } = req.body; 

      if (!id_prontuario || !id_fatura) {
        return res.status(400).json({ erro: 'ID do prontuário e ID da fatura são obrigatórios' });
      }

      const dadosAtendimentoFatura = {
        id_prontuario,
        id_fatura
      };

      const { data, error } = await supabase
        .from('atendimento_fatura')
        .insert([dadosAtendimentoFatura])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Atendimento de fatura criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar atendimento de fatura (geralmente só FKs, se permitido)
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { id_prontuario, id_fatura } = req.body; // Cuidado ao permitir atualização de FKs

      const dadosAtualizacao = {
        id_prontuario,
        id_fatura
      };

      const { data, error } = await supabase
        .from('atendimento_fatura')
        .update(dadosAtualizacao)
        .eq('id_atendimento_fatura', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Atendimento de fatura não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Atendimento de fatura atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir atendimento de fatura
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('atendimento_fatura')
        .delete()
        .eq('id_atendimento_fatura', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Atendimento de fatura excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new AtendimentoFaturaController();