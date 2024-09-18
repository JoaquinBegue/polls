// Polls related.
let pollCounter = 0;
const quantity = 10;
let pollDivCopy = '';
let choiceDivCopy = '';
let rowDivCopy = '';

// Form related.
let choiceFieldCounter = 1;
let choiceFieldDivCopy = '';

document.addEventListener('DOMContentLoaded', () => { 
    // POLLS RELATED.

    // Save and remove choice element.
    choiceDivCopy = document.querySelector('.choices').children[2].children[0].cloneNode(true);
    document.querySelector('.choices').children[2].children[0].remove();
    // Save row element.
    rowDivCopy = document.querySelector('.choices').children[2].cloneNode(true);
    
    // Save poll and poll-choices elements.
    const pollDiv = document.querySelector('.poll');
    pollDivCopy = pollDiv.cloneNode(true);
    pollDivCopy.style.display = 'block';
    pollDiv.remove();

    // Load first 10 polls.
    loadPolls();

    // Listen for scroll to load more polls.
    const polls = document.querySelector('.polls');
    polls.onscroll = () => {
        // Check if we're at the bottom.
        if (polls.scrollTop + polls.clientHeight >= polls.scrollHeight) {
            loadPolls();
        }
    };


    // FORM RELATED.

    // Mark first 2 choice fields as required.
    document.querySelector("#id_choice_set-0-choice_text").required = true;
    document.querySelector("#id_choice_set-1-choice_text").required = true;
    
    // Save extra choice field div.
    const choiceFieldDiv = document.querySelector('#extra-choice-0');
    choiceFieldDivCopy = choiceFieldDiv.cloneNode(true);
    choiceFieldDivCopy.style.display = 'flex';
    choiceFieldDiv.remove();

    // Enable add choice button if field isn't empty.
    const addChoiceFieldDiv = document.querySelector('#add-extra-choice');
    addChoiceFieldDiv.children[0].addEventListener('input', () => {
        if (addChoiceFieldDiv.children[0].value.trim() != '') {
            addChoiceFieldDiv.children[1].disabled = false;
        } else {
            addChoiceFieldDiv.children[1].disabled = true;
        }    
    });
});

// POLLS RELATED

function loadPolls() {
    const start = pollCounter;
    const end = start + quantity;
    pollCounter = end + 1;

    fetch(`/questions?start=${start}&end=${end}`) 
    .then(response => response.json())
    .then(data => {
        data.questions.forEach(addQuestion);
    });
};

function addQuestion(data) {
    const newPoll = pollDivCopy.cloneNode(true);
    // Set the question text.
    newPoll.children[0].children[0].innerHTML = data.question_text;
    // Set the publication date.
    const pubDate = new Date(data.pub_date);
    const now = new Date();
    const delta = now.getTime() - pubDate.getTime();
    let posted = '';
    switch (true) {
        // More than a week.
        case delta > 1000 * 60 * 60 * 24 * 7:
            posted = `Posted on ${pubDate.getDate()}/${pubDate.getMonth()}/${pubDate.getFullYear()}.`;
            break;
        // Less than a minute.
        case delta < 1000 * 60:
            posted = `Posted ${Math.round(delta / 1000)} seconds ago.`;
            break;
        // Less than a hour.
        case delta < 1000 * 60 * 60:
            posted = `Posted ${Math.round(delta / (1000 * 60))} minutes ago.`;
            break;
        // Less than a day.
        case delta < 1000 * 60 * 60 * 24:
            posted = `Posted ${Math.round(delta / (1000 * 60 * 60))} hours ago.`;
            break;
        // Less than a week.
        case delta < 1000 * 60 * 60 * 24 * 7:
            posted = `Posted ${Math.round(delta / (1000 * 60 * 60 * 24))} days ago.`;
            break;
    }
    newPoll.children[0].children[1].innerHTML = posted;
    // Set the category.
    newPoll.children[0].children[2].innerHTML = data.category;
    // Set the id.
    newPoll.children[0].children[3].value = data.id;
    // Append the new poll.
    document.querySelector('.polls').appendChild(newPoll);
};

