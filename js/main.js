const contenedorPedales = document.querySelector('#pedales .galeria-pedales');
const contenedorPedaleras = document.querySelector('#pedaleras .galeria-pedales');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosGlobal = [];


let usuarioLogueado = sessionStorage.getItem('usuarioLogueado');

function renderProductos(productos) {
  contenedorPedales.innerHTML = '';
  contenedorPedaleras.innerHTML = '';

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('producto-card');
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio.toLocaleString()}</p>
      <button class="btn-agregar" data-id="${producto.id}">Comprar</button>
    `;

    if (producto.categoria === 'pedales') {
      contenedorPedales.appendChild(card);
    } else if (producto.categoria === 'pedaleras') {
      contenedorPedaleras.appendChild(card);
    }
  });

  document.querySelectorAll('.btn-agregar').forEach(button => {
    button.addEventListener('click', (e) => {
      if (!usuarioLogueado) {
        abrirLogin();
      } else {
        agregarAlCarrito(e);
      }
    });
  });
}

function agregarAlCarrito(e) {
  const id = Number(e.target.dataset.id);
  const producto = productosGlobal.find(p => p.id === id);
  if (!producto) return;

  const itemCarrito = carrito.find(item => item.id === id);
  if (itemCarrito) {
    itemCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`${producto.nombre} agregado al carrito`);
}

fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productosGlobal = data;
    renderProductos(productosGlobal);
    mostrarBotonCerrarSesion();
  })
  .catch(err => console.error('Error cargando productos:', err));


function abrirLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}

function toggleForms() {
  const login = document.getElementById('loginModal');
  const register = document.getElementById('registerModal');

  if (login.style.display === 'flex') {
    login.style.display = 'none';
    register.style.display = 'flex';
  } else {
    register.style.display = 'none';
    login.style.display = 'flex';
  }
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value.trim();

  if (validarUsuario(user, pass)) {
    sessionStorage.setItem('usuarioLogueado', user);
    usuarioLogueado = user;
    alert('Login exitoso');
    document.getElementById('loginModal').style.display = 'none';
    mostrarBotonCerrarSesion();
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('registerUser').value.trim().toLowerCase();
  const pass = document.getElementById('registerPass').value.trim();

  if (crearUsuario(user, pass)) {
    alert('Usuario creado. Ahora podés iniciar sesión.');
    toggleForms();
  } else {
    alert('El usuario ya existe');
  }
});

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios')) || {};
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function crearUsuario(username, password) {
  const usuarios = obtenerUsuarios();
  if (usuarios[username]) return false;
  usuarios[username] = password;
  guardarUsuarios(usuarios);
  return true;
}

function validarUsuario(username, password) {
  const usuarios = obtenerUsuarios();
  return usuarios[username] && usuarios[username] === password;
}


function cerrarSesion() {
  sessionStorage.removeItem('usuarioLogueado');
  usuarioLogueado = null;
  alert("Sesión cerrada");
  botonCerrarSesion.style.display = 'none';
  location.reload();
}

const botonCerrarSesion = document.createElement('button');
botonCerrarSesion.textContent = 'Cerrar sesión';
botonCerrarSesion.style.position = 'fixed';
botonCerrarSesion.style.top = '50px';
botonCerrarSesion.style.right = '10px';
botonCerrarSesion.style.padding = '10px 20px';
botonCerrarSesion.style.zIndex = '100';
botonCerrarSesion.style.backgroundColor = '#ff6600';
botonCerrarSesion.style.color = '#fff';
botonCerrarSesion.style.border = 'none';
botonCerrarSesion.style.borderRadius = '8px';
botonCerrarSesion.style.cursor = 'pointer';
botonCerrarSesion.style.display = 'none';
document.body.appendChild(botonCerrarSesion);

botonCerrarSesion.addEventListener('click', cerrarSesion);


const botonVerCarrito = document.createElement('button');
botonVerCarrito.textContent = 'Ver carrito 🛒';
botonVerCarrito.style.position = 'fixed';
botonVerCarrito.style.top = '10px';
botonVerCarrito.style.right = '10px';
botonVerCarrito.style.padding = '10px 20px';
botonVerCarrito.style.zIndex = '100';
document.body.appendChild(botonVerCarrito);

botonVerCarrito.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  let mensaje = 'Productos en el carrito:\n\n';
  let total = 0;
  carrito.forEach(item => {
    mensaje += `${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString()}\n`;
    total += item.precio * item.cantidad;
  });
  mensaje += `\nTotal: $${total.toLocaleString()}`;

  if (confirm(mensaje + '\n\n¿Deseas finalizar la compra?')) {
    carrito = [];
    localStorage.removeItem('carrito');
    alert('¡Gracias por su compra!');
  }
});

function mostrarBotonCerrarSesion() {
  if (usuarioLogueado) {
    botonCerrarSesion.style.display = 'block';
  } else {
    botonCerrarSesion.style.display = 'none';
  }
}


