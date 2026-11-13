/* Task 4: retrieve and display selected-book details in the SPA. */
$(document).ready(function () {
    $(document).on("click", ".book-select", function () {
        const workId = M3.getWorkId($(this).attr("data-work-id"));
        if (!workId) {
            M3.showMessage("#detailsMessage", "A valid Open Library Work ID was not available for this book.", "error");
            return;
        }
        loadBookDetails(workId);
    });

    function loadBookDetails(workId) {
        if (M3.state.detailCache[workId]) {
            displayBookDetails(M3.state.detailCache[workId], workId);
            return;
        }

        if (M3.state.detailsRequest && M3.state.detailsRequest.readyState !== 4) {
            M3.state.detailsRequest.abort();
        }

        $("#bookDetails").addClass("hidden");
        M3.showMessage("#detailsMessage", "Loading selected book details...", "info");
        M3.setDetailsLoading(true);

        M3.state.detailsRequest = $.ajax({
            url: "https://openlibrary.org/works/" + encodeURIComponent(workId) + ".json",
            method: "GET",
            dataType: "json",
            success: function (book) {
                M3.state.detailCache[workId] = book;
                displayBookDetails(book, workId);
            },
            error: function (xhr, status) {
                if (status === "abort") return;
                $("#bookDetails").addClass("hidden");
                M3.showMessage("#detailsMessage", "The selected book details could not be loaded. Please try again.", "error");
            },
            complete: function () {
                M3.setDetailsLoading(false);
            }
        });
    }

    function displayBookDetails(book, workId) {
        const metadata = M3.state.itemMetadata[workId] || { authors: [], coverId: null };
        const title = book.title || "Untitled Book";

        $("#detailTitle").text(title);
        $("#detailWorkId").text(workId);
        $("#detailAuthors").text(
            metadata.authors.length > 0
                ? metadata.authors.join(", ")
                : "Author information is unavailable."
        );

        let description = "No description is available for this book.";
        if (typeof book.description === "string" && book.description.trim() !== "") {
            description = book.description;
        } else if (
            book.description &&
            typeof book.description === "object" &&
            typeof book.description.value === "string" &&
            book.description.value.trim() !== ""
        ) {
            description = book.description.value;
        }
        $("#detailDescription").text(description);

        $("#detailSubjects").empty();
        if (Array.isArray(book.subjects) && book.subjects.length > 0) {
            const subjectCount = Math.min(book.subjects.length, 10);
            for (let i = 0; i < subjectCount; i++) {
                $("#detailSubjects").append($("<li>").text(book.subjects[i]));
            }
        } else {
            $("#detailSubjects").append($("<li>").text("No subject information is available."));
        }

        let coverId = metadata.coverId;
        if (Array.isArray(book.covers) && book.covers.length > 0) {
            coverId = book.covers[0];
        }
        $("#detailCover").empty().append(M3.createCover(coverId, title, "M"));

        $("#openLibraryLink").attr(
            "href",
            "https://openlibrary.org/works/" + encodeURIComponent(workId)
        );

        $("#bookDetails").removeClass("hidden");
        M3.showMessage("#detailsMessage", "Showing details for \"" + title + "\".", "success");
        document.getElementById("detailsSection").scrollIntoView({ behavior: "smooth", block: "start" });
    }
});
