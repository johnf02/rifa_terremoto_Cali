import { supabase } from './supabase.js'

const grid = document.getElementById("grid")
let seleccionados = []

async function cargarPuestos() {
  const { data } = await supabase.from('puestos').select()
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
  const comprador = {
    nombre: document.getElementById("nombre").value,
    cedula: document.getElementById("cedula").value,
    telefono: document.getElementById("telefono").value
  }
  const { data: nuevo } = await supabase.from('compradores').insert(comprador).select().single()
  await supabase.from('puestos').update({ estado: 'vendido', comprador_id: nuevo.id }).in('numero', seleccionados)
  seleccionados = []
  cargarPuestos()
}

cargarPuestos()
