//import Chart from 'chart.js/auto';
import { measurments } from './threeJS.js'

//import $ from "jquery";

//import DataTable from 'datatables.net-dt';
//import 'datatables.net-select-dt';
//import 'datatables.net-colreorder-dt';

// const xSelect = document.getElementById('xSelectList');
// const ySelect = document.getElementById('ySelectList');

let xId = 0;
let yId = 10;

let isValues = false; //If both have X and Y have been selected in order to allow recording of values
let whatHeight = "floor";
let whatHeightY = "floor";
let isBuoyancy = false;


//import {DataTable} from './/jquery.dataTables.min.js'
//import { beaker } from './threeJS.js'

const ctx = document.getElementById('myChart');
const record = document.getElementById("record");

record.addEventListener('click', function() {
    //console.log(measurments);
    //let measure = Object.values(measurments);

    if(isValues){
        table.order([]);
        let row = addNewRow(measurments);
    
        addData(chart, parseNum(row[xId]), parseNum(row[yId]), xyValues);
        addData(chartBuoyancy, parseNum(row[xId]), parseNum(row[20]), xyValuesBuoyancy);
    }
    else{
        Swal.fire({
            html: `
            Δεν έχουν επιλεχθεί μεταβλητές για καταγραφή! <br> <br>
            Επέλεξε μεταβλητές πατώντας πάνω στους <b>άξονες στο γράφημα δεξιά</b>.
          `});
    }



});



let xyValues = [];
let xyValuesBuoyancy = [];


  
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
        locale: 'el-GR',
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
                display: false,
                text: 'Y-Axis Label',
                color: "#cccccc"
              }
            },
            x: {
              title: {
                display: false,
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


//second chart for buoyancy
const ctxBuoyancy = document.getElementById('myChartBuoyancy');




  
const chartBuoyancy = new Chart("myChartBuoyancy", {
    type: "scatter",
    data: {
        datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgba(242,144,144,1)",
        pointBorderColor: "rgba(242,144,144,1)",
        data: xyValuesBuoyancy
        }]
    },
    options: {
        locale: 'el-GR',
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
                display: false,
                text: 'Y-Axis Label',
                color: "#cccccc"
              }
            },
            x: {
              title: {
                display: false,
                text: 'X-Axis Label',
                color: "#cccccc"
              }
            }
        }
   }
    

});


chartBuoyancy.options.scales['x'].grid.color = "#555555";
chartBuoyancy.options.scales['y'].grid.color = "#555555";
chartBuoyancy.options.scales['x'].ticks.color = "#cccccc";
chartBuoyancy.options.scales['y'].ticks.color = "#cccccc";

chartBuoyancy.update();

//export { chart };

function addData(chart, x, y, values) {
    let xy = {
        x:x,
        y:y
    }
    values.push(xy);
    sessionStorage.setItem("chartData", values);
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
    // scrollCollapse: true,
    // scrollY: '20cqh',
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
        0,
        (data.force).toString().replace(".", ","),  //in N
        (Math.round(data.heightF*10)/1000).toString().replace(".", ","),   //in m
        (Math.round(data.heightW*10)/1000).toString().replace(".", ","),   //in m
        (data.volume/1000).toString().replace(".", ","),   //in L
        data.densityFl.toString().replace(".", ","),
        (Math.round(data.mass*1000)/1000).toString().replace(".", ","),
        (data.volumeObj/1000).toString().replace(".", ","),    //in L
        (data.density).toString().replace(".", ","),
        (data.gravity).toString().replace(".", ","),
        0,  //Second time for Y
        (data.force).toString().replace(".", ","),  //in N
        (Math.round(data.heightF*10)/1000).toString().replace(".", ","),   //in m
        (Math.round(data.heightW*10)/1000).toString().replace(".", ","),   //in m
        (data.volume/1000).toString().replace(".", ","),   //in L
        data.densityFl.toString().replace(".", ","),
        (Math.round(data.mass*1000)/1000).toString().replace(".", ","),
        (data.volumeObj/1000).toString().replace(".", ","),    //in L
        (data.density).toString().replace(".", ","),
        (data.gravity).toString().replace(".", ","),
        (Math.round((data.gravity*Math.round(data.mass*1000)/1000 - data.force)*100)/100).toString().replace(".", ",")  // Buoyancy in N
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

// xSelect.addEventListener('change', function() {
//     switch (this.value) {
//         case "volumeL":
//             xId = 0;
//             break;
//         case "force":
//             xId = 1;
//             break;
//         case "height":
//             xId = 2;
//             break;
//         case "mass":
//             xId = 3;
//             break;
//         case "densityO":
//             xId = 4;
//             break;
//         case "volumeO":
//             xId = 5;
//             break;
//         case "densityL":
//             xId = 6;
//             break;
//         case "gravity":
//             xId = 7;
//             break;
//     }
//     visibleColumns(table, xId, yId);
//     clearAndUpdateChart();
// });

// ySelect.addEventListener('change', function() {
//     switch (this.value) {
//         case "volumeL":
//             yId = 8;
//             break;
//         case "force":
//             yId = 9;
//             break;
//         case "height":
//             yId = 10;
//             break;
//         case "mass":
//             yId = 11;
//             break;
//         case "densityO":
//             yId = 12;
//             break;
//         case "volumeO":
//             yId = 13;
//             break;
//         case "densityL":
//             yId = 14;
//             break;
//         case "gravity":
//             yId = 15;
//             break;
//     }
//     visibleColumns(table, xId, yId);
//     clearAndUpdateChart();
// });

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
    xyValuesBuoyancy.length = 0;

    let data = table.rows().data();

    // let xLabel = xSelect.options[xSelect.selectedIndex].text;
    // chart.options.scales['x'].title.text = xLabel;
    // chartBuoyancy.options.scales['x'].title.text = xLabel;

    // let yLabel = ySelect.options[ySelect.selectedIndex].text;
    // chart.options.scales['y'].title.text = yLabel;
    // chartBuoyancy.options.scales['y'].title.text = "Άνωση (Ν)";

    for(let i = 0; i < data.length; i++){
        addData(chart, parseNum(data[i][xId]), parseNum(data[i][yId]), xyValues);
    }
    chart.update();

    for(let i = 0; i < data.length; i++){
        addData(chartBuoyancy, parseNum(data[i][xId]), parseNum(data[i][20]), xyValuesBuoyancy);
    }
    chartBuoyancy.update();
}

