
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Criar banco de dados se não existir
pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, (err) => {
  if (err) {
    console.error('Erro ao criar banco de dados:', err);
    return;
  }

  // Criar tabela se não existir
  pool.query(`
    CREATE TABLE IF NOT EXISTS notas_fiscais (
      id INT AUTO_INCREMENT PRIMARY KEY,
      razaoSocial VARCHAR(255) NOT NULL,
      numeroNota VARCHAR(50) NOT NULL,
      dataEmissao DATETIME NOT NULL,
      dataEnvioMensagem DATETIME NOT NULL,
      contato VARCHAR(255) NOT NULL,
      telefone VARCHAR(20) NOT NULL,
      status VARCHAR(20) NOT NULL,
      retirado BOOLEAN DEFAULT FALSE,
      data_retirada DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
      return;
    }
    console.log('Banco de dados e tabela verificados com sucesso!');
  });
});

// Limpar registros retirados com mais de 7 dias
const limparRetiradosAntigos = () => {
  const query = `
    DELETE FROM notas_fiscais 
    WHERE retirado = true 
    AND data_retirada IS NOT NULL 
    AND data_retirada < DATE_SUB(NOW(), INTERVAL 7 DAY)
  `;
  
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao limpar registros antigos:', err);
      return;
    }
    
    if (result.affectedRows > 0) {
      console.log(`${result.affectedRows} registros antigos foram removidos.`);
    }
  });
};

// Executar limpeza diariamente
setInterval(limparRetiradosAntigos, 24 * 60 * 60 * 1000);

// Rotas
app.get('/notas', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM notas_fiscais ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/notas', async (req, res) => {
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO notas_fiscais SET ?',
      req.body
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/notas/:id', async (req, res) => {
  try {
    await pool.promise().query(
      'UPDATE notas_fiscais SET ? WHERE id = ?',
      [req.body, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/notas/:id', async (req, res) => {
  try {
    await pool.promise().query(
      'DELETE FROM notas_fiscais WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Nota fiscal deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Banco de dados configurado em: ${process.env.DB_DATA_DIR}`);
  
  // Executar limpeza inicial
  limparRetiradosAntigos();
});
