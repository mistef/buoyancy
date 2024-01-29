const switchErrors = document.getElementById('switchErrors');
let isError = false;

switchErrors.addEventListener('change', function() {
    if (switchErrors.checked){
        isError = true;
    }
    else{
        isError = false;
    }
});

function init() {
    calculateForceCoefficients();
}
init();


export function calculateErrorForce(force, accuracy = 1){
    if (!isError){
        return force;
    }
    else{
        return Math.round(force/accuracy)*accuracy;
    }

}

export function calculateErrorBeaker(volume, accuracy){
    if (!isError){
        return Math.round(volume);
    }
    else{
        return Math.round(volume/accuracy)*accuracy;
    }
}


function calculateForceCoefficients(){

}