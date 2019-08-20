$('#dropdown-notifications-homepage').on('change', function() {
    var id = $(this).val();
    $('#' + id + '').tab('show'); 
  });