const supabase = require('../config/supabase');

class UsuarioController {
  // Listar todos os usuários
  async listar(req, res) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome');

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

  // Buscar usuário por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params; // ID da rota

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id_usuario', id) // PK da tabela usuarios é 'id_usuario'
        .single();

      if (error) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Criar novo usuário
  async criar(req, res) {
    try {
      const { nome, email, senha_hash, perfil, ativo } = req.body; 

      if (!nome || !email || !senha_hash || !perfil) {
        return res.status(400).json({ erro: 'Nome, email, senha_hash e perfil são obrigatórios' });
      }

      const dadosUsuario = {
        nome,
        email,
        senha_hash, 
        perfil,
        ativo: ativo !== undefined ? ativo : true, // Define 'ativo' como true por padrão se não for fornecido
        data_cadastro: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('usuarios')
        .insert([dadosUsuario])
        .select(); 

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(201).json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Usuário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Atualizar usuário
  async atualizar(req, res) {
    try {
      const { id } = req.params; // ID da rota
      const { nome, email, senha_hash, perfil, ativo } = req.body; 

      const dadosAtualizacao = {
        nome,
        email,
        senha_hash, 
        perfil,
        ativo,
        data_atualizacao: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('usuarios')
        .update(dadosAtualizacao)
        .eq('id_usuario', id) // PK da tabela usuarios é 'id_usuario'
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      res.json({
        sucesso: true,
        dados: data[0],
        mensagem: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  // Excluir usuário (soft delete, se ativo for boolean)
  async excluir(req, res) {
    try {
      const { id } = req.params; // ID da rota

      // Considerando soft delete com a coluna 'ativo'
      const { data, error } = await supabase
        .from('usuarios')
        .update({ ativo: false, data_atualizacao: new Date().toISOString() })
        .eq('id_usuario', id) // PK da tabela usuarios é 'id_usuario'
        .select();

      if (error) {
        return res.status(400).json({ erro: error.message }); 
      }

      if (data.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      res.json({
        sucesso: true,
        mensagem: 'Usuário excluído (desativado) com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new UsuarioController();