//get string with comma seperator and return float
function parseNum (string){
    return parseFloat(string.replace(".", "").replace(",", "."));
}

//Make only the x and y colums visible hide the others
function visibleColumns(table, x, y, b=false){
    table.column( x ).visible( true );
    table.column( y ).visible( true );

    for (let i = 0; i < 21; i++){
        if (i != x && i != y){
            table.column( i ).visible( false );
        }
    }

    if(isBuoyancy){
        table.column( 20 ).visible( true );
    }

    if(x != 0 && y != 10){
        isValues = true;
    }
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



//Show window to display buoyancy
let calcBuoyancyButton = document.getElementById("calcBuoyancyButton");


calcBuoyancyButton.addEventListener('click', function() {
    calcBuoyancyButton.style.display = "none";
    document.getElementById("chartContainerBuoyancy").style.display = "block";
    isBuoyancy = true;
    document.getElementById("tableDiv").style.height = "32cqh";
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
});


//The X variable modal window
let parameterXWindow = document.getElementById("parameterXWindow");

let showXWindow = document.getElementById("xSelectButton");

var span = document.getElementsByClassName("close")[0];

showXWindow.onclick = function() {
    parameterXWindow.style.display = "block";
}

span.onclick = function() {
    parameterXWindow.style.display = "none";
}

//The Y variable modal window
let parameterYWindow = document.getElementById("parameterYWindow");

let showYWindow = document.getElementById("ySelectButton");

var spanY = document.getElementsByClassName("close")[1];

showYWindow.onclick = function() {
    parameterYWindow.style.display = "block";
}

spanY.onclick = function() {
    parameterYWindow.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == parameterYWindow) {
        parameterYWindow.style.display = "none";
    }
    if (event.target == parameterXWindow) {
        parameterXWindow.style.display = "none";
    }
}

