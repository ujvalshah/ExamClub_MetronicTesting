// Page =  Downloads
function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td class="font-weight-bold">Description:</td>' +
        '<td><span class="dataTableText">' + d.description + '</span></td>' +
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

    // $('#example tfoot th').each(function () {
    //     var title = $(this).text();
    //     $(this).html('<input type="text" class="form-control form-control-sm search-table-download column_search" placeholder="Search ' + title + '" />');
    // });

    $('#example thead tr:eq(1) th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" class="form-control form-control-sm search-table-download column_search" id = "' + title + '_filter" placeholder="Search ' + title + '" />' );
    } );

    $.fn.dataTable.moment('LL', "en-gb");
    //Datatable
    
    var t = $('#example').DataTable(
        // {
            // "dom": 'itpfl'
        // } ,

        {
            "columnDefs": [
                {
                    targets: -1,
                    orderable: false,
                    "className": "align-middle text-center actionbuttons",
                    render: function (data, type, row, full, meta) {
                        return `
                        <span class="dropdown">
                        <a href="#" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown" aria-expanded="true"> <i class="fas fa-ellipsis-v"></i></a>
                        <div class="dropdown-menu dropdown-menu-right">
                        <div class="dropdown-item"> 
                            <form action="/downloads/`+ row._id + `/edit" method="GET">
                              <button class="btn btn-sm btn-label-success"><i class="far fa-edit"></i>Edit</button>
                            </form>
                        </div>
                           <div class="dropdown-item"> 
                            <form action="/downloads/`+ row._id + `?_method=DELETE" method="POST">
                              <button class="btn btn-sm btn-label-danger"><i class="far fa-trash-alt"></i> Delete</button>
                            </form>
                        </div>
                        </div>
                        </span>
                     <a href="/downloads/docs/`+ row._id + `" id="` + row._id + `" title="Download" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>
                     
                    <form id="bookmark_`+ row._id + `" class="d-inline-block m-0 p-0 bookmark-ajax-form" action="/user/downloads/` + row._id + `/bookmark" method="POST">
                              <button type="submit" title="Bookmark" class="btn btn-sm btn-clean btn-icon btn-icon-md`+ row._id + `"><i class="fas fa-bookmark"></i></button>
                    </form>
                    <a href="https://web.whatsapp.com/send?text=/downloads/`+row._id+`" title="Share" target="_blank"><span class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="fas fa-share-alt"></i></span></a>`
                },
                // Old Download Method
                //  <a href="`+ data + `" id="` + row._id + `" target="_blank" class="download_button btn btn-sm btn-clean btn-icon btn-icon-md"><span class="pr-2"><i class="fas fa-file-download"></i></span></a></a>

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
                        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        // let current_datetime = new Date(data);
                        // let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();
                        // let finalData = moment(formatted_date).format("DD-MMM-YYYY");
                        let testData = moment(data).format("DD-MMM-YYYY");
                        //let finalData = d.toDateString();
                        return '<span class="dataTableText">' + testData + '</span>';
                    },
                },
                {
                    targets: 3,
                    className: "align-middle text-center",
                    render: function (data, type, full, meta) {
                        return '<span class="text-capitalize dataTableText">' + data + '</span>';
                    },
                },
                {
                    targets: 4,
                    className: "align-middle text-center",
                    render: function (data, type, full, meta) {
                        return '<span class="dataTableText">' + data + '</span>';
                    },
                },
                {
                    targets: 5,
                    className: "align-middle text-center",
                    render: function (data, type, full, meta) {
                        var exams = {
                            "CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success' },
                            "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger' },
                            "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning' },
                            "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info' },
                            "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'btn-label-brand' },
                            "General": { 'title': "General", 'class': 'btn-label-dark' },
                        };
                        var dataExam = data.split(",");
                        var txtExam = '';
                        dataExam.forEach(function (item) {
                            if (txtExam.length > 0) {
                                txtExam += " "
                            }
                            txtExam += '<span class="btn btn-bold btn-sm btn-font-sm ' + exams[item].class + ' ">' + exams[item].title + '</span>';
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
                            "Nov 2019": { 'title': "Nov 2019", 'class': 'btn-label-primary' },
                            "May 2020": { 'title': "May 2020", 'class': 'btn-label-danger' },
                            "Nov 2020": { 'title': "Nov 2020", 'class': 'btn-label-warning' },
                            "May 2021": { 'title': "May 2021", 'class': 'btn-label-success' },
                            "Nov 2021": { 'title': "Nov 2021", 'class': 'btn-label-info' },
                        };
                        var datas = data.split(",");
                        var txt = '';
                        datas.forEach(function (item) {
                            if (txt.length > 0) {
                                txt += " "
                            }
                            txt += '<span class="btn btn-bold btn-sm btn-font-sm btn-pill ' + attempts[item].class + ' ">' + attempts[item].title + '</span>';
                        });
                        return txt;

                        if (typeof attempts[data] === 'undefined') {
                            return data;
                        }
                    },
                },
                {
                    targets: 7,
                    className: "align-middle text-center",
                    render: function (data, type, full, meta) {
                        return '<span class="dataTableText">' + data + '</span>';
                    },
                },
                { "visible": false, "targets": [8] },
                {
                    targets: 9,
                    className: "align-middle text-center",
                    render: function (data, type, full, meta) {
                        return '<span class="kt-badge kt-badge--success kt-badge--lg">' + data + '</span>';
                    },
                },
            ],
            "dom": `<'row'<'col-sm-12 col-md-5'li><'col-sm-12 col-md-7 dataTables_pager'p><'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'p>>`,
            "order": [[1, 'dsc']],
            "scrollX": true,
            "orderCellsTop": true,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "responsive": true,
            "ajax": {
                "url": "/api/downloads/",
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
            cell.innerHTML = '<span class="dataTableText">' + (i + 1) + '</span>';
        });
    }).draw();

    // Apply the search

    // $('#example thead').on('keyup change', ".column_search",function(){
    //     t.column($(this).index())
    //         .search(this.value)
    //         .draw();
    //     });

    $('#filter').on('keyup', ".column_search",function(){
        t.column($(this).parent().index())
        .search(this.value)
        .draw();
    });
    
    // t.columns().every(function () {
    //     var that = this;
    //     $('input', this.footer()).on('keyup change', function () {
    //         if (that.search() !== this.value) {
    //             that
    //                 .search(this.value)
    //                 .draw();
    //         }
    //     });
    // });



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
        // alert(`Button with ${buttonid} was clicked`);
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
        var actionUrl = 'http://localhost:3000' + $(this).attr('action');
        // alert(`Bookmark with ${formid} was clicked and with the following ${actionUrl}`); 
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