const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario_mysql', // Reemplaza con tu usuario de MySQL
  password: 'Maye3012', // Reemplaza con tu contraseña de MySQL
  database: 'inventapro'
});

// Conectar a la base de datos MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

app.get('/', (req, res) => {
  res.send('¡Hola desde el backend de Inventapro!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});