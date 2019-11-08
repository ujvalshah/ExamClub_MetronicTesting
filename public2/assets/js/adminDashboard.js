$(document).ready(function () {

  filterfilling()

  // ---------------------Download------------------
  datatableinit();
  adminDashDocs_changePaginationActiveTab();
  adminDashDocs_changePaginationTabto1();
  adminDashDocs_removeFilterTags();
  adminDashDocs_searchOnKeyUp();
  adminDashDocs_paginationButtons();
  adminDashDocs_sorting();
  adminDashDocs_filter();
  adminDashDocs_downloadBtn();
  adminDashDocs_searchEnterKey();
  adminDashDocs_clearDocsFilter();
  // ---------------------Video------------------
  videoBankinit();
  adminDashVideos_changePaginationActiveTab();
  adminDashVideos_changePaginationTabto1();
  adminDashVideos_removeFilterTags();
  adminDashVideos_searchOnKeyUp();
  adminDashVideos_clickOnSubmitBtn();
  adminDashVideos_paginationButtons();
  adminDashVideos_searchEnterKey();
  adminDashVideos_filter();
  adminDashVideos_clearVideoFilter();
  // -----------------Faculty's List--------------
  facultyTableinit();
  adminDashFaculty_paginationButtons();
  adminDashFaculty_sorting();
  adminDashFaculty_filter();
  adminDashFaculty_removeFilterTags();
  adminDashFaculty_changePaginationActiveTab();
  adminDashFaculty_changePaginationTabto1();
  adminDashFaculty_searchOnKeyUp();
  adminDashFaculty_searchEnterKey();
  adminDashFacultyTable_clearFilter();
  // -----------------Student's List--------------
  studentTableinit();
  adminDashStudent_paginationButtons();
  adminDashStudent_sorting();
  adminDashStudent_filter();
  adminDashStudent_removeFilterTags();
  adminDashStudent_changePaginationActiveTab();
  adminDashStudent_changePaginationTabto1();
  adminDashStudent_searchOnKeyUp();
  adminDashStudent_searchEnterKey();
  adminDashStudentTable_clearFilter();
});




// ----------------------------------------------------------------------------------------------------//
// -------------------------------------------------Documents------------------------------------------//
// ----------------------------------------------------------------------------------------------------//
function refreshDataTable() {
  var filterItems = $('#adminDashboard_document_table').serialize();
  var filterItemsArray = $('#adminDashboard_document_table').serializeArray();
  // console.log('DOC Filters');
  // console.log(filterItemsArray);
  let limitNo = $('#limit-adminDashboardDownloadTable').val() || "10"
  let pageNo = $('#adminDashboardDocsPagination .kt-pagination__link--active').text().trim() || 1;
  if ($("#largeScreen-adminDashboardDocTable").is(":hidden")) {
    var sort = $("select#sorting-mobile-adminDashboardDownloadTable option:checked").val();
  }
  if ($("#largeScreen-adminDashboardDocTable").is(":visible")) {
    var sort = $(".downloads-sort-active").closest('span').attr('class');
  }
  // console.log('sort');
  // console.log(sort);
  let userURL = $('#menu_dashboard_userURL').attr('href');
  // console.log(userURL);
  let adminDashboardDownloadTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
  // console.log(adminDashboardDownloadTableURL);
  $.get(adminDashboardDownloadTableURL, filterItems, function (data) {
    // console.log(data);
    var maxInitialPage = 9;
    var maxInitialPages = Math.min(data.downloads.pages,9); 
    var prePages = Math.max(data.downloads.page-7, 1);
    var postPages = Math.min(data.downloads.pages,data.downloads.page+1);
    $('#adminDashboardDocsPagination').empty();
    $('#adminDashboardDocsPagination_bottom').empty();

    if(data.downloads.page < maxInitialPage){
      for (let i = 1; i <= maxInitialPages; i++) {
        $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`);      
        $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`);      
      }      
    } else {
      for (let i = prePages; i <= postPages; i++) {
        $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`);
        $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`);
      }      
    }

    // for (let i = 1; i <= data.downloads.pages; i++) {
    //   $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
    // }
    // for (let i = 1; i <= data.pages; i++) {
    //   $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
    // }

    $(`#adminDashboardDocsPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
    $(`#adminDashboardDocsPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

    $("#adminDashboardDocTable-tableBody").empty();
    $('#smallScreen-adminDashboardDocTable-content').empty();
    data.downloads.docs.forEach(function (document, index) {
      $("#adminDashboardDocTable-tableBody").append(`
       <tr>
         <td class="align-middle text-center">${index + 1}</td>
         <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center text-capitalize">${document.author.displayName}</td>
         <td class="align-middle text-center text-break dataTableText">${document.title}</td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm ${data.downloads.examsButtons[document.exam].class}">${document.exam}</span></td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
            ${data.downloads.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
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
           <a href="/downloads/docs/${document._id}" id="${document._id}" onclick="return adminDashDocs_downloadBtn(this)" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a>
           
          <form id="bookmark_${document._id}" onsubmit="documentBookmark(event, this)" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
                    <button type="submit" title="Bookmark"  class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id} ${data.loggedinUser && data.loggedinUser.downloadBookmarks.includes(document._id) ? 'red-color' : ''}"><i class="fas fa-bookmark"></i></button>
          </form>
          
        <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
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


    data.downloads.docs.forEach(function (document, index) {
      $("#smallScreen-adminDashboardDocTable-content").append(`
                <div class="kt-widget4__item">
                <div class="kt-widget4__pic kt-widget4__pic--pic">
                <span
                    class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${document.author.displayName.charAt(0).toUpperCase()}</span>
                  <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
                </div>
                <div class="kt-widget4__info pr-1">
                  <a href="#" class="kt-widget4__username text-break">
                    ${document.title}
                  </a>
                  <p class="kt-widget4__text">
                  ${document.author.displayName} <br>
                    <span
                      class="kt-badge kt-badge--inline kt-badge--bold ${data.downloads.attemptsButtons[document.attempt[0]].mobile} text-nowrap">${document.attempt}</span>
                    <span
                      class="kt-badge kt-badge--inline kt-badge--bold ${data.downloads.examsButtons[document.exam].mobile}">${document.exam}</span>
                    ${(document.subject || document.subject !== "") ? `<span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-brand">${document.subject}</span>` : ""}
                  </p>
                </div>
                <div class='flex-column'>
                <div class="d-flex justify-content-center mb-3"> 
                <span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-danger text-nowrap x-auto">${moment(document.createdAt).format("DD-MMM-YYYY")}</span>
                </div>
                <div class=''>
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
                <a href="/downloads/docs/${document._id}" id="${document._id}"
                    onclick="downloadBtn(this)" title="Download" target="_blank"
                    class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i
                    class="fas fa-file-download"></i></span></a></a>
                    <form id="bookmark_${document._id}" onsubmit="documentBookmark(event, this)"
                      class="d-inline-block m-0 p-0 bookmark-ajax-form"
                      action="/user/downloads/${document._id}/bookmark" method="POST">
                      <button type="submit" title="Bookmark"
                        class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i
                          class="fas fa-bookmark"></i></button>
                    </form>

                    <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
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
                    </div>
                  </div>
          </div>
       `);
    });


    let curPage = $('#adminDashboardDocsPagination .kt-pagination__link--active').text().trim();
    let currentPage = parseInt(curPage);
    let limit = data.downloads.limit;
    let totalEntries = data.downloads.total;
    let probsecondNumber = limit * currentPage;
    let secondNumber = Math.min(probsecondNumber, totalEntries);
    let firstNumber = probsecondNumber - (limit - 1);
    $(".pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.downloads.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
  })
};

function datatableinit() {
  refreshDataTable();
  $('#adminDashboardDocsPagination li').first().addClass('kt-pagination__link--active')
};

function adminDashDocs_paginationButtons() {
  $('.kt-pagination__link--first').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardDocsPagination').children().first().click();
  })

  $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardDocsPagination').children().last().click();
  })

  $('.kt-pagination__link--next').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardDocsPagination .kt-pagination__link--active').prev().click();
  })

  $('.kt-pagination__link--prev').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardDocsPagination .kt-pagination__link--active').next().click();
  })
}

function adminDashDocs_sorting() {
  $('#adminDashboard-document-header i').on("click", function () {
    $('.downloads-sort-active').addClass('arrow-inactive');
    $('.downloads-sort-active').removeClass('downloads-sort-active');
    $(this).removeClass('arrow-inactive');
    $(this).addClass('downloads-sort-active');
    let para = $(this).closest('span').attr('class');
    // console.log(para);
    refreshDataTable();
  })
}

function adminDashDocs_filter() {
  $('#adminDashboardDocs-search').val("")
  var filterItemsArray = $('#adminDashboard_document_table').serializeArray();
  $('#adminDashboard-document-filter-tags').empty();
  filterItemsArray.forEach(function (filter) {

    let filtername = filter.name;
    let filterId = $(`select[name="${filtername}"]`).attr('id');
    let filterText = $(`#${filterId} option:selected`).text().trim();


    if (filter.name.indexOf('[') === -1) {
      if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit' && filter.name !== 'sort' && filter.name !== 'sortDashboard' && filter.name !== 'page') {
        filtername = filter.name;
        $('#adminDashboard-document-filter-tags').append(`<span id="adminDashboardDocs-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filterText}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
      }
    }
    if (filter.name.indexOf('[') !== -1) {
      if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit' && filter.name !== 'sort' && filter.name !== 'sortDashboard' && filter.name !== 'page') {
        filtername = filter.name.slice(0, (filter.name.indexOf('[')));
        $('#adminDashboard-document-filter-tags').append(`<span id="adminDashboardDocs-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filterText}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
      }
    }

  })
  refreshDataTable();
}

function adminDashDocs_removeFilterTags() {
  $('#adminDashboard-document-filter-tags').on('click', 'span', function () {
    let filterKey = $(this).attr('id');
    $(`#${filterKey}`).val('rf').change();
  })
}

function shareLink(elem) {
  var val = $(elem).closest('li').attr('id');
  var url = $(elem).attr('data-link');
  // console.log(val);
  // console.log(url);
  var $input = $("<input>");
  $('#' + val).append($input);
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
}

function adminDashDocs_changePaginationActiveTab() {
  $('#adminDashboardDocsPagination').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardDocsPagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardDocsPagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $(this).addClass('kt-pagination__link--active');
    refreshDataTable();
  });

  $('#adminDashboardDocsPagination_bottom').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardDocsPagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardDocsPagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    let pageNoBottomDownloadClicked = $(this).attr('id');
    let pageTopDownloadId = pageNoBottomDownloadClicked.replace('_bottom', '');
    $('#' + pageTopDownloadId).click();
    refreshDataTable();
  });
}

