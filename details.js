$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    let workId = params.get("id");

    if (!workId) {
        showMessage(
            "No Work ID was provided. Return to Home and select a book.",
            true
        );
        return;
    }

    workId = workId.replace("/works/", "").trim();

    const apiUrl =
        "https://openlibrary.org/works/" +
        encodeURIComponent(workId) +
        ".json";

    showMessage("Loading book details...", false);

    $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function (book) {
            displayBook(book, workId);
        },
        error: function () {
            showMessage(
                "Book details could not be loaded. Please try again later.",
                true
            );
        }
    });

    function displayBook(book, id) {
        const title = book.title || "Untitled Book";

        $("#bookTitle").text(title);
        $("#workId").text(id);

        let descriptionText = "No description is available for this book.";

        if (typeof book.description === "string") {
            descriptionText = book.description;
        } else if (
            book.description &&
            typeof book.description === "object" &&
            book.description.value
        ) {
            descriptionText = book.description.value;
        }

        $("#description").text(descriptionText);

        $("#subjects").empty();

        if (Array.isArray(book.subjects) && book.subjects.length > 0) {
            const subjectLimit = Math.min(book.subjects.length, 10);

            for (let i = 0; i < subjectLimit; i++) {
                $("#subjects").append(
                    $("<li>").text(book.subjects[i])
                );
            }
        } else {
            $("#subjects").append(
                $("<li>").text("No subjects are available.")
            );
        }

        $("#coverArea").empty();

        if (Array.isArray(book.covers) && book.covers.length > 0) {
            const coverId = book.covers[0];
            const coverUrl =
                "https://covers.openlibrary.org/b/id/" +
                coverId +
                "-M.jpg";

            const image = $("<img>", {
                src: coverUrl,
                alt: "Cover of " + title
            });

            image.on("error", function () {
                $("#coverArea").html(
                    $("<div>")
                        .addClass("cover-placeholder")
                        .text("No cover available")
                );
            });

            $("#coverArea").append(image);
        } else {
            $("#coverArea").append(
                $("<div>")
                    .addClass("cover-placeholder")
                    .text("No cover available")
            );
        }

        $("#openLibraryLink").attr(
            "href",
            "https://openlibrary.org/works/" + encodeURIComponent(id)
        );

        $("#bookDetails").removeClass("hidden");
        showMessage("", false);
    }

    function showMessage(message, isError) {
        $("#message")
            .text(message)
            .removeClass("error success")
            .addClass(isError ? "error" : "success");
    }
});
