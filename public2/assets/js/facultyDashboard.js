
$(document).ready(function () {

  datatableinit();
  videoBankinit();
  facultyDashDocs_sorting();

  downloadBtn();

});

// ----------------------------------------------------------------------------------------------------//
// -------------------------------------------------Documents------------------------------------------//
// ----------------------------------------------------------------------------------------------------//
function refreshDataTable() {
  var filterItems = $('#facultyDashboardDocs-form').serialize();
  var filterItemsArray = $('#facultyDashboardDocs-form').serializeArray();
  // console.log(filterItemsArray);
  if ($("#largeScreen-facultyDashboardDocs").is(":hidden")) {
    var sort = $("select#facultyDashboardDocs-sorting-mobile option:checked").val() || '-createdAt';
  }
  if ($("#largeScreen-facultyDashboardDocs").is(":visible")) {
    var sort = $(".faculty-sort-active").closest('span').attr('class');
  }
  // console.log('sort');
  // console.log(sort);
  let userURL = $('#menu_dashboard_userURL').attr('href');
  let adminDashboardDownloadTableURL = `${userURL}?sort=${sort}`;
  // console.log(adminDashboardDownloadTableURL);
  $.get(adminDashboardDownloadTableURL, filterItems, function (data) {
    $("#facultyDashboardDocs-tableBody").empty();
    $('#smallScreen-facultyDashboardDocs-content').empty();
    data.faculty.docs[0].downloads.forEach(function (document, index) {
      $("#facultyDashboardDocs-tableBody").append(`
         <tr>
           <td class="align-middle text-center">${index + 1}</td>
           <td class="align-middle text-center">${moment(document.createdAt).format("DD-MMM-YYYY")}</td>
           <td class="align-middle text-center text-capitalize">${document.author.displayName}</td>
           <td class="align-middle text-center text-break dataTableText">${document.title}</td>
           <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm ${data.faculty.examsButtons[document.exam].class}">${document.exam}</span></td>
           <td class="align-middle text-center"><span class="btn btn-bold btn-sm btn-font-sm btn-pill 
              ${data.faculty.attemptsButtons[document.attempt[0]].class} text-nowrap">${document.attempt}</span></td>
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
             <a href="/downloads/docs/${document._id}" id="${document._id}" onclick="return downloadBtn(this)" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a>
             
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


    data.faculty.docs[0].downloads.forEach(function (document, index) {
      $("#smallScreen-facultyDashboardDocs-content").append(`
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
                        class="kt-badge kt-badge--inline kt-badge--bold ${data.faculty.attemptsButtons[document.attempt[0]].mobile} text-nowrap">${document.attempt}</span>
                      <span
                        class="kt-badge kt-badge--inline kt-badge--bold ${data.faculty.examsButtons[document.exam].mobile}">${document.exam}</span>
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

    if (data.faculty.docs[0].downloads.length == 0) {
      $("#noOfDocUploads").text(`You have not uploaded any documents yet!`)
    } else {
      $("#noOfDocUploads").text(`You have uploaded ${data.faculty.docs[0].downloads.length} documents`)
    }
  })
};

function datatableinit() {
  refreshDataTable();
  // $('#facultyDashboardDocsPagination li').first().addClass('kt-pagination__link--active')
};

function facultyDashDocs_filter() {
  refreshDataTable();
}

function facultyDashDocs_sorting() {
  $('#facultyDashboardDocs-tableHeader i').on("click", function () {
    $('.faculty-sort-active').addClass('arrow-inactive');
    $('.faculty-sort-active').removeClass('faculty-sort-active');
    $(this).removeClass('arrow-inactive');
    $(this).addClass('faculty-sort-active');
    let para = $(this).closest('span').attr('class');
    // console.log(para);
    refreshDataTable();
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

// function documentBookmark(e, element) {
// 	let title = $(element).attr('data-info');
// 	let answer = confirm(`Do you really want to remove ${title} from your bookmarks?`)
// 	if (!answer) { return e.preventDefault() }
// 	else {
// 		e.preventDefault()
// 		var actionUrl = $(element).attr("action");
// 		var formid = $(element).attr("id").slice(9);
// 		// console.log(formid);
// 		$.ajax({
// 			url: actionUrl,
// 			type: "PUT",
// 			success: function (data) {
// 				refreshDataTable();
// 				console.log(data);
// 				alert(`${data[0].msg}`);
// 			}
// 		})
// 		$(element).blur();
// 	}
// };

// $(".stdDash-bookmark-form").on("submit", function (e) {
//     var title = $(this).closest("tr").children("td.title").text()
//     var answer = confirm(`Do you really want to remove ${title} from your bookmarks?`)
//     if (!answer) { e.preventDefault() };
//     $(this).find("button").blur();
// })

// $(".rmBookmark-video-form").on("click", function (e) {
//     $(this).find("button").blur();
// })

// ----------------------------------------------------------------------------------------------------//
// -------------------------------------------------Videos---------------------------------------------//
// ----------------------------------------------------------------------------------------------------//

function refreshVideoBank() {
  var filterItems = $('#facultyDashboardVideos-form').serialize();
  var filterItemsArray = $('#facultyDashboardVideos-form').serializeArray();
  // console.log(filterItemsArray);
  let sort = $("#facultyDashboardVideos-sort").val() || "-createdAt";
  // console.log('sortssssss');
  // console.log(sort);
  // let videoDatatableUrl = `/videoscopy?page=${pageNo}&limit=${limitNo}&sort=${sort}`; because it goes as part of the filter items...
  let userURL = $('#menu_dashboard_userURL').attr('href');
  let videoDatatableUrl = `${userURL}?sort=${sort}`;
  // console.log('videoDatatableUrl');
  // console.log(videoDatatableUrl);
  $.get(videoDatatableUrl, filterItems, function (data) {

    $("#facultyDashboardVideos-body").empty();

    data.faculty.docs[0].videos.forEach(function (video) {
      $("#facultyDashboardVideos-body").append(`
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
          <div class="kt-portlet__body"  ${video.type && video.type === 'playlist' ? 'title="This is a playlist"' : ""}>
            <div class="kt-widget19__wrapper mb-0">
              <h5 class="kt-widget19__title kt-font-dark kt-label-font-color-3 pb-2 mb-0">
              ${video.type && video.type === 'playlist' ? '<span title="This is a playlist" class="kt-badge kt-badge--danger kt-badge--md kt-badge--rounded mr-2">P</span>' : ""}${video.title}
              </h5>
              <div class="kt-divider"><span></span></div>
              <div class="kt-widget19__content mt-2">
                <div class="kt-widget19__userpic">
                  <span
                    class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-">${video.author.displayName.charAt(0).toUpperCase()}</span>
                  <!-- <img src="./assets/media//users/user1.jpg" alt=""> -->
                </div>
                <div class="kt-widget19__info">
                  <a href="/teachers/${video.author.id}" class="kt-widget19__username">
                    ${video.author.displayName}
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
              <div class="mb-3 small font-weight-bold"> Applicable:${video.exam.reduce((acc, exam) => acc + `<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--bold" data-toggle="tooltip" data-placement="bottom" title="Applicable Exam">${exam}</span>`,"")}
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

    if(data.faculty.docs[0].videos.length == 0){
      $("#noOfVideoUploads").text(`You haven'd added any Videos yet!`)
    } else {
    $("#noOfVideoUploads").text(`Showing ${data.faculty.docs[0].videos.length} video uploads`)
    }
  })
};

function videoBankinit() {
  refreshVideoBank();
};

function facultyDashVideos_filter() {
  refreshVideoBank();
};

// function bookmarkVideo(e, elem) {
// 	let stdvideoTitle = $(elem).attr('data-info');
// 	let answer = confirm(`Do you really want to remove ${stdvideoTitle} from your bookmarks?`);
// 	if (!answer) {
// 		return e.preventDefault()
// 	} else {
// 		e.preventDefault();
// 		let videoBookmarkActionURL = $(elem).attr('action');
// 		console.log(videoBookmarkActionURL);
// 		$.ajax({
// 			url: videoBookmarkActionURL,
// 			type: "PUT",
// 			success: function (data) {
// 				console.log(data);
// 				alert(`${data}`);
// 			}
// 		});
// 		refreshVideoBank();
// 	}
// 	$(elem).find('button').blur();
// };

