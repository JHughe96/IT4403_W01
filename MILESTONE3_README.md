# IT 4403 - Milestone 3 Open Library SPA

Milestone 3 is separate from Milestone 2. Do not remove or replace the Milestone 2 pages.

## File-to-task mapping

- `milestone3.html` — Task 1: one-page SPA interface containing Search, Results, Pagination, Details, and Collection sections.
- `task2-search.js` — Task 2: validates search input and retrieves up to 50 Open Library search results with jQuery AJAX.
- `task3-pagination.js` — Task 3: displays 10 results at a time and changes views without reloading the page.
- `task4-details.js` — Task 4: loads a selected Work with AJAX and displays title, Work ID, authors, description, subjects, cover, and Open Library link.
- `task5-collection.js` — Task 5: dynamically loads up to 10 Science Fiction works from the Subjects API.
- `task6-states.js` — Task 6: shared application state, loading messages, missing-cover fallbacks, errors, and request controls.
- `milestone3.css` — Milestone 3-specific SPA styles.

## Existing stylesheet

Keep your existing `styles.css`. `milestone3.html` deliberately loads both:

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="milestone3.css">
```

## Suggested repository layout

```text
IT4403_W01/
    milestone2.html
    booksearch.html
    bookdetails.html
    bookshelf.html
    styles.css

    milestone3.html
    milestone3.css
    task2-search.js
    task3-pagination.js
    task4-details.js
    task5-collection.js
    task6-states.js
```

## Optional link for milestones.html

```html
<li><a href="milestone3.html">Milestone 3</a></li>
```

## API endpoints used

- Search: `https://openlibrary.org/search.json`
- Work details: `https://openlibrary.org/works/WORK_ID.json`
- Collection: `https://openlibrary.org/subjects/science_fiction.json?limit=10`
- Covers: `https://covers.openlibrary.org/b/id/COVER_ID-S.jpg` and `-M.jpg`
