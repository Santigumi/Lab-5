let socket = io("http://localhost:5050", { path: "/real-time" });

const appState = {
  page: 'login'
}

const form = {
  'nombre': '',
  'origen': '',
  'destino': ''
}

renderPage()

async function renderPage(){
  if (appState.page === 'login') {
  const login = document.getElementById('Login')
  const titule = document.createElement('h1')
  titule.innerText = 'Tuber'
  login.appendChild(titule)

  const subtitule = document.createElement('h2')
  subtitule.innerText = 'Ingresa tu nombre para iniciar tu viaje'
  login.appendChild(subtitule)

  const nombreInput = document.createElement('input')
  nombreInput.id = 'nombre'
  login.appendChild(nombreInput)

  const buttonLogin = document.createElement('button')
  buttonLogin.innerText = 'Login'
  buttonLogin.id = 'buttonLogin'
  login.appendChild(buttonLogin)

  nombreInput.addEventListener('change', function() {changeName(nombreInput.value)})
  buttonLogin.addEventListener("click", function(){changeScreen('Travel')})

} else if(appState.page === 'Travel') {
  const login = document.getElementById('Login')
  login.innerHTML = ''
  
  const travel = document.getElementById('Travel')
  const titule = document.createElement('h1')
  titule.innerText = 'Selecciona el origen y el destino'
  travel.appendChild(titule)

  const labelOrigin = document.createElement('label');
  labelOrigin.for = 'origin';
  labelOrigin.innerText = 'Origen';
  const Origin = document.createElement('input');
  Origin.id = 'origin';
  travel.appendChild(labelOrigin)
  travel.appendChild(Origin);

  const labelDestiny = document.createElement('label')
  labelDestiny.for = 'Placa';
  labelDestiny.innerText = 'Destino'
  const destiny = document.createElement('input');
  destiny.id = 'Placa'
  travel.appendChild(labelDestiny)
  travel.appendChild(destiny);

  const buttonRequest = document.createElement('button');
  buttonRequest.innerText = 'Solicitar viaje';
  travel.appendChild(buttonRequest);

  Origin.addEventListener('change', function(){changeOrigen(Origin.value)})
  destiny.addEventListener('change', function(){changeDestiny(destiny.value)})

  buttonRequest.addEventListener('click', function() {createUser()})

} else if(appState.page === 'select'){
  const travel = document.getElementById('Travel')
  travel.innerHTML = ''

  const select = document.getElementById('Select')

  const titule = document.createElement('h1')
  titule.innerText = 'Conductores disponibles'
  select.appendChild(titule)

  const list = document.createElement('div');
  list.id = 'list'

  select.appendChild(list)

  const Activar = document.createElement('button')
  select.appendChild(Activar)
  Activar.addEventListener('click', function() {changeScreen('trip')})

} else if (appState.page === 'trip'){
  const select = document.getElementById('Select')
  select.innerHTML = ''
  
  const trip = document.getElementById('Trip')
  
  const titule = document.createElement('h1')
  titule.innerText = 'Viaje en progreso'
  trip.appendChild(titule)

  const infoTrip = document.createElement('div')
  trip.appendChild(infoTrip)
} 
}

function changeName(e) {
  form.nombre = e
}

function changeOrigen(e) {
  form.origen = e
}

function changeDestiny(e) {
  form.destino = e
}

function changeScreen(e) {
  appState.page = e
  renderPage()
}

socket.on("data-client", (data) => {
    const section = document.getElementById('Select')
    const cart = document.createElement('cart')
    const nombre = document.createElement('p')
    nombre.innerText = data.nombre
    cart.appendChild(nombre)

    const origen = document.createElement('p')
    origen.innerText = data.origen
    cart.appendChild(origen)

    const destino = document.createElement('p')
    destino.innerText = data.destino
    cart.appendChild(destino)
    section.appendChild(cart)
});

async function createUser() {
  try {
    const usuario = {
      nombre: form.nombre,
      origen: form.origen,
      destino: form.destino
    };
    const response = await fetch("http://localhost:5050/client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    fetchData()
    changeScreen('select')
  } catch (error) {
    alert('usuario no registrado')
  }
}

async function fetchData() {
  socket.emit("data-client", form);
  console.log(form);
  }