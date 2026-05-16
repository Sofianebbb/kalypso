(function () {
  function loadJSON(url, callback) {
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(callback)
      .catch(function (err) { console.warn('Kalipso data-loader:', url, err); });
  }

  function renderActeurs(data, container) {
    if (!container) return;
    var html = '';
    data.forEach(function (a) {
      html += '<div class="acteur-card" data-type="' + a.type + '">';
      html += '<div class="acteur-card__name">' + a.nom + '</div>';
      html += '<span class="acteur-card__type">' + a.type + '</span>';
      html += '<p class="acteur-card__secteur">' + a.secteur + '</p>';
      html += '<p class="acteur-card__potentiel">' + a.potentiel + '</p>';
      if (a.site) {
        html += '<a class="acteur-card__link" href="' + a.site + '" target="_blank" rel="noopener">' + a.nom + ' →</a>';
      }
      html += '</div>';
    });
    container.innerHTML = html;
  }

  function setupFilters(data, container, grid) {
    if (!container || !grid) return;
    var types = [];
    data.forEach(function (a) {
      if (types.indexOf(a.type) === -1) types.push(a.type);
    });

    var html = '<span class="filter-tag active" data-filter="all">Tous</span>';
    types.forEach(function (t) {
      html += '<span class="filter-tag" data-filter="' + t + '">' + t + '</span>';
    });
    container.innerHTML = html;

    container.addEventListener('click', function (e) {
      var tag = e.target.closest('.filter-tag');
      if (!tag) return;
      var filter = tag.dataset.filter;

      container.querySelectorAll('.filter-tag').forEach(function (t) { t.classList.remove('active'); });
      tag.classList.add('active');

      grid.querySelectorAll('.acteur-card').forEach(function (card) {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  function initActeurs() {
    var grid = document.getElementById('acteurs-grid');
    var filters = document.getElementById('acteurs-filters');
    if (!grid) return;

    loadJSON('../data/acteurs.json', function (data) {
      renderActeurs(data, grid);
      setupFilters(data, filters, grid);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActeurs);
  } else {
    initActeurs();
  }
})();
