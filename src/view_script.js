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
    const seeStatsButton = document.getElementById('see-stats');
    const statsModal = document.getElementById('stats');
    const closeModal = document.getElementById('close');
 

    let films = [];
    let isTableView = true;
    let currentSort = 'rev';

    fetch('./data/films.json')
        .then(response => response.json()).then(data => {
            films = data;
            displayTableView(films);
            displayRowView(films);});

    function displayTableView(data) {
        tableBody.innerHTML = '';
        data.forEach(film => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding-left:10px;">${film.title}</td>
                <td style="text-align: center;">${film.year}</td>
                <td style="text-align: center;">${film.director[0]}</td>
                <td style="text-align: center;">$${film.revenue.toLocaleString()}</td>
                <td style="padding-left:10px;">${film.country[0]}</td>
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
                    <p><strong>Director:</strong> ${film.director[0]}</p>
                    <p><strong>Revenue</strong> (millions): $${film.revenue.toLocaleString()}</p>
                    <p><strong>Country:</strong> ${film.country[0]}</p>
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

    function generatePlot(films) {
        const plot = document.getElementById('plot');
        plot.innerHTML = '';

        const filmsByYear = {};
        films.forEach(film => {
            if (!filmsByYear[film.year]) {
                filmsByYear[film.year] = [];
            }
            filmsByYear[film.year].push(film);
        });

        const years = Object.keys(filmsByYear).sort((a, b) => a - b);
        const maxFilms = Math.max(...Object.values(filmsByYear).map(arr => arr.length));
        let order = -1;

        years.forEach(year => {
            order = order + 1;

            const filmsInYear = filmsByYear[year];
            const x = order * 4.2;
            const y = 100 - (filmsInYear.length / maxFilms) * 90;


            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.left = `${x+5}%`;
            circle.style.top = `${y}%`;

            const yearX = document.createElement('div');
            yearX.textContent = year;
            yearX.className = 'yearX';
            yearX.style.left = `${x+5}%`; 
            yearX.style.top = `100%`;

            const filmAmount = document.createElement('div');
            filmAmount.textContent = '-'+filmsInYear.length;
            filmAmount.className = 'yearY';
            filmAmount.style.left = '0%';
            filmAmount.style.top = `${y}%`;


            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = filmsInYear.map(film=>film.title).join(', ');

            circle.addEventListener('mouseover', function(){
                tooltip.style.display = 'block';
                tooltip.style.left = `${x+2}%`;
                tooltip.style.top = `${y-10}%`;
            });

            circle.addEventListener('mouseout', function(){
                tooltip.style.display = 'none';
            });

            plot.appendChild(circle);
            plot.appendChild(yearX);
            plot.appendChild(filmAmount);
            plot.appendChild(tooltip);
        });
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
            displayTableView(sorted);
            tableView.classList.add('hidden');
            rowView.classList.remove('hidden');
            currentSort = 'rev';
            updateArrow();
        }
    });

    searchSubmit.addEventListener('click', function () {
        const request = searchInput.value.toLowerCase();
        const foundFilms = films.filter(film => film.title.toLowerCase().includes(request));
        if (isTableView) {
            displayTableView(foundFilms);
        } else {
            displayRowView(foundFilms);
        }
    });
    
    sortByYear.addEventListener('click', function () {
        if (currentSort === 'year') return;
        const sorted = films.slice().sort((a, b) => a.year - b.year);
        if (isTableView) {
            displayTableView(sorted);
        } else {
            displayRowView(sorted);
        }
        currentSort = 'year';
        updateArrow();
    });

    sortByRevenue.addEventListener('click', function () {
        if (currentSort === 'rev') return;
        const sorted = films.slice().sort((a, b) => b.revenue - a.revenue);
        if (isTableView) {
            displayTableView(sorted);
        } else {
            displayRowView(sorted);
        }
        currentSort = 'rev';
        updateArrow();
    });

    seeStatsButton.addEventListener('click', function () {
        statsModal.classList.remove('hidden');
        statsModal.style.display = 'block';
        generatePlot(films);
    });

    closeModal.addEventListener('click', function () {
        statsModal.classList.add('hidden');
        statsModal.style.display = 'none';
    });

    updateArrow();
});