const supabase = require('../config/supabase');

class PrescricaoController {
  // Listar todas as prescrições
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('prescricoes')
        .select(`
          *,
          prontuarios:id_prontuario ( // Removido o comentário problemático aqui
            id_prontuario,
            tipo_atendimento,
            data_atendimento
          )
        `)
        .order('data_prescricao', { ascending: false });

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

  // Buscar prescrição por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('prescricoes')
        .select(`
          *,
          prontuarios:id_prontuario ( // Removido o comentário problemático aqui
            id_prontuario,
            tipo_atendimento,
            data_atendimento
          )
        `)
        .eq('id_prescricao', id) // PK da tabela prescricoes é 'id_prescricao'
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Prescrição não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar nova prescrição
  async criar(req, res) {
    try {
      const { id_prontuario, medicamento, dosagem, frequencia, duracao, observacoes } = req.body; 

      if (!id_prontuario || !medicamento || !dosagem) {
        return res.status(400).json({ erro: 'ID do prontuário, medicamento e dosagem são obrigatórios' });
      }

      const dadosPrescricao = {
        id_prontuario,
        medicamento,
        dosagem,
        frequencia,
        duracao,
        observacoes,
        data_prescricao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('prescricoes')
        .insert([dadosPrescricao])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Prescrição criada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar prescrição
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { medicamento, dosagem, frequencia, duracao, observacoes } = req.body; 

      const dadosAtualizacao = {
        medicamento,
        dosagem,
        frequencia,
        duracao,
        observacoes
      };

      const { data, error } = await supabase
        .from('prescricoes')
        .update(dadosAtualizacao)
        .eq('id_prescricao', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Prescrição não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Prescrição atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir prescrição
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('prescricoes')
        .delete()
        .eq('id_prescricao', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Prescrição excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new PrescricaoController();