// Переключение разделов без перезагрузки страницы
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var links = document.querySelectorAll('.nav-list a');
  var pages = document.querySelectorAll('.page');
  var video = document.getElementById('mozart-video');

  function show(id) {
    var found = false;
    pages.forEach(function (p) {
      var on = p.id === id;
      p.classList.toggle('active', on);
      if (on) found = true;
    });
    if (!found) { id = 'about'; document.getElementById(id).classList.add('active'); }

    links.forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === id);
    });

    // Видео играет только когда открыт его раздел; остановка при уходе
    if (video) {
      if (id === 'video') {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        video.pause();
      }
    }

    // Останавливаем аудио при смене раздела
    if (id !== 'tracklist') {
      document.querySelectorAll('audio').forEach(function (a) { a.pause(); });
    }
    window.scrollTo(0, 0);
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var id = a.dataset.page;
      history.replaceState(null, '', '#' + id);
      show(id);
    });
  });

  // Просмотр нот в увеличенном виде
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.score').forEach(function (img) {
    img.addEventListener('click', function () {
      lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open');
    });
  });
  lb.addEventListener('click', function () { lb.classList.remove('open'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') lb.classList.remove('open');
  });

  // Если страница открыта по ссылке с #, показать нужный раздел
  show(location.hash.slice(1) || 'about');
  window.addEventListener('load', function () { window.scrollTo(0, 0); });
  window.addEventListener('hashchange', function () {
    show(location.hash.slice(1) || 'about');
  });

  // Подсветка играющего трека
  document.querySelectorAll('.track audio').forEach(function (a) {
    var card = a.closest('.track');
    a.addEventListener('play', function () {
      document.querySelectorAll('audio').forEach(function (o) { if (o !== a) o.pause(); });
      card.classList.add('playing');
    });
    a.addEventListener('pause', function () { card.classList.remove('playing'); });
    a.addEventListener('ended', function () { card.classList.remove('playing'); });
  });

  // Увеличение нот по клику
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(function (img) {
    img.addEventListener('click', function () {
      boxImg.src = img.src;
      boxImg.alt = img.alt;
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
    });
  });
  function closeBox() { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); }
  box.addEventListener('click', closeBox);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });
})();
