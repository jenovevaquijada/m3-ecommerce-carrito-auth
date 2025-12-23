const catalogo = [
    { id:1, nombre:"Snack perro variedades", precio:8990, imagen: "assets/img/snacksalchichas-01.jpeg", desc: "Deliciosos snacks ideales para entrenar." },
    { id:2, nombre:"Juguete suave", precio:11990, imagen: "assets/img/peluchehueso-01.jpeg", desc: "Un momento de relajo para tu perrito." },
    { id:3, nombre:"Bandana", precio:7990, imagen: "assets/img/bandana-01.jpeg", desc: "Dale a tu mascota el mejor estilo." },
    { id:4, nombre:"Rascador", precio:18990, imagen: "assets/img/rascador-01.jpeg", desc: "Indispensable para todo michi." },
    { id:5, nombre:"Arnés gato", precio:9990, imagen: "assets/img/arnesgato-01.jpeg", desc: "Pasea seguro junto a tu gatito." }, 
    { id:6, nombre:"Plato elevado para gato", precio:12990, imagen: "assets/img/platoelevadogato-01.jpeg", desc: "Hecho de cerámica, seguro para tu gato." }, 
    { id:7, nombre:"Caldo de huesos", precio:6990, imagen: "assets/img/caldohuesos-01.jpeg", desc: "Suplemento natural y nutritivo, apto para perros y gatos." },
    { id:8, nombre:"Correa paseo perro 2 mt", precio:25990, imagen: "assets/img/correaperro-02.jpeg", desc: "La mejor calidad para los paseos." },
    { id:9, nombre:"Jockey Dog Mom", precio:14990, imagen: "assets/img/jockeybordado-01.jpeg", desc: "Estilo para las tutoras." },
    { id:10, nombre:"Arena sanitaria de soya", precio:19990, imagen: "assets/img/arenasoya-01.jpeg", desc: "Producto natural y ecológico." },
    { id:11, nombre:"Arenero cerrado", precio:22990, imagen: "assets/img/arenero-01.jpeg", desc: "Espacioso y privado." },
    { id:12, nombre:"Polerón Cat Mom", precio:30990, imagen: "assets/img/poleron-02.jpeg", desc: "Agrega tu bordado personalizado." },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const PASSWORD = "1234";
let usuarioLogueado = localStorage.getItem("sesion") === "true";
const bootstrapModal = new bootstrap.Modal(document.getElementById('mi-modal'));
let instanciaOffcanvas;
document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('offcanvasCarrito');
    if (el) instanciaOffcanvas = new bootstrap.Offcanvas(el);
});
let descuentoActivo = 1; 


function formatCLP(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("sesion", usuarioLogueado);
}

const modalLoginBS = new bootstrap.Modal(document.getElementById('modalLogin'));

function procesarLogin() {
    const input = document.getElementById('passInput');
    const mensajeError = document.getElementById('error-login');
    
    if (input.value === PASSWORD) {
        usuarioLogueado = true;
        sincronizarStorage();
        actualizarInterfazLogin();
        
        input.value = "";
        mensajeError.classList.add('d-none');
        modalLoginBS.hide();
        
        alert("¡Bienvenid@ de nuevo!");
    } else {

        mensajeError.classList.remove('d-none');
        input.value = "";
    }
}

function actualizarInterfazLogin() {
    const btnAbrirModal = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    
    if (usuarioLogueado) {
        btnAbrirModal.classList.add('d-none');
        btnLogout.classList.remove('d-none');
    } else {
        btnAbrirModal.classList.remove('d-none');
        btnLogout.classList.add('d-none');
    }
}

function logout() {
    usuarioLogueado = false;
    sincronizarStorage(); 
    actualizarInterfazLogin();
    alert("Sesión cerrada.");
}


function agregarAlCarrito(id) {
    if (!usuarioLogueado) {
        const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
        modalLogin.show();
        return;
    }

    const producto = catalogo.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
    sincronizarStorage();
    

    if (instanciaOffcanvas) instanciaOffcanvas.show();
}

function eliminarDelCarrito(id) {
    const indice = carrito.findIndex(item => item.id === id);
    if (indice !== -1) {
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad--;
        } else {
            carrito.splice(indice, 1);
        }
        sincronizarStorage();
        renderizarCarrito();
    }
}

function vaciarCarrito() {
    carrito = [];
    descuentoActivo = 1;
    sincronizarStorage();
    renderizarCarrito();

    if (carrito.length === 0) {
    contenedor.innerHTML = `
        <div class="text-center py-5">
            <span style="font-size: 3rem;">🛒</span>
            <p class="mt-2 text-muted">Tu carrito está esperando por un michi-regalo.</p>
        </div>`;
    return;
}
}

