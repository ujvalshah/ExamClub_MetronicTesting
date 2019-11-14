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


  function clipcopy() {
    var clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function (e) {
      $('#alert-notifications').append(
        `<div class="alert alert-bold alert-solid-success alert-dismissible fade show kt-alert kt-alert--outline mx-auto my-3" style='width:90%' role="alert">
          <div class='alert-text'>Link successfully copied!</div>
          <div class="alert-close">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
          </button>
          </div>
          </div>`
      )
  
      $('html, body').animate({ scrollTop: 0 }, 'fast');
  
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
  
      e.clearSelection();
      clipboard.destroy();
    });
    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  }

  function bookmarkVideo(e, elem){
    e.preventDefault();
    let videoBookmarkActionURL = $(elem).attr('action');
    $.ajax({
      url: videoBookmarkActionURL,
      type: "PUT",
      success: function (data) {
        // console.log(data);
        alert(`${data}`)
        refreshVideoBank();  
      }
    });
  $(this).find("button").blur();
}

function bookmarkVideosignup(e, elem){
  e.preventDefault();
  alert('Please sign in to bookmark videos!');
//     $('#alert-notifications').append(`
//     <div class="alert alert-bold alert-solid-danger alert-dismissible fade show kt-alert kt-alert--outline mx-auto my-3" style='width:90%' role="alert">
//     <div class='alert-text'>Please sign in to bookmark videos!</div>
//     <div class="alert-close">
//     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//         <span aria-hidden="true">&times;</span>
//     </button>
//     </div>
//     </div>`
//    )
//    $("html, body").animate({ scrollTop: 0 }, "slow");
}