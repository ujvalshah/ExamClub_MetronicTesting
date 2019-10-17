
$(document).ready(function () {
  videoBankinit();
  changePaginationActiveTab()
  changePaginationTabto1()
  removeFilterTags();
  searchOnKeyUp()
  clickOnSubmitBtn()
  paginationButtons();
  // sorting();
  filter();
  searchEnterKey();
  filterfilling();

  // downloadBtn();
  // bookmarkVideo(e);
  // bookmarkVideosignup(e);
});


function refreshVideoBank() {
  var filterItems = $('#videoTable_filter_ajax').serialize();
  var filterItemsArray = $('#videoTable_filter_ajax').serializeArray();
  // console.log(filterItems);
  console.log(filterItemsArray);
  // console.log(decodeURI(filterItems));
  let limitNo = $('#limit-videoTable').val() || "10"
  let pageNo = $('#pagination-videos .kt-pagination__link--active').text().trim() || 1;
  let sort = $("#sorting-videoTable").val() || "-createdAt";
  // let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`; because it goes as part of the filter items...
  let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
  $.get(videoDatatableUrl, filterItems, function (data) {
    $('#pagination-videos').empty();
    for (let i = 1; i <= data.pages; i++) {
      $('#pagination-videos').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`)
    }

    $('#pagination-videos_bottom').empty();
    for (let i = 1; i <= data.pages; i++) {
    $('#pagination-videos_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
    }

    $(`#pagination-videos li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')

    $(`#pagination-videos_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')

    $("#videoLoop").empty();

    if (!data.currentUser || data.currentUser === undefined) {
      data.docs.forEach(function (video) {
        $("#videoLoop").append(`
        <div class="col-md-4 mb-3">
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
                ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded">P</span>' : ""} ${video.title}
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
                   <button type="submit" class="btn btn-sm btn-label-warning btn-bold student-alert">Bookmark</button>
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
        $("#videoLoop").append(`
      <div class="col-md-4 mb-3">
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
            ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded">P</span>' : ""}${video.title}
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
                action="/user/${data.currentUser._id}/videos/${video._id}" method="POST" data-title="${video.title}"onsubmit='return bookmarkVideo(event,this)'>
                <button type="submit" id="video-bookmark-button"
                  class="btn btn-sm ml-1 ${data.currentUser.videoBookmarks.includes(video._id) ? "btn-label-danger" : "btn-label-warning"}">
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
    // $('#pagination-videos li').first().addClass('kt-pagination__link--active')
    let curPage = $('#pagination-videos .kt-pagination__link--active').text().trim();
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
  $('#pagination-videos li').first().addClass('kt-pagination__link--active')
};

function paginationButtons() {
  $('.kt-pagination__link--first').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination_1').click();
  })

/*   $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination-videos :last-child').click();
  }) */

  $('.kt-pagination__link--last').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination-videos').children().last().click();
  })

  $('.kt-pagination__link--next').on('click', 'a', function (e) {
    e.preventDefault();
    $('#pagination-videos .kt-pagination__link--active').prev().click();
  })

  $('.kt-pagination__link--prev').on('click', 'a', function (e) {
    e.preventDefault();
    console.log('kt-pagination__link--prev');
    $('#pagination-videos .kt-pagination__link--active').next().click();
  })
}

// function sorting() {
//   $('#sorting-videoTable').on("change", function () {
//     refreshVideoBank();
//   })
// }

function filter() {
  $('#search-video').val("")
  var filterItemsArray = $('#videoTable_filter_ajax').serializeArray();
  console.log('filterItemsArray');
  // console.log(filterItemsArray);
  $('#videos-filter-tags').empty();
  filterItemsArray.forEach(function (filter) {
    if (filter.name.indexOf('[') === -1) {
      if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit'
      && filter.name !== 'sort' && filter.name !== 'page') {
      filtername = filter.name;
      $('#videos-filter-tags').append(`<span id="${filtername}" class="btn btn-label-warning btn-sm">${filter.value}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
    }
  }
  if (filter.name.indexOf('[') !== -1) {
    if (filter.value && filter.value !== "" && filter.value !== 'rf' && filter.name !== 'limit'
      && filter.name !== 'sort' && filter.name !== 'page') {
      filtername = filter.name.slice(0, (filter.name.indexOf('[')));
      $('#videos-filter-tags').append(`<span id="${filtername}" class="btn btn-label-warning btn-sm">${filter.value}<span class='ml-2'><i class="fas fa-times fa-sm"></i></span></span>&nbsp;`);
    }
  }
  })
  refreshVideoBank();
}

function removeFilterTags() {
  $('#videos-filter-tags').on('click', 'span', function () {
    let filterKey = $(this).attr('id');
    console.log(filterKey);
    let filterText = $(this).text();
    console.log(filterText);
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

function changePaginationActiveTab() {
  $('#pagination-videos').on('click', "li", function (e) {
    e.preventDefault();
    $('#pagination-videos .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#pagination-videos_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $(this).addClass('kt-pagination__link--active');
    // console.log(this);
    // let clickedPage = $(this).attr('id');
    // let bottomEquivalent = `${clickedPage}_bottom`
    // $(`#${bottomEquivalent}`).addClass('kt-pagination__link--active');
    refreshVideoBank();
  });

  $('#pagination-videos_bottom').on('click', "li", function(e){
    e.preventDefault();
    $('#pagination-videos .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    $('#pagination-videos_bottom .kt-pagination__link--active').removeClass('kt-pagination__link--active');
    let pageNoBottomVideoClicked = $(this).attr('id');
    let pageTopId = pageNoBottomVideoClicked.replace('_bottom','');
    $('#'+pageTopId).click();
  })
}

function changePaginationTabto1() {
  $('#limit-downloadTable').on('keyup change', function () {
    refreshVideoBank()
    $("#pagination-videos li:first-child").click();
  })

  $("#limit-downloadTable i").on('click', function () {
    refreshVideoBank()
    $("#pagination-videos li:first-child").click();
  })
}

function searchOnKeyUp() {
  $('#search-video').on('keyup change', function () {
    refreshVideoBank();
  });
}

function searchEnterKey(){
  $('#search-video').keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
      }
    });
}


function clickOnSubmitBtn() {
  $('#submit-video-form').on('click', function (e) {
    e.preventDefault();
    $('#search-document').val("")
    filter();
  })
}
function clickOnClearAllFiltersBtn(e) {
    e.preventDefault();
    $('#search-document').val("");
    $('#exam').val("rf");
    $('#attempt').val("rf");
    $('#author').val("rf");
    $("#subject")[0].selectedIndex = 0

    {
      let limitNo = $('#limit-videoTable').val() || "10"
      let pageNo = $('#pagination-videos .kt-pagination__link--active').text().trim() || 1;
      let sort = $("#sorting-videoTable").val() || "-createdAt"
      // let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`; because it goes as part of the filter items...
      let videoDatatableUrl = `/videos?page=${pageNo}&limit=${limitNo}&sort=${sort}`;
    
      $.get(videoDatatableUrl, function (data) {
        $('#pagination-videos').empty();
        for (let i = 1; i <= data.pages; i++) {
          $('#pagination-videos').append(`<li id="pagination_${i}"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}">${i}</a></li>`)
        }
    
        $('#pagination-videos_bottom').empty();
        for (let i = 1; i <= data.pages; i++) {
        $('#pagination-videos_bottom').append(`<li id="pagination_${i}_bottom"> <a href="${data.pageUrl}page=${i}" id="pagination-url_${i}_bottom">${i}</a></li>`)
        }
    
        $(`#pagination-videos li #pagination-url_${pageNo}`).parent("li").addClass('kt-pagination__link--active')
    
        $(`#pagination-videos_bottom li #pagination-url_${pageNo}_bottom`).parent("li").addClass('kt-pagination__link--active')
    
        $("#videoLoop").empty();
    
        if (!data.currentUser || data.currentUser === undefined) {
          data.docs.forEach(function (video) {
            $("#videoLoop").append(`
            <div class="col-md-4 mb-3">
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
                    ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded">P</span>' : ""} ${video.title}
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
                       <button type="submit" class="btn btn-sm btn-label-warning btn-bold student-alert">Bookmark</button>
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
            $("#videoLoop").append(`
          <div class="col-md-4 mb-3">
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
                ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded">P</span>' : ""}${video.title}
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
                    action="/user/${data.currentUser._id}/videos/${video._id}" method="POST" data-title="${video.title}" onsubmit='return bookmarkVideo(event,this)'>
                    <button type="submit" id="video-bookmark-button"
                      class="btn btn-sm ml-1 ${data.currentUser.videoBookmarks.includes(video._id) ? "btn-label-danger" : "btn-label-warning"}">
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
        // $('#pagination-videos li').first().addClass('kt-pagination__link--active')
        let curPage = $('#pagination-videos .kt-pagination__link--active').text().trim();
        let currentPage = parseInt(curPage);
        let limit = data.limit;
        let totalEntries = data.total;
        let probsecondNumber = limit * currentPage;
        let secondNumber = Math.min(probsecondNumber, totalEntries);
        let firstNumber = probsecondNumber - (limit - 1);
        $(".pagination__desc").text(`Showing ${firstNumber} to ${secondNumber} of ${totalEntries}`)
      })
    };
    filter();
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

function bookmarkVideo(e, elem){
      e.preventDefault();
      let videoBookmarkActionURL = $(elem).attr('action');
      $.ajax({
        url: videoBookmarkActionURL,
        type: "PUT",
        success: function (data) {
          console.log(data);
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

function deleteFacultyVideo(e,elem){
  e.preventDefault();
 let confirmDelete = confirm("Are You sure you want to delete?");
  // console.log(elem);
  let acurl = $(elem).attr('action');
  // console.log(acurl);
  if(confirmDelete){
    $.ajax({
      url: acurl,
      type: 'DELETE',
      success: function(data){
        console.log(data);
        alert(data);
        refreshVideoBank();
      }  
    })
  };
  
 let button = $(elem).find('button');
 $(button).blur();
}

function filterfilling() {

  $.get('/api/filterdata', function (filterlist) {
    console.log('filterlist filterform');
    console.log(filterlist);

    $('#exam').empty();
    $('#exam').append(`<option value='rf'>Exam</option>`);
    filterlist.exams.forEach(value => {
      $('#exam').append($("<option></option>")
        .attr("value", value.exam)
        .text(value.exam))
    })

    $('#author').empty();
    $('#author').append(`<option value='rf'>Faculty</option>`);
    filterlist.teachers.forEach(faculty => {
      $('#author').append($("<option></option>")
        .attr("value", faculty.username)
        .text(faculty.username))
    });
  })
};

async function filterVideosSubjectFilling(elem) {
  let currentExam = await $(elem).val();
  // let sectionId = await $(elem).attr("data-ref"); 
  if (currentExam !== 'All' && currentExam !== 'rf') {
    $.get(`/api/filterform/${currentExam}/subjects`, function (info) {
      console.log('subjectsssssssssssssssssssssssssss');
      console.log(info);
      $(`#subject`).empty();
      $(`#subject`).append(`<option value='rf'>Subject</option>`);
      info[0].subjects.forEach(subject => {
        $(`#subject`).append($("<option></option>")
          .attr("value", subject)
          .text(subject))
      });
    });
  }
  filter()
}