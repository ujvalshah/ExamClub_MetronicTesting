//PAGE = VIDEO UPLOAD FORM
$(document).ready(function () {
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
    } else if (optionVal_video == "CA Foundation"){
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

//PAGE = VIDEO_UPDATE FORM

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
    } else if (optionVal_edit == "CA Foundation"){
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

filterfilling();
});


function filterfilling() {

    $.get('/api/filterdata', function (filterlist) {
        console.log('filterlist');
        console.log(filterlist);

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