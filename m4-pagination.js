/*
    Milestone 4 - Pagination
    Displays 10 search results per page without a browser reload.
*/

M4.renderSearchPage = function () {
    const results = M4.state.searchResults;
    const pageSize = M4.config.resultsPerPage;

    if (!results.length) {
        $("#searchResults").empty();
        $("#paginationControls").empty();
        $("#pageIndicator").empty();
        return;
    }

    const start = (M4.state.currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, results.length);

    const pageBooks = [];

    for (let i = start; i < end; i++) {
        pageBooks.push(
            M4.searchBookViewModel(results[i])
        );
    }

    /*
        Requirement: Mustache.js renders search-result cards.
    */
    M4.renderTemplate(
        "#search-card-template",
        { books: pageBooks },
        "#searchResults"
    );

    M4.applyCurrentView();

    $("#resultSummary").text(
        "Showing books " +
        (start + 1) +
        "–" +
        end +
        " of " +
        results.length +
        " accessible result(s) for \"" +
        M4.state.searchTerm +
        "\"."
    );

    renderPagination();
};

function renderPagination() {
    const $controls = $("#paginationControls");

    $controls.empty();

    if (M4.state.totalPages === 0) {
        $("#pageIndicator").empty();
        return;
    }

    const $previous = $("<button>", {
        type: "button",
        text: "Previous"
    })
        .addClass("m4-page-button")
        .prop("disabled", M4.state.currentPage === 1)
        .on("click", function () {
            changePage(M4.state.currentPage - 1);
        });

    $controls.append($previous);

    for (
        let page = 1;
        page <= M4.state.totalPages;
        page++
    ) {
        const $pageButton = $("<button>", {
            type: "button",
            text: page,
            "aria-label": "Show search results page " + page
        })
            .addClass("m4-page-button")
            .toggleClass(
                "current-page",
                page === M4.state.currentPage
            )
            .attr(
                "aria-current",
                page === M4.state.currentPage
                    ? "page"
                    : null
            )
            .on(
                "click",
                (function (selectedPage) {
                    return function () {
                        changePage(selectedPage);
                    };
                })(page)
            );

        $controls.append($pageButton);
    }

    const $next = $("<button>", {
        type: "button",
        text: "Next"
    })
        .addClass("m4-page-button")
        .prop(
            "disabled",
            M4.state.currentPage ===
                M4.state.totalPages
        )
        .on("click", function () {
            changePage(M4.state.currentPage + 1);
        });

    $controls.append($next);

    $("#pageIndicator").text(
        "Page " +
        M4.state.currentPage +
        " of " +
        M4.state.totalPages
    );
}

function changePage(page) {
    if (
        page < 1 ||
        page > M4.state.totalPages ||
        page === M4.state.currentPage
    ) {
        return;
    }

    M4.state.currentPage = page;
    M4.renderSearchPage();

    document
        .getElementById("searchPanel")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}
