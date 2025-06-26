const supabase = require('../config/supabase');

class AnexoProntuarioController {
  // Listar todos os anexos de prontuário
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('anexos_prontuario')
        .select(`
          *,
          prontuarios:id_prontuario (
            id_prontuario,
            data_atendimento,
            tipo_atendimento
          )
        `)
        .order('data_upload', { ascending: false });

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

  // Buscar anexo de prontuário por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('anexos_prontuario')
        .select(`
          *,
          prontuarios:id_prontuario (
            id_prontuario,
            data_atendimento,
            tipo_atendimento
          )
        `)
        .eq('id_anexo', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Anexo de prontuário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo anexo de prontuário
  async criar(req, res) {
    try {
      const { 
        id_prontuario, 
        nome_arquivo, 
        caminho_arquivo, 
        tipo_arquivo 
      } = req.body; 

      if (!id_prontuario || !nome_arquivo || !caminho_arquivo || !tipo_arquivo) {
        return res.status(400).json({ erro: 'ID do prontuário, nome, caminho e tipo do arquivo são obrigatórios' });
      }

      const dadosAnexo = {
        id_prontuario,
        nome_arquivo,
        caminho_arquivo,
        tipo_arquivo,
        data_upload: new Date().toISOString(), // Gerado automaticamente
      };

      const { data, error } = await supabase
        .from('anexos_prontuario')
        .insert([dadosAnexo])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Anexo de prontuário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar anexo de prontuário
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        nome_arquivo, 
        caminho_arquivo, 
        tipo_arquivo 
      } = req.body; 

      const dadosAtualizacao = {
        nome_arquivo,
        caminho_arquivo,
        tipo_arquivo,
      };

      const { data, error } = await supabase
        .from('anexos_prontuario')
        .update(dadosAtualizacao)
        .eq('id_anexo', id)
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Anexo de prontuário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Anexo de prontuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir anexo de prontuário
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('anexos_prontuario')
        .delete()
        .eq('id_anexo', id);

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      res.json({
        sucesso: true,
        mensagem: 'Anexo de prontuário excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new AnexoProntuarioController();