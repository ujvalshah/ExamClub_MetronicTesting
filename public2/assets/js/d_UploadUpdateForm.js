//PAGE = download_uploadform


// var downloadAlert = document.querySelector(".download_alert");
// downloadAlert.addEventListener("click",function(){
//     alert("Connected");    
//     // document.querySelector('.downloadSubjectsFormControlSelect1').removeAttribute("hidden");
// });

// BEGIN
$(document).ready(function () {

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

//Page = Download Update Form
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

    filterfilling();
    // filterfillingupdate();
});

function filterfilling() {

    $.get('/api/filterdata', function (filterlist) {
        // console.log('filterlist filterform');
        // console.log(filterlist);
        console.log('filterlist');
        console.log(filterlist);
        // $('.exam').empty();
        // $('.exam').append("<option disabled selected>Exam</option>");
        // filterlist.exams.forEach(value => {
        //     $('.exam').append($("<option></option>")
        //         .attr("value", value.exam)
        //         .text(value.exam))
        // })

        $(".author").empty();
        $(".author").append(`<option disabled selected>Faculty</option>`);
        filterlist.teachers.forEach(faculty => {
            if (!faculty.byAdmin) {
                $(".author").append($("<option></option>")
                    .attr("value", faculty.username)
                    .text(faculty.registeredUser.displayName))
            }
            if (faculty.byAdmin) {
                $(".author").append($("<option></option>")
                    .attr("value", faculty.username)
                    .text(faculty.displayName))
            }
        });
    })
};

// async function filterUpdateDocSubjectFilling(elem) {
//     let currentExam = await $(elem).val();
//     let sectionId = await $(elem).attr("data-ref");
//     if (currentExam !== 'All' && currentExam !== 'rf') {
//         $.get(`/api/filterform/${currentExam}/subjects`, function (info) {
//             // console.log('subjects');
//             // console.log(info);
//             $(`#${sectionId}`).empty();
//             info[0].subjects.forEach(subject => {
//                 $(`#${sectionId}`).append($("<option></option>")
//                     .attr("value", subject)
//                     .text(subject))
//             });
//         });
//     }
// };


// // Update

// function filterfillingupdate() {

//     $.get('/api/filterdata', function (filterlist) {
//         // console.log('filterlist filterform');
//         // console.log(filterlist);
//         console.log('filterlist');
//         console.log(filterlist);
//         $('.examUpdate').empty();
//         filterlist.exams.forEach(value => {
//             $('.examUpdate').append($(`<option></option>`).attr("value", value.exam).attr('selected', `<option <%=download.exam.includes${value.exam} ? "true" : "" %>></option>`).text(value.exam))
//         })

//         $(".authorUpdate").empty();
//         $(".authorUpdate").append(`<option disabled selected>Faculty</option>`);
//         filterlist.teachers.forEach(faculty => {
//             if (!faculty.byAdmin) {
//                 $(".authorUpdate").append($(`<option></option>`)
//                     .attr("value", faculty.username)
//                     .attr("selected",`<option <%=download.author===${faculty.username} ? "true" : "" %>></option>`)
//                     .text(faculty.registeredUser.displayName))
//             }
//             if (faculty.byAdmin) {
//                 $(".authorUpdate").append($(`<option></option>`)
//                     .attr("value", faculty.username)
//                     .attr("selected", `<option <%=download.author===${faculty.username} ? "true" : "" %>></option>`)
//                     .text(faculty.displayName))
//             }
//         });

//         let currentExam = "CA Final(New)";
//         console.log('currentExam')
//         console.log(currentExam)
//         let sectionId = 'subjectUpdate';
//         $.get(`/api/filterform/${currentExam}/subjects`, function (info) {
//             console.log('subjects-info');
//             console.log(info);
//             $(`.${sectionId}`).empty();
//             info[0].subjects.forEach(subject => {
//                 $(`.${sectionId}`).append($(`<option></option>`)
//                     .attr("value", subject)
//                     .attr("selected",`<%= download.subject.includes("${subject}") ? "true" : "" %>`)
//                     .text(subject))
//             });
//         });
//     })
// };

// async function filterUpdateDocSubjectFillingUpdate(elem) {
//     let currentExam = await $(elem).val();
//     let sectionId = 'subjectUpdate'
//     if (currentExam !== 'All' && currentExam !== 'rf') {
//         $.get(`/api/filterform/${currentExam}/subjects`, function (info) {
//             // console.log('subjects');
//             // console.log(info);
//             $(`.${sectionId}`).empty();
//             info[0].subjects.forEach(subject => {
//                 $(`.${sectionId}`).append($("<option></option>")
//                     .attr("value", subject)
//                     .text(subject))
//             });
//         });
//     }
// }