function adminDashDocs_changePaginationTabto1() {
  $('#limit-adminDashboardDownloadTable').on('keyup change', function () {
    refreshDataTable()
    $("#adminDashboardDocsPagination li:first-child").click();
  })

  $("#limit-adminDashboardDownloadTable i").on('click', function () {
    refreshDataTable()
    $("#adminDashboardDocsPagination li:first-child").click();
  })
}

function adminDashDocs_searchOnKeyUp() {
  $('#adminDashboardDocs-search').on('keyup change', function () {
    refreshDataTable();
  });
}

function adminDashDocs_searchEnterKey() {
  $('#adminDashboardDocs-search').keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });
}

function adminDashDocs_downloadBtn(elem) {

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
};

function documentBookmark(e, element) {
  e.preventDefault();
  var actionUrl = $(element).attr("action");
  // console.log(actionUrl);
  var formid = $(element).attr("id").slice(9);
  // console.log(formid);
  $.ajax({
    url: actionUrl,
    type: "PUT",
    success: function (data) {
      refreshDataTable();
      // console.log(data);
      alert(`${data[0].msg}`);
    }
  })
};

function adminDashDocs_clearDocsFilter() {
  $('#adminDashboardDocs-cleardocsform').on('click', function (e) {
    e.preventDefault();
    $('#adminDashboard-document-filter-tags').empty();
    let limitNo = $('#limit-adminDashboardDownloadTable').val() || "10"
    let pageNo = $('#adminDashboardDocsPagination .kt-pagination__link--active').text().trim() || 1;
    $(`#sorting-mobile-adminDashboardDownloadTable`).val('-createdAt');

    $('#adminDashboardDocs-search').val("");
    $('#adminDashboardDocs-exam').val('rf');
    $('#adminDashboardDocs-attempt').val('rf');
    $('#adminDashboardDocs-author').val('rf');
    $('#adminDashboardDocs-subject').val('rf');
    $('#adminDashboardDocs-topic').val('rf');
    $('#aadminDashboardDocs-subtopic').val('rf');

    let userURL = $('#menu_dashboard_userURL').attr('href');
    let adminDashboardDownloadTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=-createdAt`;
    console.log(adminDashboardDownloadTableURL);
    $.get(adminDashboardDownloadTableURL, function (data) {
      $('#adminDashboardDocsPagination').empty();
      $('#adminDashboardDocsPagination_bottom').empty();

      var maxInitialPage = 9;
      var maxInitialPages = Math.min(data.downloads.pages,9); 
      var prePages = Math.max(data.downloads.page-7, 1);
      var postPages = Math.min(data.downloads.pages,data.downloads.page+1);
      if(data.downloads.page < maxInitialPage){
        for (let i = 1; i <= maxInitialPages; i++) {
          $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`);      
          $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`);      
        }      
      } else {
        for (let i = prePages; i <= postPages; i++) {
          $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`);
          $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`);
        }      
      }
      $(`#adminDashboardDocsPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
      $(`#adminDashboardDocsPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

      $("#adminDashboardDocTable-tableBody").empty();
      $('#smallScreen-adminDashboardDocTable-content').empty();
      data.downloads.docs.forEach(function (document, index) {
        $("#adminDashboardDocTable-tableBody").append(`
       <tr>
         <td class="align-middle text-center">${index + 1}</td>
         <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center text-capitalize">${document.author.displayName}</td>
         <td class="align-middle text-center text-break dataTableText">${document.title}</td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm ${data.downloads.examsButtons[document.exam].class}">${document.exam}</span></td>
         <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
            ${data.downloads.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
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
           <a href="/downloads/docs/${document._id}" id="${document._id}" onclick="return adminDashDocs_downloadBtn(this)" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a>
           
          <form id="bookmark_${document._id}" onsubmit="documentBookmark(event, this)" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${document._id}/bookmark" method="POST">
                    <button type="submit" title="Bookmark"  class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id} ${data.loggedinUser && data.loggedinUser.downloadBookmarks.includes(document._id) ? 'red-color' : ''}"><i class="fas fa-bookmark"></i></button>
          </form>
          
        <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
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


      data.downloads.docs.forEach(function (document, index) {
        $("#smallScreen-adminDashboardDocTable-content").append(`
                <div class="kt-widget4__item">
                <div class="kt-widget4__pic kt-widget4__pic--pic">
                <span
                    class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${document.author.displayName.charAt(0).toUpperCase()}</span>
                  <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
                </div>
                <div class="kt-widget4__info pr-1">
                  <a href="#" class="kt-widget4__username text-break">
                    ${document.title}
                  </a>
                  <p class="kt-widget4__text">
                    ${document.author.displayName} <br>
                    <span
                      class="kt-badge kt-badge--inline kt-badge--bold ${data.downloads.attemptsButtons[document.attempt[0]].mobile} text-nowrap">${document.attempt}</span>
                    <span
                      class="kt-badge kt-badge--inline kt-badge--bold ${data.downloads.examsButtons[document.exam].mobile}">${document.exam}</span>
                    ${(document.subject || document.subject !== "") ? `<span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-brand">${document.subject}</span>` : ""}
                  </p>
                </div>
                <div class='flex-column'>
                <div class="d-flex justify-content-center mb-3"> 
                <span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-danger text-nowrap x-auto">${moment(document.createdAt).format("DD-MMM-YYYY")}</span>
                </div>
                <div class=''>
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
                <a href="/downloads/docs/${document._id}" id="${document._id}"
                    onclick="downloadBtn(this)" title="Download" target="_blank"
                    class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i
                    class="fas fa-file-download"></i></span></a></a>
                    <form id="bookmark_${document._id}" onsubmit="documentBookmark(event, this)"
                      class="d-inline-block m-0 p-0 bookmark-ajax-form"
                      action="/user/downloads/${document._id}/bookmark" method="POST">
                      <button type="submit" title="Bookmark"
                        class="btn btn-sm btn-clean btn-icon btn-icon-md ${document._id}"><i
                          class="fas fa-bookmark"></i></button>
                    </form>

                    <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
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
                    </div>
                  </div>
          </div>
       `);
      });


      let curPage = $('#adminDashboardDocsPagination .kt-pagination__link--active').text().trim();
      let currentPage = parseInt(curPage);
      let limit = data.downloads.limit;
      let totalEntries = data.downloads.total;
      let probsecondNumber = limit * currentPage;
      let secondNumber = Math.min(probsecondNumber, totalEntries);
      let firstNumber = probsecondNumber - (limit - 1);
        $(".pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.downloads.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`);
    })

  })
};

// ----------------------------------------------------------------------------------------------------//
// -------------------------------------------------Video----------------------------------------------//
// ----------------------------------------------------------------------------------------------------//

