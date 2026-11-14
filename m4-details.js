/*
    Milestone 4 - Details on Demand
    Uses jQuery AJAX and renders the detail panel with Mustache.js.
*/

$(document).ready(function () {

    /*
        Delegated handler supports both search cards and public collection
        cards because both use the .book-select class.
    */
    $(document).on("click", ".book-select", function () {
        const workId = M4.getWorkId(
            $(this).attr("data-work-id")
        );

        if (!workId) {
            M4.showMessage(
                "#detailsMessage",
                "A valid Work ID is unavailable for this book.",
                "error"
            );

            return;
        }

        loadDetails(workId);
    });

    /*
        Replace missing cover images with the fallback placeholder.
    */
    $(document).on("error", ".m4-cover, .m4-detail-cover img", function () {
        $(this).replaceWith(
            $("<div>")
                .addClass(
                    "m4-cover m4-cover-placeholder"
                )
                .text("No cover available")
        );
    });

    function loadDetails(workId) {
        if (M4.state.detailCache[workId]) {
            renderDetails(
                M4.state.detailCache[workId],
                workId
            );
            return;
        }

        if (
            M4.state.detailsRequest &&
            M4.state.detailsRequest.readyState !== 4
        ) {
            M4.state.detailsRequest.abort();
        }

        $("#bookDetails").empty();

        M4.showMessage(
            "#detailsMessage",
            "Loading selected book details...",
            "info"
        );

        M4.setDetailsLoading(true);

        M4.state.detailsRequest = $.ajax({
            url:
                "https://openlibrary.org/works/" +
                encodeURIComponent(workId) +
                ".json",
            method: "GET",
            dataType: "json",

            success: function (work) {
                M4.state.detailCache[workId] = work;
                renderDetails(work, workId);
            },

            error: function (xhr, status) {
                if (status === "abort") {
                    return;
                }

                M4.showMessage(
                    "#detailsMessage",
                    "The selected book details could not be loaded. Please try again.",
                    "error"
                );
            },

            complete: function () {
                M4.setDetailsLoading(false);
            }
        });
    }

    function renderDetails(work, workId) {
        const metadata =
            M4.state.metadata[workId] || {};

        const authors = Array.isArray(metadata.authors)
            ? metadata.authors
            : [];

        let description =
            "No description is available for this book.";

        if (
            typeof work.description === "string" &&
            work.description.trim() !== ""
        ) {
            description = work.description;
        } else if (
            work.description &&
            typeof work.description === "object" &&
            typeof work.description.value === "string" &&
            work.description.value.trim() !== ""
        ) {
            description = work.description.value;
        }

        const subjects =
            Array.isArray(work.subjects)
                ? work.subjects.slice(0, 10)
                : [];

        let coverId = metadata.coverId || null;

        if (
            Array.isArray(work.covers) &&
            work.covers.length > 0
        ) {
            coverId = work.covers[0];
        }

        const viewModel = {
            title: work.title || "Untitled Book",
            workId: workId,

            authorText:
                authors.length > 0
                    ? authors.join(", ")
                    : "Author information unavailable",

            publishYearText:
                metadata.firstPublishYear ||
                "Not available",

            languageText:
                M4.languageName(
                    metadata.languages || []
                ),

            editionCountText:
                metadata.editionCount ||
                "Not available",

            description: description,

            subjects: subjects,
            hasSubjects: subjects.length > 0,

            hasCover: Boolean(coverId),

            coverUrl:
                coverId
                    ? M4.coverUrl(coverId, "M")
                    : "",

            openLibraryUrl:
                "https://openlibrary.org/works/" +
                encodeURIComponent(workId)
        };

        /*
            Requirement: Mustache.js renders individual item details.
        */
        M4.renderTemplate(
            "#details-template",
            viewModel,
            "#bookDetails"
        );

        M4.showMessage(
            "#detailsMessage",
            "Showing details for \"" +
                viewModel.title +
                "\".",
            "success"
        );

        document
            .getElementById("detailsSection")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
});
