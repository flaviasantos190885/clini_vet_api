const supabase = require('../config/supabase');

class ProntuarioController {
  // Listar todos os prontuários
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('prontuarios')
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie,
            clientes:id_cliente (
              id_cliente,
              nome
            )
          ),
veterinarios : id_veterinario ( 
            id,       
            nome     
          )
        .order('data_atendimento', { ascending: false });

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

  // Buscar prontuário por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('prontuarios')
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie,
            clientes:id_cliente (
              id_cliente,
              nome
            )
          ),
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          ),
          prescricoes(*),
          vacinas(*),
          anexos_prontuario(*)
        `)
        .eq('id_prontuario', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Prontuário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo prontuário
  async criar(req, res) {
    try {
      const { 
        id_animal, 
        id_veterinario, 
        tipo_atendimento, 
        anamnese, 
        diagnostico, 
        procedimentos_realizados, 
        observacoes 
      } = req.body;

      // Validação básica
      if (!id_animal || !id_veterinario) {
        return res.status(400).json({ erro: 'ID do animal e veterinário são obrigatórios' });
      }

      const dadosProntuario = {
        id_animal,
        id_veterinario,
        tipo_atendimento,
        anamnese,
        diagnostico,
        procedimentos_realizados,
        observacoes,
        data_atendimento: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('prontuarios')
        .insert([dadosProntuario])
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
veterinarios : id_veterinario ( 
            id,       
            nome     
          );

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Prontuário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar prontuário
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        tipo_atendimento, 
        anamnese, 
        diagnostico, 
        procedimentos_realizados, 
        observacoes 
      } = req.body;

      const dadosAtualizacao = {
        tipo_atendimento,
        anamnese,
        diagnostico,
        procedimentos_realizados,
        observacoes
      };

      const { data, error } = await supabase
        .from('prontuarios')
        .update(dadosAtualizacao)
        .eq('id_prontuario', id)
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
veterinarios : id_veterinario ( 
            id,       
            nome     
          );

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Prontuário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Prontuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir prontuário
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('prontuarios')
        .delete()
        .eq('id_prontuario', id);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.json({
        sucesso: true,
        mensagem: 'Prontuário excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ProntuarioController();