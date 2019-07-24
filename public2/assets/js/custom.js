<% if(page !== 'undefined' && page === 'downloads'){ %>
    <!--begin::Page Vendors Styles(used by this page) -->
    <link href="./assets/vendors/custom/datatables/datatables.bundle.css" rel="stylesheet" type="text/css" />
    <!-- <link href="../public2/assets/vendors/custom/fullcalendar/fullcalendar.bundle.css" rel="stylesheet" type="text/css" /> -->
    <!--end::Page Vendors Styles -->
    <script src="./assets/js/demo2/pages/dashboard.js" type="text/javascript"></script>
    <script src="./assets/vendors/custom/datatables/datatables.bundle.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js"></script>
    <script src="//cdn.datatables.net/plug-ins/1.10.19/sorting/datetime-moment.js"></script>
    <script>
        function format(d) {
            // `d` is the original data object for the row
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                '<tr>' +
                '<td class="font-weight-bold">Description:</td>' +
                '<td><small>' + d.description + '</small></td>' +
                '</tr>' +
                // '<tr>'+
                //     '<td class="font-weight-bold">Title:</td>'+
                //     '<td><small>'+d.title+'</small></td>'+
                // '</tr>'+
                // '<tr>'+
                //     '<td class="font-weight-bold">Extra info:</td>'+
                //     '<td><small>And any further details here (images etc)...</small></td>'+
                // '</tr>'+
                '</table>';
        }

        $(document).ready(function () {

            $('#example tfoot th').each(function () {
                var title = $(this).text();
                $(this).html('<input type="text" class="form-control form-control-sm search-table-download" placeholder="Search ' + title + '" />');
            });
            $.fn.dataTable.moment('LL', "en-gb");
            //Datatable
            var t = $('#example').DataTable(

                {
                    "columnDefs": [
                        {
                            targets: -1,
                            orderable: false,
                            "className": "align-middle text-center actionbuttons",
                            render: function (data, type, row, full, meta) {
                                return `
                          <span class="dropdown">
                            <a href="#" class="pr-2" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="dropdown-item" href="/downloads/`+ row._id + `/edit"><i class="far fa-edit fa-xs"></i> Edit Details</a>
                               <div class="dropdown-item"> 
                                <form action="/downloads/`+ row._id + `">
                                  <button class="btn btn-sm btn-danger"><i class="far fa-trash-alt"></i> Delete</button>
                                </form>
                            </div>
                            </div>
                            </span>
                         <a href="`+ data + `" id="` + row._id + `" target="_blank" class="download_button"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>
                         
                        <form id="bookmark_`+ row._id + `" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/` + row._id + `/bookmark" method="POST">
                                  <button type="submit" class="btn border-0 bg-transparent p-0 m-0 btn_`+ row._id + `"><i class="fas fa-bookmark"></i></button>
                        </form>
                         <a href="#" title="Share"><span class="pr-2"><i class="fas fa-share-alt"></i></span></a>`
                            },
                        },
                        {
                            "targets": 0,
                            "searchable": false,
                            "orderable": false,
                            "width": "3%",
                            "render": function (data, type, full, meta) {
                                return '<span class=""> <i class="fas fa-plus-circle"></i> </span>'
                            },
                        },
                        {
                            "targets": 1,
                            "searchable": false,
                            "orderable": false,
                            "width": "3%",
                            className: "align-middle text-center",
                            //  "render": function(data, type, full, meta){
                            //   return '<span class="text-center">' + data + '</span>'   
                            // },
                        },
                        {
                            targets: 2,
                            className: "align-middle text-center",
                            render: function (data, type, full, meta) {
                                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                let current_datetime = new Date(data);
                                let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();
                                let finalData = moment(formatted_date).format("DD-MMM-YYYY");
                                //let finalData = d.toDateString();
                                return '<small>' + finalData + '</small>';
                            },
                        },
                        {
                            targets: 3,
                            className: "align-middle text-center",
                            render: function (data, type, full, meta) {
                                return '<span class="text-capitalize"><small>' + data + '</small></span>';
                            },
                        },
                        {
                            targets: 4,
                            className: "align-middle text-center",
                            render: function (data, type, full, meta) {
                                return '<small>' + data + '</small>';
                            },
                        },
                        {
                            targets: 5,
                            className: "align-middle text-center",
                            render: function (data, type, full, meta) {
                                var exams = {
                                    "CA Final(New)": { 'title': "CA Final(New)", 'class': 'badge-success' },
                                    "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'badge-danger' },
                                    "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'badge-warning' },
                                    "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'badge-info' },
                                    "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'badge-secondary' },
                                };
                                var dataExam = data.split(",");
                                var txtExam = '';
                                dataExam.forEach(function (item) {
                                    if (txtExam.length > 0) {
                                        txtExam += " "
                                    }
                                    txtExam += '<span class="badge ' + exams[item].class + ' ">' + exams[item].title + '</span>';
                                });
                                return txtExam;

                                if (typeof exams[data] === 'undefined') {
                                    return data;
                                }
                            },
                        },
                        {
                            targets: 6,
                            className: "align-middle text-center",
                            render: function (data, type, full, meta) {
                                var attempts = {
                                    "Nov 2019": { 'title': "Nov 2019", 'class': 'badge-primary' },
                                    "May 2020": { 'title': "May 2020", 'class': 'badge-danger' },
                                    "Nov 2020": { 'title': "Nov 2020", 'class': 'badge-warning' },
                                    "May 2021": { 'title': "May 2021", 'class': 'badge-success' },
                                    "Nov 2021": { 'title': "Nov 2021", 'class': 'badge-info' },
                                };
                                var datas = data.split(",");
                                var txt = '';
                                datas.forEach(function (item) {
                                    if (txt.length > 0) {
                                        txt += " "
                                    }
                                    txt += '<span class="badge badge-pill ' + attempts[item].class + ' ">' + attempts[item].title + '</span>';
                                });
                                return txt;

                                if (typeof attempts[data] === 'undefined') {
                                    return data;
                                }
                            },
                        },
                        {
                            targets: 7,
                            className: "align-middle",
                            render: function (data, type, full, meta) {
                                return '<small>' + data + '</small>';
                            },
                        },
                        { "visible": false, "targets": [8] },
                        {
                            targets: 9,
                            className: "align-middle text-center",
                            render: function (data, type, full, meta) {
                                return '<small>' + data + '</small>';
                            },
                        },
                    ],
                    "order": [[1, 'dsc']],
                    "scrollY": 200,
                    "scrollX": true,
                    "ajax": {
                        "url": "http://localhost:3000/api/downloads/",
                        "dataSrc": ''
                    },

                    "columns": [
                        {
                            "className": 'details-control text-center align-middle',
                            "orderable": false,
                            "data": null,
                            "defaultContent": ''
                        },
                        { data: 'date' },
                        { data: 'date' },
                        { data: 'author.username' },
                        { data: 'title' },
                        { data: 'exam[,]' },
                        { data: 'attempt[,]' },
                        { data: 'subject[,]' },
                        { data: '_id' },
                        { data: 'downloadCounter' },
                        { data: 'file.0.url', responsivePriority: -1 },
                    ]
                });
            t.on('order.dt search.dt', function () {
                t.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = '<span><small>' + (i + 1) + '</small></span>';
                });
            }).draw();

            // Apply the search
            t.columns().every(function () {
                var that = this;
                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });

            //alert("connected");
            // Add event listener for opening and closing details
            $('#example tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = t.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                    $('td.details-control').html('<i class="fas fa-plus-circle"></i>');
                }
                else {
                    // Open this row
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                    $('tr.shown td.details-control').html('<i class="fas fa-minus-circle"></i>');
                }
            });


            $("td.details-control").on("click", function () {
                $(this).html('<i class="fas fa-minus-circle"></i>');
            });

            $("shown td.details-control").on("click", function () {
                $(this).html('<i class="fas fa-minus-circle"></i>');
            });






            // $('#example tbody').on( 'click', 'tr', function () {
            //     alert( 'Row index: '+t.row( this ).index() );
            // } );

            $("#example tbody").on("click", 'td.actionbuttons .download_button', function (e) {
                e.stopPropagation();
                var buttonid = $(this).attr("id");
                alert(`Button with ${buttonid} was clicked`);
                var actionUrl = `/download/${buttonid}/counter`;
                console.log(actionUrl);
                $.ajax({
                    url: actionUrl,
                    type: "PUT",
                    success: function (data) {
                        t.ajax.reload();
                        console.log(data);
                    }
                });
                $(this).find("button").blur();
            });

            $("#example tbody").on("click", 'td.actionbuttons .bookmark-ajax-form', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var formid = $(this).attr("id").slice(9);
                // var actionUrl = `/download/${formid}/counter`;
                var actionUrl = 'http://localhost:8081' + $(this).attr('action');
                // alert(`Bookmark with ${formid} was clicked and with the follwing ${actionUrl}`); 
                $.ajax({
                    url: actionUrl,
                    type: "PUT",
                    success: function (data) {
                        t.ajax.reload();
                        console.log(data);
                        alert(`${data[0].msg}`);
                    }
                });
                $(this).find("button").blur();
                // $(this).find("i.fas.fa-bookmark").toggleClass("red")
            });


        });
    </script>
    <%}%>

