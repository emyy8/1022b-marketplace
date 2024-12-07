import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// Criando o aplicativo Express
const server = express();

// Configurando o middleware para receber JSON e permitir CORS
server.use(express.json());
server.use(cors());

// Conexão com o banco de dados (pode ser configurado em um arquivo de variáveis de ambiente)
const getDbConnection = async () => {
  try {
    return await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'banco1022b',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });
  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
    throw new Error('Falha na conexão com o banco de dados');
  }
};

// Rota para listar os produtos
server.get('/products', async (req, res) => {
  try {
    const connection = await getDbConnection();
    const [products] = await connection.query('SELECT * FROM produtos');
    await connection.end();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para cadastrar um novo produto
server.post('/products', async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    const connection = await getDbConnection();
    const query = 'INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)';
    const [result] = await connection.query(query, [name, description, price, image]);
    await connection.end();
    res.status(201).json({ message: 'Produto cadastrado com sucesso', result });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ message: 'Erro ao cadastrar produto' });
  }
});

// Iniciar o servidor
server.listen(8000, () => {
  console.log('Servidor rodando na porta 8000');
});