function refreshVideoBank() {
  var filterItems = $('#adminDashboardVideos-form').serialize();
  var filterItemsArray = $('#adminDashboardVideos-form').serializeArray();
  // console.log(filterItems);
  // console.log('Video FILTERS');
  // console.log(filterItemsArray);
  // console.log(decodeURI(filterItems));
  let limitNo = $('#adminDashboardVideos-limit').val() || "10"
  let pageNo = $('#adminDashboardVideos-pagination .kt-pagination__link--active').text().trim() || 1;
  let sort = $("#adminDashboardVideos-sort").val() || "-createdAt"
  // let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`; because it goes as part of the filter items...
  
  let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`;

  $.get(videoDatatableUrl, filterItems, function (data) {

    console.log('videovideovideo');
    console.log(data);
    var prePages = Math.max(data.page-7, 1);
    var postPages = Math.min(data.pages,data.page+1);
    var maxInitialPage = 9;
    var maxInitialPages = Math.min(data.pages,9); 
    $('#adminDashboardVideos-pagination').empty();
    $('#adminDashboardVideos-pagination_bottom').empty();

    if(data.page < maxInitialPage){
      for (let i = 1; i <= maxInitialPages; i++) {
        $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`);
        $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
      }      
    } else {
      for (let i = prePages; i <= postPages; i++) {
        $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`);
        $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`);
      }      
    }

    // for (let i = 1; i <= data.pages; i++) {
    //   $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`)
    // }

    // $('#adminDashboardVideos-pagination_bottom').empty();
    // for (let i = 1; i <= data.pages; i++) {
    //   $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
    // }

    $(`#adminDashboardVideos-pagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')

    $(`#adminDashboardVideos-pagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

    $("#adminDashboardVideos-body").empty();

  //   if (!data.currentUser || data.currentUser === undefined) {
  //     data.docs.forEach(function (video) {
  //       $("#adminDashboardVideos-body").append(`
  //       <div class="col-md-4 mb-3 px-1">
  //       <!--begin:: Widgets/Blog-->
  //       <div class="kt-portlet kt-portlet--height-fluid kt-widget19 mx-2 shadow">
  //         <div class="kt-portlet__body kt-portlet__body--fit kt-portlet__body--unfill">
  //           <div class="kt-widget19__pic kt-portlet-fit--top kt-portlet-fit--sides">
  //             <div class="embed-responsive embed-responsive-16by9 card-img-top">
  //               <iframe width="560" height="315" class="embed-responsive-item" src="${video.url}" frameborder="0"
  //                 allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  //                 allowfullscreen></iframe>
  //             </div>
  //           </div>
  //         </div>
  //         <div class="kt-portlet__body">
  //           <div class="kt-widget19__wrapper mb-0">
  //             <h5 class="kt-widget19__title kt-font-dark kt-label-font-color-3 pb-2 mb-0">
  //               ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded mr-2">P</span>' : ""} ${video.title}
  //             </h5>
  //             <div class="kt-divider"><span></span></div>
  //             <div class="kt-widget19__content mt-2">
  //               <div class="kt-widget19__userpic">
  //                 <span
  //                   class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.displayName ? video.author.displayName.charAt(0).toUpperCase() : video.author.id.displayName.charAt(0).toUpperCase()}</span>
  //                 <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
  //               </div>
  //               <div class="kt-widget19__info">
  //                 <a href="/teachers/${video.author.id.id}" class="kt-widget19__username">
  //                   ${video.author.displayName ? video.author.displayName : video.author.id.displayName}
  //                 </a>
  //                 <span class="kt-widget19__time small">
  //                   CA Faculty/Author
  //                 </span>
  //               </div>
  //               <span class="kt-badge kt-badge--info kt-badge--inline float-right" data-toggle="tooltip"
  //                 data-placement="left" title="Date of Upload">${moment(video.createdAt).format("DD-MMM-YYYY")}</span>
  //               <!-- <div class="kt-widget19__stats">
  //           <span class="kt-widget19__number kt-font-brand" style="font-size: 0.9rem">
  //           </span>
  //           <div class="float-right"> Applicable Attempt </div>
  //         </div> -->
  //             </div>
  //             <div class="mb-3 small font-weight-bold"> Applicable: <span
  //                 class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--bold"
  //                 data-toggle="tooltip" data-placement="bottom" title="Applicable Exam">${video.exam}</span>
  //               <span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--bold"
  //                 data-toggle="tooltip" data-placement="bottom" title="Applicaple Attempt">${video.attempt}</span>
  //             </div>
  //             <div><small><span class="font-weight-bold">Description:</span> ${video.description}</small></div>
  //             <div class="kt-widget19__text mb-2">
  //             </div>
  //           </div>
  //           <div class="kt-divider"><span></span></div>
  //           <div class="kt-widget19__action">
  //             <!--Ownership Criteria of Videos-->
  //              <div class="float-right">
  //                <form id=" bookmarkForm_${video._id}" class="d-inline float-right save-video-form-signup" action="javascript:;" onsubmit='return bookmarkVideosignup(event, this)'>
  //                  <button type="submit" class="btn btn-sm btn-warning btn-bold student-alert">Bookmark</button>
  //                </form>
  //              </div>
  //         </div>
  //       </div>
  //     </div>
  //     <!--end:: Widgets/Blog-->
  // </div>`);
  //     });
  //   }

    // if (data.currentUser) {
      data.docs.forEach(function (video) {
        $("#adminDashboardVideos-body").append(`
      <div class="col-md-4 mb-3 px-1">
      <!--begin:: Widgets/Blog-->
      <div class="kt-portlet kt-portlet--height-fluid kt-widget19 mx-2 shadow">
        <div class="kt-portlet__body kt-portlet__body--fit kt-portlet__body--unfill">
          <div class="kt-widget19__pic kt-portlet-fit--top kt-portlet-fit--sides">
            <div class="embed-responsive embed-responsive-16by9 card-img-top">
              <iframe width="560" height="315" class="embed-responsive-item" src="${video.url}" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <div class="kt-portlet__body">
          <div class="kt-widget19__wrapper mb-0">
            <h5 class="kt-widget19__title kt-font-dark kt-label-font-color-3 pb-2 mb-0">
            ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded mr-2">P</span>' : ""}${video.title}
            </h5>
            <div class="kt-divider"><span></span></div>
            <div class="kt-widget19__content mt-2">
              <div class="kt-widget19__userpic">
                <span
                  class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.displayName ? video.author.displayName.charAt(0).toUpperCase() : video.author.id.displayName.charAt(0).toUpperCase()}</span>
                <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
              </div>
              <div class="kt-widget19__info">
                <a href="/teachers/${video.author.id.id}" class="kt-widget19__username">
                  ${video.author.displayName ? video.author.displayName : video.author.id.displayName}
                </a>
                <span class="kt-widget19__time small">
                  CA Faculty/Author
                </span>
              </div>
              <span class="kt-badge kt-badge--info kt-badge--inline float-right" data-toggle="tooltip"
                data-placement="left" title="Date of Upload">${moment(video.createdAt).format("DD-MMM-YYYY")}</span>
              <!-- <div class="kt-widget19__stats">
          <span class="kt-widget19__number kt-font-brand" style="font-size: 0.9rem">
          </span>
          <div class="float-right"> Applicable Attempt </div>
        </div> -->
            </div>
            <div class="mb-3 small font-weight-bold"> Applicable: <span
                class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--bold"
                data-toggle="tooltip" data-placement="bottom" title="Applicable Exam">${video.exam}</span>
              <span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--bold"
                data-toggle="tooltip" data-placement="bottom" title="Applicaple Attempt">${video.attempt}</span>
            </div>
            <div><small><span class="font-weight-bold">Description:</span> ${video.description}</small></div>
            <div class="kt-widget19__text mb-2">
            </div>
          </div>
          <div class="kt-divider"><span></span></div>
          <div class="kt-widget19__action">
            <!--Ownership Criteria of Videos-->
           <div class="float-right align-bottom">
              <a class="btn btn-sm btn-label-brand btn-bold ml-4" href="/videos/${video._id}/edit"
                role="button">Edit</a>
              <form class="d-inline-block delete-video-form" action="/videos/${video._id}?_method=DELETE"
                method="POST" onsubmit="return deleteFacultyVideo(event,this)">
                <button type="submit" class="btn btn-sm btn-label-danger btn-bold ml-1">Delete</button>
              </form>
            </div>
        </div>
      </div>
    </div>
    <!--end:: Widgets/Blog-->
</div>`);
      });
    // };
    let curPage = $('#adminDashboardVideos-pagination .kt-pagination__link--active').text().trim();
    let currentPage = parseInt(curPage);
    let limit = data.limit;
    let totalEntries = data.total;
    let probsecondNumber = limit * currentPage;
    let secondNumber = Math.min(probsecondNumber, totalEntries);
    let firstNumber = probsecondNumber - (limit - 1);
    $(".adminVideo-pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
  })
};

function videoBankinit() {
  refreshVideoBank();
  $('#adminDashboardVideos-pagination li').first().addClass('kt-pagination__link--active')
};

function adminDashVideos_paginationButtons() {
  $('.kt-pagination__link--first').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardVideos-pagination').children().first().click();
  })

  $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardVideos-pagination').children().last().click();
  })

  $('.kt-pagination__link--next').on('click', 'a', function (e) {
    e.preventDefault();
    let classs = $(this).attr('id');
    console.log('classsnext');
    console.log(classs);
    $('#adminDashboardVideos-pagination .kt-pagination__link--active').prev().click();
  })

  $('.kt-pagination__link--prev').on('click', 'a', function (e) {
    e.preventDefault();
    let classs2 = $(this).attr('id');
    console.log('classsprevious');
    console.log(this);
    // console.log('kt-pagination__link--prev');
    $('#adminDashboardVideos-pagination .kt-pagination__link--active').next().click();
  })
}

function adminDashVideos_filter(elem) {
  $('#adminDashboardVideos-search').val("")
  var filterItemsArray = $('#adminDashboardVideos-form').serializeArray();
  // console.log('filterItemsArray');
  $('#adminDashboardVideos-filterTags').empty();
  filterItemsArray.forEach(function (filter) {

    let filtername = filter.name;
    if(filtername.indexOf('[')!== -1){
      var filterId = filtername.slice(0, (filtername.indexOf('[')));
    } else {
      var filterId = filtername;
    }
    let filterText = $(`#adminDashboardVideos-${filterId} option:selected`).text().trim();
    if (filter.name.indexOf('[') === -1) {
      if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit'
        && filter.name !== 'sort' && filter.name !== 'page') {
        let filtername = filter.name;
        $('#adminDashboardVideos-filterTags').append(`<span id="adminDashboardVideos-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filterText}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
      }
    }
    if (filter.name.indexOf('[') !== -1) {
      if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit'
        && filter.name !== 'sort' && filter.name !== 'page') {
        let filtername = filter.name.slice(0, (filter.name.indexOf('[')));
        $('#adminDashboardVideos-filterTags').append(`<span id="adminDashboardVideos-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filterText}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
      }
    }


  })
  refreshVideoBank();
}

function adminDashVideos_removeFilterTags() {
  $('#adminDashboardVideos-filterTags').on('click', 'span', function () {
    let filterKey = $(this).attr('id');
    $(`#${filterKey}`).val('rf').change();
  })
}

function shareLink(elem) {
  var val = $(elem).closest('li').attr('id');
  var url = $(elem).attr('data-link');
  // console.log(val);
  // console.log(url);
  var $input = $("<input>");
  $('#' + val).append($input);
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
}

function adminDashVideos_changePaginationActiveTab() {
  $('#adminDashboardVideos-pagination').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardVideos-pagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardVideos-pagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $(this).addClass('kt-pagination__link--active');
    refreshVideoBank();
  });

  $('#adminDashboardVideos-pagination_bottom').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardVideos-pagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardVideos-pagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    let pageNoBottomVideoClicked = $(this).attr('id');
    let pageTopId = pageNoBottomVideoClicked.replace('_bottom', '');
    $('#' + pageTopId).click();
  })
}

function adminDashVideos_changePaginationTabto1() {
  $('#limit-downloadTable').on('keyup change', function () {
    refreshVideoBank()
    $("#adminDashboardVideos-pagination li:first-child").click();
  })

  $("#limit-downloadTable i").on('click', function () {
    refreshVideoBank()
    $("#adminDashboardVideos-pagination li:first-child").click();
  })
}

function adminDashVideos_searchOnKeyUp() {
  $('#adminDashboardVideos-search').on('keyup change', function () {
    refreshVideoBank();
  });
}

function adminDashVideos_searchEnterKey() {
  $('#adminDashboardVideos-search').keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });
}

function adminDashVideos_clickOnSubmitBtn() {
  $('#submit-video-form').on('click', function (e) {
    e.preventDefault();
    $('#search-document').val("")
    filter();
  })
}

function downloadBtn(elem) {

  var buttonid = $(elem).attr('id');
  var actionUrl = `/download/${buttonid}/counter`;
  $.ajax({
    url: actionUrl,
    type: "PUT",
    success: function (data) {
      refreshVideoBank();
      // console.log(data);
    }
  });
  $(this).find("button").blur();
}

function documentBookmark(e, element) {
  e.preventDefault();
  var actionUrl = $(element).attr("action");
  // console.log(actionUrl);
  var formid = $(element).attr("id").slice(9);
  // console.log(formid);
  $.ajax({
    url: actionUrl,
    type: "PUT",
    success: function (data) {
      refreshVideoBank();
      // console.log(data);
      alert(`${data[0].msg}`);
    }
  })
};

function bookmarkVideo(e, elem) {
  e.preventDefault();
  let videoBookmarkActionURL = $(elem).attr('action');

  $.ajax({
    url: videoBookmarkActionURL,
    type: "PUT",
    success: function (data) {
      // console.log(data);
      alert(`${data}`)
    }
  });
  refreshVideoBank();
  $(this).find("button").blur();
}

