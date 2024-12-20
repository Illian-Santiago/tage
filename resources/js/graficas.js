import ApexCharts from 'apexcharts';

let array = [];
const urlAntes = '/api/antes';
const token = sessionStorage.getItem('apiToken');

const url = '/api/registros';

function viewGraficas(valores, compReg) {
    const idCompostera = window.location.href.slice(-1);
    let valoresArray = valores.data;

    let idWithCompostera = compReg.map(e => {
        return e.compostera == idCompostera ? e.id : null;
    }).filter(id => id != null);

    let filtroId = valoresArray.filter(e => idWithCompostera.includes(e.registro_id));

    const arrayTempAmb = filtroId.map(e => e.tempAmbiente);
    const arrayTempComp = filtroId.map(e => e.tempCompostera);
    const arrayFechaInsercion = filtroId.map(e => e.created_at ? e.created_at.slice(0, 10) : ''); // Aquí está la comprobación

    var options = {
        series: [
        {
          name: "Temperatura Ambiente",
          data: arrayTempAmb
        },
        {
          name: "Temperatura Compostera",
          data: arrayTempComp
        }
      ],
        chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5
        },
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Average High & Low Temperature',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: arrayFechaInsercion,
        title: {
          text: 'Fecha'
        }
      },
      yaxis: {
        title: {
          text: 'Temperature'
        },
        min: 5,
        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
}


export default async function fetchDataAntes() {
    const comp = await regComposte();
    try {
        const response = await fetch(urlAntes, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Verificar si la respuesta es válida
        if (!response.ok) {
            const errorData = await response.text(); // Usamos .text() para inspeccionar el error
            console.error('Errores devueltos por el servidor:', errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Verificar si el cuerpo tiene contenido antes de convertir a JSON
        const textResponse = await response.text();
        if (textResponse.trim() === "") {
            console.warn("El servidor devolvió una respuesta vacía.");
            return [];
        }

        const result = JSON.parse(textResponse); // Convertir el texto a JSON
        console.log('Datos obtenidos de la base de datos:', result);

        // Actualizamos el array con la información obtenida
        array = result;

        viewGraficas(array, comp);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Propagamos el error para manejarlo en otro lugar si es necesario
    }
}

async function regComposte() { // Cambiamos el nombre de la función para mayor claridad
    try {
        // Asegúrate de ajustar el parámetro de 'limit' según la documentación de la API
        const response = await fetch(`${url}?limit=1000`, { // Modificado para obtener más registros (o sin límite)
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const datos = await response.json(); // Convertir a JSON
        console.log('Datos recibidos:', datos); // Verificar qué estructura tiene la API

        // Asegúrate de que "datos" sea un array
        const registros = Array.isArray(datos) ? datos : datos.data || [];

        if (registros.length === 0) {
            console.log('No hay registros disponibles.');
            return [];
        }

        // Ordenar por fecha (descendente), si es necesario
        const registrosOrdenados = registros.sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        console.log('Registros ordenados:', registrosOrdenados);
        return registrosOrdenados; // Devolver el arreglo completo
    } catch (error) {
        console.log(`Error en la promesa: ${error}`);
        return []; // Devolver un arreglo vacío en caso de error
    }
}
