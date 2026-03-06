//
const savedWords = [];

// show saved word in ui
const displaySavedWords = () => {
    const saveWordsContainer = document.querySelector('#saved-word-container');
    const wordsContainer = document.querySelector('#saved-words');

    wordsContainer.innerHTML = '';

     if(savedWords.length === 0){
        saveWordsContainer.classList.add('hidden');

        return;
    }

    saveWordsContainer.classList.remove('hidden');

    savedWords.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.classList = 'rounded-2xl bg-white p-14';

        wordDiv.innerHTML = `
            <h3 class="text-lg font-bold">${word.word}</h3>
            <p>${word.meaning || "No meaning found"}</p>
        `;

        wordsContainer.appendChild(wordDiv);
    });
};

// save the word
const savedWord = (word) => {
    const wordExists = savedWords.find(savedWord => savedWord.id === word.id);

    if (wordExists) {
        alert('Word already saved!');
        return;
    }

    savedWords.push(word);

    alert('Word saved successfully!');

    displaySavedWords();
};

// look for words.. implement search
const searchWord = () => {
    btnActive();

    const searchInput = document.querySelector('#input-search');
    const searchValue = searchInput.value.trim().toLowerCase();
    // console.log(searchValue);

    const searchWordUrl = 'https://openapi.programming-hero.com/api/words/all';

    fetch(searchWordUrl)
        .then(res =>  res.json())
        .then(searchData => {
            const allWords = searchData.data;
            // console.log(allWords);

            const filterWords = allWords.filter(filterWord =>
                filterWord.word.toLowerCase().includes(searchValue)
            );

            displayLevelWord(filterWords);
        });
};

const searchInput = document.querySelector('#input-search');
searchInput.addEventListener('input', searchWord);

// const searchBtn = document.querySelector('#btn-search');
// searchBtn.addEventListener('click', searchWord);

// pronounce word or english sound for word
const pronounceWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
};

// show spinner before loading data
const manageSpinner = (status) => {
    const spinner = document.querySelector('#spin-container');
    const LevelContentContainer = document.querySelector('#level-content-container');

    if (status === true) {
        spinner.classList.remove('hidden');
        spinner.classList.add('flex');
        LevelContentContainer.classList.add('hidden');
    } else {
        spinner.classList.add('hidden');
        spinner.classList.remove('flex');
        LevelContentContainer.classList.remove('hidden');
    }
};

// show similar word
const synonymWord = (synonyms) => {
    // console.log(synonyms);

    if (!synonyms || synonyms.length === 0) return '';

    return synonyms.map(synonym => `
            <span class="p-2 bg-[#EDF7FF] border-2 border-[#BADEFF10] rounded-lg">${synonym}</span>
        `
    ).join(' ');
};

// display word in detail with meaning, example and synonym
const displayWordDetails = (word, details) => {
    // console.log(word);

    const modal = document.querySelector('#word-modal-container');
    const detailsBox = document.querySelector('#details-container');

    detailsBox.innerHTML = `
        <h3 class="text-2xl font-bold"><span id="word">${details.word || ''}</span>(<i class="fa-solid fa-microphone-lines"></i> : <span id="pronunciation">${details.pronunciation || ''}</span>)</h3>

        <div>
            <p class="font-bold">Meaning</p>
            <p id="meaning">${details.meaning || ''}</p>
        </div>

        <div>
            <p class="font-bold">Example</p>
            <p id="example">${details.sentence || ''}</p>
        </div>

        <div class="synonym">
            <p class="font-bold"></p>
            <p id="synonym-words" class="flex gap-4  flex-wrap">${synonymWord(details.synonyms)}</p>
        </div>
    `;

    modal.showModal();
};

// load data ffrom api
const loadWordDetail = async (id) => {
    const wordDetailUrl = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(wordDetailUrl);

    const res = await fetch(wordDetailUrl);
    const details = await res.json();
    // console.log(details);

    displayWordDetails(id, details.data);
};

// acitive button on click
const btnActive = (level) => {
    const lessonBtns = document.querySelectorAll('.lesson-btn');

    lessonBtns.forEach(btn => {
        btn.classList.remove('btn-active', 'text-white');
    });

    const clickedBtn = document.querySelector(`.lesson-btn[data-id="${level}"]`);

    // console.log(clickedBtn);

    clickedBtn?.classList.add('btn-active', 'text-white');
};

