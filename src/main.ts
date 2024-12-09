import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

app.use(express.json());
app.use(cors());

// ROTA PARA CADASTRAR UM LIVRO
app.post('/livros', async (req, res) => {
    try {
        const { id, titulo, autor, editora, sinopse, preco, imagem } = req.body;

        const conexao = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "defaultdb",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
        });

        const query = `
            INSERT INTO livros (id, titulo, autor, editora, sinopse, preco, imagem) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [resultado] = await conexao.execute(query, [id, titulo, autor, editora, sinopse, preco, imagem]);
        await conexao.end();

        res.status(201).send({ mensagem: 'Livro cadastrado com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro do servidor');
    }
});

// ROTA PARA LISTAR TODOS OS LIVROS
app.get('/livros', async (req, res) => {
    try {
        const conexao = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "defaultdb",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
        });

        const [resultado] = await conexao.query('SELECT * FROM livros');
        await conexao.end();
        res.send(resultado);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro do servidor');
    }
});

// INICIAR O SERVIDOR
const PORTA = process.env.PORTA || 8000;
app.listen(PORTA, () => {
    console.log(`Servidor iniciado na porta ${PORTA}`);
});
