$(document).on('click', (e) => {
  const c = e.target.className;
  if (c === 'loginOnlineDraw') {
    $('.loginOnline').toggleClass('open');
  }
});
