//PAGE = download_uploadform

    
// var downloadAlert = document.querySelector(".download_alert");
// downloadAlert.addEventListener("click",function(){
//     alert("Connected");    
//     // document.querySelector('.downloadSubjectsFormControlSelect1').removeAttribute("hidden");
// });

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