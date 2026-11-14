/*
    Milestone 4 - Grid/List Views and Search/Collection Tabs
*/

$(document).ready(function () {

    $("#gridViewButton").on("click", function () {
        M4.state.currentView = "grid";
        M4.applyCurrentView();
        updateViewButtons();
    });

    $("#listViewButton").on("click", function () {
        M4.state.currentView = "list";
        M4.applyCurrentView();
        updateViewButtons();
    });

    $("#searchTab").on("click", function () {
        M4.showPanel("search");
    });

    $("#collectionTab").on("click", function () {
        M4.showPanel("collection");
    });

    updateViewButtons();
});

M4.applyCurrentView = function () {
    const isGrid = M4.state.currentView === "grid";

    $(".m4-items")
        .toggleClass("grid-view", isGrid)
        .toggleClass("list-view", !isGrid);
};

M4.showPanel = function (panel) {
    const showSearch = panel === "search";

    M4.state.activePanel = showSearch
        ? "search"
        : "collection";

    $("#searchPanel").toggleClass(
        "hidden",
        !showSearch
    );

    $("#collectionPanel").toggleClass(
        "hidden",
        showSearch
    );

    $("#searchTab")
        .toggleClass("active", showSearch)
        .attr("aria-selected", showSearch);

    $("#collectionTab")
        .toggleClass("active", !showSearch)
        .attr("aria-selected", !showSearch);

    M4.applyCurrentView();
};

function updateViewButtons() {
    const isGrid = M4.state.currentView === "grid";

    $("#gridViewButton")
        .toggleClass("active", isGrid)
        .attr("aria-pressed", isGrid);

    $("#listViewButton")
        .toggleClass("active", !isGrid)
        .attr("aria-pressed", !isGrid);
}
