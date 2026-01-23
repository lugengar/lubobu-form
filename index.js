const API_BASE = "https://lubobu.lubobu-arg.workers.dev";
const PUBLIC_KEY = "23g2y4ut287ewgh4v236tg2g2g4v32htg4f";

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en la API");
  return data;
}

function createPedido2(pedido) {
  return apiFetch("/pedidos2", {
    method: "POST",
    headers: {
      "x-api-key": PUBLIC_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedido),
  });
}

const form = document.querySelector(".js-product-variants.form-row");

// === AGREGAMOS LOS NUEVOS CAMPOS ===
form.innerHTML += `
<div class="js-product-variants-group form-group col-12 text-center text-md-left mb-4 cara">
<label class="form-label">Cara <span style="color:red;">*</span>: <span class="js-insta-variation-label textofoto">Sin imagen</span></label>
<input class="inputfoto" type="file" style="display:none;" />
<button type="button" class="subirfoto js-insta-variant btn btn-variant">
  <span class="btn-variant-content">Seleccionar imagen</span>
</button>
<div class="miniaturas-cara mt-2 d-flex gap-1"></div>
</div>
<div class="js-product-variants-group form-group col-12 mb-4 nombre-cliente">
    <label class="form-label">Nombre del comprador <span style="color:red;">*</span></label>
    <input type="text" class="js-nombre-cliente form-control" placeholder="Nombre completo" required />
  </div>

<details class="js-mas-personalizaciones form-group col-12 mb-4">
<summary style="cursor:pointer; font-weight:bold;">Más personalizaciones</summary>

<div class="js-product-variants-group form-group col-12 text-center text-md-left mb-4 caja">
  <label class="form-label">Imagenes caja (opcional, máximo 6): <span class="js-insta-variation-label cantdadimagenes">0/6</span></label>
  <input class="inputfoto2" type="file" style="display:none;" multiple accept="image/*" />
  <button type="button" class="subirfoto2 js-insta-variant btn btn-variant">
    <span class="btn-variant-content">Seleccionar imágenes</span>
  </button>
  <div class="miniaturas-caja mt-2 d-flex gap-1"></div>
</div>
<div class="js-product-variants-group form-group col-12 mb-4 mensaje-caja">
    <label class="form-label">Mensaje en la caja (opcional):</label>
    <textarea class="js-mensaje-caja form-control" maxlength="200" style="resize:none; height:7vh;"></textarea>
  </div>
<div class="js-product-variants-group form-group col-12 text-center text-md-left mb-4 qr">
  <label class="form-label">Tipo de QR:</label>
  <select class="js-tipo-qr form-control">
    <option value="">Sin regalo virtual</option>
    <option value="men">Mensaje personalizado</option>
    <option value="foto">URL foto de recuerdo</option>
    <option value="cum">Cumpleaños</option>
    <option value="nav">Navidad</option>
    <option value="rey">Reyes magos</option>
    <option value="año">Año nuevo</option>
    <option value="bod">Boda</option>
    <option value="ani">Aniversario</option>
  </select>
</div>

<div class="js-product-variants-group form-group col-12 text-center text-md-left mb-4 qr-extra" style="display:none;"></div>
<div class="js-product-variants-group form-group col-12 text-center text-md-left mb-4 previsualizacion" style="display:none;"></div>
<div class="js-product-variants-group form-group col-12 text-center text-md-left mb-4 comentario">
  <label class="form-label">Comentario (opcional):</label>
  <textarea class="js-comentario form-control" maxlength="200" style="resize:none; height:7vh;"></textarea>
</div>
</details>



`;

// === ELEMENTOS EXISTENTES ===
const inputCara = form.querySelector(".inputfoto");
const btnCara = form.querySelector(".subirfoto");
const labelCara = form.querySelector(".textofoto");
const miniaturasCara = form.querySelector(".miniaturas-cara");

const inputCaja = form.querySelector(".inputfoto2");
const btnCaja = form.querySelector(".subirfoto2");
const labelCaja = form.querySelector(".cantdadimagenes");
const miniaturasCaja = form.querySelector(".miniaturas-caja");

const selectQR = form.querySelector(".js-tipo-qr");
const qrExtraContainer = form.querySelector(".qr-extra");
const previsualizacionContainer = form.querySelector(".previsualizacion");

const btnAgregar = document.querySelector(".js-addtocart.js-prod-submit-form.btn-add-to-cart.btn.btn-primary.btn-big.btn-block.cart");

// === FUNCIONES ===
function crearMiniatura(file) {
  const url = URL.createObjectURL(file);
  const div = document.createElement("div");
  div.className = "js-insta-variant btn btn-variant selected btn-variant-color p-0";
  div.style.width = "45px";
  div.style.height = "45px";
  div.innerHTML = `
    <span class="btn-variant-content btn-variant-content-square">
      <img src="${url}" class="absolute-centered-vertically" style="width:40px;height:40px;object-fit:cover;">
    </span>
  `;
  return div;
}

