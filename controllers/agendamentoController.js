const supabase = require('../config/supabase');

class AgendamentoController {
  // Listar todos os agendamentos
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone
          ),
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          )
        `)
        .order('data_hora_inicio', { ascending: true });

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

  // Buscar agendamento por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone
          ),
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          )
        `)
        .eq('id_agendamento', id)
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Agendamento não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo agendamento
  async criar(req, res) {
    try {
      const { 
        id_animal, 
        id_cliente, 
        id_veterinario, 
        data_hora_inicio, 
        data_hora_fim, 
        tipo_agendamento, 
        observacoes 
      } = req.body;

      // Validação básica
      if (!id_animal || !id_cliente || !id_veterinario || !data_hora_inicio || !data_hora_fim) {
        return res.status(400).json({ 
          erro: 'Animal, cliente, veterinário, data/hora início e fim são obrigatórios' 
        });
      }

      const dadosAgendamento = {
        id_animal,
        id_cliente,
        id_veterinario,
        data_hora_inicio,
        data_hora_fim,
        tipo_agendamento,
        observacoes,
        status_agendamento: 'Agendado',
        data_cadastro: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('agendamentos')
        .insert([dadosAgendamento])
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone
          ),
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          )
        `);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Agendamento criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar agendamento
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { 
        data_hora_inicio, 
        data_hora_fim, 
        tipo_agendamento, 
        status_agendamento, 
        observacoes 
      } = req.body;

      const dadosAtualizacao = {
        data_hora_inicio,
        data_hora_fim,
        tipo_agendamento,
        status_agendamento,
        observacoes,
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('agendamentos')
        .update(dadosAtualizacao)
        .eq('id_agendamento', id)
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone
          ),
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          )
        `);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Agendamento não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Agendamento atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir agendamento
  async excluir(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id_agendamento', id);

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.json({
        sucesso: true,
        mensagem: 'Agendamento excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Listar agendamentos por data
  async listarPorData(req, res) {
    try {
      const { data: dataParam } = req.query;
      
      if (!dataParam) {
        return res.status(400).json({ erro: 'Data é obrigatória' });
      }

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          animais:id_animal (
            id_animal,
            nome,
            especie
          ),
          clientes:id_cliente (
            id_cliente,
            nome,
            telefone
          ),
          usuarios:id_veterinario (
            id_usuario,
            nome,
            perfil
          )
        `)
        .gte('data_hora_inicio', `${dataParam}T00:00:00`)
        .lt('data_hora_inicio', `${dataParam}T23:59:59`)
        .order('data_hora_inicio', { ascending: true });

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

module.exports = new AgendamentoController();