$(document).ready(function(){
    addSubjectField();
})

function addSubjectField(){
    $('form #filtereditform_subject_add').on('click', function(e){
        e.preventDefault();
        $('#filtereditform_subject').append(`<div class="col-sm-10 my-2">
        <input class="form-control" type="text" name="filterform[subjects][]" style="width:40%">
      </div>`)
    })
}

function deleteSubjectField(e, element){
        e.preventDefault();
        let id = $(element).parent().attr('id');
        let mainId = `inputfield${id}`;
        console.log(id);
        console.log(mainId);
        $(`#${mainId}`).empty();
}