//Select X
function makeXGrey(){
    document.getElementById("forceParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("heightParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("volumeLParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("densityLParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("massParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("volumeParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("densityParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("gravityParamX").style.backgroundColor = "#c7c7c7";
    document.getElementById("chooseHeightType").style.display = "none";
}

document.getElementById("forceParamX").onclick = function(){
    makeXGrey();
    document.getElementById("forceParamX").style.backgroundColor = "#9AD284";
    xId = 1;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("forceParamX").textContent;
}

document.getElementById("heightParamX").onclick = function(){
    makeXGrey();
    document.getElementById("heightParamX").style.backgroundColor = "#9AD284";
    document.getElementById("chooseHeightType").style.display = "block";
    if (whatHeight == "floor"){
        xId = 2;
        showXWindow.textContent = "Απόσταση από έδαφος (m)";
    }
    else {
        xId = 3;
        showXWindow.textContent = "Απόσταση από επιφάνεια υγρού (m)";
    }
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    
}

document.getElementById("volumeLParamX").onclick = function(){
    makeXGrey();
    document.getElementById("volumeLParamX").style.backgroundColor = "#9AD284";
    xId = 4;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("volumeLParamX").textContent;
}

document.getElementById("densityLParamX").onclick = function(){
    makeXGrey();
    document.getElementById("densityLParamX").style.backgroundColor = "#9AD284";
    xId = 5;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("densityLParamX").textContent;
}

document.getElementById("massParamX").onclick = function(){
    makeXGrey();
    document.getElementById("massParamX").style.backgroundColor = "#9AD284";
    xId = 6;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("massParamX").textContent;
}

document.getElementById("volumeParamX").onclick = function(){
    makeXGrey();
    document.getElementById("volumeParamX").style.backgroundColor = "#9AD284";
    xId = 7;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("volumeParamX").textContent;
}

document.getElementById("densityParamX").onclick = function(){
    makeXGrey();
    document.getElementById("densityParamX").style.backgroundColor = "#9AD284";
    xId = 8;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("densityParamX").textContent;
}

document.getElementById("gravityParamX").onclick = function(){
    makeXGrey();
    document.getElementById("gravityParamX").style.backgroundColor = "#9AD284";
    xId = 9;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = document.getElementById("gravityParamX").textContent;
}

document.getElementById("heightParamXfloor").onclick = function(){
    document.getElementById("heightParamXfloor").style.backgroundColor = "#9AD284";
    document.getElementById("heightParamXwater").style.backgroundColor = "#c7c7c7";
    xId = 2;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = "Απόσταση από έδαφος (m)";
    whatHeight = "floor";
}

document.getElementById("heightParamXwater").onclick = function(){
    document.getElementById("heightParamXwater").style.backgroundColor = "#9AD284";
    document.getElementById("heightParamXfloor").style.backgroundColor = "#c7c7c7";
    xId = 3;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showXWindow.textContent = "Απόσταση από επιφάνεια υγρού (m)";
    whatHeight = "water";
}

//SelectY
function makeYGrey(){
    document.getElementById("forceParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("heightParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("volumeLParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("densityLParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("massParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("volumeParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("densityParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("gravityParamY").style.backgroundColor = "#c7c7c7";
    document.getElementById("chooseHeightTypeY").style.display = "none";
}

document.getElementById("forceParamY").onclick = function(){
    makeYGrey();
    document.getElementById("forceParamY").style.backgroundColor = "#9AD284";
    yId = 11;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("forceParamY").textContent;
    if(isBuoyancy == false){
        calcBuoyancyButton.style.display = "block";
        document.getElementById("tableDiv").style.height = "52cqh";
    }
}

document.getElementById("heightParamY").onclick = function(){
    makeYGrey();
    document.getElementById("heightParamY").style.backgroundColor = "#9AD284";
    document.getElementById("chooseHeightTypeY").style.display = "block";
    if (whatHeightY == "floor"){
        yId = 12;
        showYWindow.textContent = "Απόσταση από έδαφος (m)";
    }
    else {
        yId = 13;
        showYWindow.textContent = "Απόσταση από επιφάνεια υγρού (m)";
    }
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    
}

document.getElementById("volumeLParamY").onclick = function(){
    makeYGrey();
    document.getElementById("volumeLParamY").style.backgroundColor = "#9AD284";
    yId = 14;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("volumeLParamY").textContent;
}

document.getElementById("densityLParamY").onclick = function(){
    makeYGrey();
    document.getElementById("densityLParamY").style.backgroundColor = "#9AD284";
    yId = 15;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("densityLParamY").textContent;
}

document.getElementById("massParamY").onclick = function(){
    makeYGrey();
    document.getElementById("massParamY").style.backgroundColor = "#9AD284";
    yId = 16;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("massParamY").textContent;
}

document.getElementById("volumeParamY").onclick = function(){
    makeYGrey();
    document.getElementById("volumeParamY").style.backgroundColor = "#9AD284";
    yId = 17;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("volumeParamY").textContent;
}

document.getElementById("densityParamY").onclick = function(){
    makeYGrey();
    document.getElementById("densityParamY").style.backgroundColor = "#9AD284";
    yId = 18;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("densityParamY").textContent;
}

document.getElementById("gravityParamY").onclick = function(){
    makeYGrey();
    document.getElementById("gravityParamY").style.backgroundColor = "#9AD284";
    yId = 19;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = document.getElementById("gravityParamY").textContent;
}

document.getElementById("heightParamYfloor").onclick = function(){
    document.getElementById("heightParamYfloor").style.backgroundColor = "#9AD284";
    document.getElementById("heightParamYwater").style.backgroundColor = "#c7c7c7";
    yId = 12;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = "Απόσταση από έδαφος (m)";
    whatHeightY = "floor";
}

document.getElementById("heightParamYwater").onclick = function(){
    document.getElementById("heightParamYwater").style.backgroundColor = "#9AD284";
    document.getElementById("heightParamYfloor").style.backgroundColor = "#c7c7c7";
    yId = 13;
    visibleColumns(table, xId, yId);
    clearAndUpdateChart();
    showYWindow.textContent = "Απόσταση από επιφάνεια υγρού (m)";
    whatHeightY = "water";
}