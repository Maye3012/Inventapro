console.log("Script.js cargado correctamente.");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM completamente cargado.");

  
  // Accesibilidad
  
  let currentFontSize = 16;

  const btnAumentar = document.getElementById("aumentar-fuente");
  const btnReducir = document.getElementById("reducir-fuente");
  const btnContraste = document.getElementById("contraste-toggle");
  const btnRestablecer = document.getElementById("restablecer");

  if (btnAumentar && btnReducir && btnContraste && btnRestablecer) {
    btnAumentar.addEventListener("click", () => {
      currentFontSize += 1;
      document.body.style.fontSize = currentFontSize + "px";
    });

    btnReducir.addEventListener("click", () => {
      currentFontSize = Math.max(12, currentFontSize - 1);
      document.body.style.fontSize = currentFontSize + "px";
    });

    btnContraste.addEventListener("click", () => {
      document.body.classList.toggle("alto-contraste");
    });

    btnRestablecer.addEventListener("click", () => {
      currentFontSize = 16;
      document.body.style.fontSize = "16px";
      document.body.classList.remove("alto-contraste");
    });
  }
 
  // Login
const usuarios = [
  { correo: "admin@example.com", contraseña: "12345", nombre: "Admin" },
  { correo: "usuario@example.com", contraseña: "abcde", nombre: "Usuario" }
];

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const usuario = usuarios.find(u => u.correo === email && u.contraseña === password);

    if (usuario) {
      sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      alert("Bienvenido/a " + usuario.nombre);
      window.location.href = "pages/dashboard.html";
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  });
}
  
  // Dashboard
const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));

if (window.location.pathname.includes("dashboard.html")) {
  if (!usuarioActivo) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "../index.html";
  } else {
    console.log("Sesión activa de:", usuarioActivo.nombre);
  }
  document.querySelector(".logout a")?.addEventListener("click", () => {
      sessionStorage.removeItem("usuarioActivo");
    });

 
  // Cierre de sesion
  document.querySelector(".logout a")?.addEventListener("click", () => {
    sessionStorage.removeItem("usuarioActivo");
  });
} 
  // Productos
  if (window.location.pathname.includes("dashboard.html")) {
  const form = document.getElementById("producto-form");
  const productosList = document.getElementById("productos");
  const buscarInput = document.getElementById("buscar");

  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let editandoId = null;
  
  // Historial
  const historialBody = document.getElementById("historial-body");
  const historial = JSON.parse(localStorage.getItem("historial")) || [];

function guardarHistorial() {
  localStorage.setItem("historial", JSON.stringify(historial));
}

function registrarMovimiento(accion, producto) {
  const fecha = new Date().toLocaleString();
  historial.push({accion,producto: producto.nombre,fecha});
  guardarHistorial();
  mostrarHistorial();
}

function mostrarHistorial() {
  historialBody.innerHTML = "";
  historial.forEach(mov => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${mov.accion}</td>
      <td>${mov.producto}</td>
      <td>${mov.fecha}</td>
    `;
    historialBody.appendChild(fila);
  });
}
 
  // Categorias
    const categoriaSelect = document.getElementById("categoria");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const formCategoria = document.getElementById("form-categoria");
    const inputNuevaCategoria = document.getElementById("nueva-categoria");

    let categorias = JSON.parse(localStorage.getItem("categorias")) || ["Electrónica", "Móviles"];

    function guardarCategorias() {
      localStorage.setItem("categorias", JSON.stringify(categorias));
    }

    function cargarCategorias() {
      categoriaSelect.innerHTML = "";
      filtroCategoria.innerHTML = '<option value="todas">Todas</option>';
      
      categorias.forEach(cat => {
        const option1 = document.createElement("option");
        option1.value = cat;
        option1.textContent = cat;
        categoriaSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = cat;
        option2.textContent = cat;
        filtroCategoria.appendChild(option2);
      });
    }

    formCategoria.addEventListener("submit", (e) => {
      e.preventDefault();
      const nuevaCat = inputNuevaCategoria.value.trim();
      if (!nuevaCat) return;

      if (categorias.includes(nuevaCat)) {
        alert("Esa categoría ya existe.");
        return;
      }

      categorias.push(nuevaCat);
      guardarCategorias();
      cargarCategorias();
      formCategoria.reset();
    });

 // Guardar productos
  function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
  }

// -Mostrar productos
  function actualizarLista() {
    productosList.innerHTML = "";
    let stockBajo = 0;

    const categoriaSeleccionada = filtroCategoria?.value || "todas";

    productos.forEach((prod, index) => {
      if (categoriaSeleccionada !== "todas" && prod.categoria !== categoriaSeleccionada) {
          return;
        }
      const fila = document.createElement("tr");  
      const imagenHTML = prod.imagen
        ? `<img src="${prod.imagen}" alt="${prod.nombre}" width="50">`
        : "Sin imagen";

      fila.innerHTML = `
        <td>${imagenHTML}</td>
        <td>${prod.nombre}</td>
        <td>${prod.cantidad}</td>
        <td>${prod.categoria}</td>
        <td>
          <button class="editar" onclick="editarProducto(${index})">Editar</button>
          <button class="eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
        </td>
      `;

      if (prod.cantidad < 5) stockBajo++;
      productosList.appendChild(fila);
    });

    document.getElementById("total-productos").textContent = productos.length;
    document.getElementById("stock-bajo").textContent = stockBajo;
    guardarProductos();
  }

    // Agregar o editar producto
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const categoria = document.getElementById("categoria").value.trim();
    const imagenInput = document.getElementById("imagen");
    const imagen = imagenInput.files[0];

    if (!nombre || isNaN(cantidad) || !categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    let imagenURL = "";
    if (imagen) {
      imagenURL = URL.createObjectURL(imagen);
    }

    const producto = {
      nombre,
      cantidad,
      categoria,
      imagen: imagenURL
    };

    if (editandoId !== null) {
        registrarMovimiento("Editado", producto);
        productos[editandoId] = producto;
        editandoId = null;
      } else {
        registrarMovimiento("Agregado", producto);
        productos.push(producto);
      }

    form.reset();
    actualizarLista();
  });

  // Editar producto
  window.editarProducto = (index) => {
    const prod = productos[index];
    document.getElementById("nombre").value = prod.nombre;
    document.getElementById("cantidad").value = prod.cantidad;
    document.getElementById("categoria").value = prod.categoria;
    editandoId = index;
    alert("Edita el producto y vuelve a hacer clic en 'Añadir Producto'");
  };

  // Eliminar producto
  window.eliminarProducto = (index) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      productos.splice(index, 1);
      actualizarLista();
    }
  };

   // Buscar productos
  buscarInput.addEventListener("input", () => {
    const filtro = buscarInput.value.toLowerCase();
    document.querySelectorAll("#productos tr").forEach(fila => {
      const texto = fila.textContent.toLowerCase();
      fila.style.display = texto.includes(filtro) ? "" : "none";
    });
  });

   // Filtrar por categoria
    filtroCategoria.addEventListener("change", () => {
      actualizarLista();
    });

   // Iniciar todo
    actualizarLista();
    mostrarHistorial();
    cargarCategorias();
  actualizarLista(); // Mostrar productos al cargar
  }
}); 