const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../cliente')));

// Rota raiz manda o index.html da pasta cliente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../cliente/index.html'));
});

io.on('connection', (socket) => {
  console.log('🔌 Usuário conectado:', socket.id);

  socket.on("set_username", (nome) => {
    socket.username = nome;
  });

  socket.on("mensagem", (msg) => {
    const nome = socket.username || "Anônimo";
    const msgComNome = `${nome}: ${msg}`;
    io.emit("mensagem", msgComNome);
  });

  socket.on('disconnect', () => {
    console.log('❌ Saiu:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