function displayChoices(displayBtn) {
    let choiceFieldCounter = 0
    let rowCounter = 2
    const pollDiv = displayBtn.parentNode;
    const choicesDiv = pollDiv.children[1];

    // Add choices if empty.
    if (choicesDiv.children[0].value == 'empty') {
        const questionId = pollDiv.children[0].children[3].value;
        fetch(`/choices?question_id=${questionId}`) 
        .then(response => response.json())
        .then(data => {
            data.choices.forEach((choice) => {
            // Every 2 choices add a row.
            if (choiceFieldCounter != 0 && choiceFieldCounter % 2 == 0) {
                choicesDiv.appendChild(rowDivCopy.cloneNode(true));
                rowCounter ++;
            }
    
            const newChoice = choiceDivCopy.cloneNode(true);
            newChoice.children[0].children[1].children[0].innerHTML = choice.choice_text;
            choicesDiv.children[rowCounter].appendChild(newChoice);
    
            choiceFieldCounter ++;
            choicesDiv.children[0].value = 'filled';
            });
        });
    }

    choicesDiv.style.display = 'grid'

    // Change btn to hideChoices.
    displayBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5m-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5"/></svg>';
    displayBtn.addEventListener('click', () => {hideChoices(displayBtn, choicesDiv)});
}

function hideChoices(displayBtn, choicesDiv) {
    choicesDiv.style.display = 'none';
    displayBtn.addEventListener('click', () => {displayChoices(displayBtn)});
    displayBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/></svg>';
}

function voteChoice(choiceDiv) {
    const pollDiv = choiceDiv.parentNode.parentNode.parentNode;
    // Change styling to mark choice as voted.
    // If choice is unvoted, mark it as voted and unvote other choices.
    if (choiceDiv.children[0].value == 'unvoted') {
        // Unvote other choices.
        if (pollDiv.children[1].value != 'unvoted') {
            const choices = pollDiv.querySelectorAll('.choice');
            choices.forEach((choice) => {
                choice.classList = 'row choice mx-auto';
                choice.children[0].value = 'unvoted';
            });
        }
        // Mark as voted.
        choiceDiv.classList += ' voted';
        choiceDiv.children[0].value = 'voted';
        pollDiv.children[1].value = 'voted';
    // If choice is voted, unvote it.
    } else {
        // Mark choice and poll as unvoted.
        choiceDiv.classList = 'row choice mx-auto';
        choiceDiv.children[0].value = 'unvoted';
        pollDiv.children[1].value = 'unvoted';

        // Hide percentages.
        // TODO
    }

    // Fetch the server with the voted choice.
    // TODO First, add authentication system.
}

// FORM RELATED

function addExtraChoiceField(button) {
    // Add a new extra-choice field
    const newExtraChoiceField = choiceFieldDivCopy.cloneNode(true);
    newExtraChoiceField.children[0].value = button.parentNode.children[0].value;
    choiceForm = document.querySelector('.choice-form');
    choiceForm.insertBefore(newExtraChoiceField, button.parentNode);
    
    // Update counters.
    choiceFieldDivCopy.id = `extra-choice-${choiceFieldCounter}`
    var regex = new RegExp(`choice_set-(\\d+)-`, 'g');
    choiceFieldDivCopy.innerHTML = choiceFieldDivCopy.innerHTML.replace(regex, `choice_set-${2 + choiceFieldCounter}-`);
    choiceFieldCounter ++;
    document.querySelector('#id_choice_set-TOTAL_FORMS').value ++;

    // Reset field value and disable button.
    button.parentNode.children[0].value = '';
    button.disabled = true;
};

function removeChoice(button) {
    button.parentNode.remove();
    document.querySelector('#id_choice_set-TOTAL_FORMS').value --;
};