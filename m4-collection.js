/*
    Milestone 4 - Public Collection
    Loads a separate Bestsellers subject collection with jQuery AJAX.
    Search results are not overwritten.
*/

$(document).ready(function () {
    loadPopularCollection();

    function loadPopularCollection() {
        M4.showMessage(
            "#collectionMessage",
            "Loading the public bestseller collection...",
            "info"
        );

        M4.setCollectionLoading(true);

        M4.state.collectionRequest = $.ajax({
            url:
                "https://openlibrary.org/subjects/" +
                M4.config.collectionSubject +
                ".json",
            method: "GET",
            dataType: "json",

            data: {
                limit: M4.config.collectionLimit
            },

            success: function (data) {
                const works =
                    Array.isArray(data.works)
                        ? data.works.slice(
                            0,
                            M4.config.collectionLimit
                        )
                        : [];

                if (works.length === 0) {
                    $("#collectionResults").empty();

                    M4.showMessage(
                        "#collectionMessage",
                        "The public collection is currently empty or unavailable.",
                        "error"
                    );

                    return;
                }

                const collectionBooks = [];

                for (let i = 0; i < works.length; i++) {
                    const work = works[i];
                    const workId = M4.getWorkId(work.key);

                    if (!workId) {
                        continue;
                    }

                    const authors = [];

                    if (Array.isArray(work.authors)) {
                        for (
                            let a = 0;
                            a < work.authors.length;
                            a++
                        ) {
                            if (work.authors[a].name) {
                                authors.push(
                                    work.authors[a].name
                                );
                            }
                        }
                    }

                    const coverId =
                        work.cover_id || null;

                    M4.state.metadata[workId] = {
                        authors: authors,
                        coverId: coverId,
                        firstPublishYear:
                            work.first_publish_year || null,
                        languages: [],
                        editionCount:
                            work.edition_count || null
                    };

                    collectionBooks.push({
                        workId: workId,
                        title:
                            work.title ||
                            "Untitled Book",
                        authorText:
                            authors.length
                                ? authors.join(", ")
                                : "Author unavailable",
                        publishYear:
                            work.first_publish_year || "",
                        hasCover:
                            Boolean(coverId),
                        coverUrl:
                            coverId
                                ? M4.coverUrl(
                                    coverId,
                                    "M"
                                )
                                : ""
                    });
                }

                /*
                    Requirement: Mustache.js renders collection items.
                */
                M4.renderTemplate(
                    "#collection-card-template",
                    { books: collectionBooks },
                    "#collectionResults"
                );

                M4.applyCurrentView();

                M4.showMessage(
                    "#collectionMessage",
                    "Popular / bestselling collection loaded successfully.",
                    "success"
                );
            },

            error: function () {
                $("#collectionResults").empty();

                M4.showMessage(
                    "#collectionMessage",
                    "The public collection could not be loaded. Please try again later.",
                    "error"
                );
            },

            complete: function () {
                M4.setCollectionLoading(false);
            }
        });
    }
});
