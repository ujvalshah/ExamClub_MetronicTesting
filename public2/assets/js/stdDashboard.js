//PAGE = Students Dashboard
        $(".stdDash-bookmark-form").on("submit", function (e) {
            var title = $(this).closest("tr").children("td.title").text()
            var answer = confirm(`Do you really want to remove ${title} from your bookmarks?`)
            if (!answer) { e.preventDefault() };
            $(this).find("button").blur();
        })

        $(".rmBookmark-video-form").on("click", function (e) {
            $(this).find("button").blur();
        })
        


