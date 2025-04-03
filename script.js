// --- Hiragana Data (Now includes Dakuten & Handakuten) ---
const hiraganaData = [
    // Gojūon (Basic 46)
    { hiragana: 'あ', romaji: 'a' }, { hiragana: 'い', romaji: 'i' }, { hiragana: 'う', romaji: 'u' }, { hiragana: 'え', romaji: 'e' }, { hiragana: 'お', romaji: 'o' },
    { hiragana: 'か', romaji: 'ka' }, { hiragana: 'き', romaji: 'ki' }, { hiragana: 'く', romaji: 'ku' }, { hiragana: 'け', romaji: 'ke' }, { hiragana: 'こ', romaji: 'ko' },
    { hiragana: 'さ', romaji: 'sa' }, { hiragana: 'し', romaji: 'shi' }, { hiragana: 'す', romaji: 'su' }, { hiragana: 'せ', romaji: 'se' }, { hiragana: 'そ', romaji: 'so' },
    { hiragana: 'た', romaji: 'ta' }, { hiragana: 'ち', romaji: 'chi' }, { hiragana: 'つ', romaji: 'tsu' }, { hiragana: 'て', romaji: 'te' }, { hiragana: 'と', romaji: 'to' },
    { hiragana: 'な', romaji: 'na' }, { hiragana: 'に', romaji: 'ni' }, { hiragana: 'ぬ', romaji: 'nu' }, { hiragana: 'ね', romaji: 'ne' }, { hiragana: 'の', romaji: 'no' },
    { hiragana: 'は', romaji: 'ha' }, { hiragana: 'ひ', romaji: 'hi' }, { hiragana: 'ふ', romaji: 'fu' }, { hiragana: 'へ', romaji: 'he' }, { hiragana: 'ほ', romaji: 'ho' },
    { hiragana: 'ま', romaji: 'ma' }, { hiragana: 'み', romaji: 'mi' }, { hiragana: 'む', romaji: 'mu' }, { hiragana: 'め', romaji: 'me' }, { hiragana: 'も', romaji: 'mo' },
    { hiragana: 'や', romaji: 'ya' }, { hiragana: 'ゆ', romaji: 'yu' }, { hiragana: 'よ', romaji: 'yo' },
    { hiragana: 'ら', romaji: 'ra' }, { hiragana: 'り', romaji: 'ri' }, { hiragana: 'る', romaji: 'ru' }, { hiragana: 'れ', romaji: 're' }, { hiragana: 'ろ', romaji: 'ro' },
    { hiragana: 'わ', romaji: 'wa' }, { hiragana: 'を', romaji: 'wo' },
    { hiragana: 'ん', romaji: 'n' },

    // Dakuten (゛) Variations
    { hiragana: 'が', romaji: 'ga' }, { hiragana: 'ぎ', romaji: 'gi' }, { hiragana: 'ぐ', romaji: 'gu' }, { hiragana: 'げ', romaji: 'ge' }, { hiragana: 'ご', romaji: 'go' },
    { hiragana: 'ざ', romaji: 'za' }, { hiragana: 'じ', romaji: 'ji' }, { hiragana: 'ず', romaji: 'zu' }, { hiragana: 'ぜ', romaji: 'ze' }, { hiragana: 'ぞ', romaji: 'zo' },
    { hiragana: 'だ', romaji: 'da' }, { hiragana: 'ぢ', romaji: 'ji' }, { hiragana: 'づ', romaji: 'zu' }, { hiragana: 'で', romaji: 'de' }, { hiragana: 'ど', romaji: 'do' },
    { hiragana: 'ば', romaji: 'ba' }, { hiragana: 'び', romaji: 'bi' }, { hiragana: 'ぶ', romaji: 'bu' }, { hiragana: 'べ', romaji: 'be' }, { hiragana: 'ぼ', romaji: 'bo' },

    // Handakuten (゜) Variations
    { hiragana: 'ぱ', romaji: 'pa' }, { hiragana: 'ぴ', romaji: 'pi' }, { hiragana: 'ぷ', romaji: 'pu' }, { hiragana: 'ぺ', romaji: 'pe' }, { hiragana: 'ぽ', romaji: 'po' }
];

// --- DOM Elements ---
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const flipButton = document.getElementById('flip-button');
const nextButton = document.getElementById('next-button');
const progressElement = document.getElementById('progress');

// --- State Variables ---
let currentCardIndex = 0;
let isFlipped = false;
let shuffledDeck = [];

// --- Functions ---

// Fisher-Yates (Knuth) Shuffle Algorithm
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Update card content and reset flip state
function showCard(index) {
    // Check if shuffledDeck has elements - prevents errors on initial load if data was empty
    if (shuffledDeck.length === 0) {
        console.error("Deck is empty!");
        cardFront.textContent = 'Error';
        cardBack.textContent = 'No Data';
        progressElement.textContent = `Card 0 / 0`;
        return;
    }
    const cardData = shuffledDeck[index];
    cardFront.textContent = cardData.hiragana;
    cardBack.textContent = cardData.romaji;

    // Reset flip state if card is currently flipped
    if (isFlipped) {
        flashcard.classList.remove('is-flipped');
        isFlipped = false;
    }

    // Update progress indicator - This line automatically handles the correct total count
    progressElement.textContent = `Card ${index + 1} / ${shuffledDeck.length}`;
}

// Toggle the flip animation
function flipCard() {
    flashcard.classList.toggle('is-flipped');
    isFlipped = !isFlipped;
}

// Move to the next card
function nextCard() {
    // Prevent errors if deck is empty
    if (shuffledDeck.length === 0) return;

    currentCardIndex++;
    // Wrap around to the beginning if end is reached
    if (currentCardIndex >= shuffledDeck.length) {
        currentCardIndex = 0;
        // Optional: Reshuffle deck when starting over
        // shuffledDeck = shuffle([...hiraganaData]);
        // alert("Deck finished! Shuffling and starting over.");
    }
    showCard(currentCardIndex);
}

// Initialize the flashcards
function initialize() {
    shuffledDeck = shuffle([...hiraganaData]); // Shuffle the combined data
    currentCardIndex = 0;
    showCard(currentCardIndex);
}

// --- Event Listeners ---
flipButton.addEventListener('click', flipCard);
nextButton.addEventListener('click', nextCard);
// Also allow flipping by clicking the card itself
flashcard.addEventListener('click', flipCard);

// --- Initial Setup ---
initialize();