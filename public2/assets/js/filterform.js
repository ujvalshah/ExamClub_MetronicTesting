$(document).ready(function(){
    addSubjectField();
})

function addSubjectField(){
    $('form #filterform_subject_add').on('click', function(e){
        e.preventDefault();
        $('#filterform_subject').append(`<div class="col-sm-10 my-2 offset-sm-2">
        <input class="form-control" type="text" name="filterform[subjects][]" style="width:40%">
      </div>`)
    })
}