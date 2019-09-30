$(document).ready(function () {
    // ---------------------Download------------------
    datatableinit();
    adminDashDocs_changePaginationActiveTab()
    adminDashDocs_changePaginationTabto1()
    adminDashDocs_removeFilterTags();
    adminDashDocs_searchOnKeyUp()
    adminDashDocs_paginationButtons();
    adminDashDocs_sorting();
    adminDashDocs_filter();
    adminDashDocs_downloadBtn();
    adminDashDocs_searchEnterKey();
    adminDashVideos_clearDocsFilter();
    // ---------------------Video------------------
    videoBankinit();
    adminDashVideos_changePaginationActiveTab()
    adminDashVideos_changePaginationTabto1()
    adminDashVideos_removeFilterTags();
    adminDashVideos_searchOnKeyUp()
    adminDashVideos_clickOnSubmitBtn()
    adminDashVideos_paginationButtons();
    adminDashVideos_searchEnterKey();
    adminDashVideos_filter();
    adminDashVideos_clearVideoFilter();
    
});


function refreshDataTable() {
    var filterItems = $('#adminDashboard_document_table').serialize();
    var filterItemsArray = $('#adminDashboard_document_table').serializeArray();
    console.log(filterItemsArray);
    let limitNo = $('#limit-adminDashboardDownloadTable').val() || "10"
    let pageNo = $('#adminDashboardDocsPagination .kt-pagination__link--active').text().trim() || 1;
    if ($("#largeScreen-adminDashboardDocTable").is(":hidden")) {
        var sort = $("select#sorting-mobile-adminDashboardDownloadTable option:checked").val();
    }
    if ($("#largeScreen-adminDashboardDocTable").is(":visible")) {
        var sort = $(".downloads-sort-active").closest('span').attr('class');
    }
    console.log('sort');
    console.log(sort);
    let userURL = $('#menu_dashboard_userURL').attr('href');
    // console.log(userURL);
    let adminDashboardDownloadTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
    console.log(adminDashboardDownloadTableURL);
    $.get(adminDashboardDownloadTableURL, filterItems, function (data) {
      console.log(data);
        $('#adminDashboardDocsPagination').empty();
        $('#adminDashboardDocsPagination_bottom').empty();
        for (let i = 1; i <= data.downloads.pages; i++) {
            $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
        }
        for (let i = 1; i <= data.downloads.pages; i++) {
            $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
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
           <td class="align-middle text-center text-capitalize">${document.author.username}</td>
           <td class="align-middle text-center dataTableText">${document.title}</td>
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
                      class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${document.author.username.charAt(0).toUpperCase()}</span>
                    <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
                  </div>
                  <div class="kt-widget4__info pr-1">
                    <a href="#" class="kt-widget4__username">
                      ${document.title}
                    </a>
                    <p class="kt-widget4__text">
                      ${document.author.username} <br>
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
        $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
    })
};

function datatableinit() {
    refreshDataTable();
    $('#adminDashboardDocsPagination li').first().addClass('kt-pagination__link--active')
};

function adminDashDocs_paginationButtons() {
    $('.kt-pagination__link--first').on('click', 'a', function (e) {
        e.preventDefault();
        $('#pagination_1').click();
    })

    $('.kt-pagination__link--last').on('click', 'a', function (e) {
        e.preventDefault();
        $('#adminDashboardDocsPagination').children().last().click();
    })

    $('.kt-pagination__link--next').on('click', 'a', function (e) {
        e.preventDefault();
        let val = $('#adminDashboardDocsPagination .kt-pagination__link--active').prev().click();
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
        console.log(para);
        refreshDataTable();
    })
}

function adminDashDocs_filter() {
    $('#adminDashboardDocs-search').val("")
    var filterItemsArray = $('#adminDashboard_document_table').serializeArray();
    $('#adminDashboard-document-filter-tags').empty();
    filterItemsArray.forEach(function (filter) {
        if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit' && filter.name !== 'sort' && filter.name !== 'sortDashboard' && filter.name !== 'page') {
            filtername = filter.name.slice(0, (filter.name.indexOf('[')));
            $('#adminDashboard-document-filter-tags').append(`<span id="adminDashboardDocs-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filter.value}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
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
    console.log(val);
    console.log(url);
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
            console.log(data);
        }
    });
    $(this).find("button").blur();
}

function documentBookmark(e, element) {
    e.preventDefault();
    var actionUrl = $(element).attr("action");
    console.log(actionUrl);
    var formid = $(element).attr("id").slice(9);
    console.log(formid);
    $.ajax({
        url: actionUrl,
        type: "PUT",
        success: function (data) {
            refreshDataTable();
            console.log(data);
            alert(`${data[0].msg}`);
        }
    })
};


function adminDashVideos_clearDocsFilter(){
  $('#adminDashboardDocs-cleardocsform').on('click',function(e){
    e.preventDefault();
    $('#adminDashboard-document-filter-tags').empty();
    let limitNo = $('#limit-adminDashboardDownloadTable').val() || "10"
    let pageNo = $('#adminDashboardDocsPagination .kt-pagination__link--active').text().trim() || 1;
    $(`#sorting-mobile-adminDashboardDownloadTable`).val('-createdAt');
    // if ($("#largeScreen-adminDashboardDocTable").is(":hidden")) {
    //     var sort = $("select#sorting-mobile-adminDashboardDownloadTable option:checked").val() || "-createdAt";
    // }
    // if ($("#largeScreen-adminDashboardDocTable").is(":visible")) {
    //     var sort = $(".downloads-sort-active").closest('span').attr('class');
    // }
    let userURL = $('#menu_dashboard_userURL').attr('href');
    let adminDashboardDownloadTableURL = `${userURL}?page=${pageNo}&limit=${limitNo}&sort=-createdAt`;
    console.log(adminDashboardDownloadTableURL);
    $.get(adminDashboardDownloadTableURL, function (data) {
        $('#adminDashboardDocsPagination').empty();
        $('#adminDashboardDocsPagination_bottom').empty();
        for (let i = 1; i <= data.downloads.pages; i++) {
            $('#adminDashboardDocsPagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}">${i}</a></li>`)
        }
        for (let i = 1; i <= data.downloads.pages; i++) {
            $('#adminDashboardDocsPagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}&limit=${limitNo}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }
        $(`#adminDashboardDocsPagination li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
        $(`#adminDashboardDocsPagination_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

        $("adminDashboardDocTable-tableBody").empty();
        $('#smallScreen-adminDashboardDocTable-content').empty();
        data.downloads.docs.forEach(function (document, index) {
            $("adminDashboardDocTable-tableBody").append(`
         <tr>
           <td class="align-middle text-center">${index + 1}</td>
           <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
           <td class="align-middle text-center text-capitalize">${document.author.username}</td>
           <td class="align-middle text-center dataTableText">${document.title}</td>
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
                      class="kt-badge kt-badge--unified-brand kt-badge--lg kt-badge--rounded kt-badge--bold">${document.author.username.charAt(0).toUpperCase()}</span>
                    <!-- <img src="./assets/media/users/100_4.jpg" alt=""> -->
                  </div>
                  <div class="kt-widget4__info pr-1">
                    <a href="#" class="kt-widget4__username">
                      ${document.title}
                    </a>
                    <p class="kt-widget4__text">
                      ${document.author.username} <br>
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
        $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
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
    console.log(filterItemsArray);
    // console.log(decodeURI(filterItems));
    let limitNo = $('#adminDashboardVideos-limit').val() || "10"
    let pageNo = $('#adminDashboardVideos-pagination .kt-pagination__link--active').text().trim() || 1;
    let sort = $("#adminDashboardVideos-sort").val() || "-createdAt"
    // let videoDatatableUrl = `/videoscopy?page=${pageNo}&limit=${limitNo}&sort=${sort}`; because it goes as part of the filter items...
    let videoDatatableUrl = `/videoscopy?page=${pageNo}`;

    $.get(videoDatatableUrl, filterItems, function (data) {
        $('#adminDashboardVideos-pagination').empty();
        for (let i = 1; i <= data.pages; i++) {
            $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`)
        }

        $('#adminDashboardVideos-pagination_bottom').empty();
        for (let i = 1; i <= data.pages; i++) {
            $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
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
                      class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.username.charAt(0).toUpperCase()}</span>
                    <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
                  </div>
                  <div class="kt-widget19__info">
                    <a href="/teachers/${video.author.id}" class="kt-widget19__username">
                      ${video.author.username}
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
                    class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.username.charAt(0).toUpperCase()}</span>
                  <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
                </div>
                <div class="kt-widget19__info">
                  <a href="/teachers/${video.author.id}" class="kt-widget19__username">
                    ${video.author.username}
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
        $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
    })
};

function videoBankinit() {
    refreshVideoBank();
    $('#adminDashboardVideos-pagination li').first().addClass('kt-pagination__link--active')
};

function adminDashVideos_paginationButtons() {
    $('.kt-pagination__link--first').on('click', 'a', function (e) {
        e.preventDefault();
        $('#pagination_1').click();
    })

    $('.kt-pagination__link--last').on('click', 'a', function (e) {
        e.preventDefault();
        $('#adminDashboardVideos-pagination').children().last().click();
    })

    $('.kt-pagination__link--next').on('click', 'a', function (e) {
        e.preventDefault();
        $('#adminDashboardVideos-pagination .kt-pagination__link--active').prev().click();
    })

    $('.kt-pagination__link--prev').on('click', 'a', function (e) {
        e.preventDefault();
        console.log('kt-pagination__link--prev');
        $('#adminDashboardVideos-pagination .kt-pagination__link--active').next().click();
    })
}

function adminDashVideos_filter() {
    $('#adminDashboardVideos-search').val("")
    var filterItemsArray = $('#adminDashboardVideos-form').serializeArray();
    console.log('filterItemsArray');
    $('#adminDashboardVideos-filterTags').empty();
    filterItemsArray.forEach(function (filter) {
        if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit'
            && filter.name !== 'sort' && filter.name !== 'page') {
            filtername = filter.name.slice(0, (filter.name.indexOf('[')));
            $('#adminDashboardVideos-filterTags').append(`<span id="adminDashboardVideos-${filtername}" class="kt-badge kt-badge--inline kt-badge--bold kt-badge--unified-warning">${filter.value}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
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
    console.log(val);
    console.log(url);
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
            console.log(data);
        }
    });
    $(this).find("button").blur();
}

function documentBookmark(e, element) {
    e.preventDefault();
    var actionUrl = $(element).attr("action");
    console.log(actionUrl);
    var formid = $(element).attr("id").slice(9);
    console.log(formid);
    $.ajax({
        url: actionUrl,
        type: "PUT",
        success: function (data) {
            refreshVideoBank();
            console.log(data);
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
            console.log(data);
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
                console.log(data);
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
        let videoDatatableUrl = `/videoscopy?page=${pageNo}`;

        $.get(videoDatatableUrl, function (data) {
            $('#adminDashboardVideos-pagination').empty();
            for (let i = 1; i <= data.pages; i++) {
                $('#adminDashboardVideos-pagination').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`)
            }

            $('#adminDashboardVideos-pagination_bottom').empty();
            for (let i = 1; i <= data.pages; i++) {
                $('#adminDashboardVideos-pagination_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
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
                      class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.username.charAt(0).toUpperCase()}</span>
                    <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
                  </div>
                  <div class="kt-widget19__info">
                    <a href="/teachers/${video.author.id}" class="kt-widget19__username">
                      ${video.author.username}
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
                    class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.username.charAt(0).toUpperCase()}</span>
                  <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
                </div>
                <div class="kt-widget19__info">
                  <a href="/teachers/${video.author.id}" class="kt-widget19__username">
                    ${video.author.username}
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
            $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
        })
    })
}