// show word for each level
const displayLevelWord = (words) => {
    const levelContent = document.querySelector('#level-content');
    const defaultMessage = document.querySelector('#default-message');

    defaultMessage?.classList.add("hidden");
    
    levelContent.innerHTML = '';

    if (!words || words.length === 0) {
        levelContent.innerHTML += `
            <div class="no-content p-16 text-center col-span-3">
                <img class="mx-auto" src="./assets/alert-error.png" />
                <p class="text-[#79716B] text-sm mb-3 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h3 class="text-3xl font-medium text-[#292524] font-bangla">নেক্সট Lesson এ যান</h3>
            </div>
        `;

        manageSpinner(false);
        
        return;
    };

    words.forEach(word => {
        levelContent.innerHTML += `
            <div class="level-card rounded-2xl bg-white p-14">
                <h3 class="font-bold text-3xl">${word.word || "শব্দ পাওয়া যায়নি"}</h3>

                <p class="text-sm py-6">Meaning / Pronunciation</p>

                <p class="font-bangla text-[#464649] font-semibold text-2xl">
                    ${word.meaning || "অর্থ পাওয়া যায়নি"} 
                    /
                    ${word.pronunciation || "Pronounciation পাওয়া  যায়নি"}
                </p>

                <div class="card-icon mt-14 flex justify-between gap-4 text-xl text-[#374957]">
                    <button data-id="${word.id}" class="word-details btn bg-[#edf7ff] p-3 rounded-lg"><i class="fa-solid fa-circle-info"></i></button>

                    <button data-id="${word.id}" class="save-word btn bg-[#EDF7FF] p-3 rounded-lg"><i class="fa-solid fa-heart text-primary"></i></button>

                    <button data-id="${word.word}" class="word-sound btn bg-[#EDF7FF] p-3 rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `;
    });

    // load the word details wordDetails()
    const wordDetails = document.querySelectorAll('.word-details');

    wordDetails.forEach((detailsBtn) => {
        detailsBtn.addEventListener('click', (event) => {
            const wordId = event.currentTarget.dataset.id;
            // console.log(wordId);

            loadWordDetail(wordId);
        });
    });

    const wordSaveBtns = document.querySelectorAll('.save-word');
    wordSaveBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const wordId = parseInt(event.currentTarget.dataset.id);
            
            const selectedWord = words.find(word => word.id === wordId);

            savedWord(selectedWord);
        });
    });

    const wordSound = document.querySelectorAll('.word-sound');
    wordSound.forEach((sound) => {
        sound.addEventListener('click', (event) => {
            const word = event.currentTarget.dataset.id;
            // console.log(word);

            pronounceWord(word);
        });
    });
    
    manageSpinner(false);
}

// load word from api for each level
const loadLevelWords = (level) => {
    manageSpinner(true);

    const levelWordUrl = `https://openapi.programming-hero.com/api/level/${level}`;

    fetch(levelWordUrl)
        .then(res => res.json())
        .then(jsonData => {
            const words = jsonData.data;

            // console.log(words);

            displayLevelWord(words);
        });
};

// show lessons
const displayLessons = (lessons) => {
    const levelContainer = document.querySelector('#level-container');
    levelContainer.innerHTML = '';

    lessons.forEach(lesson => {
        const level = lesson.level_no;

        levelContainer.innerHTML += `
            <button data-id="${level}" class="lesson-btn btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson - ${level}
            </button>
        `;
    });

    // send the level id to loadLevelWords()
    const lessonBtns = document.querySelectorAll('.lesson-btn');

    lessonBtns.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.dataset.id;
            loadLevelWords(id);
            btnActive(id);
        });
    });
};

// load lessons from api
const loadLessons = () => {
    const lessonUrl = 'https://openapi.programming-hero.com/api/levels/all';

    fetch(lessonUrl)
        .then(res => res.json())
        .then(jsonData => {
            const data = jsonData.data;

            displayLessons(data);
        });
};

// initialization
loadLessons();