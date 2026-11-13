/* Task 3: local pagination in groups of 10 without a page reload. */
M3.renderSearchPage = function () {
    const results = M3.state.searchResults;
    const pageSize = M3.config.resultsPerPage;
    if (!Array.isArray(results) || results.length === 0) {
        $("#searchResults, #paginationControls, #resultSummary, #pageIndicator").empty();
        return;
    }

    const startIndex = (M3.state.currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, results.length);
    $("#searchResults").empty();

    for (let i = startIndex; i < endIndex; i++) {
        const book = results[i];
        $("#searchResults").append(M3.createBookCard({
            workId: book.key,
            title: book.title || "Untitled Book",
            coverId: book.cover_i || null
        }));
    }

    $("#resultSummary").text(
        "Showing books " + (startIndex + 1) + "–" + endIndex +
        " of " + results.length + " accessible result(s) for \"" + M3.state.searchTerm + "\"."
    );
    M3.renderPaginationControls();
};

M3.renderPaginationControls = function () {
    const $controls = $("#paginationControls").empty();
    if (M3.state.totalPages <= 1) {
        $("#pageIndicator").text(M3.state.totalPages === 1 ? "Page 1 of 1" : "");
        return;
    }

    $controls.append($("<button>", { type: "button", text: "Previous" })
        .addClass("m3-page-button")
        .prop("disabled", M3.state.currentPage === 1)
        .on("click", function () { M3.changePage(M3.state.currentPage - 1); }));

    for (let page = 1; page <= M3.state.totalPages; page++) {
        const $button = $("<button>", {
            type: "button",
            text: page,
            "aria-label": "Show search results page " + page
        }).addClass("m3-page-button")
          .toggleClass("current-page", page === M3.state.currentPage)
          .on("click", (function (selectedPage) {
              return function () { M3.changePage(selectedPage); };
          })(page));
        if (page === M3.state.currentPage) $button.attr("aria-current", "page");
        $controls.append($button);
    }

    $controls.append($("<button>", { type: "button", text: "Next" })
        .addClass("m3-page-button")
        .prop("disabled", M3.state.currentPage === M3.state.totalPages)
        .on("click", function () { M3.changePage(M3.state.currentPage + 1); }));

    $("#pageIndicator").text("Page " + M3.state.currentPage + " of " + M3.state.totalPages);
};

M3.changePage = function (pageNumber) {
    if (pageNumber < 1 || pageNumber > M3.state.totalPages || pageNumber === M3.state.currentPage) return;
    M3.state.currentPage = pageNumber;
    M3.renderSearchPage();
    document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });
};
