// $(document).ready(function () {
//     validateForm();
// });

// function validateForm() {
//     $('#registrationForm').on('submit', function (e){ 
//         e.preventDefault();
//         let pass = $("#password").val();
//         let confirmPas = $("#confirmPassword").val();
//         console.log(pass);
//         console.log(confirmPas);

//         if (pass !== confirmPas) {
//             alert("Confirm Password not matching");
//             return false
//         } else if (pass === confirmPas){
//             $(this).submit(); 
//             // $(this).off("submit");
//             // this.submit();
//         }
//     })};


function validateForm() {
    let pass = $("#password").val();
    let confirmPas = $("#confirmPassword").val();
    let checked = $('#termsandconditions').is(":checked");
    console.log('******checked****');
    console.log(checked);
    console.log(pass);
    console.log(confirmPas);

    if (pass !== confirmPas) {
        alert("Confirm Password is not matching");
        $("#errorMessageRegister").append(`<div class="alert alert-danger alert-dismissible fade show kt-alert kt-alert--outline m-0" role="alert">
            <span>Confirm Password is not matching</span> 
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>`)
        return false;
    }

    if (!checked) {
        $("#errorMessageRegister").append(`<div class="alert alert-danger alert-dismissible fade show kt-alert kt-alert--outline m-0" role="alert">
        <span>You need to agree to the Terms and Conditions</span> 
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>`)
        return false;
    }
}