/* Task 2: Open Library book search using jQuery AJAX. */
$(document).ready(function () {
    $("#searchForm").on("submit", function (event) {
        event.preventDefault();
        const searchTerm = $("#searchInput").val().trim();

        if (searchTerm === "") {
            M3.showMessage("#searchMessage", "Please enter a book title or keyword before searching.", "error");
            $("#searchResults, #paginationControls, #resultSummary, #pageIndicator").empty();
            return;
        }
        runBookSearch(searchTerm);
    });

    function runBookSearch(searchTerm) {
        if (M3.state.searchRequest && M3.state.searchRequest.readyState !== 4) {
            M3.state.searchRequest.abort();
        }

        M3.state.searchTerm = searchTerm;
        M3.state.currentPage = 1;
        M3.state.searchResults = [];
        M3.state.totalPages = 0;
        $("#searchResults, #paginationControls, #resultSummary, #pageIndicator").empty();
        M3.showMessage("#searchMessage", "Loading search results...", "info");
        M3.setSearchLoading(true);

        M3.state.searchRequest = $.ajax({
            url: "https://openlibrary.org/search.json",
            method: "GET",
            dataType: "json",
            data: {
                q: searchTerm,
                limit: M3.config.maxResults,
                fields: "key,title,author_name,cover_i"
            },
            success: function (data) {
                const docs = Array.isArray(data.docs) ? data.docs : [];
                M3.state.searchResults = docs.slice(0, M3.config.maxResults).filter(function (book) {
                    return M3.getWorkId(book.key) !== "";
                });

                if (M3.state.searchResults.length === 0) {
                    M3.showMessage("#searchMessage", "No books matched your search. Try another title or keyword.", "error");
                    return;
                }

                for (let i = 0; i < M3.state.searchResults.length; i++) {
                    const book = M3.state.searchResults[i];
                    const workId = M3.getWorkId(book.key);
                    M3.state.itemMetadata[workId] = {
                        authors: Array.isArray(book.author_name) ? book.author_name : [],
                        coverId: book.cover_i || null
                    };
                }

                M3.state.totalPages = Math.ceil(M3.state.searchResults.length / M3.config.resultsPerPage);
                M3.showMessage("#searchMessage", "Search completed for \"" + searchTerm + "\".", "success");
                M3.renderSearchPage();
            },
            error: function (xhr, status) {
                if (status === "abort") return;
                $("#searchResults, #paginationControls, #resultSummary, #pageIndicator").empty();
                M3.showMessage("#searchMessage", "The Open Library search request failed. Please try again.", "error");
            },
            complete: function () {
                M3.setSearchLoading(false);
            }
        });
    }
});
