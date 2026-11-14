/*
    Milestone 4 - Shared state and helper functions

    This file loads first so every other Milestone 4 JavaScript file can
    use the M4 object. Milestone 3 files are not modified.
*/

window.M4 = {
    config: {
        maxResults: 50,
        resultsPerPage: 10,
        collectionSubject: "bestsellers",
        collectionLimit: 10
    },

    state: {
        searchTerm: "",
        searchResults: [],
        currentPage: 1,
        totalPages: 0,
        currentView: "grid",
        activePanel: "search",
        searchRequest: null,
        detailsRequest: null,
        collectionRequest: null,
        detailCache: {},
        metadata: {}
    },

    getWorkId: function (key) {
        if (!key) {
            return "";
        }

        return String(key)
            .replace("/works/", "")
            .trim();
    },

    coverUrl: function (coverId, size) {
        if (!coverId) {
            return "";
        }

        return "https://covers.openlibrary.org/b/id/" +
            encodeURIComponent(coverId) +
            "-" + (size || "M") +
            ".jpg?default=false";
    },

    showMessage: function (selector, message, type) {
        $(selector)
            .text(message)
            .removeClass("m4-info m4-success m4-error")
            .addClass(
                type === "error"
                    ? "m4-error"
                    : type === "success"
                    ? "m4-success"
                    : "m4-info"
            );
    },

    clearMessage: function (selector) {
        $(selector)
            .text("")
            .removeClass("m4-info m4-success m4-error");
    },

    normalizeAuthors: function (authors) {
        if (!Array.isArray(authors) || authors.length === 0) {
            return [];
        }

        return authors.filter(function (author) {
            return typeof author === "string" && author.trim() !== "";
        });
    },

    languageName: function (languageCodes) {
        if (!Array.isArray(languageCodes) || languageCodes.length === 0) {
            return "Not available";
        }

        const names = {
            eng: "English",
            spa: "Spanish",
            fre: "French",
            fra: "French",
            ger: "German",
            deu: "German",
            ita: "Italian",
            por: "Portuguese",
            jpn: "Japanese",
            chi: "Chinese",
            zho: "Chinese"
        };

        const code = String(languageCodes[0]).toLowerCase();

        return names[code] || code.toUpperCase();
    },

    /*
        Convert one Search API record into display-ready template data.
    */
    searchBookViewModel: function (book) {
        const workId = this.getWorkId(book.key);
        const authors = this.normalizeAuthors(book.author_name);
        const coverId = book.cover_i || null;

        return {
            workId: workId,
            title: book.title || "Untitled Book",
            authors: authors,
            authorText: authors.length
                ? authors.join(", ")
                : "Author unavailable",
            publishYear: book.first_publish_year || "",
            coverId: coverId,
            hasCover: Boolean(coverId),
            coverUrl: coverId
                ? this.coverUrl(coverId, "M")
                : ""
        };
    },

    /*
        Render a Mustache template into a target element.
    */
    renderTemplate: function (templateSelector, data, targetSelector) {
        const template = $(templateSelector).html();
        const rendered = Mustache.render(template, data);
        $(targetSelector).html(rendered);
    },

    setSearchLoading: function (loading) {
        $("#searchButton")
            .prop("disabled", loading)
            .text(loading ? "Searching..." : "Search");

        $("#searchInput").prop("disabled", loading);
        $("#searchSection").attr("aria-busy", loading ? "true" : "false");
    },

    setDetailsLoading: function (loading) {
        $("#detailsSection").attr("aria-busy", loading ? "true" : "false");
    },

    setCollectionLoading: function (loading) {
        $("#collectionPanel").attr("aria-busy", loading ? "true" : "false");
    }
};