function procesarCupon() {
    const inputCupon = document.getElementById('input-cupon');
    const mensajeCupon = document.getElementById('mensaje-cupon');
    
    const codigo = inputCupon.value.trim().toUpperCase();
    
    if (codigo === "DESC15") {
        descuentoActivo = 0.85;
        mensajeCupon.className = "text-success small mt-1";
        mensajeCupon.innerText = "¡Cupón DESC15 aplicado!";
    } else {
        descuentoActivo = 1;
        mensajeCupon.className = "text-danger small mt-1";
        mensajeCupon.innerText = "Cupón no válido";
    }
    renderizarCarrito();
}


function renderizarCatalogo() {
    const vitrina = document.querySelector("#catalogo");
    

    vitrina.classList.add("g-4"); 

    vitrina.innerHTML = catalogo.map(p => `
        <div class="col-12 col-sm-6 col-md-4"> 
            <div class="card h-100 shadow-sm border-0">
                <img src="${p.imagen}" 
                    class="card-img-top" 
                            alt="${p.nombre}" 
                    style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${p.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${p.desc}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fw-bold text-primary">${formatCLP(p.precio)}</span>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-dark" onclick="agregarAlCarrito(${p.id})">Agregar</button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="verDetalle(${p.id})">Info</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderizarCarrito() {
    const contenedor = document.getElementById("carrito-container");
    const btnFlotante = document.getElementById('btn-flotante-carrito');
    const badge = document.getElementById("badge-count");

    if (!contenedor) return;


    const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    if (badge) badge.innerText = totalItems;


    if (carrito.length === 0) {
        contenedor.innerHTML = `<div class="text-center mt-5"><p class="text-muted">Tu carrito está vacío 😿</p></div>`;
        if (btnFlotante) btnFlotante.classList.add('d-none');
        descuentoActivo = 1;
        return;
    } else {
        if (btnFlotante) btnFlotante.classList.remove('d-none');
    }

    let subtotal = 0;

    let htmlProductos = carrito.map(item => {
        const lineaSubtotal = item.precio * item.cantidad;
        subtotal += lineaSubtotal;
        return `
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 text-dark">
                <div>
                    <h6 class="mb-0 small fw-bold">${item.nombre}</h6>
                    <small class="text-muted">${item.cantidad} x ${formatCLP(item.precio)}</small>
                </div>
                <div class="text-end">
                    <div class="small fw-bold">${formatCLP(lineaSubtotal)}</div>
                    <button class="btn btn-sm text-danger p-0" style="font-size: 0.7rem" onclick="eliminarDelCarrito(${item.id})">Quitar</button>
                </div>
            </div>`;
    }).join("");

    const totalFinal = Math.round(subtotal * descuentoActivo);
    const ahorro = subtotal - totalFinal;

    contenedor.innerHTML = `
        ${htmlProductos}
        
        <div class="mt-4 p-3 bg-light rounded shadow-sm">
            <label class="small fw-bold mb-2 d-block text-dark">¿Tienes un cupón?</label>
            <div class="input-group input-group-sm">
                <input type="text" id="input-cupon" class="form-control" placeholder="Ej: DESC15" value="${descuentoActivo < 1 ? 'DESC15' : ''}">
                <button class="btn btn-dark" onclick="procesarCupon()">Aplicar</button>
            </div>
            <div id="mensaje-cupon"></div>
        </div>

        <div class="mt-4 pt-3 border-top text-dark">
            <div class="d-flex justify-content-between mb-1">
                <span>Subtotal:</span>
                <span>${formatCLP(subtotal)}</span>
            </div>
            
            ${descuentoActivo < 1 ? `
            <div class="d-flex justify-content-between mb-1 text-success fw-bold">
                <span>Descuento (15%):</span>
                <span>- ${formatCLP(ahorro)}</span>
            </div>` : ''}

            <h5 class="d-flex justify-content-between fw-bold mt-2">
                Total: <span>${formatCLP(totalFinal)}</span>
            </h5>
            
            <button class="btn btn-primary w-100 mt-3 py-2 fw-bold" onclick="alert('Pedido confirmado por ${formatCLP(totalFinal)}')">
                Finalizar Compra
            </button>
            <button class="btn btn-link btn-sm w-100 mt-2 text-secondary text-decoration-none" onclick="vaciarCarrito()">
                Vaciar Carrito
            </button>
        </div>
    `;
}

function verDetalle(id) {
    const p = catalogo.find(prod => prod.id === id);
    if (p) {
        document.getElementById('modal-titulo').innerText = p.nombre;
        document.getElementById('modal-cuerpo').innerHTML = `
            <div class="text-center mb-3">
                <img src="${p.imagen}" class="img-fluid rounded shadow-sm" alt="${p.nombre}">
            </div>
            <p class="text-muted mt-3">${p.desc}</p>
            <p class="h4 text-primary fw-bold text-center">${formatCLP(p.precio)}</p>
        `;
        document.getElementById('btn-agregar-modal').onclick = () => {
            agregarAlCarrito(p.id);
            bootstrapModal.hide();
        };
        bootstrapModal.show();
    }
} 


actualizarInterfazLogin();
renderizarCatalogo();
renderizarCarrito();