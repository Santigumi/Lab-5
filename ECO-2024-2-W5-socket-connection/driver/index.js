let socket = io("http://localhost:5050", { path: "/real-time" });

const appState = {
  page: 'login'
}

const form = {
  'nombre': '',
  'carro': '',
  'placa': ''
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

  const nombre = document.getElementById("nombre");
  nombre.addEventListener('change', function() {changeName(nombre.value)})
 
  const buttonLogin = document.createElement('button')
  buttonLogin.innerText = 'Login'
  buttonLogin.id = 'buttonLogin'
  login.appendChild(buttonLogin)

  buttonLogin.addEventListener('click', function() {changeScreen('select')})

} else if(appState.page === 'select') {
  const login = document.getElementById('Login')
  login.innerHTML = ''
  
  const select = document.getElementById('Select')
  const titule = document.createElement('h1')
  titule.innerText = 'Selecciona un vehículo'
  select.appendChild(titule)

  const labelVehicule = document.createElement('label');
  labelVehicule.for = 'vehicule';
  labelVehicule.innerText = 'Nombre del vehículo';
  const vehicule = document.createElement('input');
  vehicule.id = 'vehicule';
  select.appendChild(labelVehicule)
  select.appendChild(vehicule);

  const labelPlaca = document.createElement('label')
  labelPlaca.for = 'Placa';
  labelPlaca.innerText = 'Placa del vehículo'
  const placa = document.createElement('input');
  placa.id = 'Placa'
  select.appendChild(labelPlaca)
  select.appendChild(placa);

  const buttonRegister = document.createElement('button');
  buttonRegister.innerText = 'Registrar';
  select.appendChild(buttonRegister);

  vehicule.addEventListener('change', function() {changeCar(vehicule.value)})
  placa.addEventListener('change', function() {changePlaca(placa.value)})

  buttonRegister.addEventListener('click', function() {changeScreen('state')})

} else if(appState.page === 'state'){
  const select = document.getElementById('Select')
  select.innerHTML = ''

  const State = document.getElementById('State')

  const titule = document.createElement('h1')
  titule.innerText = 'Estado'
  State.appendChild(titule)

  const Selectvehicule = document.createElement('p');
  Selectvehicule.innerText = 'Vehículo seleccionado'
  State.appendChild(Selectvehicule)

  const Activar = document.createElement('button')
  Activar.innerText = 'Activar'
  State.appendChild(Activar)
  
  const Desactivar = document.createElement('button')
  Desactivar.innerText = 'Desactivar'
  State.appendChild(Desactivar)

  const Waiting = document.createElement('p');

  State.appendChild(Waiting)

  Activar.addEventListener('click', function(){createUser()})

} else if (appState.page === 'request'){
  const state = document.getElementById('State')
  state.innerHTML = ''
  
  const Request = document.getElementById('Request')
  
  const titule = document.createElement('h1')
  titule.innerText = 'Nuevo viaje'
  Request.appendChild(titule)

  const infoPasajero = document.createElement('div')
  infoPasajero.className = 'infoPasajero'
  Request.appendChild(infoPasajero)

  const Accept = document.createElement('button')
  Accept.innerText = 'Aceptar'
  Request.appendChild(Accept)

  Request.addEventListener('click', function() {changeScreen('trip')})

} else if(appState.page === 'trip'){
  const request = document.getElementById('Request')
  request.innerHTML = ''

  const Trip = document.getElementById('Trip')

  const titule = document.createElement('h1')
  titule.innerText = 'Viaje en progreso'
  Trip.appendChild(titule)
  
  const Iniciar = document.createElement('button')
  Iniciar.innerText = 'Iniciar viaje'
  Trip.appendChild(Iniciar)

  Iniciar.addEventListener('click', function(){Iniciar.innerHTML = 'Finalizar viaje'})
}}

function changeName(e) {
  form.nombre = e
}

function changeCar(e) {
  form.carro = e
  }

function changePlaca(e) {
  form.placa = e
  }

function changeScreen(e) {
  appState.page = e
  renderPage()
}

async function createUser() {
  try {
    const usuario = {
      nombre: form.nombre,
      carro: form.carro,
      placa: form.placa
    };
    const response = await fetch("http://localhost:5050/driver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    changeScreen('request')
    await fetchData()
  } catch (error) {
    alert('usuario no registrado')
  }
}

async function fetchData() {
  socket.emit("data-driver", form);
  console.log(form);
  if (appState.page === 'request') {
    clientsData()
    }
  }

  async function fecthClientsData(){
    try {
        const response = await fetch("http://localhost:5050/clients")
        if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        const clientsData = await response.json()
        return clientsData
    } catch (error) {
        alert('hi')
    }
}

async function clientsData(){
  const clientData = await fecthClientsData()
  const Request = document.getElementById('Request')

  let infoPasajero = document.querySelector('.infoPasajero');

  if (infoPasajero) {
    infoPasajero.innerHTML = '';
  } else {
    infoPasajero = document.createElement('div');
    infoPasajero.className = 'infoPasajero';
    Request.appendChild(infoPasajero);
  }

  clientData.forEach(element => {
    const cart = document.createElement('cart')
    const nombre = document.createElement('p')
    nombre.innerText = element.nombre
    cart.appendChild(nombre)
  
    const origen = document.createElement('p')
    origen.innerText = element.origen
    cart.appendChild(origen)
  
    const destino = document.createElement('p')
    destino.innerText = element.destino
    cart.appendChild(destino)
    infoPasajero.appendChild(cart)
  });
}


socket.on("data-client", ()=>{
  if(appState.page === 'request'){
    clientsData()
  }
})
