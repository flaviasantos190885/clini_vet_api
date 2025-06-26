const supabase = require('../config/supabase');

class VacinaController {
  // Listar todas as vacinas
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('vacinas')
        .select(`
          *,
          prontuarios:id_prontuario (
            id_prontuario,
            tipo_atendimento,
            data_atendimento
          )
        `)
        .order('nome_vacina');

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

  // Buscar vacina por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('vacinas')
        .select(`
          *,
          prontuarios:id_prontuario (
            id_prontuario,
            tipo_atendimento,
            data_atendimento
          )
        `)
        .eq('id_vacina', id) // PK da tabela vacinas é 'id_vacina'
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Vacina não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar nova vacina
  async criar(req, res) {
    try {
      const { id_prontuario, nome_vacina, data_aplicacao, data_proxima_dose, lote } = req.body; 

      if (!id_prontuario || !nome_vacina || !data_aplicacao) {
        return res.status(400).json({ erro: 'ID do prontuário, nome da vacina e data de aplicação são obrigatórios' });
      }

      const dadosVacina = {
        id_prontuario,
        nome_vacina,
        data_aplicacao,
        data_proxima_dose,
        lote
      };

      const { data, error } = await supabase
        .from('vacinas')
        .insert([dadosVacina])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Vacina criada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar vacina
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome_vacina, data_aplicacao, data_proxima_dose, lote } = req.body; 

      const dadosAtualizacao = {
        nome_vacina,
        data_aplicacao,
        data_proxima_dose,
        lote
      };

      const { data, error } = await supabase
        .from('vacinas')
        .update(dadosAtualizacao)
        .eq('id_vacina', id) // PK da tabela vacinas é 'id_vacina'
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Vacina não encontrada' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Vacina atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir vacina
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('vacinas')
        .delete()
        .eq('id_vacina', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Vacina excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new VacinaController();