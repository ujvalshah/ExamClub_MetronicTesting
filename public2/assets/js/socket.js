const socket = io();

// notificationFeed = []

// socket.on('notification', (data) => {
//     console.log(data);
//     notification(data);
//     updateNewNotificationNoBtn();
// })

// socket.on("message", addMessages)

// notification = (data) => {
//     var parent = document.querySelector('#notification_sockets');
//     const html = `<a href="#" class="kt-notification__item">
//     <div class="kt-notification__item-icon"> <i class="flaticon2-line-chart kt-font-success"></i> </div>
//     <div class="kt-notification__item-details">
//         <div class="kt-notification__item-title"> ${data.message} </div>
//         <div class="kt-notification__item-time"> ${data.author.username} <span class="float-right">${moment(data.createdAt).fromNow()}</span> </div>
//     </div>
//     </a>`
//     parent.insertAdjacentHTML('afterbegin', html);
// }


$(document).ready(function () {

    $(() => {
        $("#notificationBtn").click((e) => {
            e.preventDefault();
            let message = $("#notificationMessage").val();
            let exam = $("#notificationExamData option:selected").val();
            $.post('/notification', { message, exam })
            $('#kt_modal_4').modal('hide');
        })

        // updateNewNotificationNo();

    });

    $(() => {
        getMessages();
        getMessagesAll();
        updateNewNotificationNoBtn();
        updateNewNotificationNo();
        followFaculty();
    })
    
})

function addMessages(notification){
    var parent = document.querySelector('#notification_sockets');
    
    const html = `<a href="#" class="kt-notification__item">
        <div class="kt-notification__item-icon"> <i class="flaticon2-line-chart kt-font-success"></i> </div>
        <div class="kt-notification__item-details">
            <div class="kt-notification__item-title"> ${notification.message} </div>
            <div class="kt-notification__item-time"> ${notification.author.username} - <span class="small">${notification.exam}</span> <span class="float-right">${moment(notification.createdAt).fromNow()}</span></div>
        </div>
        </a>`
    parent.insertAdjacentHTML('afterbegin', html);
};


function addAllMessages(notification){
var parent2 = document.querySelector('#notification_all');
    const html = `<a href="#" class="kt-notification__item">
        <div class="kt-notification__item-icon"> <i class="flaticon2-line-chart kt-font-success"></i> </div>
        <div class="kt-notification__item-details">
            <div class="kt-notification__item-title"> ${notification.message} </div>
            <div class="kt-notification__item-time"> ${notification.author.username}  - <span class="small">${notification.exam}</span> <span class="float-right">${moment(notification.createdAt).fromNow()}</span></div>
        </div>
        </a>`
    parent2.insertAdjacentHTML('afterbegin', html);
}



function addnonDropdownNotification(notification) {
    var exam = `${notification.exam}`;
    var substring = exam.toString();
    if(substring === 'CA Final(New)'){
        var sub = '#homepage_ca_final_new_notification_add';
        var notificationTab = '#ca-final-new-tab';
    } else if(substring === 'CA Final(Old)'){
        var sub = '#homepage_ca_final_old_notification_add';
        var notificationTab = '#ca-final-old-tab';
    } else if(substring === 'CA Intermediate(New)'){
        var sub = '#homepage_ca_intermediate_notification_add';
        var notificationTab = '#ca-intermediate-tab';
    } else if(substring === 'CA IPCC(Old)'){
        var sub = '#homepage_ca_ipcc_notification_add';
        var notificationTab = '#ca-ipcc-tab';
    } else if(substring === 'CA Foundation(New)'){
        var sub = '#homepage_ca_foundation_notification_add';
        var notificationTab = '#ca-foundation-tab';
    } else if(!substring || substring === 'General' || typeof substring=== undefined){
        var sub = '#homepage_ca_general_notification_add';
        var notificationTab = '#ca-general-tab';
    }
  
    $(sub).append(`<a href="#" class="kt-notification__item">
    <div class="kt-notification__item-icon">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon kt-svg-icon--brand">
<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
<rect id="bound" x="0" y="0" width="24" height="24"/>
<path d="M5,3 L6,3 C6.55228475,3 7,3.44771525 7,4 L7,20 C7,20.5522847 6.55228475,21 6,21 L5,21 C4.44771525,21 4,20.5522847 4,20 L4,4 C4,3.44771525 4.44771525,3 5,3 Z M10,3 L11,3 C11.5522847,3 12,3.44771525 12,4 L12,20 C12,20.5522847 11.5522847,21 11,21 L10,21 C9.44771525,21 9,20.5522847 9,20 L9,4 C9,3.44771525 9.44771525,3 10,3 Z" id="Combined-Shape" fill="#000000"/>
<rect id="Rectangle-Copy-2" fill="#000000" opacity="0.3" transform="translate(17.825568, 11.945519) rotate(-19.000000) translate(-17.825568, -11.945519) " x="16.3255682" y="2.94551858" width="3" height="18" rx="1"/>
</g>
</svg>                        </div>
    <div class="kt-notification__item-details">
        <div class="kt-notification__item-title">
            ${notification.message}
        </div>
        <div class="kt-notification__item-time"> ${notification.author.username} <span class="float-right">${moment(notification.createdAt).format("DD-MMM-YY")}</span></div>
    </div>
</a>`)
}

