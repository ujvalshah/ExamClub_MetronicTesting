
$(document).ready(function () {


  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//


  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//

  // function filter() {
  //   var filterItemsArray = $('#dataTable_filter_ajax').serializeArray();
  //   $('#downloads-filter-tags').empty();
  //   filterItemsArray.forEach(async function(filter){
  //   $('#downloads-filter-tags').append(`<span class="btn btn-label-warning">${filter.value}</span>&nbsp;`);
  //   })
  //   refreshDataTable();

  // var filterItems = $('#dataTable_filter_ajax').serialize();
  // console.log(filterItems);
  // $.get("/downloadscopy", filterItems, function (data) {
  //   console.log(data);
  //   $("tbody").empty();
  //   data.docs.forEach(function(document, index){
  //     $("tbody").append(`
  //      <tr>
  //        <td class="align-middle text-center">${index+1}</td>
  //        <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
  //        <td class="align-middle text-center">${document.author.username}</td>
  //        <td class="align-middle text-center dataTableText">${document.title}</td>
  //        <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm${data.examsButtons[document.exam].class}">${document.exam}</span></td>
  //        <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
  //           ${data.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
  //        <td class="align-middle text-center">${document.subject}</td>
  //        <td class="align-middle text-center "><span class="kt-badge kt-badge--success kt-badge--lg">${document.downloadCounter}</span></td>
  //        <td class="align-middle text-center"><span class="dropdown">
  //             <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
  //             <div class="dropdown-menu dropdown-menu-right">
  //             <div class="dropdown-item"> 
  //                 <form action="/downloads/${document._id}/edit" method="GET">
  //                   <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
  //                 </form>
  //             </div>
  //                <div class="dropdown-item"> 
  //                 <form action="/downloads/${document._id}?_method=DELETE" method="POST">
  //                   <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
  //                 </form>
  //             </div>
  //             </div>
  //             </span>
  //          <a href="/downloads/docs/${document._id}" id="${document._id}" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>

  //         <form id="bookmark_${document._id}" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
  //                   <button type="submit" title="Bookmark" class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i class="fas fa-bookmark"></i></button>
  //         </form>
  //         <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${document._id}" title="Share" target="_blank"><span class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="fas fa-share-alt"></i></span></a>
  //       </td>
  //      </tr>
  //      `);
  //   });
  // })
  // };

  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//


  function multiPagination() {
    $('#pagination-downloads').empty();
    for (let i = 1; i <= data.pages; i++) {
      $('#pagination-downloads').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}${i}" id="pagination-url_${i}">${i}</a></li>`)
    }
    $('#pagination-downloads li').first().addClass('kt-pagination__link--active')
  };


  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//


  $('#pagination-downloads').on('click', "li", function (e) {
    e.preventDefault();

    //---------------------Change Pagination Active Tab---------------------------//
    //----------------------------------------------------------------------------//
    $('#pagination-downloads .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $(this).addClass('kt-pagination__link--active');

    refreshDataTable();
  })

  // $('#pagination-downloads').on('click', "li", function (e) {
  //   e.preventDefault();

  //   //---------------------Change Pagination Active Tab---------------------------//
  //   //----------------------------------------------------------------------------//
  //   $('#pagination-downloads .kt-pagination__link--active').removeClass('kt-pagination__link--active');
  //   $(this).addClass('kt-pagination__link--active');



  //   let curPage = $(this).text().trim();
  //   let pageNo = $('#pagination-downloads .kt-pagination__link--active').text().trim();
  //   console.log("pageNo");
  //   console.log(pageNo);
  //   console.log("curPage");
  //   console.log(curPage);


  //   let url = $(this).find("a").attr('href');
  //   $.get(url, function (data) {
  //     var pageUrl = data.pageUrl;
  //     $("tbody").empty();
  //     data.docs.forEach(function(document, index){
  //       $("tbody").append(`
  //     <tr>
  //       <td class="align-middle text-center">${index+1}</td>
  //       <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
  //       <td class="align-middle text-center">${document.author.username}</td>
  //       <td class="align-middle text-center dataTableText">${document.title}</td>
  //       <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm${data.examsButtons[document.exam].class}">${document.exam}</span></td>
  //       <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
  //             ${data.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
  //       <td class="align-middle text-center">${document.subject}</td>
  //       <td class="align-middle text-center "><span class="kt-badge kt-badge--success kt-badge--lg">${document.downloadCounter}</span></td>
  //       <td class="align-middle text-center"><span class="dropdown">
  //               <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
  //               <div class="dropdown-menu dropdown-menu-right">
  //               <div class="dropdown-item"> 
  //                   <form action="/downloads/${document._id}/edit" method="GET">
  //                     <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
  //                   </form>
  //               </div>
  //                  <div class="dropdown-item"> 
  //                   <form action="/downloads/${document._id}?_method=DELETE" method="POST">
  //                     <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
  //                   </form>
  //               </div>
  //               </div>
  //               </span>
  //            <a href="/downloads/docs/${document._id}" id="${document._id}" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>

  //           <form id="bookmark_${document._id}" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
  //                     <button type="submit" title="Bookmark" class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i class="fas fa-bookmark"></i></button>
  //           </form>
  //           <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${document._id}" title="Share" target="_blank"><span class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="fas fa-share-alt"></i></span></a>
  //         </td>
  //     </tr>
  //     `);
  //     });

  //     let currentPage = parseInt(curPage);
  //     // console.log(curPage);
  //     let limit = data.limit; 
  //     let totalEntries = data.total; 
  //     let probsecondNumber = limit*currentPage;
  //     let secondNumber = Math.min(probsecondNumber, totalEntries);
  //     let firstNumber = probsecondNumber - (limit-1);
  //     $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
  //   })
  // })

  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//

  $('#limit-downloadTable').on('keyup change', function () {
    refreshDataTable()
    // var filterItems = $('#dataTable_filter_ajax').serialize();
    // let limitNo = $(this).val();
    // let limitUrl = `/downloadscopy?limit=${limitNo}`;
    // $.get(limitUrl, filterItems, function (data) {

    //   $('#pagination-downloads').empty();
    //   for (let i = 1; i <= data.pages; i++) {
    //     $('#pagination-downloads').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}${i}" id="pagination-url_${i}">${i}</a></li>`)
    //   }

    //   $("tbody").empty();
    // data.docs.forEach(function(document, index){
    //   $("tbody").append(`
    // <tr>
    //   <td class="align-middle text-center">${index+1}</td>
    //   <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
    //   <td class="align-middle text-center">${document.author.username}</td>
    //   <td class="align-middle text-center dataTableText">${document.title}</td>
    //   <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm${data.examsButtons[document.exam].class}">${document.exam}</span></td>
    //   <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
    //         ${data.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
    //   <td class="align-middle text-center">${document.subject}</td>
    //   <td class="align-middle text-center "><span class="kt-badge kt-badge--success kt-badge--lg">${document.downloadCounter}</span></td>
    //   <td class="align-middle text-center"><span class="dropdown">
    //           <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
    //           <div class="dropdown-menu dropdown-menu-right">
    //           <div class="dropdown-item"> 
    //               <form action="/downloads/${document._id}/edit" method="GET">
    //                 <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
    //               </form>
    //           </div>
    //              <div class="dropdown-item"> 
    //               <form action="/downloads/${document._id}?_method=DELETE" method="POST">
    //                 <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
    //               </form>
    //           </div>
    //           </div>
    //           </span>
    //        <a href="/downloads/docs/${document._id}" id="${document._id}" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>

    //       <form id="bookmark_${document._id}" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
    //                 <button type="submit" title="Bookmark" class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i class="fas fa-bookmark"></i></button>
    //       </form>
    //       <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${document._id}" title="Share" target="_blank"><span class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="fas fa-share-alt"></i></span></a>
    //     </td>
    // </tr>
    // `);
    // });

    $("#pagination-downloads li:first-child").click();

    // let curPage = $('#pagination-downloads .kt-pagination__link--active').text().trim();
    // let currentPage = parseInt(curPage);
    // let limit = data.limit; 
    // let totalEntries = data.total; 
    // let probsecondNumber = limit*currentPage;
    // let secondNumber = Math.min(probsecondNumber, totalEntries);
    // let firstNumber = secondNumber - (secondNumber-1);
    // $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)

  })

  $("#limit-downloadTable i").on('click', function () {
    refreshDataTable()
    $("#pagination-downloads li:first-child").click();
  })
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//


  $('#search-document').on('keyup change', function () {
    searchinit();
  });

  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//


  $('#downloads_filter_submit').on('click', function (e) {
    e.preventDefault();
    $('#search-document').val("")
    filter();
  })
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  $('.downloadUrlLink').on('click', 'a', function (e) {
    e.preventDefault();
    alert('clicked');
  })
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  //----------------------------------------------------------------------------//
  // copyUrl();
  paginationButtons();
  sorting();
  datatableinit();
  removeFilterTags();


});



