const express = require("express"); // Aqui tava "exp", mas melhor usar o nome padrão
const http = require("http");
const { Server } = require("socket.io"); // Aqui tu colocou "server", o correto é "Server" com S maiúsculo
const path = require("path"); // Tu usou path lá embaixo, mas esqueceu de importar

const app = express(); // Aqui também tava com nome trocado

const server = http.createServer(app);
const io = new Server(server); // Corrigido o construtor aqui

// Serve a pasta "cliente"
app.use(express.static(path.join(__dirname, '../cliente')));

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

server.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