// Convertir archivo a Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// === EVENTOS ===
// Cara
btnCara.addEventListener("click", () => inputCara.click());
inputCara.addEventListener("change", () => {
  labelCara.textContent = inputCara.files.length ? inputCara.files[0].name : "Sin imagen";
  miniaturasCara.innerHTML = "";
  if(inputCara.files.length){
    miniaturasCara.appendChild(crearMiniatura(inputCara.files[0]));
  }
});

// Caja
btnCaja.addEventListener("click", () => inputCaja.click());
inputCaja.addEventListener("change", () => {
  const count = Math.min(inputCaja.files.length, 6);
  labelCaja.textContent = `${count}/6`;
  miniaturasCaja.innerHTML = "";
  Array.from(inputCaja.files).slice(0,6).forEach(f => {
    miniaturasCaja.appendChild(crearMiniatura(f));
  });
});

// QR extra
selectQR.addEventListener("change", () => {
  const tipo = selectQR.value;
  qrExtraContainer.innerHTML = "";
  previsualizacionContainer.style.display = "none";
  previsualizacionContainer.innerHTML = "";
  qrExtraContainer.style.display = tipo ? "block" : "none";

  if(tipo === "men") {
    qrExtraContainer.innerHTML = `
      <label class="form-label">Mensaje personalizado:</label>
      <textarea class="js-qr-extra form-control" maxlength="200" style="resize:none; height:7vh;"></textarea>
    `;
  } else if(tipo === "foto") {
    qrExtraContainer.innerHTML = `
      <label class="form-label">URL de la foto de recuerdo:</label>
      <input type="text" class="js-qr-extra form-control" placeholder="https://...">
    `;
  } else if(["cum","nav","rey","año","bod","ani"].includes(tipo)) {
    qrExtraContainer.innerHTML = `
      <label class="form-label">Nombre del remitente:</label>
      <input type="text" class="js-qr-extra form-control" placeholder="Nombre">
    `;
  }

  const campoExtra = qrExtraContainer.querySelector(".js-qr-extra");
  if(campoExtra){
    campoExtra.addEventListener("input", updatePrevisualizacion);
  }
});

function updatePrevisualizacion(){
  const tipoRegaloVirtual = selectQR.value;
  const mensaje2 = qrExtraContainer.querySelector(".js-qr-extra")?.value || "";
  if(tipoRegaloVirtual && mensaje2){
    previsualizacionContainer.style.display = "block";
    previsualizacionContainer.innerHTML = `
      <a href="https://lubobu.com.ar/sorpresa/${tipoRegaloVirtual}/${encodeURIComponent(mensaje2)}" target="_blank">
        Previsualizar regalo
      </a>
    `;
  } else {
    previsualizacionContainer.style.display = "none";
    previsualizacionContainer.innerHTML = "";
  }
}

// === ENVÍO A API ===
btnAgregar.addEventListener("click", async (e) => {
  e.preventDefault();

  const nombreCliente = form.querySelector(".js-nombre-cliente").value.trim();
  if (!nombreCliente) {
    e.stopImmediatePropagation(); 
    alert("Por favor, ingrese el nombre del comprador.");
    return;
  }
  if (!inputCara.files.length) {
    e.stopImmediatePropagation(); 
    alert("Por favor, seleccioná una foto del peluche.");
    return;
  }

  const caraBase64 = await fileToBase64(inputCara.files[0]);
  const imagenesCajaBase64 = await Promise.all(
    Array.from(inputCaja.files).slice(0,6).map(f => fileToBase64(f))
  );

  const valores = form.querySelectorAll(".js-insta-variation-label");
  const nombreProducto = document.querySelector(".h2.js-product-name.h4.h2-md.mb-2")?.textContent || "";

  const payload = {
    orderId: crypto.randomUUID(),
    nombreCliente: nombreCliente,

    productos: [
      {
        nombre: nombreProducto,
        color: valores[0]?.textContent || "",
        caja: valores[1]?.textContent || "",
        imagenPeluche: caraBase64 || "",
        imagenesCaja: JSON.stringify(Array.isArray(imagenesCajaBase64) ? imagenesCajaBase64 : []),
        tipoRegaloVirtual: selectQR.value || "",
        mensajeCaja: form.querySelector(".js-mensaje-caja").value.trim() || "",
        comentario : form.querySelector(".js-comentario")?.value || "",
        regaloVirtual: form.querySelector(".js-qr-extra")?.value || ""
      }
    ]
  };

  try {
    console.log("Pedido enviado:", payload);

    const response = await createPedido2(payload);
    console.log("Pedido enviado:", response);

  } catch(err) {
    console.error(err);
    alert("Ocurrió un error al cargar el pedido.");
  }
});
