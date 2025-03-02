document.addEventListener('DOMContentLoaded', function () {
    const tableView = document.getElementById('table-view');
    const rowView = document.getElementById('row-view');
    const searchInput = document.getElementById('search');
    const searchSubmit = document.getElementById('search-submit');
    const switchButton = document.getElementById('toggle-view');
    const tableBody = document.querySelector('#films-table tbody');
    const rowBody = document.getElementById('row-view');
    const sortByYear = document.getElementById('sort-year');
    const sortByRevenue = document.getElementById('sort-revenue');
 

    let films = [];
    let isTableView = true;
    let currentSort = 'rev';

    fetch('./data/films.json')
        .then(response => response.json())
        .then(data => {
            films = data;
            displayTableView(films);
            displayRowView(films);
        });

    function displayTableView(data) {
        tableBody.innerHTML = '';
        data.forEach(film => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding-left:10px;">${film.title}</td>
                <td style="text-align: center;">${film.year}</td>
                <td style="text-align: center;">${film.director.join(', ')}</td>
                <td style="text-align: center;">$${film.revenue.toLocaleString()}</td>
                <td style="padding-left:10px;">${film.country.join(', ')}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function displayRowView(data) {
        rowBody.innerHTML = '';
        data.forEach(film => {
            const row = document.createElement('div');
            row.className = 'film-row';
            row.innerHTML = `
                <img src="${film.poster}" alt="${film.title}" class="poster-img">
                <div class="film-data">
                    <h1>${film.title}</h2>
                    <p><strong>Year:</strong> ${film.year}</p>
                    <p><strong>Director:</strong> ${film.director.join(', ')}</p>
                    <p><strong>Revenue</strong> (millions): $${film.revenue.toLocaleString()}</p>
                    <p><strong>Country:</strong> ${film.country.join(', ')}</p>
                </div>
            `;
            rowBody.appendChild(row);
        });
    }

    function updateArrow() {
        sortByYear.textContent = 'Sort by year';
        sortByRevenue.textContent = 'Sort by revenue';

        if (currentSort === 'year') {
            sortByYear.textContent += ' 🠴';
        } else {
            sortByRevenue.textContent += ' 🠴';
        }
    }

    
    switchButton.addEventListener('click', function () {
        isTableView = !isTableView;
        if (isTableView) {
            switchButton.textContent = 'Switch to Row View';
            const sorted = films.slice().sort((a, b) => b.revenue - a.revenue);
            displayRowView(sorted)
            tableView.classList.remove('hidden');
            rowView.classList.add('hidden');
            currentSort = 'rev'
            updateArrow()
        } else {
            switchButton.textContent = 'Switch to Table View';
            const sorted = films.slice().sort((a, b) => b.revenue - a.revenue);
            displayTableView(sorted)
            tableView.classList.add('hidden');
            rowView.classList.remove('hidden');
            currentSort = 'rev'
            updateArrow()
        }
    });

    searchSubmit.addEventListener('click', function () {
        const request = searchInput.value.toLowerCase();
        const foundFilms = films.filter(film => film.title.toLowerCase().includes(request));
        if (isTableView) {
            displayTableView(foundFilms);
        } else {
            displayRowView(foundFilms)
        }
    });
    
    sortByYear.addEventListener('click', function () {
        if (currentSort === 'year') return;
        const sorted = films.slice().sort((a, b) => a.year - b.year);
        if (isTableView) {
            displayTableView(sorted)
        } else {
            displayRowView(sorted)
        }
        currentSort = 'year'
        updateArrow()
    });

    sortByRevenue.addEventListener('click', function () {
        if (currentSort === 'rev') return;
        const sorted = films.slice().sort((a, b) => b.revenue - a.revenue);
        if (isTableView) {
            displayTableView(sorted)
        } else {
            displayRowView(sorted)
        }
        currentSort = 'rev'
        updateArrow()
    });

    updateArrow();
});