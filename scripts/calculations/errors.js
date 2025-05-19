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


export function calculateErrorForce(force){
    if (!isError){
        return force;
    }
    else{
        return force;
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