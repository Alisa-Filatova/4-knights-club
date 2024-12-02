onReady(() => {
  const container = document.getElementById('participants-list');
  const itemsCounter = document.getElementById('participants-slides-counter');

  const getCarouselWidth = () => {
    const carousel = document.querySelector('.participants-carousel');
    const width = getComputedStyle(carousel).getPropertyValue('width');

    return parseFloat(width);
  };

  const getItemWidth = () => {
    const item = document.querySelector('.participants-list__item')
    const gap = getComputedStyle(item).getPropertyValue('--list-item-gap');

    return item.clientWidth + parseFloat(gap);
  };

  const createState = (previousState = {}) => {
    const items = document.querySelectorAll('.participants-list__item');
    const itemWidth = getItemWidth();
    const displayedItems = Math.round(getCarouselWidth() / itemWidth);
    const maxItemsLeft = items.length - displayedItems;

    return {
      itemWidth: itemWidth,
      totalItems: items.length,
      itemsLeft: maxItemsLeft,
      maxItemsLeft: maxItemsLeft,
      displayedItems: displayedItems,
      animationStarted: false,
      animationTimeout: previousState.animationTimeout,
      autoScrollInterval: previousState.autoScrollInterval,
      autoScrollRestartTimeout: previousState.autoScrollRestartTimeout,
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

  const updateItemsCounter = () => {
    itemsCounter.textContent = state.totalItems - state.itemsLeft;
  };

  const startAutoScroll = () => {
    clearInterval(state.autoScrollInterval);
    clearTimeout(state.autoScrollRestartTimeout);

    state.autoScrollInterval = setInterval(() => {
      scrollToTheNext(true);
    }, 4000);
  };

  const stopAutoScroll = () => {
    clearInterval(state.autoScrollInterval);
    clearTimeout(state.autoScrollRestartTimeout);

    state.autoScrollRestartTimeout = setTimeout(() => {
      startAutoScroll();
    }, 6000);
  };

  const scroll = (auto) => {
    if (!auto) stopAutoScroll();
    startAnimation();

    const offset = state.itemWidth * (state.totalItems - state.itemsLeft - state.displayedItems);
    container.style.transform = `translateX(-${offset}px)`;

    updateItemsCounter();
  };

  const scrollToTheStart = (auto) => {
    if (!auto) stopAutoScroll();
    startAnimation();

    container.style.transform = `translateX(0)`;

    updateItemsCounter();
  };

  const scrollToTheEnd = (auto) => {
    if (!auto) stopAutoScroll();
    startAnimation();

    container.style.transform = `translateX(-${state.itemWidth * state.maxItemsLeft}px)`;

    updateItemsCounter();
  };

  const scrollToTheNext = (auto = false) => {
    if (state.itemsLeft === 0) {
      state.itemsLeft = state.maxItemsLeft;
      scrollToTheStart(auto);
    } else {
      state.itemsLeft -= 1;
      scroll(auto);
    }
  };

  document.getElementById('participants-slides-total').textContent = state.totalItems;

  document.getElementById('participants-btn-next').addEventListener('click', () => {
    if (!state.animationStarted) {
      scrollToTheNext();
    }
  });

  document.getElementById('participants-btn-prev').addEventListener('click', () => {
    if (state.animationStarted) return;

    if (state.itemsLeft === state.maxItemsLeft) {
      state.itemsLeft = 0;
      scrollToTheEnd();
    } else {
      state.itemsLeft += 1;
      scroll();
    }
  });

  window.addEventListener('resize', () => {
    state = createState(state);
    scrollToTheStart(true);
  });

  updateItemsCounter();
  startAutoScroll();
});