function getMessages() {
    $.get('/notification', (data) => {
        // let notificationTab = ['#ca-final-new-tab', '#ca-final-old-tab', '#ca-intermediate-tab', '#ca-ipcc-tab', '#ca-foundation-tab', '#ca-general-tab'];
        // let examSub = ['CA Final(New)', 'CA Final(Old)','CA Intermediate', 'CA IPCC', 'CA Foundation', 'General'];
        // let filters = ['CA Final(New)', 'CA Final(Old)', 'CA Intermediate(New)', 'CA IPCC(Old)','CA Foundation(New)', 'General' ];
        // for (let i = 0; i < notificationTab.length; i++) {
        //     var element = notificationTab[i];
        //     var examelement = examSub[i];
        //     var filterelement = filters[i];

        //     var examLength = data.filter(msg=>msg.exam === filterelement);
        //     $(element).html(`${examelement} <span id="notification-btn-badge" class="kt-badge kt-badge kt-badge--danger">${examLength.length}</span>`)
        // };
        data.forEach(addMessages);
    });

};

function getMessagesAll(){
    $.get('/notification/all', (data)=>{
        data.forEach(addAllMessages());
    });
}

function sendMessage(message) {
    $.post('/notification', message, function(data){
        console.log("data from post")
        console.log(data)
            // let notificationTab = ['#ca-final-new-tab', '#ca-final-old-tab', '#ca-intermediate-tab', '#ca-ipcc-tab', '#ca-foundation-tab', '#ca-general-tab'];
            // let examSub = ['CA Final(New)', 'CA Final(Old)','CA Intermediate', 'CA IPCC', 'CA Foundation', 'General'];
            // let filters = ['CA Final(New)', 'CA Final(Old)', 'CA Intermediate(New)', 'CA IPCC(Old)','CA Foundation(New)', 'General' ];
            // for (let i = 0; i < notificationTab.length; i++) {
            //     var element = notificationTab[i];
            //     var examelement = examSub[i];
            //     var filterelement = filters[i];
    
            //     var examLength = data.filter(msg=>msg.exam === filterelement);
            //     $(element).html(`${examelement} <span id="notification-btn-badge" class="kt-badge kt-badge kt-badge--danger">${examLength.length}</span>`)
            // }
            // data.forEach(addMessages);
    });

}

function updateNewNotificationNo() {
    //  var quickPanel = document.querySelector('#quickpanel');
    var notificationNo = document.querySelector('#notificationNo');
    var subnotificationNo = document.querySelector('#subNotificationNo');
    $('#quickpanel').on('click', function () {
        $.get('/notification', (data) => {
            notificationNo.innerHTML = data.length;
            subnotificationNo.innerHTML = data.length;
        })
    })
}

function updateNewNotificationNoBtn() {
    //  var quickPanel = document.querySelector('#quickpanel');
    var notificationNoBadge = document.querySelector('#notification-btn-badge');
    $.get('/notification', (data) => {
        // console.log(data);
        notificationNoBadge.innerHTML = data.length;
    })
}


function followFaculty() {
    $('.faculty-follow-button').on('click', function () {
        let buttonid = $(this).attr("id");
        let url = `/follow/${buttonid}`;
        $.ajax({
            url: url,
            data: buttonid,
            type: 'PUT',
            success: function (data) {
                alert(data.message);
                if(data.class==='danger'){
                    $(`#${buttonid}`).text('Unfollow').toggleClass("btn-label-danger btn-label-success"); 
                } else if (data.class==='success') {
                    $(`#${buttonid}`).text('Follow').toggleClass("btn-label-success btn-label-danger");
                };
            }
        })
        $(this).blur();
    })
}