function datatableinit() {
  //  var filterItems = $('#dataTable_filter_ajax').serialize();
  refreshDataTable();
  $('#pagination-downloads li').first().addClass('kt-pagination__link--active')

};



function refreshDataTable() {
  var filterItems = $('#dataTable_filter_ajax').serialize();
  var filterItemsArray = $('#dataTable_filter_ajax').serializeArray();
  // console.log(filterItems);
  console.log(filterItemsArray);
  // console.log(decodeURI(filterItems));
  let limitNo = $('#limit-downloadTable').val() || "10"
  let pageNo = $('#pagination-downloads .kt-pagination__link--active').text().trim() || 1;
  let sort = $(".downloads-sort-active").closest('span').attr('class');
  // console.log("pageNo");
  // console.log(pageNo);
  // console.log("limitNo");
  // console.log(limitNo);
  // console.log("sort");
  // console.log(sort);
  let downloadDatatableUrl = `/downloadscopy?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
  $.get(downloadDatatableUrl, filterItems, function (data) {

    $('#pagination-downloads').empty();
    for (let i = 1; i <= data.pages; i++) {
      $('#pagination-downloads').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
    }
    $(`#pagination-downloads li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')

    $("tbody").empty();
    data.docs.forEach(function (document, index) {
      $("tbody").append(`
       <tr>
         <td class="align-middle text-center">${index + 1}</td>
         <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center text-capitalize">${document.author.username}</td>
         <td class="align-middle text-center dataTableText">${document.title}</td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm ${data.examsButtons[document.exam].class}">${document.exam}</span></td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
            ${data.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
         <td class="align-middle text-center">${document.subject}</td>
         <td class="align-middle text-center "><span class="kt-badge kt-badge--success kt-badge--lg">${document.downloadCounter}</span></td>
         <td class="align-middle text-center text-nowrap">
         <span class="dropdown">
              <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
              <div class="dropdown-menu dropdown-menu-right">
              <div class="dropdown-item"> 
                  <form action="/downloads/${document._id}/edit" method="GET">
                    <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                  </form>
              </div>
                 <div class="dropdown-item"> 
                  <form action="/downloads/${document._id}?_method=DELETE" method="POST">
                    <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                  </form>
              </div>
              </div>
          </span>
           <a href="/downloads/docs/${document._id}" id="${document._id}" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>
           
          <form id="bookmark_${document._id}" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
                    <button type="submit" title="Bookmark" class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i class="fas fa-bookmark"></i></button>
          </form>
          
        <div class="kt-widget2__actions" id='sharingBtns'>
          <a href="#" class="btn btn-clean btn-sm btn-icon btn-icon-md" data-toggle="dropdown">
            <i class="fas fa-share-alt"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right">
            <ul class="kt-nav">
              <li class="kt-nav__item">
                <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${document._id}" title="Share" target="_blank" class="kt-nav__link">
                        <i class="kt-nav__link-icon socicon-whatsapp"></i>
                        <span class="kt-nav__link-text">Whatsapp</span>
                </a>
              </li>
              <li class="kt-nav__item"> 

                  <a href="tg://msg?url=http://${$(location).attr('host')}/downloads/${document._id}&text=${document.title}" class="kt-nav__link">
                      <i class="kt-nav__link-icon socicon-telegram"></i>
                      <span class="kt-nav__link-text">Telegram</span>
                  </a>
              </li>
              <li class="kt-nav__item">
                  <a href="https://www.facebook.com/sharer/sharer.php?u=http://${$(location).attr('host')}/downloads/${document._id}" target="_blank" class="kt-nav__link">
                      <i class="kt-nav__link-icon socicon-facebook"></i>
                      <span class="kt-nav__link-text">Facebook</span>
                  </a>
              </li>
              <li class="kt-nav__item" id='inputdownloadUrl_${document._id}'>
              <input type="text"  class="form-control d-none" value="http://${$(location).attr('host')}/downloads/${document._id}"">
                  <a href="javascript:;" data-link="http://${$(location).attr('host')}/downloads/${document._id}" id='downloadUrl_${document._id}' onclick="return shareLink(this)" class="kt-nav__link sharelinktrial"'>
                      <i class="kt-nav__link-icon fa fa-link"></i>
                      <span class="kt-nav__link-text">Copy URL</span>
                  </a>
              </li>
              </ul>							
            </div>
        </div>
        </td>
       </tr>
       `);
    });



    // $('#pagination-downloads li').first().addClass('kt-pagination__link--active')
    let curPage = $('#pagination-downloads .kt-pagination__link--active').text().trim();
    let currentPage = parseInt(curPage);
    // console.log(curPage);
    let limit = data.limit;
    let totalEntries = data.total;
    let probsecondNumber = limit * currentPage;
    let secondNumber = Math.min(probsecondNumber, totalEntries);
    let firstNumber = probsecondNumber - (limit - 1);
    $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
  })
};

