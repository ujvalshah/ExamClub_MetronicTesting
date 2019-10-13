//PAGE = Profile Page

    function emailEdit(e){
        e.preventDefault();
        $('#userEmailEdit').prop("disabled", false);
        // $('#emailGroup').append(`<input type="hidden" name="updateProfile[emailVerified]" value="false">`);
    }

    function submitProfileEdit(e){
        let answer = confirm('Are you sure you want to make the change?');
        if(!answer){
            return e.preventDefault();
        }
    }