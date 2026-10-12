$(document).ready(function () {
    // These are Open Library Work IDs.
    // You can replace any of these with other Work IDs later.
    const bookshelfIds = [
        "OL45804W",
        "OL27448W",
        "OL82563W",
        "OL262758W"
    ];

    let loadedCount = 0;
    let failedCount = 0;

    $("#message")
        .text("Loading books from Open Library...")
        .removeClass("error")
        .addClass("success");

    for (let i = 0; i < bookshelfIds.length; i++) {
        loadBook(bookshelfIds[i]);
    }

    function loadBook(workId) {
        const apiUrl =
            "https://openlibrary.org/works/" +
            encodeURIComponent(workId) +
            ".json";

        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function (book) {
                displayBook(book, workId);
                loadedCount++;
                updateStatus();
            },
            error: function () {
                failedCount++;
                updateStatus();
            }
        });
    }

    function displayBook(book, workId) {
        const title = book.title || "Untitled Book";

        const card = $("<article>").addClass("book-card");

        if (Array.isArray(book.covers) && book.covers.length > 0) {
            const coverId = book.covers[0];
            const coverUrl =
                "https://covers.openlibrary.org/b/id/" +
                coverId +
                "-S.jpg";

            const image = $("<img>", {
                src: coverUrl,
                alt: "Cover of " + title
            });

            image.on("error", function () {
                $(this).replaceWith(
                    $("<div>")
                        .addClass("cover-placeholder")
                        .text("No cover available")
                );
            });

            card.append(image);
        } else {
            card.append(
                $("<div>")
                    .addClass("cover-placeholder")
                    .text("No cover available")
            );
        }

        const titleLink = $("<a>", {
            href: "details.html?id=" + encodeURIComponent(workId),
            text: title
        });

        card.append(
            $("<h3>").append(titleLink)
        );

        $("#bookshelf").append(card);
    }

    function updateStatus() {
        if (loadedCount + failedCount !== bookshelfIds.length) {
            return;
        }

        if (loadedCount === 0) {
            $("#message")
                .text("The bookshelf could not be loaded. Please try again later.")
                .removeClass("success")
                .addClass("error");
        } else if (failedCount > 0) {
            $("#message")
                .text(
                    "Some books loaded successfully, but " +
                    failedCount +
                    " request(s) failed."
                )
                .removeClass("success")
                .addClass("error");
        } else {
            $("#message")
                .text("Bookshelf loaded successfully.")
                .removeClass("error")
                .addClass("success");
        }
    }
});
