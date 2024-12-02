onReady(() => {
  const carousel = document.getElementById('stages-list');
  const items = document.querySelectorAll('.stages-list__item');
  const prevButton = document.getElementById('stages-btn-prev');
  const nextButton = document.getElementById('stages-btn-next');
  const paginationButtons = document.querySelectorAll('.pagination__button');

  const getItemWidth = () => {
    const item = document.querySelector('.stages-list__item');
    const gap = getComputedStyle(carousel).getPropertyValue('grid-column-gap');

    return item.clientWidth + parseFloat(gap);
  };

  const createState = (previousState = {}) => {
    const totalItems = Math.round(items.length / 2);

    return {
      itemWidth: getItemWidth(),
      totalItems: totalItems,
      itemsLeft: totalItems,
      animationStarted: false,
      animationTimeout: previousState.animationTimeout,
    };
  };

  let state = createState();

  const startAnimation = () => {
    clearTimeout(state.animationTimeout);

    state.animationStarted = true;
    state.animationTimeout = setTimeout(() => {
      state.animationStarted = false;
    }, 300);
  };

  const disableButton = (button, disabled) => {
    button.disabled = disabled;
  };

  const updatePagination = () => {
    const className = 'pagination__button_active';
    const activeButton = document.querySelector(`.${className}`);
    activeButton.disabled = false;
    activeButton.classList.remove(className);

    const activePaginationButton = paginationButtons[state.totalItems - state.itemsLeft];
    activePaginationButton.disabled = true;
    activePaginationButton.classList.add(className);
  };

  const scroll = () => {
    startAnimation();

    const offset = state.itemWidth * (state.totalItems - state.itemsLeft);
    carousel.style.transform = `translateX(-${offset}px)`;

    disableButton(nextButton, false);
    disableButton(prevButton, false);

    if (state.itemsLeft === state.totalItems) {
      disableButton(prevButton, true);
    } else if (state.itemsLeft === 0) {
      disableButton(nextButton, true);
    }

    updatePagination();
  };

  const scrollToTheStart = () => {
    startAnimation();

    carousel.style.transform = `translateX(0)`;

    disableButton(prevButton, true);
    disableButton(nextButton, false);
    updatePagination();
  };

  prevButton.addEventListener('click', () => {
    if (state.itemsLeft < state.totalItems && !state.animationStarted) {
      state.itemsLeft += 1;
      scroll();
    }
  });

  nextButton.addEventListener('click', () => {
    if (state.itemsLeft > 0 && !state.animationStarted) {
      state.itemsLeft -= 1;
      scroll();
    }
  });

  Array.from(paginationButtons).forEach((button, index) => {
    button.addEventListener('click', () => {
      state.itemsLeft = state.totalItems - index;
      scroll();
    });
  });

  window.addEventListener('resize', () => {
    state = createState(state);
    scrollToTheStart();
  });
});