function bookmarkVideosignup(e, elem) {
  e.preventDefault();
  alert('Please sign in to bookmark videos!');
}

function deleteFacultyVideo(e, elem) {
  e.preventDefault();
  let confirmDelete = confirm("Are You sure you want to delete?");
  let acurl = $(elem).attr('action');
  if (confirmDelete) {
    $.ajax({
      url: acurl,
      type: 'DELETE',
      success: function (data) {
        // console.log(data);
        alert(data);
        refreshVideoBank();
      }
    })
  };

  let button = $(elem).find('button');
  $(button).blur();
}

function adminDashVideos_clearVideoFilter() {
  $('#adminDashboardVideos-clearvideoform').on('click', function (e) {
    e.preventDefault();
    $('#adminDashboardVideos-filterTags').empty();
    let pageNo = $('#adminDashboardVideos-pagination .kt-pagination__link--active').text().trim() || 1;
    let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`;

    $('#adminDashboardVideos-search').val("");
    $('#adminDashboardVideos-exam').val('rf');
    $('#adminDashboardVideos-attempt').val('rf');
    $('#adminDashboardVideos-author').val('rf');
    $('#adminDashboardVideos-subject').val('rf');
    $('#adminDashboardVideos-topic').val('rf');
    $('#adminDashboardVideos-subtopic').val('rf');

    $.get(videoDatatableUrl, function (data) {
      $('#adminDashboardVideos-pagination').empty();

      $('#adminDashboardVideos-pagination_bottom').empty();

      var prePages = Math.max(data.page-7, 1);
      var postPages = Math.min(data.pages,data.page+1);
      var maxInitialPage = 9;
      var maxInitialPages = Math.min(data.pages,9); 
      if(data.page < maxInitialPage){
        for (let i = 1; i <= maxInitialPages; i++) {
          $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`);
          $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }      
      } else {
        for (let i = prePages; i <= postPages; i++) {
          $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`);
          $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`);
        }      
      }

      $(`#adminDashboardVideos-pagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')

      $(`#adminDashboardVideos-pagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

      $("#adminDashboardVideos-body").empty();

      if (!data.currentUser || data.currentUser === undefined) {
        data.docs.forEach(function (video) {
          $("#adminDashboardVideos-body").append(`
        <div class="col-md-4 mb-3 px-1">
        <!--begin:: Widgets/Blog-->
        <div class="kt-portlet kt-portlet--height-fluid kt-widget19 mx-2 shadow">
          <div class="kt-portlet__body kt-portlet__body--fit kt-portlet__body--unfill">
            <div class="kt-widget19__pic kt-portlet-fit--top kt-portlet-fit--sides">
              <div class="embed-responsive embed-responsive-16by9 card-img-top">
                <iframe width="560" height="315" class="embed-responsive-item" src="${video.url}" frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
              </div>
            </div>
          </div>
          <div class="kt-portlet__body">
            <div class="kt-widget19__wrapper mb-0">
              <h5 class="kt-widget19__title kt-font-dark kt-label-font-color-3 pb-2 mb-0">
                ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded mr-2">P</span>' : ""} ${video.title}
              </h5>
              <div class="kt-divider"><span></span></div>
              <div class="kt-widget19__content mt-2">
                <div class="kt-widget19__userpic">
                  <span
                    class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.displayName ? video.author.displayName.charAt(0).toUpperCase() : video.author.id.displayName.charAt(0).toUpperCase()}</span>
                  <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
                </div>
                <div class="kt-widget19__info">
                  <a href="/teachers/${video.author.id.id}" class="kt-widget19__username">
                    ${video.author.displayName ? video.author.displayName : video.author.id.displayName}
                  </a>
                  <span class="kt-widget19__time small">
                    CA Faculty/Author
                  </span>
                </div>
                <span class="kt-badge kt-badge--info kt-badge--inline float-right" data-toggle="tooltip"
                  data-placement="left" title="Date of Upload">${moment(video.createdAt).format("DD-MMM-YYYY")}</span>
                <!-- <div class="kt-widget19__stats">
            <span class="kt-widget19__number kt-font-brand" style="font-size: 0.9rem">
            </span>
            <div class="float-right"> Applicable Attempt </div>
          </div> -->
              </div>
              <div class="mb-3 small font-weight-bold"> Applicable: <span
                  class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--bold"
                  data-toggle="tooltip" data-placement="bottom" title="Applicable Exam">${video.exam}</span>
                <span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--bold"
                  data-toggle="tooltip" data-placement="bottom" title="Applicaple Attempt">${video.attempt}</span>
              </div>
              <div><small><span class="font-weight-bold">Description:</span> ${video.description}</small></div>
              <div class="kt-widget19__text mb-2">
              </div>
            </div>
            <div class="kt-divider"><span></span></div>
            <div class="kt-widget19__action">
              <!--Ownership Criteria of Videos-->
               <div class="float-right">
                 <form id=" bookmarkForm_${video._id}" class="d-inline float-right save-video-form-signup" action="javascript:;" onsubmit='return bookmarkVideosignup(event, this)'>
                   <button type="submit" class="btn btn-sm btn-warning btn-bold student-alert">Bookmark</button>
                 </form>
               </div>
          </div>
        </div>
      </div>
      <!--end:: Widgets/Blog-->
  </div>`);
        });
      }

      if (data.currentUser) {
        data.docs.forEach(function (video) {
          $("#adminDashboardVideos-body").append(`
      <div class="col-md-4 mb-3 px-1">
      <!--begin:: Widgets/Blog-->
      <div class="kt-portlet kt-portlet--height-fluid kt-widget19 mx-2 shadow">
        <div class="kt-portlet__body kt-portlet__body--fit kt-portlet__body--unfill">
          <div class="kt-widget19__pic kt-portlet-fit--top kt-portlet-fit--sides">
            <div class="embed-responsive embed-responsive-16by9 card-img-top">
              <iframe width="560" height="315" class="embed-responsive-item" src="${video.url}" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <div class="kt-portlet__body">
          <div class="kt-widget19__wrapper mb-0">
            <h5 class="kt-widget19__title kt-font-dark kt-label-font-color-3 pb-2 mb-0">
            ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded mr-2">P</span>' : ""}${video.title}
            </h5>
            <div class="kt-divider"><span></span></div>
            <div class="kt-widget19__content mt-2">
              <div class="kt-widget19__userpic">
                <span
                  class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.displayName ? video.author.displayName.charAt(0).toUpperCase() : video.author.id.displayName.charAt(0).toUpperCase()}</span>
                <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
              </div>
              <div class="kt-widget19__info">
                <a href="/teachers/${video.author.id.id}" class="kt-widget19__username">
                  ${video.author.displayName ? video.author.displayName : video.author.id.displayName}
                </a>
                <span class="kt-widget19__time small">
                  CA Faculty/Author
                </span>
              </div>
              <span class="kt-badge kt-badge--info kt-badge--inline float-right" data-toggle="tooltip"
                data-placement="left" title="Date of Upload">${moment(video.createdAt).format("DD-MMM-YYYY")}</span>
              <!-- <div class="kt-widget19__stats">
          <span class="kt-widget19__number kt-font-brand" style="font-size: 0.9rem">
          </span>
          <div class="float-right"> Applicable Attempt </div>
        </div> -->
            </div>
            <div class="mb-3 small font-weight-bold"> Applicable: <span
                class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--bold"
                data-toggle="tooltip" data-placement="bottom" title="Applicable Exam">${video.exam}</span>
              <span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill kt-badge--bold"
                data-toggle="tooltip" data-placement="bottom" title="Applicaple Attempt">${video.attempt}</span>
            </div>
            <div><small><span class="font-weight-bold">Description:</span> ${video.description}</small></div>
            <div class="kt-widget19__text mb-2">
            </div>
          </div>
          <div class="kt-divider"><span></span></div>
          <div class="kt-widget19__action">
            <!--Ownership Criteria of Videos-->
            ${(data.currentUser && (data.currentUser.isFaculty || data.currentUser.isAdmin) && (JSON.stringify(data.currentUser._id) === JSON.stringify(video.author.id))) ?
              `<div class="float-right align-bottom">
              <a class="btn btn-sm btn-label-brand btn-bold ml-4" href="/videos/${video._id}/edit"
                role="button">Edit</a>
              <form class="d-inline-block delete-video-form" action="/videos/${video._id}?_method=DELETE"
                method="POST" onsubmit="return deleteFacultyVideo(event,this)">
                <button type="submit" class="btn btn-sm btn-label-danger btn-bold ml-1">Delete</button>
              </form>
            </div>` : (data.currentUser && data.currentUser.isStudent) ?
                `<div class="float-right">
              <form class="d-inline float-right save-video-form id=${video._id}"
                action="/user/${data.currentUser._id}/videos/${video._id}?_method=PUT" method="POST" onsubmit='return bookmarkVideo(event,this)'>
                <button type="submit" id="video-bookmark-button"
                  class="btn btn-sm ml-1 ${data.currentUser.videoBookmarks.includes(video._id) ? "btn-info" : "btn-warning"}">
                  ${data.currentUser.videoBookmarks.includes(video._id) ? "Bookmarked" : "Bookmark"}</button>
              </form>
            </div>` : ""
            }
        </div>
      </div>
    </div>
    <!--end:: Widgets/Blog-->
</div>`);
        });
      };
      let curPage = $('#adminDashboardVideos-pagination .kt-pagination__link--active').text().trim();
      let currentPage = parseInt(curPage);
      let limit = data.limit;
      let totalEntries = data.total;
      let probsecondNumber = limit * currentPage;
      let secondNumber = Math.min(probsecondNumber, totalEntries);
      let firstNumber = probsecondNumber - (limit - 1);
      $(".adminVideo-pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)    })
  })
}

