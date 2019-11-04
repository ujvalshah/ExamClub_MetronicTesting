function downloadBtn(elem) {

    var buttonid = $(elem).attr('id');
    var actionUrl = `/download/${buttonid}/counter`;
    $.ajax({
      url: actionUrl,
      type: "PUT",
      success: function (data) {
        refreshDataTable();
        // console.log(data);
      }
    });
    $(this).find("button").blur();
  }