function searchinit() {
  refreshDataTable()
}

function initialiseDownloadsTable() {
  $.get('/downloadscopy', function (data) {
    // console.log(data);
    // console.log(moment(data.docs[0].attempt, "MMM-YYYY"));
    // console.log(moment(moment(document.createdAt).format("DD-MMM-YYYY")).format("DD-MMM-YYYY"));
    // var initUrl = data.pageUrl;
    $("tbody").empty();
    data.docs.forEach(function (document, index) {
      $("tbody").append(`
       <tr>
         <td class="align-middle text-center">${index + 1}</td>
         <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center">${document.author.username}</td>
         <td class="align-middle text-center dataTableText">${document.title}</td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm ${data.examsButtons[document.exam].class}">${document.exam}</span></td>
         <td class="align-middle text-center text-nowrap"><span class="btn btn-bold btn-sm btn-font-sm btn-pill ${data.attemptsButtons[document.attempt[0]].class}">${moment(document.attempt, "MMM-YYYY").format("MMM YYYY")}</span>
         </td>
         <td class="align-middle text-center">${document.subject}</td>
         <td class="align-middle text-center"><span class="kt-badge kt-badge--success kt-badge--lg">${document.downloadCounter}</span></td>
         <td class="align-middle text-center text-nowrap"><span class="dropdown">
              <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
              <div class="dropdown-menu dropdown-menu-right">
              <div class="dropdown-item"> 
                  <form action="/downloads/${document._id}/edit" method="GET">
                    <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                  </form>
              </div>
                 <div class="dropdown-item"> 
                  <form action="/downloads/${document._id}?_method=DELETE" method="POST">
                    <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                  </form>
              </div>
              </div>
              </span>
           <a href="/downloads/docs/${document._id}" id="${document._id}" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>
           
          <form id="bookmark_${document._id}" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
                    <button type="submit" title="Bookmark" class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i class="fas fa-bookmark"></i></button>
          </form>
          <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${document._id}" title="Share" target="_blank"><span class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="fas fa-share-alt"></i></span></a>
        </td>
       </tr>
       `);
    });
  })
}


