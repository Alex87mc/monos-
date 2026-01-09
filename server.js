const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware para entender JSON y permitir conexiones desde tu HTML
app.use(express.json());
app.use(cors());

// --- CONEXIÓN A MONGODB ---
// Si tienes Mongo instalado localmente:
mongoose.connect('mongodb://localhost:27017/monkeyRescueDB')
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err));

// --- CREACIÓN DE MODELOS (ESQUEMAS) ---

// 1. Esquema para guardar a los usuarios que inician sesión
const UsuarioSchema = new mongoose.Schema({
    usuarioInstagram: String,
    fechaRegistro: { type: Date, default: Date.now }
});

// 2. Esquema para guardar las donaciones
const DonacionSchema = new mongoose.Schema({
    usuario: String,
    causa: String,
    monto: Number, // Simulado
    fecha: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Donacion = mongoose.model('Donacion', DonacionSchema);

// --- RUTAS (Lo que tu página web va a llamar) ---

// Ruta para guardar el "Login"
app.post('/api/login', async (req, res) => {
    const { usuario } = req.body;
    
    // Buscamos si ya existe, si no, lo creamos
    let usuarioExistente = await Usuario.findOne({ usuarioInstagram: usuario });
    if (!usuarioExistente) {
        usuarioExistente = new Usuario({ usuarioInstagram: usuario });
        await usuarioExistente.save();
        console.log(`Nuevo usuario registrado: ${usuario}`);
    } else {
        console.log(`Usuario regresó: ${usuario}`);
    }

    res.json({ mensaje: 'Login exitoso', usuario: usuarioExistente });
});

// Ruta para guardar la Donación
app.post('/api/donar', async (req, res) => {
    const { usuario, causa } = req.body;

    const nuevaDonacion = new Donacion({
        usuario: usuario,
        causa: causa,
        monto: 5 // Valor fijo por ahora
    });

    await nuevaDonacion.save();
    console.log(`Donación recibida de ${usuario} para ${causa}`);
    
    res.json({ mensaje: 'Donación registrada' });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});