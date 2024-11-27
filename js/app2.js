
//Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

function UI() { }

//Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function() {
    /* 
        1 = Americano 1.15
        2 = Asiático 1.05
        3 = Europeo 1.35
    */

        let cantidad;
        const base = 2000;

   switch(this.marca) {
        case '1':
            cantidad =  base * 1.15;
            break;
        case '2':
            cantidad =  base * 1.05;
            break;
        case '3':
            cantidad =  base * 1.35;
            break;
        default:
            break;
   }

   //Leer el año
   const diferencia = new Date().getFullYear() - this.year;
   
   //Entre más antiguo sea el año, el costo va a reducirse un 3%
   cantidad = cantidad - (diferencia * .03) * cantidad;
   
   /* 
    Si el seguro es básico se múltiplica por un 30% más
    Si el seguro es completo se múltiplica por un 50% más
   */

    if(this.tipo === 'basico') {
        cantidad = cantidad * .3;
    }else {
        cantidad = cantidad * .5;
    }
   return cantidad;
}


//Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = function(mensaje, tipo) {

    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add('mensaje', 'mt-10','error');
    } else {
        div.classList.add('mensaje', 'mt-10', 'correcto');
    }

    div.textContent = mensaje;

    //Insertar en HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;

    let nombreMarca;

    switch(marca) {
        case '1':
            nombreMarca = 'Americano'
            break;
        case '2':
            nombreMarca = 'Asiático'
            break;
        case '3':
            nombreMarca = 'Europeo'
            break;
        default:
            break;
    }
   
    //Crear el resultado
    const div = document.createElement('DIV');
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class="header"> Tu Resumen </p>
    <p class="font-bold"> Marca: <span class="font-normal"> ${nombreMarca} </span> </p>
    <p class="font-bold"> Año: <span class="font-normal"> ${year} </span> </p>
    <p class="font-bold"> Tipo: <span class="font-normal capitalize"> ${tipo} </span> </p>
    <p class="font-bold"> Total: <span class="font-normal"> $${total} </span> </p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

      //Mostrar el spinner
      const spinner = document.querySelector('#cargando');
      spinner.style.display = 'block';
 
      setTimeout(() => {
         spinner.style.display = 'none' //Se borra el spinner
         resultadoDiv.appendChild(div); //Pero se muestra el resultado
     }, 3000);
}

//Instanciar UI
const ui = new UI();

//Llena el selecto con los años
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); 
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    //Leer la marca seleccionada
    const marca =  document.querySelector('#marca').value

     //Leer el año seleccionada
     const year =  document.querySelector('#year').value

      //Leer el tipo de cobertura 
      const tipo =  document.querySelector('input[type="radio"]:checked').value;
      if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    ui.mostrarMensaje('Cotizando...', 'exito');

    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Utilizar el prototype que va a cotizar.
    ui.mostrarResultado(total, seguro);

     //Ocultar las cotizaciones previas
     const resultados = document.querySelector('#resultado div'); //Seleccionando el div dentro de resultado
     if(resultados !== null) {
         resultados.remove();
     }
}