<% if(page !== 'undefined' && page === 'videos'){ %>
    <script type="text/javascript" src="scripts/main.js"></script>
    <!--end::Page Scripts -->
    <script>
        $(document).ready(function () {
                          <% if (!currentUser) {%>
                $(".student-alert").on("click", function (e) {
                    e.preventDefault();
                    alert("You need to sign up as a student to bookmark these videos!");
                    $(this).blur();
                });
                          <%}%>
                          
                          <%if (currentUser && currentUser.isStudent) {%>
                function () {
                    $("#save-video-form").on("submit", function (e) {
                        $("#video-bookmark-button").toggleClass(function (i, class){
                            return class === "btn-warning" ? "btn-info" : "btn:info";
                        }).text(function (i, text) {
                            return text === "Bookmarked" ? "Bookmark" : "Bookmarked";
                        }).blur();
                });
            }
            <%}%>
            
            $('[data-toggle="tooltip"]').tooltip();

        });


    </script>
    <%}%>



    
    <!--start::Page Scripts -->
    <% if(page !== 'undefined' && page === 'dashboard_student'){ %>
    <script>
        $(".stdDash-bookmark-form").on("submit", function (e) {
            var title = $(this).closest("tr").children("td.title").text()
            var answer = confirm(`Do you really want to remove ${title} from your bookmarks?`)
            if (!answer) { e.preventDefault() };
            $(this).find("button").blur();
        })

        $(".rmBookmark-video-form").on("click", function (e) {
            $(this).find("button").blur();
        })
        
    </script>
    <script src="./assets/vendors/custom/datatables/datatables.bundle.js" type="text/javascript"></script>
    <%}%>
    <!--end::Page Scripts -->
    <!--start::Page Scripts -->
    <% if(page !== 'undefined' && page === 'download_uploadform'){ %>
                            <script>
      var downloadAlert = document.querySelector(".download_alert");
        downloadAlert.addEventListener("click",function(){
        document.querySelector('.downloadSubjectsFormControlSelect1').removeAttribute("hidden");
        alert("Connected");    
    });
    
    $("#downloadExamFormControlSelect").on("change", function(){
            var optionVal = $("#downloadExamFormControlSelect option:selected").val();
            
            if(optionVal == "CA Final(New)"){
            $('#downloadSubjectsFormControlSelect1').removeAttr("disabled");
            $('#downloadSubjectsFormControlSelect2').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect3').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect4').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect5').attr("disabled", "true");
            } else if (optionVal == "CA Intermediate(New)"){
            $('#downloadSubjectsFormControlSelect1').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect2').removeAttr("disabled");
            $('#downloadSubjectsFormControlSelect3').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect4').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect5').attr("disabled", "true");
            } else if (optionVal == "CA Foundation(New)"){
            $('#downloadSubjectsFormControlSelect1').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect2').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect3').removeAttr("disabled");
            $('#downloadSubjectsFormControlSelect4').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect5').attr("disabled", "true");
            }  else if (optionVal == "CA Final(Old)"){
            $('#downloadSubjectsFormControlSelect1').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect2').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect3').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect4').removeAttr("disabled");
            $('#downloadSubjectsFormControlSelect5').attr("disabled", "true");
            }  else if (optionVal == "CA IPCC(Old)"){
            $('#downloadSubjectsFormControlSelect1').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect2').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect3').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect4').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect5').removeAttr("disabled");
            } else if (optionVal == "General"){
            $('#downloadSubjectsFormControlSelect1').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect2').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect3').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect4').attr("disabled", "true");
            $('#downloadSubjectsFormControlSelect5').attr("disabled", "true");
            } 
    });
    </script>
    <%}%>
        <!--end::Page Scripts -->
    <!--start::Page Scripts -->
    <% if(page !== 'undefined' && page === 'download_updateform'){ %>
    <script>
    $("#downloadExamFormControlSelect_update").on("change", function(){
       var optionVal_edit = $("#downloadExamFormControlSelect_update option:selected").val();
        if(optionVal_edit == "CA Final(New)"){
                $('#downloadSubjectsFormControlSelect1_update').removeAttr("disabled");
                $('#downloadSubjectsFormControlSelect2_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect3_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect4_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect5_update').attr("disabled", "true");
                } else if (optionVal_edit == "CA Intermediate(New)"){
                $('#downloadSubjectsFormControlSelect1_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect2_update').removeAttr("disabled");
                $('#downloadSubjectsFormControlSelect3_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect4_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect5_update').attr("disabled", "true");
                } else if (optionVal_edit == "CA Foundation(New)"){
                $('#downloadSubjectsFormControlSelect1_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect2_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect3_update').removeAttr("disabled");
                $('#downloadSubjectsFormControlSelect4_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect5_update').attr("disabled", "true");
                }  else if (optionVal_edit == "CA Final(Old)"){
                $('#downloadSubjectsFormControlSelect1_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect2_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect3_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect4_update').removeAttr("disabled");
                $('#downloadSubjectsFormControlSelect5_update').attr("disabled", "true");
                }  else if (optionVal_edit == "CA IPCC(Old)"){
                $('#downloadSubjectsFormControlSelect1_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect2_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect3_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect4_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect5_update').removeAttr("disabled");
                } else if (optionVal_edit == "General"){
                $('#downloadSubjectsFormControlSelect1_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect2_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect3_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect4_update').attr("disabled", "true");
                $('#downloadSubjectsFormControlSelect5_update').attr("disabled", "true");
                } ;
    })
    </script>
    <%}%>
        <!--end::Page Scripts -->
        <!--start::Page Scripts -->
    <% if(page !== 'undefined' && page === 'videos_uploadform'){ %>
    <script>
        $("#videoExamFormControlSelect").on("change", function(){
            var optionVal_video = $("#videoExamFormControlSelect option:selected").val();
            
            if(optionVal_video == "CA Final(New)"){
            $('#videoSubjectsFormControlSelect1').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect2').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5').attr("disabled", "true");
            } else if (optionVal_video == "CA Intermediate(New)"){
            $('#videoSubjectsFormControlSelect1').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect3').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5').attr("disabled", "true");
            } else if (optionVal_video == "CA Foundation(New)"){
            $('#videoSubjectsFormControlSelect1').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect4').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5').attr("disabled", "true");
            }  else if (optionVal_video == "CA Final(Old)"){
            $('#videoSubjectsFormControlSelect1').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect5').attr("disabled", "true");
            }  else if (optionVal_video == "CA IPCC(Old)"){
            $('#videoSubjectsFormControlSelect1').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5').removeAttr("disabled");
            } else if (optionVal_video == "General"){
            $('#videoSubjectsFormControlSelect1').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5').attr("disabled", "true");
            } 
    });
    </script>
    <%}%>
    <!--end::Page Scripts -->
    <!--start::Page Scripts -->
    <% if(page !== 'undefined' && page === 'videos_updateform'){ %>
    <script>
        $("#videoExamFormControlSelect_update").on("change", function(){
   var optionVal_edit = $("#videoExamFormControlSelect_update option:selected").val();
    if(optionVal_edit == "CA Final(New)"){
            $('#videoSubjectsFormControlSelect1_update').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect2_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5_update').attr("disabled", "true");
            } else if (optionVal_edit == "CA Intermediate(New)"){
            $('#videoSubjectsFormControlSelect1_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2_update').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect3_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5_update').attr("disabled", "true");
            } else if (optionVal_edit == "CA Foundation(New)"){
            $('#videoSubjectsFormControlSelect1_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3_update').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect4_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5_update').attr("disabled", "true");
            }  else if (optionVal_edit == "CA Final(Old)"){
            $('#videoSubjectsFormControlSelect1_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4_update').removeAttr("disabled");
            $('#videoSubjectsFormControlSelect5_update').attr("disabled", "true");
            }  else if (optionVal_edit == "CA IPCC(Old)"){
            $('#videoSubjectsFormControlSelect1_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5_update').removeAttr("disabled");
            } else if (optionVal_edit == "General"){
            $('#videoSubjectsFormControlSelect1_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect2_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect3_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect4_update').attr("disabled", "true");
            $('#videoSubjectsFormControlSelect5_update').attr("disabled", "true");
            } ;
    })
    </script>
    <%}%>
    <!--end::Page Scripts -->