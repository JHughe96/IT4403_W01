/* Task 5: predefined Science Fiction collection from Open Library Subjects API. */
$(document).ready(function () {
    loadCollection();

    function loadCollection() {
        $("#collectionResults").empty();
        M3.showMessage("#collectionMessage", "Loading the Science Fiction collection...", "info");
        M3.setCollectionLoading(true);

        M3.state.collectionRequest = $.ajax({
            url: "https://openlibrary.org/subjects/" + M3.config.collectionSubject + ".json",
            method: "GET",
            dataType: "json",
            data: { limit: M3.config.collectionLimit },
            success: function (data) {
                const works = Array.isArray(data.works)
                    ? data.works.slice(0, M3.config.collectionLimit)
                    : [];

                if (works.length === 0) {
                    M3.showMessage("#collectionMessage", "The Science Fiction collection is currently empty or unavailable.", "error");
                    return;
                }

                for (let i = 0; i < works.length; i++) {
                    const book = works[i];
                    const workId = M3.getWorkId(book.key);
                    if (!workId) continue;

                    const authorNames = [];
                    if (Array.isArray(book.authors)) {
                        for (let a = 0; a < book.authors.length; a++) {
                            if (book.authors[a].name) authorNames.push(book.authors[a].name);
                        }
                    }

                    M3.state.itemMetadata[workId] = {
                        authors: authorNames,
                        coverId: book.cover_id || null
                    };

                    $("#collectionResults").append(M3.createBookCard({
                        workId: workId,
                        title: book.title || "Untitled Book",
                        coverId: book.cover_id || null
                    }));
                }

                if ($("#collectionResults").children().length === 0) {
                    M3.showMessage("#collectionMessage", "No usable books were returned for the collection.", "error");
                    return;
                }

                M3.showMessage("#collectionMessage", "Science Fiction collection loaded successfully.", "success");
            },
            error: function () {
                $("#collectionResults").empty();
                M3.showMessage("#collectionMessage", "The Science Fiction collection could not be loaded. Please try again later.", "error");
            },
            complete: function () {
                M3.setCollectionLoading(false);
            }
        });
    }
});
