CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100)
);
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria_id INT,
    proveedor_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') DEFAULT 'usuario'
);
ALTER TABLE movimientos
ADD COLUMN usuario_id INT;

ALTER TABLE movimientos
ADD CONSTRAINT fk_usuario
FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Dispositivos y componentes electrónicos'),
('Ropa', 'Prendas de vestir'),
('Papelería', 'Artículos de oficina y papelería');

INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES
('ProveedorTech', 'Carlos Gómez', '5551234567', 'carlos@proveedortech.com'),
('RopaFina', 'Laura Díaz', '5559876543', 'laura@ropafina.com');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id) VALUES
('Laptop Dell', 'Laptop de 15 pulgadas', 850.00, 5, 1, 1),
('Camisa Blanca', 'Camisa de algodón talla M', 25.00, 10, 2, 2),
('Cuaderno A4', 'Cuaderno universitario', 3.50, 50, 3, 1);

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin General', 'admin@inventario.com', '1234admin', 'admin'),
('Empleado Uno', 'empleado1@inventario.com', 'empleado123', 'usuario');

INSERT INTO movimientos (producto_id, tipo, cantidad, usuario_id) VALUES
(1, 'entrada', 5, 1),
(2, 'salida', 2, 2),
(3, 'entrada', 20, 2);

SELECT 
    p.id,
    p.nombre AS producto,
    c.nombre AS categoria,
    p.stock,
    p.precio
FROM productos p
JOIN categorias c ON p.categoria_id = c.id;

SELECT 
    m.id,
    p.nombre AS producto,
    m.tipo,
    m.cantidad,
    m.fecha,
    u.nombre AS usuario
FROM movimientos m
JOIN productos p ON m.producto_id = p.id
LEFT JOIN usuarios u ON m.usuario_id = u.id
ORDER BY m.fecha DESC;

SELECT 
    nombre, stock 
FROM productos 
WHERE stock < 5;

SELECT 
    c.nombre AS categoria,
    COUNT(p.id) AS total_productos
FROM categorias c
LEFT JOIN productos p ON p.categoria_id = c.id
GROUP BY c.id;

SELECT 
    p.id,
    p.nombre AS producto,
    c.nombre AS categoria,
    p.stock,
    p.precio
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.nombre = 'Ropa';

