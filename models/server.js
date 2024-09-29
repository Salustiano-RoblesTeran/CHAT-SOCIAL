const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

// DB
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // Paths
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";
    this.chatPath = "/api/chat"; 

    // Conectar a la base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas
    this.routes();

    // Configuración del servidor HTTP y Socket.IO
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server, {
      cors: {
        origin: 'http://http://localhost:5173/',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
      },
    });

    // Configuración de Socket.IO
    this.sockets();
  }

  // Conectar base de datos
  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.chatPath, require("../routes/chat")); // Agregar la ruta del chat

  }

  sockets() {
    this.io.on('connection', (socket) => {
      console.log('Se ha conectado un cliente');
      // Aquí puedes seguir manteniendo la lógica de Socket.IO si lo necesitas
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Servidor escuchando en http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
