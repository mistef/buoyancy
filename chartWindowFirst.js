//import Chart from 'chart.js/auto';
import { measurments } from './threeJS.js'

//import $ from "jquery";

//import DataTable from 'datatables.net-dt';
//import 'datatables.net-select-dt';
//import 'datatables.net-colreorder-dt';

const xSelect = document.getElementById('xSelectList');
const ySelect = document.getElementById('ySelectList');

let xId = 2;
let yId = 9;




//import {DataTable} from './/jquery.dataTables.min.js'
//import { beaker } from './threeJS.js'

const ctx = document.getElementById('myChart');
const record = document.getElementById("record");

record.addEventListener('click', function() {
    //console.log(measurments);
    //let measure = Object.values(measurments);


    table.order([]);
    let row = addNewRow(measurments);

    addData(chart, parseNum(row[xId]), parseNum(row[yId]));


});



let xyValues = [];


  
const chart = new Chart("myChart", {
    type: "scatter",
    data: {
        datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgba(154,210,132,1)",
        pointBorderColor: "rgba(154,210,132,1)",
        data: xyValues
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                displayColors: false
            }
        },
        scales: {
            y: {
              //beginAtZero: true,
              title: {
                display: true,
                text: 'Y-Axis Label',
                color: "#cccccc"
              }
            },
            x: {
              title: {
                display: true,
                text: 'X-Axis Label',
                color: "#cccccc"
              }
            }
        }
   }
    

});

chart.options.scales['x'].grid.color = "#555555";
chart.options.scales['y'].grid.color = "#555555";
chart.options.scales['x'].ticks.color = "#cccccc";
chart.options.scales['y'].ticks.color = "#cccccc";

chart.update();

//export { chart };

function addData(chart, x, y) {
    let xy = {
        x:x,
        y:y
    }
    xyValues.push(xy);
    sessionStorage.setItem("chartData", xyValues);
    chart.update();
}



let table = new DataTable('#myTable', {
    info: false,
    locale: 'gr',
    paging: false,
    searching: false,
    order : [],
    language: {
        decimal: ',',
        thousands: '.',
        emptyTable: "Δεν έχουν καταγραφεί μετρήσεις"
    },
    select: true,
    stateSave: true,
    stateSaveParams : function (settings, data) {
        data.search.search = "";
      }
});

$('#example').dataTable( {
    "stateSave": true,
    "stateSaveParams": function (settings, data) {
      data.search.search = "";
    }
  } );

// table.on('click', 'tbody tr', function (e) {
//     e.currentTarget.classList.toggle('selected');
// });

// function addNewRow(x, y) {
//     table.row
//         .add([x, y])
//         .draw(true);

// }
function addNewRow(data) {
    let row = [
    (data.volume/1000).toString().replace(".", ","),   //in L
    (data.force).toString().replace(".", ","),  //in N
    (Math.round(data.height*10)/1000).toString().replace(".", ","),   //in m
    (Math.round(data.mass*1000)/1000).toString().replace(".", ","),
    data.densityFl.toString().replace(".", ","),
    (data.volumeObj/1000).toString().replace(".", ","),    //in L
    (data.density).toString().replace(".", ","),    //Second Time for Y
    (data.gravity).toString().replace(".", ","),
    (data.volume/1000).toString().replace(".", ","),   //in L
    (data.force).toString().replace(".", ","),  //in N
    (Math.round(data.height*10)/1000).toString().replace(".", ","),   //in m
    (Math.round(data.mass*1000)/1000).toString().replace(".", ","),
    data.densityFl.toString().replace(".", ","),
    (data.volumeObj/1000).toString().replace(".", ","),    //in L
    (data.density).toString().replace(".", ","),
    (data.gravity).toString().replace(".", ",")

    ];
    table.row
        .add(row)
        .draw(true);
    return row;
}


visibleColumns(table, xId, yId);
clearAndUpdateChart();


// $(document).ready( function () {
//     $('#myTable').DataTable({
//         "searching": false,
//         "language": {
//             "decimal": ","
//         }
//     });
// } );

xSelect.addEventListener('change', function() {
    switch (this.value) {
        case "volumeL":
            xId = 0;
            break;
        case "force":
            xId = 1;
            break;
        case "height":
            xId = 2;
            break;
        case "mass":
            xId = 3;
            break;
        case "densityO":
            xId = 4;
            break;
        case "volumeO":
            xId = 5;
            break;
        case "densityL":
            xId = 6;
            break;
        case "gravity":
            xId = 7;
            break;
    }
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
});

ySelect.addEventListener('change', function() {
    switch (this.value) {
        case "volumeL":
            yId = 8;
            break;
        case "force":
            yId = 9;
            break;
        case "height":
            yId = 10;
            break;
        case "mass":
            yId = 11;
            break;
        case "densityO":
            yId = 12;
            break;
        case "volumeO":
            yId = 13;
            break;
        case "densityL":
            yId = 14;
            break;
        case "gravity":
            yId = 15;
            break;
    }
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
});

//on del key press remove rows
$(document).on('keyup', function ( e ) {
    if ( e.keyCode === 46  && table.rows( { selected: true } ).any() ) { // 46 == delete key
        table.rows('.selected').remove().draw(false);
        clearAndUpdateChart();
    }
  } );

function clearAndUpdateChart(){
    //console.log(table.rows().data()[0][4]); //[row][column]
    //console.log(table.rows().data().length);
    //chart.clear();
    //Clear the array for the data
    xyValues.length = 0;

    let data = table.rows().data();

    let xLabel = xSelect.options[xSelect.selectedIndex].text;
    chart.options.scales['x'].title.text = xLabel;

    let yLabel = ySelect.options[ySelect.selectedIndex].text;
    chart.options.scales['y'].title.text = yLabel;

    for(let i = 0; i < data.length; i++){
        addData(chart, parseNum(data[i][xId]), parseNum(data[i][yId]));
    }
    chart.update();
}

//get string with comma seperator and return float
function parseNum (string){
    return parseFloat(string.replace(".", "").replace(",", "."));
}

//Make only the x and y colums visible hide the others
function visibleColumns(table, x, y){
    table.column( x ).visible( true );
    table.column( y ).visible( true );

    for (let i = 0; i < 16; i++){
        if (i != x && i != y){
            table.column( i ).visible( false );
        }
    }

    //reorder the x and y colomns
    //table.colReorder.move( x, 0 );
    
}


//the buttons for delete
const deleteSelected = document.getElementById("deleteSelected");

deleteSelected.addEventListener('click', function() {
    table.rows('.selected').remove().draw(false);
    clearAndUpdateChart();
});

const deleteEverything = document.getElementById("deleteEverything");

deleteEverything.addEventListener('click', function() {
    table.rows().remove().draw(false);
    clearAndUpdateChart();
});
