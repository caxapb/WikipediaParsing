document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#films-table tbody');
    const sortYearButton = document.getElementById('sort-year');
    const sortRevenueButton = document.getElementById('sort-revenue');

    let films = [];

    // Load JSON data
    fetch('./data/films.json')
        .then(response => response.json())
        .then(data => {
            films = data;
            renderTable(films);
        });

    // Render table
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(film => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${film.title}</td>
                <td>${film.release_year}</td>
                <td>${film.director}</td>
                <td>$${film.box_office.toLocaleString()}</td>
                <td>${film.country}</td>
                <td><img src="${film.poster}" alt="None"></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Sort by year
    sortYearButton.addEventListener('click', function () {
        const sortedFilms = films.slice().sort((a, b) => a.release_year - b.release_year);
        renderTable(sortedFilms);
    });

    // Sort by revenue
    sortRevenueButton.addEventListener('click', function () {
        const sortedFilms = films.slice().sort((a, b) => b.box_office - a.box_office);
        renderTable(sortedFilms);
    });
});