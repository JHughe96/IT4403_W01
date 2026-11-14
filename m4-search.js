/*
    Milestone 4 - Book Search
    Uses jQuery AJAX and Open Library Search API.
*/

$(document).ready(function () {

    $("#searchForm").on("submit", function (event) {
        event.preventDefault();

        const term = $("#searchInput").val().trim();

        if (term === "") {
            M4.showMessage(
                "#searchMessage",
                "Please enter a book title or keyword before searching.",
                "error"
            );

            return;
        }

        runSearch(term);
    });

    function runSearch(term) {
        if (
            M4.state.searchRequest &&
            M4.state.searchRequest.readyState !== 4
        ) {
            M4.state.searchRequest.abort();
        }

        M4.state.searchTerm = term;
        M4.state.currentPage = 1;
        M4.state.searchResults = [];
        M4.state.totalPages = 0;

        $("#searchResults").empty();
        $("#paginationControls").empty();
        $("#pageIndicator").empty();
        $("#resultSummary").empty();

        M4.showMessage(
            "#searchMessage",
            "Loading search results...",
            "info"
        );

        M4.setSearchLoading(true);

        M4.state.searchRequest = $.ajax({
            url: "https://openlibrary.org/search.json",
            method: "GET",
            dataType: "json",

            data: {
                q: term,
                limit: M4.config.maxResults,
                fields:
                    "key,title,author_name,cover_i," +
                    "first_publish_year,language,edition_count"
            },

            success: function (data) {
                const docs = Array.isArray(data.docs)
                    ? data.docs
                    : [];

                M4.state.searchResults = docs
                    .slice(0, M4.config.maxResults)
                    .filter(function (book) {
                        return M4.getWorkId(book.key) !== "";
                    });

                if (M4.state.searchResults.length === 0) {
                    M4.showMessage(
                        "#searchMessage",
                        "No books matched your search. Try another title or keyword.",
                        "error"
                    );

                    $("#searchResults").empty();
                    $("#paginationControls").empty();
                    $("#pageIndicator").empty();
                    $("#resultSummary").empty();
                    return;
                }

                /*
                    Keep useful Search API metadata for details-on-demand.
                */
                for (
                    let i = 0;
                    i < M4.state.searchResults.length;
                    i++
                ) {
                    const book = M4.state.searchResults[i];
                    const workId = M4.getWorkId(book.key);

                    M4.state.metadata[workId] = {
                        authors: M4.normalizeAuthors(book.author_name),
                        coverId: book.cover_i || null,
                        firstPublishYear:
                            book.first_publish_year || null,
                        languages:
                            Array.isArray(book.language)
                                ? book.language
                                : [],
                        editionCount:
                            book.edition_count || null
                    };
                }

                M4.state.totalPages = Math.ceil(
                    M4.state.searchResults.length /
                    M4.config.resultsPerPage
                );

                M4.showMessage(
                    "#searchMessage",
                    "Search completed for \"" + term + "\".",
                    "success"
                );

                /*
                    Automatically show Search Results if the user was viewing
                    the collection when a new search was submitted.
                */
                M4.showPanel("search");

                M4.renderSearchPage();
            },

            error: function (xhr, status) {
                if (status === "abort") {
                    return;
                }

                M4.showMessage(
                    "#searchMessage",
                    "The Open Library search request failed. Please try again.",
                    "error"
                );
            },

            complete: function () {
                M4.setSearchLoading(false);
            }
        });
    }
});
