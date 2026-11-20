/**
 * ============================================================================
 * SBW Neue Medien – Weihnachtskarten 2026
 * Complete Responsive Memory & Flip-Card Application (Vanilla ES6+)
 * ============================================================================
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & COMPLETE 24-CARD DATASET
     ========================================================================== */

  /**
   * Key used to store and retrieve user game progress in localStorage.
   * @type {string}
   */
  const STORAGE_KEY = 'weihnachtskalender_fortschritt';

  /**
   * Media query matching the mobile breakpoint specification (<= 768px).
   * @type {MediaQueryList}
   */
  const MOBILE_MEDIA_QUERY = window.matchMedia('(max-width: 768px)');

  /**
   * Complete dataset of all 24 Christmas cards, mapping ID, song title,
   * artist, designer attribution, and relative image path.
   * Note: 5 songs appear twice across the 24 cards.
   * @type {Array<{id: number, title: string, artist: string, designer: string, image: string, songKey: string}>}
   */
  const CARDS_DATA = [
    {
      id: 1,
      title: 'Red Water',
      artist: 'Type O Negative',
      designer: 'Platzhaltername 1',
      image: 'assets/img/sujet-1.jpg'
    },
    {
      id: 2,
      title: "It's Beginning to Look Like Christmas",
      artist: 'Michael Bublé',
      designer: 'Platzhaltername 2',
      image: 'assets/img/sujet-2.jpg'
    },
    {
      id: 3,
      title: 'Merry Christmas',
      artist: 'Ed Sheeran, Elton John',
      designer: 'Platzhaltername 3',
      image: 'assets/img/sujet-3.jpg'
    },
    {
      id: 4,
      title: 'Driving Home for Christmas',
      artist: 'Chris Rea',
      designer: 'Platzhaltername 4',
      image: 'assets/img/sujet-4.jpg'
    },
    {
      id: 5,
      title: 'Wonderful Christmastime',
      artist: 'Paul McCartney',
      designer: 'Platzhaltername 5',
      image: 'assets/img/sujet-5.jpg'
    },
    {
      id: 6,
      title: "Don't Shoot Me Santa",
      artist: 'The Killers',
      designer: 'Platzhaltername 6',
      image: 'assets/img/sujet-6.jpg'
    },
    {
      id: 7,
      title: 'Santa Tell Me',
      artist: 'Ariana Grande',
      designer: 'Platzhaltername 7',
      image: 'assets/img/sujet-7.jpg'
    },
    {
      id: 8,
      title: 'Merry Christmas Everyone',
      artist: 'Shaking Stevens',
      designer: 'Platzhaltername 8',
      image: 'assets/img/sujet-8.jpg'
    },
    {
      id: 9,
      title: 'Hoe, Hoe, Hoe',
      artist: 'Olexesh',
      designer: 'Platzhaltername 9',
      image: 'assets/img/sujet-9.jpg'
    },
    {
      id: 10,
      title: 'Love Me Like You (Christmas Mix)',
      artist: 'Little Mix',
      designer: 'Platzhaltername 10',
      image: 'assets/img/sujet-10.jpg'
    },
    {
      id: 11,
      title: 'Leise rieselt der Schnee',
      artist: 'Traditionell',
      designer: 'Platzhaltername 11',
      image: 'assets/img/sujet-11.jpg'
    },
    {
      id: 12,
      title: 'Mistletoe',
      artist: 'Justin Bieber',
      designer: 'Platzhaltername 12',
      image: 'assets/img/sujet-12.jpg'
    },
    {
      id: 13,
      title: 'Santa Tell Me',
      artist: 'Ariana Grande',
      designer: 'Platzhaltername 13',
      image: 'assets/img/sujet-13.jpg'
    },
    {
      id: 14,
      title: 'Snowman',
      artist: 'Sia',
      designer: 'Platzhaltername 14',
      image: 'assets/img/sujet-14.jpg'
    },
    {
      id: 15,
      title: 'Merry Christmas Everyone',
      artist: 'Shaking Stevens',
      designer: 'Platzhaltername 15',
      image: 'assets/img/sujet-15.jpg'
    },
    {
      id: 16,
      title: 'Let It Snow! Let It Snow! Let It Snow!',
      artist: 'Dean Martin',
      designer: 'Platzhaltername 16',
      image: 'assets/img/sujet-16.jpg'
    },
    {
      id: 17,
      title: 'Happy Xmas (War Is Over)',
      artist: 'John Lennon',
      designer: 'Platzhaltername 17',
      image: 'assets/img/sujet-17.jpg'
    },
    {
      id: 18,
      title: 'Underneath the Tree',
      artist: 'Kelly Clarkson',
      designer: 'Platzhaltername 18',
      image: 'assets/img/sujet-18.jpg'
    },
    {
      id: 19,
      title: 'All I Want for Christmas Is You',
      artist: 'Mariah Carey',
      designer: 'Platzhaltername 19',
      image: 'assets/img/sujet-19.jpg'
    },
    {
      id: 20,
      title: 'Snowman',
      artist: 'Sia',
      designer: 'Platzhaltername 20',
      image: 'assets/img/sujet-20.jpg'
    },
    {
      id: 21,
      title: 'Happy Xmas (War Is Over)',
      artist: 'John Lennon',
      designer: 'Platzhaltername 21',
      image: 'assets/img/sujet-21.jpg'
    },
    {
      id: 22,
      title: 'Blue Christmas',
      artist: 'Elvis Presley',
      designer: 'Platzhaltername 22',
      image: 'assets/img/sujet-22.jpg'
    },
    {
      id: 23,
      title: 'Blue Christmas',
      artist: 'Elvis Presley',
      designer: 'Platzhaltername 23',
      image: 'assets/img/sujet-23.jpg'
    },
    {
      id: 24,
      title: 'Frohes Fest',
      artist: 'Die Fantastischen Vier',
      designer: 'Platzhaltername 24',
      image: 'assets/img/sujet-24.jpg'
    }
  ].map((card) => ({
    ...card,
    songKey: `${card.title.toLowerCase()}__${card.artist.toLowerCase()}`
  }));
  /* ==========================================================================
     2. APPLICATION STATE & DOM REFERENCES
     ========================================================================== */

  const dom = {
    songList: document.getElementById('songList'),
    songSidebar: document.querySelector('.song-sidebar'),
    cardGrid: document.getElementById('cardGrid'),
    resetButton: document.getElementById('resetButton'),
    gameStatus: document.getElementById('gameStatus')
  };

  /**
   * Central state store for both Desktop and Mobile modes.
   */
  const state = {
    // Currently highlighted songKey in the desktop left sidebar (or null)
    selectedSongKey: null,
    // Array of matched card IDs persisted in localStorage
    matchedCardIds: [],
    // Randomized order of card IDs for the desktop board
    desktopCardOrder: [],
    // Randomized order of card IDs for the mobile view (shuffled on each load)
    mobileCardOrder: [],
    // Prevents overlapping mismatch animations on a card
    isAnimatingMismatch: false
  };

  /* ==========================================================================
     3. UTILITY FUNCTIONS (Shuffling, Deduplication, LocalStorage)
     ========================================================================== */

  /**
   * Performs an unbiased Fisher-Yates shuffle on a cloned array.
   * @param {Array} array - Source array to shuffle.
   * @returns {Array} New shuffled array.
   */
  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Extracts the ordered list of unique songs from CARDS_DATA in order of
   * first appearance, tracking all card IDs that belong to each unique song.
   * @returns {Array<{songKey: string, title: string, artist: string, cardIds: number[]}>}
   */
  function getUniqueSongsList() {
    const songMap = new Map();

    CARDS_DATA.forEach((card) => {
      if (!songMap.has(card.songKey)) {
        songMap.set(card.songKey, {
          songKey: card.songKey,
          title: card.title,
          artist: card.artist,
          cardIds: [card.id]
        });
      } else {
        songMap.get(card.songKey).cardIds.push(card.id);
      }
    });

    return Array.from(songMap.values());
  }

  /**
   * Checks whether every card instance associated with a given songKey
   * has been matched by the user.
   * @param {string} songKey - Unique song identifier.
   * @returns {boolean} True if all instances (1 or 2) are matched.
   */
  function isSongCompletelyMatched(songKey) {
    const matchingCards = CARDS_DATA.filter((card) => card.songKey === songKey);
    return matchingCards.every((card) => state.matchedCardIds.includes(card.id));
  }

  /**
   * Loads saved game progress (`matchedCardIds` and `desktopCardOrder`) from
   * `localStorage` under `weihnachtskalender_fortschritt`.
   */
  function loadProgressFromStorage() {
    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        initializeFreshDesktopState();
        return;
      }

      const parsed = JSON.parse(rawData);
      const validIds = new Set(CARDS_DATA.map((c) => c.id));

      // Validate matchedCardIds array
      if (Array.isArray(parsed.matchedCardIds)) {
        state.matchedCardIds = parsed.matchedCardIds.filter((id) => validIds.has(id));
      } else {
        state.matchedCardIds = [];
      }

      // Validate desktopCardOrder array so the 6x4 grid stays consistent across reloads
      if (
        Array.isArray(parsed.desktopCardOrder) &&
        parsed.desktopCardOrder.length === CARDS_DATA.length &&
        parsed.desktopCardOrder.every((id) => validIds.has(id))
      ) {
        state.desktopCardOrder = parsed.desktopCardOrder;
      } else {
        state.desktopCardOrder = shuffleArray(CARDS_DATA.map((c) => c.id));
      }

      saveProgressToStorage();
    } catch (error) {
      console.warn('Could not read progress from localStorage:', error);
      initializeFreshDesktopState();
    }
  }

  /**
   * Initializes a clean, newly shuffled desktop game state and saves it.
   */
  function initializeFreshDesktopState() {
    state.matchedCardIds = [];
    state.selectedSongKey = null;
    state.desktopCardOrder = shuffleArray(CARDS_DATA.map((c) => c.id));
    saveProgressToStorage();
  }

  /**
   * Persists the current desktop progress to `localStorage`.
   */
  function saveProgressToStorage() {
    try {
      const payload = {
        matchedCardIds: state.matchedCardIds,
        desktopCardOrder: state.desktopCardOrder,
        updatedAt: new Date().toISOString()
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Could not save progress to localStorage:', error);
    }
  }

  /**
   * Updates the ARIA live status region for assistive technologies.
   * @param {string} message - Status message to announce.
   */
  function announceStatus(message) {
    if (dom.gameStatus) {
      dom.gameStatus.textContent = message;
    }
  }

  /* ==========================================================================
     4. CARDS 
     ========================================================================== */

  /**
   * shown in the desktop and mobile screendesigns.
   * @returns {string} SVG HTML string.
   */

  function getPlaceholderIconSVG() {
    return '';
  }



  /* ==========================================================================
     5. RENDERING FUNCTIONS (Song Sidebar & Card Grid)
     ========================================================================== */

  /**
   * Renders the vertical list of unique songs in the left column (Desktop).
   * Applies `.is-selected` to the active song and `.is-matched` once all
   * instances of that song are uncovered.
   */
  function renderSongList() {
    const uniqueSongs = getUniqueSongsList();
    dom.songList.innerHTML = '';

    uniqueSongs.forEach((song) => {
      const li = document.createElement('li');
      li.className = 'song-list__item';
      li.dataset.songKey = song.songKey;
      li.setAttribute('role', 'option');
     
      li.innerHTML = `
        <span class="song-list__text">${song.title}</span>
        <div class="song-tooltip" aria-hidden="true">
          <span class="song-tooltip__title">${song.title}</span>
          <span class="song-tooltip__artist">${song.artist}</span>
        </div>
      `;


      const matched = isSongCompletelyMatched(song.songKey);
      const selected = state.selectedSongKey === song.songKey && !matched;

      if (matched) {
        li.classList.add('is-matched');
        li.setAttribute('aria-disabled', 'true');
        li.setAttribute('aria-selected', 'false');
        li.tabIndex = -1;
      } else {
        li.tabIndex = 0;
        li.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (selected) {
          li.classList.add('is-selected');
        }
      }

      // Click handler to select a song on desktop
      li.addEventListener('click', () => handleSongSelect(song.songKey));

      // Keyboard accessibility (Enter / Space)
      li.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSongSelect(song.songKey);
        }
      });

      dom.songList.appendChild(li);
    });
  }

  /**
   * Renders the 24 cards inside `#cardGrid` according to the active viewport
   * mode (Desktop memory game vs. Mobile 2-column flip cards).
   */
  function renderCardGrid() {
    const isMobile = MOBILE_MEDIA_QUERY.matches;
    const activeOrder = isMobile ? state.mobileCardOrder : state.desktopCardOrder;

    dom.cardGrid.innerHTML = '';

    activeOrder.forEach((cardId) => {
      const cardData = CARDS_DATA.find((c) => c.id === cardId);
      if (!cardData) return;

      const isMatchedOnDesktop = state.matchedCardIds.includes(cardData.id);

      // Create accessible button container for the card
      const cardEl = document.createElement('button');
      cardEl.type = 'button';
      cardEl.className = 'card';
      cardEl.dataset.cardId = String(cardData.id);

      if (!isMobile && isMatchedOnDesktop) {
        cardEl.classList.add('is-revealed');
      }

      // Set descriptive accessible label
      cardEl.setAttribute(
        'aria-label',
        isMobile || isMatchedOnDesktop
          ? `${cardData.title} (${cardData.artist}) – Design: ${cardData.designer}`
          : `Verdeckte Weihnachtskarte`
      );

      // Build inner 3D structure containing Covered Face, Artwork Face, and Mobile Back Face
      cardEl.innerHTML = `
        <div class="card__inner">
          <!-- 1. Covered Face (Desktop default before match) -->
          <div class="card__face card__face--covered">
            ${getPlaceholderIconSVG()}
          </div>

          <!-- 2. Artwork Face (Desktop revealed state / Mobile initial front state) -->
          <div class="card__face card__face--artwork">
            <img
              class="card__image"
              src="${cardData.image}"
              alt="${cardData.title} – (${cardData.artist})"
              loading="lazy"
            />
            <!-- Desktop Hover Inspection Overlay -->
            <div class="card__desktop-overlay">
              <div class="card__overlay-top">
                <span class="card__overlay-title">${cardData.title}</span>
                <span class="card__overlay-artist">${cardData.artist}</span>
              </div>
              <span class="card__overlay-designer">Design: ${cardData.designer}</span>
            </div>
          </div>

          <!-- 3. Mobile Flipped Back Face (Song Title, Artist in parentheses, Designer) -->
          <div class="card__face card__face--mobile-back">
            <div class="card__mobile-meta">
              <span class="card__mobile-title">${cardData.title}</span>
              <span class="card__mobile-artist">${cardData.artist}</span>
            </div>
            <span class="card__mobile-designer">Design: ${cardData.designer}</span>
          </div>
        </div>
      `;

      // Graceful visual fallback if `images/sujet-X.jpg` is not yet present on disk
      const imgEl = cardEl.querySelector('.card__image');
      imgEl.addEventListener('error', () => {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'card__image-fallback';
        fallbackDiv.innerHTML = getPlaceholderIconSVG();
        imgEl.replaceWith(fallbackDiv);
      });

      // Attach interaction listener
      cardEl.addEventListener('click', () => handleCardInteraction(cardData, cardEl));

      dom.cardGrid.appendChild(cardEl);
    });
  }


  /* ==========================================================================
       6. INTERACTION HANDLERS (Desktop Memory Logic & Mobile Flip Logic)
       ========================================================================== */

  /**
   * Handles selecting a song from the left column on Desktop.
   * Blocks changing the selection while a wrong card is currently open.
   * @param {string} songKey Unique key of the clicked song.
   */
  function handleSongSelect(songKey) {
    // Block song change during the 3-second mismatch preview/shake phase
    if (state.isAnimatingMismatch || isSongCompletelyMatched(songKey)) return;

    // Toggle or activate the clicked song
    state.selectedSongKey = state.selectedSongKey === songKey ? null : songKey;
    renderSongList();

    const selectedSong = CARDS_DATA.find((c) => c.songKey === songKey);
    if (selectedSong && state.selectedSongKey) {
      announceStatus(`Song ausgewählt: ${selectedSong.title}. Wähle nun eine verdeckte Karte.`);
    }
  }

  /**
    * Routes card clicks depending on whether the user is on Mobile or Desktop.
    * @param {Object} cardData Data object for the clicked card.
    * @param {HTMLElement} cardEl DOM button element of the clicked card.
    */
  function handleCardInteraction(cardData, cardEl) {
    if (MOBILE_MEDIA_QUERY.matches) {
      // Mobile View (<= 768px): Toggle 3D flip animation on tap
      cardEl.classList.toggle('is-flipped');
      return;
    }

    // Desktop View (> 768px): Memory Game Matching Logic
    handleDesktopCardAttempt(cardData, cardEl);
  }

  /**
   * Evaluates a user's attempt to match the currently selected song with a
   * covered card in the desktop 6x4 grid.
   * @param {Object} cardData Data object for the clicked card.
   * @param {HTMLElement} cardEl DOM button element of the clicked card.
   */
  function handleDesktopCardAttempt(cardData, cardEl) {
    // 1. Ignore clicks if card is already solved or if a mismatch preview is active
    if (state.matchedCardIds.includes(cardData.id) || state.isAnimatingMismatch) {
      return;
    }

    // 2. If no song is selected yet in the left column, gently nudge the song list
    if (!state.selectedSongKey) {
      if (dom.songSidebar) {
        dom.songSidebar.classList.remove('is-nudged');
        // Force reflow to restart animation
        void dom.songSidebar.offsetWidth;
        dom.songSidebar.classList.add('is-nudged');
      }
      announceStatus('Bitte wähle zuerst links einen Weihnachtssong aus der Liste.');
      return;
    }
    const isMatch = cardData.songKey === state.selectedSongKey;

    if (isMatch) {
      // 3A. CORRECT MATCH: Permanently reveal the card artwork & enable hover overlay
      state.matchedCardIds.push(cardData.id);
      cardEl.classList.add('is-revealed');
      cardEl.setAttribute(
        'aria-label',
        `${cardData.title} (${cardData.artist}) – Design: ${cardData.designer}`
      );

      // If all instances of the selected song are now matched, clear selection
      if (isSongCompletelyMatched(cardData.songKey)) {
        state.selectedSongKey = null;
      }

      // Persist state and refresh the song sidebar
      saveProgressToStorage();
      renderSongList();

      announceStatus(
        `Richtig zugeordnet! ${cardData.title} von ${cardData.artist}, Design: ${cardData.designer}.`
      );
    } else {
      // 3B. INCORRECT MATCH:
      // Lock board interactions and flip the card open to show the image without hover overlay
      state.isAnimatingMismatch = true;
      cardEl.classList.add('is-flipped');
      announceStatus('Leider falsch. Merke dir das Motiv – die Karte deckt sich in 3 Sekunden wieder zu.');


      window.setTimeout(() => {
        // Trigger the shake animation while the card is still open
        cardEl.classList.add('is-mismatch');

        // After the shake animation finishes (500 ms), flip the card back down and unlock
        window.setTimeout(() => {
          cardEl.classList.remove('is-mismatch', 'is-flipped');
          state.isAnimatingMismatch = false;
        }, 300);
      }, 800);
    }
  }

  /**
   * Clears `localStorage` (`weihnachtskalender_fortschritt`) and resets
   * the entire desktop game state and board.
   */
  function handleResetGame() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Could not clear localStorage:', error);
    }

    initializeFreshDesktopState();
    renderSongList();
    renderCardGrid();
    announceStatus('Das Spiel wurde zurückgesetzt und die Karten wurden neu gemischt.');
  }

  /* ==========================================================================
     7. APPLICATION INITIALIZATION & EVENT LISTENERS
     ========================================================================== */

  /**
   * Initializes the application on page load and binds responsive and UI listeners.
   */
  function initApp() {
    createSnowflakes(); // <-- DIESE ZEILE ERGÄNZEN

    // Randomize mobile card order on every page load per specification
    state.mobileCardOrder = shuffleArray(CARDS_DATA.map((c) => c.id));

    // Load or initialize desktop game progress from localStorage
    loadProgressFromStorage();

    // Perform initial render
    renderSongList();
    renderCardGrid();

    // Bind desktop reset button
    if (dom.resetButton) {
      dom.resetButton.addEventListener('click', handleResetGame);
    }

    // Re-render card grid seamlessly when crossing the 768px breakpoint
    MOBILE_MEDIA_QUERY.addEventListener('change', () => {
      renderCardGrid();
    });
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }


    /* ==========================================================================
     8. SNOW-FLAKES ANIMATION
     ========================================================================== */

  function createSnowflakes() {
    const container = document.getElementById('snowContainer');
    if (!container) return;

    const isMobile = MOBILE_MEDIA_QUERY.matches;

    const images = ['assets/img/snowflake-silver.svg', 'assets/img/snowflake-gold.svg'];

    for (let i = 0; i < 30; i += 1) {
      const flake = document.createElement('img');
      flake.src = images[Math.floor(Math.random() * images.length)];
      flake.alt = '';
      flake.className = 'falling-snowflake';

      // Zufällige Position (0-100%), Grösse (16-38px), Geschwindigkeit (10-22 Sek.) & Startzeit
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.width = `${16 + Math.random() * 22}px`;
      flake.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
      flake.style.animationDuration = `${10 + Math.random() * 12}s`;
      flake.style.animationDelay = `-${Math.random() * 20}s`;

      container.appendChild(flake);
    }
  }


})();