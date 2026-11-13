/* Task 6: shared application state, messages, fallbacks, and request controls. */
window.M3 = {
    config: {
        maxResults: 50,
        resultsPerPage: 10,
        collectionSubject: "science_fiction",
        collectionLimit: 10
    },
    state: {
        searchTerm: "",
        searchResults: [],
        currentPage: 1,
        totalPages: 0,
        searchRequest: null,
        detailsRequest: null,
        collectionRequest: null,
        detailCache: {},
        itemMetadata: {}
    },
    showMessage: function (selector, message, type) {
        const $message = $(selector);
        $message.text(message).removeClass("m3-info m3-success m3-error");
        if (type === "error") {
            $message.addClass("m3-error");
        } else if (type === "success") {
            $message.addClass("m3-success");
        } else {
            $message.addClass("m3-info");
        }
    },
    clearMessage: function (selector) {
        $(selector).text("").removeClass("m3-info m3-success m3-error");
    },
    getWorkId: function (key) {
        if (!key) return "";
        return String(key).replace("/works/", "").trim();
    },
    coverUrl: function (coverId, size) {
        if (!coverId) return "";
        const coverSize = size || "S";
        return "https://covers.openlibrary.org/b/id/" + encodeURIComponent(coverId) + "-" + coverSize + ".jpg?default=false";
    },
    createCover: function (coverId, title, size) {
        if (!coverId) {
            return $("<div>").addClass("cover-placeholder").text("No cover available");
        }
        const $image = $("<img>", {
            src: this.coverUrl(coverId, size),
            alt: "Cover of " + (title || "selected book"),
            loading: "lazy"
        });
        $image.on("error", function () {
            $(this).replaceWith($("<div>").addClass("cover-placeholder").text("No cover available"));
        });
        return $image;
    },
    createBookCard: function (book) {
        const workId = this.getWorkId(book.workId);
        const title = book.title || "Untitled Book";
        const $card = $("<article>").addClass("book-card");
        $card.append(this.createCover(book.coverId, title, "S"));
        const $button = $("<button>", {
            type: "button",
            text: title,
            "data-work-id": workId
        }).addClass("book-select m3-title-button");
        $card.append($("<h3>").append($button));
        return $card;
    },
    setSearchLoading: function (isLoading) {
        $("#searchButton").prop("disabled", isLoading).text(isLoading ? "Searching..." : "Search");
        $("#searchInput").prop("disabled", isLoading);
    },
    setCollectionLoading: function (isLoading) {
        $("#collectionSection").attr("aria-busy", isLoading ? "true" : "false");
    },
    setDetailsLoading: function (isLoading) {
        $("#detailsSection").attr("aria-busy", isLoading ? "true" : "false");
    }
};
