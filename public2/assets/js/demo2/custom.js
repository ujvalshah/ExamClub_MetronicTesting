$(document).ready(function() {
$('#notificationBtn').on('click', ()=>{
    $('#notificationBtn').blur();
})


$('#kt_modal_4').on('hidden.bs.modal', function (e) {
    $('#notificationMessage').val("");
    $('#notificationExamData>option:eq()').prop('selected', true);
  })
})