const onReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

onReady(() => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        event.preventDefault();

        document.querySelector(anchor.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
        });
    });
  });
});
