import { supabase } from './supabase.js'

const grid = document.getElementById("grid")
let seleccionados = []
let divSeleccionado = null

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
  divSeleccionado = null
  data.forEach(p => {
    const div = document.createElement("div")
    div.textContent = p.numero.toString().padStart(2,"0")
    div.className = "puesto " + p.estado
    div.onclick = () => seleccionar(div, p.numero, p.estado)
    grid.appendChild(div)
  })
}

function seleccionar(div, numero, estado) {
  if (estado === "vendido") return

  // Devolver a verde el puesto seleccionado anteriormente
  if (divSeleccionado) divSeleccionado.className = "puesto disponible"

  // Tocar el mismo puesto lo deselecciona
  if (divSeleccionado === div) {
    divSeleccionado = null
    seleccionados = []
    return
  }

  divSeleccionado = div
  seleccionados = [numero]
  div.className = "puesto seleccionado"
}

document.getElementById("compradorForm").onsubmit = async e => {
  e.preventDefault()
  if (seleccionados.length !== 1) {
    alert("Debes seleccionar exactamente 1 puesto")
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