function paginationButtons() {
  $('.kt-pagination__link--first').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination_1').click();
  })

  $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination-downloads :last-child').click();
  })

  $('.kt-pagination__link--next').on('click', 'a', function (e) {
    e.preventDefault();
    let val = $('#pagination-downloads .kt-pagination__link--active').prev().click();
  })

  $('.kt-pagination__link--prev').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination-downloads .kt-pagination__link--active').next().click();
  })
}

function sorting() {
  $('#download-header i').on("click", function () {
    $('.downloads-sort-active').addClass('arrow-inactive');
    $('.downloads-sort-active').removeClass('downloads-sort-active');
    $(this).removeClass('arrow-inactive');
    $(this).addClass('downloads-sort-active');
    let para = $(this).closest('span').attr('class');
    refreshDataTable();
  })
}

function filter() {
  $('#search-document').val("")
  var filterItemsArray = $('#dataTable_filter_ajax').serializeArray();
  // console.log('filterItemsArray')
  // console.log(filterItemsArray)
  $('#downloads-filter-tags').empty();
  filterItemsArray.forEach(function (filter) {
    if (filter.value && filter.value !== "" && filter.value !== 'rf') {
      filtername = filter.name.slice(0, (filter.name.indexOf('[')));
      $('#downloads-filter-tags').append(`<span id="${filtername}" class="btn btn-label-warning btn-sm">${filter.value}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
    }
  })
  refreshDataTable();
}

function removeFilterTags() {
  $('#downloads-filter-tags').on('click', 'span', function () {
    let filterKey = $(this).attr('id');
    let filterText = $(this).text();
    $(`#${filterKey}`).val('rf').change();
    // $(`#${filterKey}`).val('rf').trigger('change');
    // $(`#${filterKey}>option:eq(2)`).attr('selected', true);
    // filter();
  })
}




function shareLink(elem) {
  var val = $(elem).closest('li').attr('id');
  var url = $(elem).attr('data-link');
  console.log(val);
  console.log(url);
  var $input = $("<input>");
  $('#'+val).append($input);
  $input.val(url).select();
  document.execCommand("copy");
  $input.remove();

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

  // let href = $('a').attr('id');
  // // let val = 'input' + href;
  // let url = $('.sharelinktrial').attr('data-link');
  // alert('clicked' + url);
  // console.log(`Data lINK is ${url}`);
  // console.log(`HREF is ${href}`);

  // // let url = $('#'+val).val()
  // console.log(url);
  // var copyText = document.getElementById(val);
  // copyText.select();
  // copyText.setSelectionRange(0, 99999)
  // document.execCommand("copy");
  // console.log(copyText);

  //  $('#alert-notifications').append(
  //    `<div class="alert alert-warning alert-dismissible fade show kt-alert kt-alert--outline m-0" role="alert">
  //    <span>Link copied to clipboard succesfully</span>
  //     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  //         <span aria-hidden="true">&times;</span>
  //     </button>
  //     </div>`
  //  )
}

// var $temp = $("<input>");
// $('#'+val).append($temp);
// $temp.val($(element).text()).select();
// document.execCommand("copy");
// $temp.remove();