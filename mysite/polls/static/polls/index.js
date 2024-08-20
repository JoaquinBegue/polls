// Polls related.
let pollCounter = 0;
const quantity = 10;
let pollDivCopy = '';

// Form related.
let choiceCounter = 1;
let choiceDivCopy = '';

document.addEventListener('DOMContentLoaded', () => { 
    // POLLS RELATED.

    // Save poll div.
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
    
    // Save extra choice div.
    const choiceDiv = document.querySelector('#extra-choice-0');
    choiceDivCopy = choiceDiv.cloneNode(true);
    choiceDivCopy.style.display = 'flex';
    choiceDiv.remove();

    // Enable add choice button if field isn't empty.
    const addChoiceDiv = document.querySelector('#add-extra-choice');
    addChoiceDiv.children[0].addEventListener('input', () => {
        if (addChoiceDiv.children[0].value.trim() != '') {
            addChoiceDiv.children[1].disabled = false;
        } else {
            addChoiceDiv.children[1].disabled = true;
        }    
    });
});

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
            posted = `Posted on ${pubDate.getMonth()} ${pubDate.getDate()}, ${pubDate.getFullYear()}.`;
        // Less than a minute.
        case delta < 1000 * 60:
            posted = `Posted ${Math.round(delta / 1000)} seconds ago.`;
        // Less than a hour.
        case delta < 1000 * 60 * 60:
            posted = `Posted ${Math.round(delta / (1000 * 60))} minutes ago.`;
        // Less than a day.
        case delta < 1000 * 60 * 60 * 24:
            posted = `Posted ${Math.round(delta / (1000 * 60 * 60))} hours ago.`;
        // Less than a week.
        case delta < 1000 * 60 * 60 * 24 * 7:
            posted = `Posted ${Math.round(delta / (1000 * 60 * 60 * 24))} days ago.`;
    }
    newPoll.children[0].children[1].innerHTML = posted;
    // Set the category
    newPoll.children[0].children[2].innerHTML = data.category;
    // Append the new poll.
    document.querySelector('.polls').appendChild(newPoll);
};

function addExtraChoice(button) {
    // Add a new extra-choice field
    const newExtraChoice = choiceDivCopy.cloneNode(true);
    newExtraChoice.children[0].value = button.parentNode.children[0].value;
    choiceForm = document.querySelector('.choice-form');
    choiceForm.insertBefore(newExtraChoice, button.parentNode);
    
    // Update counters.
    choiceDivCopy.id = `extra-choice-${choiceCounter}`
    var regex = new RegExp(`choice_set-(\\d+)-`, 'g');
    choiceDivCopy.innerHTML = choiceDivCopy.innerHTML.replace(regex, `choice_set-${2 + choiceCounter}-`);
    choiceCounter ++;
    document.querySelector('#id_choice_set-TOTAL_FORMS').value ++;

    // Reset field value and disable button.
    button.parentNode.children[0].value = '';
    button.disabled = true;
};

function removeChoice(button) {
    button.parentNode.remove();
    document.querySelector('#id_choice_set-TOTAL_FORMS').value --;
};