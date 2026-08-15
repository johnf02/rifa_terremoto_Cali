import { supabase } from './supabase.js'

const grid = document.getElementById("grid")
let seleccionados = []

// Cargar puestos desde Supabase
async function cargarPuestos() {
  const { data, error } = await supabase
    .from('puestos')
    .select()
    .order('numero', { ascending: true })   // 👈 aquí está la clave

  if (error) {
    console.error(error)
    return
  }

  grid.innerHTML = ""
  data.forEach(p => {
    const div = document.createElement("div")
    div.textContent = p.numero.toString().padStart(3,"0")
    div.className = "puesto " + p.estado
    div.onclick = () => seleccionar(div, p.numero, p.estado)
    grid.appendChild(div)
  })
}

function seleccionar(div, numero, estado) {
  if (estado === "vendido") return
  if (seleccionados.includes(numero)) {
    seleccionados = seleccionados.filter(x => x !== numero)
    div.className = "puesto disponible"
  } else {
    if (seleccionados.length >= 10) {
      alert("Solo puedes seleccionar 10 puestos")
      return
    }
    seleccionados.push(numero)
    div.className = "puesto vendido"
  }
}

document.getElementById("compradorForm").onsubmit = async e => {
  e.preventDefault()
  if (seleccionados.length !== 10) {
    alert("Debes seleccionar exactamente 10 puestos")
    return
  }

  // Insertar comprador en Supabase
  const comprador = {
    nombre: document.getElementById("nombre").value,
    cedula: document.getElementById("cedula").value,
    telefono: document.getElementById("telefono").value
  }

  const { data: nuevo, error } = await supabase
    .from('compradores')
    .insert(comprador)
    .select()
    .single()

  if (error) {
    console.error(error)
    alert("Error guardando comprador")
    return
  }

  // Actualizar puestos vendidos
  const { error: errorPuestos } = await supabase
    .from('puestos')
    .update({ estado: 'vendido', comprador_id: nuevo.id })
    .in('numero', seleccionados)

  if (errorPuestos) {
    console.error(errorPuestos)
    alert("Error guardando puestos")
    return
  } else {
    alert("Proceso realizado correctamente")
  }

  seleccionados = []
  cargarPuestos()
}

// Inicializar
cargarPuestos()