// ----------------------------------------------------------------------------------------------------//
// --------------------------------------------Faculty'S List------------------------------------------//
// ----------------------------------------------------------------------------------------------------//
function refreshAdminFacultyTable() {
  var filterItems = $('#adminDashboardfaculty-form').serialize();
  var filterItemsArray = $('#adminDashboardfaculty-form').serializeArray();
  // console.log(filterItems);
  // console.log(filterItemsArray);
  let limitNo = $('#adminDashboardfaculty-limit').val() || "10"
  let pageNo = $('#adminDashboardfacultyPagination .kt-pagination__link--active').text().trim() || 1;
  if ($("#largeScreen-adminDashboardfaculty").is(":hidden")) {
    var sort = $("select#adminDashboardfaculty-sort-mobile option:checked").val();
  }
  if ($("#largeScreen-adminDashboardfaculty").is(":visible")) {
    var sort = $(".faculty-sort-active").closest('span').attr('class');
  }
  // console.log('sort Faculty');
  // console.log(sort);
  let userURL = $('#menu_dashboard_userURL').attr('href');
  // console.log(userURL);
  let adminDashboardFacultyTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
  // console.log(adminDashboardFacultyTableURL);
  $.get(adminDashboardFacultyTableURL, filterItems, function (data) {
    // console.log(data);
    $('#adminDashboardfacultyPagination').empty();
    $('#adminDashboardfacultyPagination_bottom').empty();
    var maxInitialPage = 9;
    var maxInitialPages = Math.min(data.faculty.pages,9); 
    var prePages = Math.max(data.faculty.page-7, 1);
    var postPages = Math.min(data.faculty.pages,data.faculty.page+1);
    if(data.faculty.page < maxInitialPage){
      for (let i = 1; i <= maxInitialPages; i++) {
      $('#adminDashboardfacultyPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
      $('#adminDashboardfacultyPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
      }      
    } else {
      for (let i = prePages; i <= postPages; i++) {
      $('#adminDashboardfacultyPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
      $('#adminDashboardfacultyPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
      }      
    }

    $(`#adminDashboardfacultyPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
    $(`#adminDashboardfacultyPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

    $("#adminDashboardfaculty-table-body").empty();
    $('#smallScreen-adminDashboardfaculty-content').empty();
    data.faculty.docs.forEach(function (teacher, index) {
      $("#adminDashboardfaculty-table-body").append(`
       <tr>
         <td class="align-middle text-center">${index + 1}</td>
         <td class="align-middle text-center">${teacher.username}</td>
         <td class="align-middle text-center">${teacher.firstName}</td>
         <td class="align-middle text-center">${teacher.lastName}</td>
         <td class="align-middle text-center">${teacher.exam}</td>
         <td class="align-middle text-center">${teacher.city}</td>
         <td class="align-middle text-center">${teacher.state}</td>
         <td class="align-middle text-center">${teacher.mobile}</td>
         <td class="align-middle text-center">${teacher.email}</td>
         <td class="align-middle text-center">${teacher.emailVerified}</td>
         <td class="align-middle text-center">${teacher.isFacultyVerified ? 
          `<span class="btn btn-label-success btn-sm">Verified</span>`:`<form id="facultyVerification${teacher._id}" onsubmit="facultyVerification(event, this)" class="d-inline-block m-0 p-0" 
          action="/facultyVerification/${teacher._id}?_method=PUT" method="POST">
          <button type="submit" class="btn btn-label-danger btn-sm">Verify</button>
          </form>` }</td>
         <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center text-nowrap">
         <span class="dropdown">
              <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
              <div class="dropdown-menu dropdown-menu-right">
              <div class="dropdown-item"> 
                  <form action="/user/${teacher._id}/edit" method="GET">
                  <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                  </form>
              </div>
              <div class="dropdown-item"> 
                  <form action="/user/${teacher._id}?_method=DELETE" method="POST">
                  <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                  </form>
              </div>
              </div>
          </span> 
        </td>
       </tr>
       `);
    });


    data.faculty.docs.forEach(function (teacher, index) {
      $("#smallScreen-adminDashboardfaculty-content").append(`
        <div class="kt-widget4__item">
        <div class="kt-widget4__pic kt-widget4__pic--pic">
        <span
            class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${teacher.firstName.charAt(0).toUpperCase()}</span>
          <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
        </div>
        <div class="kt-widget4__info pr-1">
          <a href="#" class="kt-widget4__username">
            ${teacher.username} 
          </a>
          <p class="kt-widget4__text">
            ${teacher.username}  <br> 
            <span
              class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success text-nowrap">${teacher.exam}</span>
            <span
              class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success">${teacher.exam}</span>
            ${(teacher.exam || teacher.exam !== "") ? `<span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-brand">${teacher.exam}</span>` : ""}
          </p>
        </div>
        <div class='flex-column'>
        <div class="d-flex justify-content-center mb-3"> 
        <span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-danger text-nowrap x-auto">${moment(teacher.createdAt).format("DD-MMM-YYYY")}</span>
        </div>
        <div class=''>
        <span class="dropdown">
        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
        <div class="dropdown-menu dropdown-menu-right">
        <div class="dropdown-item"> 
            <form action="/user/${teacher._id}/edit" method="GET">
            <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
            </form>
        </div>
        <div class="dropdown-item"> 
            <form action="/user/${teacher._id}?_method=DELETE" method="POST">
            <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
            </form>
        </div>
        <div class="dropdown-item"> 
        ${teacher.isFacultyVerified ? 
          ``:`<form id="facultyVerification${teacher._id}" onsubmit="facultyVerification(event, this)" class="d-inline-block m-0 p-0" 
          action="/facultyVerification/${teacher._id}?_method=PUT" method="POST">
          <button type="submit" class="btn btn-label-warning btn-sm"><i class="far fa-vote-yea"></i>Verify</button>
          </form>` }
        </div>
        </div>
          </span> 
            </div>
          </div>
  </div>
`);
    });

    let curPage = $('#adminDashboardfacultyPagination .kt-pagination__link--active').text().trim();
    let currentPage = parseInt(curPage);
    let limit = data.faculty.limit;
    let totalEntries = data.faculty.total;
    let probsecondNumber = limit * currentPage;
    let secondNumber = Math.min(probsecondNumber, totalEntries);
    let firstNumber = probsecondNumber - (limit - 1);
    $(".faculty-pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.faculty.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
  })
};

function facultyTableinit() {
  refreshAdminFacultyTable();
  $('#adminDashboardfacultyPagination li').first().addClass('kt-pagination__link--active')
};

function adminDashFaculty_paginationButtons() {
  $('.kt-pagination__link--first').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardfacultyPagination').children().first().click();
  })

  $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardfacultyPagination').children().last().click();
  })

  $('.kt-pagination__link--next').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardfacultyPagination .kt-pagination__link--active').prev().click();
  })

  $('.kt-pagination__link--prev').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardfacultyPagination .kt-pagination__link--active').next().click();
  })
}

function adminDashFaculty_sorting() {
  $('#adminDashboardfaculty-table--header i').on("click", function () {
    $('.faculty-sort-active').addClass('arrow-inactive');
    $('.faculty-sort-active').removeClass('faculty-sort-active');
    $(this).removeClass('arrow-inactive');
    $(this).addClass('faculty-sort-active');
    let para = $(this).closest('span').attr('class');
    // console.log(para);
    refreshAdminFacultyTable();
  })
}

function adminDashFaculty_filter() {
  $('#adminDashboardfaculty-search').val("")
  var filterItemsArray = $('#adminDashboardfaculty-form').serializeArray();
  $('#adminDashboardfaculty-filterTags').empty();
  filterItemsArray.forEach(function (filter) {

    let filtername = filter.name;
    if(filtername.indexOf('[')!== -1){
      var filterId = filtername.slice(0, (filtername.indexOf('[')));
    } else {
      var filterId = filtername;
    }
    let filterText = $(`#adminDashboardfaculty-${filterId} option:selected`).text().trim();
    
    if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit' && filter.name !== 'sort' && filter.name !== 'sortDashboard' && filter.name !== 'page') {
      if (filter.name.indexOf('[') !== -1) {
        filtername = filter.name.slice(0, (filter.name.indexOf('[')));
      } else {
        filtername = filter.name;
      }
      $('#adminDashboardfaculty-filterTags').append(`<span id="adminDashboardfaculty-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filterText}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
    }
  })
  refreshAdminFacultyTable();
}

function adminDashFaculty_removeFilterTags() {
  $('#adminDashboardfaculty-filterTags').on('click', 'span', function () {
    let filterKey = $(this).attr('id');
    $(`#${filterKey}`).val('rf').change();
  })
}

function adminDashFaculty_changePaginationActiveTab() {
  $('#adminDashboardfacultyPagination').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardfacultyPagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardfacultyPagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $(this).addClass('kt-pagination__link--active');
    refreshAdminFacultyTable();
  });

  $('#adminDashboardfacultyPagination_bottom').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardfacultyPagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardfacultyPagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    let pageNoBottomDownloadClicked = $(this).attr('id');
    let pageTopDownloadId = pageNoBottomDownloadClicked.replace('_bottom', '');
    $('#' + pageTopDownloadId).click();
    refreshAdminFacultyTable();
  });
}

function adminDashFaculty_changePaginationTabto1() {
  $('#adminDashboardfaculty-limit').on('keyup change', function () {
    refreshAdminFacultyTable()
    $("#adminDashboardfacultyPagination li:first-child").click();
  })

  $("#adminDashboardfaculty-limit i").on('click', function () {
    refreshAdminFacultyTable()
    $("#adminDashboardfacultyPagination li:first-child").click();
  })
}

function adminDashFaculty_searchOnKeyUp() {
  $('#adminDashboardfaculty-search').on('keyup change', function () {
    refreshAdminFacultyTable();
  });
}

function adminDashFaculty_searchEnterKey() {
  $('#adminDashboardfaculty-search').keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });
}

function adminDashFacultyTable_clearFilter() {
  $('#adminDashboardfaculty-clearform').on('click', function (e) {
    e.preventDefault();
    let limitNo = $('#adminDashboardfaculty-limit').val() || "10"
    let pageNo = $('#adminDashboardfacultyPagination .kt-pagination__link--active').text().trim() || 1;
    $(`#sorting-mobile-adminDashboardDownloadTable`).val('-createdAt');

    $('#adminDashboardfaculty-search').val("");
    $('#adminDashboardfaculty-exam').val('rf');
    $('#adminDashboardfaculty-city').val('rf');
    $('#adminDashboardfaculty-emailVerified').val('rf');

    $('#adminDashboardfaculty-filterTags').empty();
    let userURL = $('#menu_dashboard_userURL').attr('href');
    let adminDashboardFacultyTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=-createdAt`;
    // console.log(adminDashboardFacultyTableURL);
    $.get(adminDashboardFacultyTableURL, function (data) {
      $('#adminDashboardfacultyPagination').empty();
      $('#adminDashboardfacultyPagination_bottom').empty();

      var maxInitialPage = 9;
      var maxInitialPages = Math.min(data.faculty.pages,9); 
      var prePages = Math.max(data.faculty.page-7, 1);
      var postPages = Math.min(data.faculty.pages,data.faculty.page+1);
      if(data.faculty.page < maxInitialPage){
        for (let i = 1; i <= maxInitialPages; i++) {
        $('#adminDashboardfacultyPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
        $('#adminDashboardfacultyPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }      
      } else {
        for (let i = prePages; i <= postPages; i++) {
        $('#adminDashboardfacultyPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
        $('#adminDashboardfacultyPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }      
      }
  
      $(`#adminDashboardfacultyPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
      $(`#adminDashboardfacultyPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

      $("#adminDashboardfaculty-table-body").empty();
      $('#smallScreen-adminDashboardfaculty-content').empty();
      data.faculty.docs.forEach(function (teacher, index) {
        $("#adminDashboardfaculty-table-body").append(`
          <tr>
          <td class="align-middle text-center">${index + 1}</td>
          <td class="align-middle text-center">${teacher.username}</td>
          <td class="align-middle text-center">${teacher.firstName}</td>
          <td class="align-middle text-center">${teacher.lastName}</td>
          <td class="align-middle text-center">${teacher.exam}</td>
          <td class="align-middle text-center">${teacher.city}</td>
          <td class="align-middle text-center">${teacher.state}</td>
          <td class="align-middle text-center">${teacher.mobile}</td>
          <td class="align-middle text-center">${teacher.email}</td>
          <td class="align-middle text-center">${teacher.emailVerified}</td>
          <td class="align-middle text-center">${teacher.isFacultyVerified ? 
            `<span class="btn btn-label-success btn-sm">Verified</span>`:`<form id="facultyVerification${teacher._id}" onsubmit="facultyVerification(event, this)" class="d-inline-block m-0 p-0" 
            action="/facultyVerification/${teacher._id}?_method=PUT" method="POST">
            <button type="submit" class="btn btn-label-danger btn-sm">Verify</button>
            </form>` }</td>
          <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
          <td class="align-middle text-center text-nowrap">
          <span class="dropdown">
               <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
               <div class="dropdown-menu dropdown-menu-right">
               <div class="dropdown-item"> 
                   <form action="/user/${teacher._id}/edit" method="GET">
                   <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                   </form>
               </div>
               <div class="dropdown-item"> 
                   <form action="/user/${teacher._id}?_method=DELETE" method="POST">
                   <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                   </form>
               </div>
               </div>
           </span> 
            <a href="/downloads/docs/${teacher._id}" id="${teacher._id}" onclick="return adminDashFaculty_downloadBtn(this)" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a>
            
           <form id="bookmark_${teacher._id}" onsubmit="documentBookmark(event, this)" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${teacher._id}/bookmark" method="POST">
                     <button type="submit" title="Bookmark"  class="btn btn-sm btn-clean btn-icon btn-icon-md ${teacher._id} ${data.loggedinUser && data.loggedinUser.downloadBookmarks.includes(document._id) ? 'red-color' : ''}"><i class="fas fa-bookmark"></i></button>
           </form>
         <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
           <a href="#" class="btn btn-clean btn-sm btn-icon btn-icon-md" data-toggle="dropdown">
             <i class="fas fa-share-alt"></i>
           </a>
           <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right">
             <ul class="kt-nav">
               <li class="kt-nav__item">
                 <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${teacher._id}" title="Share" target="_blank" class="kt-nav__link">
                         <i class="kt-nav__link-icon socicon-whatsapp"></i>
                         <span class="kt-nav__link-text">Whatsapp</span>
                 </a>
               </li>
               <li class="kt-nav__item"> 
 
                   <a href="tg://msg?url=http://${$(location).attr('host')}/downloads/${teacher._id}&text=${teacher.title}" class="kt-nav__link">
                       <i class="kt-nav__link-icon socicon-telegram"></i>
                       <span class="kt-nav__link-text">Telegram</span>
                   </a>
               </li>
               <li class="kt-nav__item">
                   <a href="https://www.facebook.com/sharer/sharer.php?u=http://${$(location).attr('host')}/downloads/${teacher._id}" target="_blank" class="kt-nav__link">
                       <i class="kt-nav__link-icon socicon-facebook"></i>
                       <span class="kt-nav__link-text">Facebook</span>
                   </a>
               </li>
               <li class="kt-nav__item" id='inputdownloadUrl_${teacher._id}'>
               <input type="text"  class="form-control d-none" value="http://${$(location).attr('host')}/downloads/${teacher._id}"">
                   <a href="javascript:;" data-link="http://${$(location).attr('host')}/downloads/${teacher._id}" id='downloadUrl_${teacher._id}' onclick="return shareLink(this)" class="kt-nav__link sharelinktrial"'>
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


      data.faculty.docs.forEach(function (teacher, index) {
        $("#smallScreen-adminDashboardfaculty-content").append(`
          <div class="kt-widget4__item">
          <div class="kt-widget4__pic kt-widget4__pic--pic">
          <span
              class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${teacher.firstName.charAt(0).toUpperCase()}</span>
            <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
          </div>
          <div class="kt-widget4__info pr-1">
            <a href="#" class="kt-widget4__username">
              ${teacher.username}
            </a>
            <p class="kt-widget4__text">
              ${teacher.username} <br>
              <span
                class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success text-nowrap">${teacher.exam}</span>
              <span
                class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success">${teacher.exam}</span>
              ${(teacher.exam || teacher.exam !== "") ? `<span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-brand">${teacher.subject}</span>` : ""}
            </p>
          </div>
          <div class='flex-column'>
          <div class="d-flex justify-content-center mb-3"> 
          <span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-danger text-nowrap x-auto">${moment(teacher.createdAt).format("DD-MMM-YYYY")}</span>
          </div>
          <div class=''>
          <span class="dropdown">
          <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
          <div class="dropdown-menu dropdown-menu-right">
          <div class="dropdown-item"> 
              <form action="/user/${teacher._id}/edit" method="GET">
              <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
              </form>
          </div>
          <div class="dropdown-item"> 
              <form action="/user/${teacher._id}?_method=DELETE" method="POST">
              <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
              </form>
          </div>
          <div class="dropdown-item"> 
          ${teacher.isFacultyVerified ? 
            ``:`<form id="facultyVerification${teacher._id}" onsubmit="facultyVerification(event, this)" class="d-inline-block m-0 p-0" 
            action="/facultyVerification/${teacher._id}?_method=PUT" method="POST">
            <button type="submit" class="btn btn-label-warning btn-sm"><i class="far fa-vote-yea"></i>Verify</button>
            </form>` }
          </div>
          </div>
            </span> 
          <a href="/downloads/docs/${teacher._id}" id="${teacher._id}"
              onclick="downloadBtn(this)" title="Download" target="_blank"
              class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i
              class="fas fa-file-download"></i></span></a></a>
              <form id="bookmark_${teacher._id}" onsubmit="teacherBookmark(event, this)"
                class="d-inline-block m-0 p-0 bookmark-ajax-form"
                action="/user/downloads/${teacher._id}/bookmark" method="POST">
                <button type="submit" title="Bookmark"
                  class="btn btn-sm btn-clean btn-icon btn-icon-md ${teacher._id}"><i
                    class="fas fa-bookmark"></i></button>
              </form>

              <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
              <a href="#" class="btn btn-clean btn-sm btn-icon btn-icon-md" data-toggle="dropdown">
                <i class="fas fa-share-alt"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right">
                <ul class="kt-nav">
                  <li class="kt-nav__item">
                    <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${teacher._id}" title="Share" target="_blank" class="kt-nav__link">
                            <i class="kt-nav__link-icon socicon-whatsapp"></i>
                            <span class="kt-nav__link-text">Whatsapp</span>
                    </a>
                  </li>
                  <li class="kt-nav__item"> 
    
                      <a href="tg://msg?url=http://${$(location).attr('host')}/downloads/${teacher._id}&text=${teacher.title}" class="kt-nav__link">
                          <i class="kt-nav__link-icon socicon-telegram"></i>
                          <span class="kt-nav__link-text">Telegram</span>
                      </a>
                  </li>
                  <li class="kt-nav__item">
                      <a href="https://www.facebook.com/sharer/sharer.php?u=http://${$(location).attr('host')}/downloads/${teacher._id}" target="_blank" class="kt-nav__link">
                          <i class="kt-nav__link-icon socicon-facebook"></i>
                          <span class="kt-nav__link-text">Facebook</span>
                      </a>
                  </li>
                  <li class="kt-nav__item" id='inputdownloadUrl_${teacher._id}'>
                  <input type="text"  class="form-control d-none" value="http://${$(location).attr('host')}/downloads/${teacher._id}"">
                      <a href="javascript:;" data-link="http://${$(location).attr('host')}/downloads/${teacher._id}" id='downloadUrl_${teacher._id}' onclick="return shareLink(this)" class="kt-nav__link sharelinktrial"'>
                          <i class="kt-nav__link-icon fa fa-link"></i>
                          <span class="kt-nav__link-text">Copy URL</span>
                      </a>
                  </li>
                  </ul>							
                </div>
            </div>
              </div>
            </div>
    </div>
 `);
      });


      let curPage = $('#adminDashboardfacultyPagination .kt-pagination__link--active').text().trim();
      let currentPage = parseInt(curPage);
      let limit = data.faculty.limit;
      let totalEntries = data.faculty.total;
      let probsecondNumber = limit * currentPage;
      let secondNumber = Math.min(probsecondNumber, totalEntries);
      let firstNumber = probsecondNumber - (limit - 1);
      $(".faculty-pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.faculty.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
    })

  })
};

function facultyVerification(e, elem){
  e.preventDefault();
  let actionUrl = $(elem).attr('action');
  // console.log(actionUrl);
  $.ajax({
    url: actionUrl,
    type: "PUT",
    success: function (data) {
      // console.log('facultyVerification-DAAATA');
      // console.log(data);
      refreshAdminFacultyTable();
      // console.log('refreshed!');
    }
  });
}
// ----------------------------------------------------------------------------------------------------//
// --------------------------------------------Student'S List------------------------------------------//
// ----------------------------------------------------------------------------------------------------//
function refreshAdminstudentTable() {
  var filterItems = $('#adminDashboardstudent-form').serialize();
  var filterItemsArray = $('#adminDashboardstudent-form').serializeArray();
  // console.log('StudentTable');
  // console.log(filterItems);
  // console.log(filterItemsArray);
  let limitNo = $('#adminDashboardstudent-limit').val() || "10"
  let pageNo = $('#adminDashboardstudentPagination .kt-pagination__link--active').text().trim() || 1;
  if ($("#largeScreen-adminDashboardstudent").is(":hidden")) {
    var sort = $("select#adminDashboardstudent-sort-mobile option:checked").val();
  }
  if ($("#largeScreen-adminDashboardstudent").is(":visible")) {
    var sort = $(".student-sort-active").closest('span').attr('class');
  }
  // console.log('sort');
  // console.log(sort);
  let userURL = $('#menu_dashboard_userURL').attr('href');
  // console.log(userURL);
  let adminDashboardstudentTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
  // console.log(adminDashboardstudentTableURL);
  $.get(adminDashboardstudentTableURL, filterItems, function (data) {
    // console.log(data);
    $('#adminDashboardstudentPagination').empty();
    $('#adminDashboardstudentPagination_bottom').empty();
    var maxInitialPage = 9;
    var maxInitialPages = Math.min(data.student.pages,9); 
    var prePages = Math.max(data.student.page-7, 1);
    var postPages = Math.min(data.student.pages,data.student.page+1);
    if(data.student.page < maxInitialPage){
      for (let i = 1; i <= maxInitialPages; i++) {
      $('#adminDashboardstudentPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
      $('#adminDashboardstudentPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
      }      
    } else {
      for (let i = prePages; i <= postPages; i++) {
      $('#adminDashboardstudentPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
      $('#adminDashboardstudentPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
      }      
    }

    $(`#adminDashboardstudentPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
    $(`#adminDashboardstudentPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

    $("#adminDashboardstudent-table-body").empty();
    $('#smallScreen-adminDashboardstudent-content').empty();
    data.student.docs.forEach(function (stud, index) {
      $("#adminDashboardstudent-table-body").append(`
       <tr>
         <td class="align-middle text-center">${index + 1}</td>
         <td class="align-middle text-center">${stud.username}</td>
         <td class="align-middle text-center">${stud.firstName}</td>
         <td class="align-middle text-center">${stud.lastName}</td>
         <td class="align-middle text-center">${moment(stud.dob).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center">${stud.exam}</td>
         <td class="align-middle text-center">${stud.city}</td>
         <td class="align-middle text-center">${stud.mobile}</td>
         <td class="align-middle text-center">${stud.email}</td>
         <td class="align-middle text-center">${stud.emailVerified}</td>
         <td class="align-middle text-center">${moment(stud.createdAt).format("DD-MMM-YYYY")}</td>
         <td class="align-middle text-center text-nowrap">
         <span class="dropdown">
              <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
              <div class="dropdown-menu dropdown-menu-right">
              <div class="dropdown-item"> 
                  <form action="/user/${stud._id}/edit" method="GET">
                  <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                  </form>
              </div>
              <div class="dropdown-item"> 
                  <form action="/user/${stud._id}?_method=DELETE" method="POST">
                  <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                  </form>
              </div>
              </div>
          </span> 
        </td>
       </tr>
       `);
    });


    data.student.docs.forEach(function (stud, index) {
      $("#smallScreen-adminDashboardstudent-content").append(`
        <div class="kt-widget4__item">
        <div class="kt-widget4__pic kt-widget4__pic--pic">
        <span
            class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${stud.firstName.charAt(0).toUpperCase()}</span>
          <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
        </div>
        <div class="kt-widget4__info pr-1">
          <a href="#" class="kt-widget4__username">
            ${stud.username}
          </a>
          <p class="kt-widget4__text">
            ${stud.username} <br>
            <span
              class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success text-nowrap">${stud.exam}</span>
            <span
              class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success">${stud.exam}</span>
            ${(stud.exam || stud.exam !== "") ? `<span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-brand">${stud.exam}</span>` : ""}
          </p>
        </div>
        <div class='flex-column'>
        <div class="d-flex justify-content-center mb-3"> 
        <span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-danger text-nowrap x-auto">${moment(stud.createdAt).format("DD-MMM-YYYY")}</span>
        </div>
        <div class=''>
        <span class="dropdown">
        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
        <div class="dropdown-menu dropdown-menu-right">
        <div class="dropdown-item"> 
            <form action="/user/${stud._id}/edit" method="GET">
            <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
            </form>
        </div>
        <div class="dropdown-item"> 
            <form action="/user/${stud._id}?_method=DELETE" method="POST">
            <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
            </form>
        </div>
        </div>
          </span> 
            </div>
          </div>
  </div>
`);
    });

    let curPage = $('#adminDashboardstudentPagination .kt-pagination__link--active').text().trim();
    let currentPage = parseInt(curPage);
    let limit = data.student.limit;
    let totalEntries = data.student.total;
    let probsecondNumber = limit * currentPage;
    let secondNumber = Math.min(probsecondNumber, totalEntries);
    let firstNumber = probsecondNumber - (limit - 1);
    $(".student-pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.student.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
  })
};

function studentTableinit() {
  refreshAdminstudentTable();
  $('#adminDashboardstudentPagination li').first().addClass('kt-pagination__link--active')
};

function adminDashStudent_paginationButtons() {
  $('.kt-pagination__link--first').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardstudentPagination').children().first().click();
  })

  $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardstudentPagination').children().last().click();
  })

  $('.kt-pagination__link--next').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardstudentPagination .kt-pagination__link--active').prev().click();
  })

  $('.kt-pagination__link--prev').on('click', 'a', function (e) {
    e.preventDefault();
    $('#adminDashboardstudentPagination .kt-pagination__link--active').next().click();
  })
}

function adminDashStudent_sorting() {
  $('#adminDashboardstudent-table--header i').on("click", function () {
    $('.student-sort-active').addClass('arrow-inactive');
    $('.student-sort-active').removeClass('student-sort-active');
    $(this).removeClass('arrow-inactive');
    $(this).addClass('student-sort-active');
    let para = $(this).closest('span').attr('class');
    // console.log(para);
    refreshAdminstudentTable();
  })
}

function adminDashStudent_filter() {
  $('#adminDashboardstudent-search').val("")
  var filterItemsArray = $('#adminDashboardstudent-form').serializeArray();
  $('#adminDashboardstudent-filterTags').empty();
  filterItemsArray.forEach(function (filter) {

    let filtername = filter.name;
    if(filtername.indexOf('[')!== -1){
      var filterId = filtername.slice(0, (filtername.indexOf('[')));
    } else {
      var filterId = filtername;
    }
    let filterText = $(`#adminDashboardstudent-${filterId} option:selected`).text().trim();


    if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit' && filter.name !== 'sort' && filter.name !== 'sortDashboard' && filter.name !== 'page') {
      if (filter.name.indexOf('[') !== -1) {
        filtername = filter.name.slice(0, (filter.name.indexOf('[')));
      } else {
        filtername = filter.name;
      }
      $('#adminDashboardstudent-filterTags').append(`<span id="adminDashboardstudent-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filterText}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
    }
  })
  refreshAdminstudentTable();
}

function adminDashStudent_removeFilterTags() {
  $('#adminDashboardstudent-filterTags').on('click', 'span', function () {
    let filterKey = $(this).attr('id');
    $(`#${filterKey}`).val('rf').change();
  })
}

function adminDashStudent_changePaginationActiveTab() {
  $('#adminDashboardstudentPagination').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardstudentPagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardstudentPagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $(this).addClass('kt-pagination__link--active');
    refreshAdminstudentTable();
  });

  $('#adminDashboardstudentPagination_bottom').on('click', "li", function (e) {
    e.preventDefault();
    $('#adminDashboardstudentPagination .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#adminDashboardstudentPagination_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    let pageNoBottomDownloadClicked = $(this).attr('id');
    let pageTopDownloadId = pageNoBottomDownloadClicked.replace('_bottom', '');
    $('#' + pageTopDownloadId).click();
    refreshAdminstudentTable();
  });
}

function adminDashStudent_changePaginationTabto1() {
  $('#adminDashboardstudent-limit').on('keyup change', function () {
    refreshAdminstudentTable()
    $("#adminDashboardstudentPagination li:first-child").click();
  })

  $("#adminDashboardstudent-limit i").on('click', function () {
    refreshAdminstudentTable()
    $("#adminDashboardstudentPagination li:first-child").click();
  })
}

function adminDashStudent_searchOnKeyUp() {
  $('#adminDashboardstudent-search').on('keyup change', function () {
    refreshAdminstudentTable();
  });
}

function adminDashStudent_searchEnterKey() {
  $('#adminDashboardstudent-search').keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });
}

function adminDashStudentTable_clearFilter() {
  $('#adminDashboardstudent-clearform').on('click', function (e) {
    e.preventDefault();
    let limitNo = $('#adminDashboardstudent-limit').val() || "10"
    let pageNo = $('#adminDashboardstudentPagination #pagination-url_1').text() || 1;
    $('#adminDashboardstudentPagination #pagination_1').addClass('kt-pagination__link--active');
    $(`#sorting-mobile-adminDashboardDownloadTable`).val('-createdAt');
    // if ($("#largeScreen-adminDashboardstudent").is(":hidden")) {
    //     var sort = $("select#sorting-mobile-adminDashboardDownloadTable option:checked").val() || "-createdAt";
    // }
    // if ($("#largeScreen-adminDashboardstudent").is(":visible")) {
    //     var sort = $(".student-sort-active").closest('span').attr('class');
    // }
    $('#adminDashboardstudent-search').val("");
    $('#adminDashboardstudent-exam').val('rf');
    $('#adminDashboardstudent-city').val('rf');
    $('#adminDashboardstudent-emailVerified').val('rf');

    $('#adminDashboardstudent-filterTags').empty();
    let userURL = $('#menu_dashboard_userURL').attr('href');
    let adminDashboardstudentTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=-createdAt`;
    // console.log(adminDashboardstudentTableURL);
    $.get(adminDashboardstudentTableURL, function (data) {
      $('#adminDashboardstudentPagination').empty();
      $('#adminDashboardstudentPagination_bottom').empty();
      var maxInitialPage = 9;
      var maxInitialPages = Math.min(data.student.pages,9); 
      var prePages = Math.max(data.student.page-7, 1);
      var postPages = Math.min(data.student.pages,data.student.page+1);
      if(data.student.page < maxInitialPage){
        for (let i = 1; i <= maxInitialPages; i++) {
        $('#adminDashboardstudentPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
        $('#adminDashboardstudentPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }      
      } else {
        for (let i = prePages; i <= postPages; i++) {
        $('#adminDashboardstudentPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
        $('#adminDashboardstudentPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }      
      }

      $(`#adminDashboardstudentPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
      $(`#adminDashboardstudentPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

      $("#adminDashboardstudent-table-body").empty();
      $('#smallScreen-adminDashboardstudent-content').empty();
      data.student.docs.forEach(function (stud, index) {
        $("#adminDashboardstudent-table-body").append(`
          <tr>
          <td class="align-middle text-center">${index + 1}</td>
          <td class="align-middle text-center">${stud.username}</td>
          <td class="align-middle text-center">${stud.firstName}</td>
          <td class="align-middle text-center">${stud.lastName}</td>
          <td class="align-middle text-center">${stud.exam}</td>
          <td class="align-middle text-center">${stud.city}</td>
          <td class="align-middle text-center">${stud.state}</td>
          <td class="align-middle text-center">${stud.mobile}</td>
          <td class="align-middle text-center">${stud.email}</td>
          <td class="align-middle text-center">${stud.emailVerified}</td>
          <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
          <td class="align-middle text-center text-nowrap">
          <span class="dropdown">
               <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
               <div class="dropdown-menu dropdown-menu-right">
               <div class="dropdown-item"> 
                   <form action="/downloads/${stud._id}/edit" method="GET">
                   <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                   </form>
               </div>
               <div class="dropdown-item"> 
                   <form action="/downloads/${stud._id}?_method=DELETE" method="POST">
                   <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                   </form>
               </div>
               </div>
           </span> 
            <a href="/downloads/docs/${stud._id}" id="${stud._id}" onclick="return adminDashstudent_downloadBtn(this)" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a>
            
           <form id="bookmark_${stud._id}" onsubmit="documentBookmark(event, this)" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/${stud._id}/bookmark" method="POST">
                     <button type="submit" title="Bookmark"  class="btn btn-sm btn-clean btn-icon btn-icon-md ${stud._id} ${data.loggedinUser && data.loggedinUser.downloadBookmarks.includes(document._id) ? 'red-color' : ''}"><i class="fas fa-bookmark"></i></button>
           </form>
           
         <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
           <a href="#" class="btn btn-clean btn-sm btn-icon btn-icon-md" data-toggle="dropdown">
             <i class="fas fa-share-alt"></i>
           </a>
           <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right">
             <ul class="kt-nav">
               <li class="kt-nav__item">
                 <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${stud._id}" title="Share" target="_blank" class="kt-nav__link">
                         <i class="kt-nav__link-icon socicon-whatsapp"></i>
                         <span class="kt-nav__link-text">Whatsapp</span>
                 </a>
               </li>
               <li class="kt-nav__item"> 
 
                   <a href="tg://msg?url=http://${$(location).attr('host')}/downloads/${stud._id}&text=${stud.title}" class="kt-nav__link">
                       <i class="kt-nav__link-icon socicon-telegram"></i>
                       <span class="kt-nav__link-text">Telegram</span>
                   </a>
               </li>
               <li class="kt-nav__item">
                   <a href="https://www.facebook.com/sharer/sharer.php?u=http://${$(location).attr('host')}/downloads/${stud._id}" target="_blank" class="kt-nav__link">
                       <i class="kt-nav__link-icon socicon-facebook"></i>
                       <span class="kt-nav__link-text">Facebook</span>
                   </a>
               </li>
               <li class="kt-nav__item" id='inputdownloadUrl_${stud._id}'>
               <input type="text"  class="form-control d-none" value="http://${$(location).attr('host')}/downloads/${stud._id}"">
                   <a href="javascript:;" data-link="http://${$(location).attr('host')}/downloads/${stud._id}" id='downloadUrl_${stud._id}' onclick="return shareLink(this)" class="kt-nav__link sharelinktrial"'>
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


      data.student.docs.forEach(function (stud, index) {
        $("#smallScreen-adminDashboardstudent-content").append(`
          <div class="kt-widget4__item">
          <div class="kt-widget4__pic kt-widget4__pic--pic">
          <span
              class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${stud.firstName.charAt(0).toUpperCase()}</span>
            <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
          </div>
          <div class="kt-widget4__info pr-1">
            <a href="#" class="kt-widget4__username">
              ${stud.username}
            </a>
            <p class="kt-widget4__text">
              ${stud.username} <br>
              <span
                class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success text-nowrap">${stud.exam}</span>
              <span
                class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-success">${stud.exam}</span>
              ${(stud.exam || stud.exam !== "") ? `<span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-brand">${stud.subject}</span>` : ""}
            </p>
          </div>
          <div class='flex-column'>
          <div class="d-flex justify-content-center mb-3"> 
          <span class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-danger text-nowrap x-auto">${moment(stud.createdAt).format("DD-MMM-YYYY")}</span>
          </div>
          <div class=''>
          <span class="dropdown">
          <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
          <div class="dropdown-menu dropdown-menu-right">
          <div class="dropdown-item"> 
              <form action="/downloads/${stud._id}/edit" method="GET">
              <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
              </form>
          </div>
          <div class="dropdown-item"> 
              <form action="/downloads/${stud._id}?_method=DELETE" method="POST">
              <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
              </form>
          </div>
          </div>
            </span> 
          <a href="/downloads/docs/${stud._id}" id="${stud._id}"
              onclick="downloadBtn(this)" title="Download" target="_blank"
              class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i
              class="fas fa-file-download"></i></span></a></a>
              <form id="bookmark_${stud._id}" onsubmit="studBookmark(event, this)"
                class="d-inline-block m-0 p-0 bookmark-ajax-form"
                action="/user/downloads/${stud._id}/bookmark" method="POST">
                <button type="submit" title="Bookmark"
                  class="btn btn-sm btn-clean btn-icon btn-icon-md ${stud._id}"><i
                    class="fas fa-bookmark"></i></button>
              </form>

              <div class="kt-widget2__actions d-inline-block" id='sharingBtns'>
              <a href="#" class="btn btn-clean btn-sm btn-icon btn-icon-md" data-toggle="dropdown">
                <i class="fas fa-share-alt"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-fit dropdown-menu-right">
                <ul class="kt-nav">
                  <li class="kt-nav__item">
                    <a href="https://web.whatsapp.com/send?text=http://${$(location).attr('host')}/downloads/${stud._id}" title="Share" target="_blank" class="kt-nav__link">
                            <i class="kt-nav__link-icon socicon-whatsapp"></i>
                            <span class="kt-nav__link-text">Whatsapp</span>
                    </a>
                  </li>
                  <li class="kt-nav__item"> 
    
                      <a href="tg://msg?url=http://${$(location).attr('host')}/downloads/${stud._id}&text=${stud.title}" class="kt-nav__link">
                          <i class="kt-nav__link-icon socicon-telegram"></i>
                          <span class="kt-nav__link-text">Telegram</span>
                      </a>
                  </li>
                  <li class="kt-nav__item">
                      <a href="https://www.facebook.com/sharer/sharer.php?u=http://${$(location).attr('host')}/downloads/${stud._id}" target="_blank" class="kt-nav__link">
                          <i class="kt-nav__link-icon socicon-facebook"></i>
                          <span class="kt-nav__link-text">Facebook</span>
                      </a>
                  </li>
                  <li class="kt-nav__item" id='inputdownloadUrl_${stud._id}'>
                  <input type="text"  class="form-control d-none" value="http://${$(location).attr('host')}/downloads/${stud._id}"">
                      <a href="javascript:;" data-link="http://${$(location).attr('host')}/downloads/${stud._id}" id='downloadUrl_${stud._id}' onclick="return shareLink(this)" class="kt-nav__link sharelinktrial"'>
                          <i class="kt-nav__link-icon fa fa-link"></i>
                          <span class="kt-nav__link-text">Copy URL</span>
                      </a>
                  </li>
                  </ul>							
                </div>
            </div>
              </div>
            </div>
    </div>
 `);
      });

      let curPage = $('#adminDashboardstudentPagination .kt-pagination__link--active').text().trim();
      let currentPage = parseInt(curPage);
      let limit = data.student.limit;
      let totalEntries = data.student.total;
      let probsecondNumber = limit * currentPage;
      let secondNumber = Math.min(probsecondNumber, totalEntries);
      let firstNumber = probsecondNumber - (limit - 1);
      $(".student-pagination__desc").html(`Total pages <span class="kt-badge kt-badge--unified-brand kt-badge--md kt-badge--rounded kt-badge--bold mr-1">${data.student.pages}</span>|| Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`);
    })

  })
};




function filterfilling() {

  $.get('/api/filterdata', function (filterlist) {
    // console.log('filterlist filterform');
    // console.log(filterlist);

    $('.adminDashboard-exam').empty();
    $('.adminDashboard-exam').append(`<option value='rf'>Exam</option> 
    <option value='All'>All</option>`);
    filterlist.exams.forEach(value => {
      $('.adminDashboard-exam').append($("<option></option>")
        .attr("value", value.exam)
        .text(value.exam))
    })

    $('.adminDashboard-author').empty();
    $('.adminDashboard-author').append(`<option value='rf'>Faculty</option>`);
    filterlist.teachers.forEach(faculty => {
      if (!faculty.byAdmin) {
        $('.adminDashboard-author').append($("<option></option>")
          .attr("value", faculty.username)
          .text(faculty.registeredUser.displayName))
      }
      if (faculty.byAdmin) {
        $('.adminDashboard-author').append($("<option></option>")
          .attr("value", faculty.username)
          .text(faculty.displayName))
      }
    });
  })
};

async function filterAdminDocSubjectFilling(elem) {
  let currentExam = await $(elem).val();
  let sectionId = await $(elem).attr("data-ref");
  if (currentExam !== 'All' && currentExam !== 'rf') {
    $.get(`/api/filterform/${currentExam}/subjects`, function (info) {
      // console.log('subjects');
      // console.log(info);
      $(`#${sectionId}`).empty();
      $(`#${sectionId}`).append(`<option value='rf'>Subject</option> 
      <option value='All'>All</option>`);
      info[0].subjects.forEach(subject => {
        $(`#${sectionId}`).append($("<option></option>")
          .attr("value", subject)
          .text(subject))
      });
    });
  }
  if (sectionId === 'adminDashboardDocs-subject') {
    // console.log('docs');
    adminDashDocs_filter();
  } else if (sectionId === 'adminDashboardVideos-subject') {
    // console.log('videos');
    adminDashVideos_filter();
  }
}
