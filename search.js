$(document).ready(function () {
    const RESULTS_PER_PAGE = 12;
    const MAX_RESULTS = 60;

    let currentSearch = "";
    let currentPage = 1;
    let totalAvailableResults = 0;
    let totalPages = 0;

    $("#searchForm").on("submit", function (event) {
        event.preventDefault();

        const searchTerm = $("#searchInput").val().trim();

        if (searchTerm === "") {
            clearResults();
            showMessage("Please enter a search term.", true);
            return;
        }

        currentSearch = searchTerm;
        currentPage = 1;
        searchBooks();
    });

    $("#pageSelectTop, #pageSelectBottom").on("change", function () {
        currentPage = parseInt($(this).val(), 10);
        searchBooks();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    function searchBooks() {
        showMessage("Searching Open Library...", false);
        $("#results").empty();

        const apiUrl =
            "https://openlibrary.org/search.json?q=" +
            encodeURIComponent(currentSearch) +
            "&limit=" + RESULTS_PER_PAGE +
            "&page=" + currentPage;

        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function (data) {
                const books = data.docs || [];
                const found = data.num_found ?? data.numFound ?? 0;

                totalAvailableResults = Math.min(found, MAX_RESULTS);
                totalPages = Math.ceil(totalAvailableResults / RESULTS_PER_PAGE);

                if (books.length === 0 || totalAvailableResults === 0) {
                    clearResults();
                    showMessage("No books were found for that search.", true);
                    return;
                }

                displayBooks(books);
                updatePagination();

                const startNumber = ((currentPage - 1) * RESULTS_PER_PAGE) + 1;
                const endNumber = Math.min(
                    startNumber + books.length - 1,
                    totalAvailableResults
                );

                $("#resultSummary").text(
                    "Showing " + startNumber + "–" + endNumber +
                    " of up to " + totalAvailableResults + " results"
                );

                showMessage(
                    "Search results for \"" + currentSearch + "\"",
                    false
                );
            },
            error: function () {
                clearResults();
                showMessage(
                    "The search request failed. Please try again later.",
                    true
                );
            }
        });
    }

    function displayBooks(books) {
        $("#results").empty();

        for (let i = 0; i < books.length; i++) {
            const book = books[i];

            if (i >= RESULTS_PER_PAGE) {
                break;
            }

            let workId = "";

            if (book.key) {
                workId = book.key.replace("/works/", "");
            }

            if (!workId) {
                continue;
            }

            const title = book.title || "Untitled Book";

            const card = $("<article>").addClass("book-card");

            if (book.cover_i) {
                const coverUrl =
                    "https://covers.openlibrary.org/b/id/" +
                    book.cover_i +
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

            $("#results").append(card);
        }
    }

    function updatePagination() {
        $("#pageSelectTop, #pageSelectBottom").empty();

        for (let page = 1; page <= totalPages; page++) {
            const optionTop = $("<option>", {
                value: page,
                text: "Page " + page
            });

            const optionBottom = optionTop.clone();

            if (page === currentPage) {
                optionTop.prop("selected", true);
                optionBottom.prop("selected", true);
            }

            $("#pageSelectTop").append(optionTop);
            $("#pageSelectBottom").append(optionBottom);
        }

        if (totalPages > 1) {
            $("#paginationTop, #paginationBottom").removeClass("hidden");
        } else {
            $("#paginationTop, #paginationBottom").addClass("hidden");
        }
    }

    function clearResults() {
        $("#results").empty();
        $("#pageSelectTop, #pageSelectBottom").empty();
        $("#paginationTop, #paginationBottom").addClass("hidden");
        $("#resultSummary").text("");
    }

    function showMessage(message, isError) {
        $("#message")
            .text(message)
            .removeClass("error success")
            .addClass(isError ? "error" : "success");
    }
});
