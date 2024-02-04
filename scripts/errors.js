const buttonAcc = document.getElementById('buttonAcc');
let isError = false;

export{isError};


buttonAcc.addEventListener('click', function() {
    changeState();
});

function init() {
    changeState(false);
}
init();

//optional arguement otherwise switches
function changeState(set){
    if (set === true){
        isError = true;
        buttonAcc.textContent = "Ακρίβεια: Ρεαλιστική";
    }
    else if (set === false){
        isError = false;
        buttonAcc.textContent = "Ακρίβεια: Μέγιστη";
    }
    else if (isError){
        isError = false;
        buttonAcc.textContent = "Ακρίβεια: Μέγιστη";
    }
    else{
        isError = true;
        buttonAcc.textContent = "Ακρίβεια: Ρεαλιστική";
    }
}


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


