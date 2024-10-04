// Polls related.
let pollCounter = 0;
const quantity = 10;
let pollElement = null;
let choiceElement = null;
let rowElement = null;

// Form related.
let choiceFieldCounter = 1;
let choiceFieldElement = null;

document.addEventListener('DOMContentLoaded', () => {
    // POLLS RELATED.

    // Save and remove choice and poll elements.
    choiceElement = document.querySelector('.col-6').cloneNode(true);
    document.querySelector('.col-6').remove();
    pollElement = document.querySelector('.poll').cloneNode(true);
    document.querySelector('.poll').remove();
    
    // Save row element.
    rowElement = pollElement.querySelector('.row').cloneNode(true);

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

    // Mark first 2 choice fields as required and add class to parent divs.
    try {
        const choiceField0 = document.querySelector("#id_choices-0-choice_text")
        choiceField0.required = true;
        choiceField0.parentElement.className = 'choice-field';
        const choiceField1 = document.querySelector("#id_choices-1-choice_text")
        choiceField1.required = true;
        choiceField1.parentElement.className = 'choice-field';
    } catch (error) {
        console.log(error);
    }

    try {
        // Save extra choice field div.
        const choiceFieldDiv = document.querySelector('#extra-choice-0');
        choiceFieldElement = choiceFieldDiv.cloneNode(true);
        choiceFieldElement.style.display = 'flex';
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
    } catch (error) {
        console.log(error);
    }
});

// POLLS RELATED

function loadPolls() {
    const start = pollCounter;
    const end = start + quantity;
    pollCounter = end + 1;

    const category = document.querySelector('#category-select').value;
    const order = document.querySelector('#order-select').value;

    fetch(`/polls?start=${start}&end=${end}&category=${category}&order=${order}`)
        .then(response => response.json())
        .then(data => {
            data.polls.forEach(addPoll);
        });
};

function addPoll(data) {
    const newPoll = pollElement.cloneNode(true);
    newPoll.style.display = 'block';
    // Set the question text.
    newPoll.querySelector('.question-text').innerHTML = data.question_text;
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
    newPoll.querySelector('.poll-pub-date').innerHTML = posted;
    // Set the category.
    newPoll.querySelector('.poll-category').innerHTML = data.category;
    // Set the id.
    newPoll.querySelector('#poll-id').value = data.id;
    // Append the new poll.
    document.querySelector('.polls').appendChild(newPoll);
};

function addChoices(pollId, choicesDiv) {
    // Get choices from backend.
    fetch(`/choices?poll_id=${pollId}`)
        .then(response => response.json())
        .then(data => {
            // Add each choice to the choices div.
            let choiceCounter = 0;
            let rowCounter = 2;
            data.choices.forEach((choice) => {
                // Every 2 choices add a row.
                if (choiceCounter != 0 && choiceCounter % 2 == 0) {
                    choicesDiv.appendChild(rowElement.cloneNode(true));
                    rowCounter++;
                }

                const newChoice = choiceElement.cloneNode(true);
                // Set choice's id.
                newChoice.querySelector('#choice-id').value = choice.id;
                // Set choice's text.
                newChoice.querySelector('#choice-text').innerHTML = choice.choice_text;
                // Set choice's status.
                if (choice.voted) {
                    newChoice.querySelector('.row').classList = 'row choice mx-auto voted';
                    newChoice.querySelector('#status').value = 'voted';
                    choicesDiv.querySelector('#status').value = 'voted';
                }

                choicesDiv.children[rowCounter].appendChild(newChoice);

                choiceCounter++;
                choicesDiv.querySelector('#empty').value = 'false';
            });

            if (choicesDiv.querySelector('#status').value != 'voted') {
                choicesDiv.querySelector('#status').value = 'unvoted';
            }

        });
}

function displayChoices(displayBtn) {
    const choicesDiv = displayBtn.parentNode.querySelector('.choices');

    // Add choices if empty.
    if (choicesDiv.querySelector('#empty').value == 'true') {
        const pollId = displayBtn.parentNode.querySelector('#poll-id').value;
        addChoices(pollId, choicesDiv);
    }

    // Show choices div.
    choicesDiv.style.display = 'grid';

    // Change btn to hideChoices.
    displayBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5m-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5"/></svg>';
    displayBtn.addEventListener('click', () => { hideChoices(displayBtn, choicesDiv); });
}

function hideChoices(displayBtn, choicesDiv) {
    choicesDiv.style.display = 'none';
    displayBtn.addEventListener('click', () => { displayChoices(displayBtn); });
    displayBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/></svg>';
}

function voteChoice(choiceDiv) {
    let behavior = 'vote';
    const choiceId = choiceDiv.querySelector('#choice-id').value;
    const pollDiv = choiceDiv.parentNode.parentNode.parentNode;

    // If choice is unvoted, mark it as voted and unvote other choices.
    if (choiceDiv.querySelector('#status').value == 'unvoted') {
        // Unvote other choices.
        if (pollDiv.querySelector('#status').value == 'voted') {
            const choices = pollDiv.querySelectorAll('.choice');
            choices.forEach((choice) => {
                choice.classList = 'row choice mx-auto';
                choice.querySelector('#status').value = 'unvoted';
            });
        }
        
        // Mark as voted.
        choiceDiv.classList = 'row choice mx-auto voted';
        choiceDiv.querySelector('#status').value = 'voted';
        pollDiv.querySelector('#status').value = 'voted';

    // If choice is voted, unvote it.
    } else {
        // Mark choice and poll as unvoted.
        choiceDiv.classList = 'row choice mx-auto';
        choiceDiv.querySelector('#status').value = 'unvoted';
        pollDiv.querySelector('#status').value = 'unvoted';
        behavior = 'unvote';
        // Hide percentages.
        // TODO
    }

    // Fetch the server with the voted choice.
    fetch(`/vote?choice_id=${choiceId}&behavior=${behavior}`)
        .then(response => response.json())
        .then(data => {
            // TODO Update percentages.
        });
}

function refreshPolls() {
    // Clear the polls section.
    document.querySelector('.polls').innerHTML = '';
    // Reset the polls counter.
    pollCounter = 0;
    // Display the new polls.
    loadPolls();
}

// FORM RELATED

function addExtraChoiceField(button) {
    // Add a new extra-choice field
    const newExtraChoiceField = choiceFieldElement.cloneNode(true);
    newExtraChoiceField.children[0].value = button.parentNode.children[0].value;
    choiceForm = document.querySelector('.choice-form');
    choiceForm.insertBefore(newExtraChoiceField, button.parentNode);

    // Update counters.
    choiceFieldElement.id = `extra-choice-${choiceFieldCounter}`;
    var regex = new RegExp(`choices-(\\d+)-`, 'g');
    choiceFieldElement.innerHTML = choiceFieldElement.innerHTML.replace(regex, `choices-${2 + choiceFieldCounter}-`);
    choiceFieldCounter++;
    document.querySelector('#id_choices-TOTAL_FORMS').value++;

    // Reset field value and disable button.
    button.parentNode.children[0].value = '';
    button.disabled = true;
};

function removeChoice(button) {
    button.parentNode.remove();
    document.querySelector('#id_choices-TOTAL_FORMS').value--;
    // Update the counters of the other choice fields.
    let counter = 0;
    document.querySelectorAll('.choice-field').forEach((choiceField) => {
        value = choiceField.children[0].value;
        var regex = new RegExp(`choices-(\\d+)-`, 'g');
        choiceField.innerHTML = choiceField.innerHTML.replace(regex, `choices-${counter}-`);
        choiceField.children[0].value = value;
        counter++;
    });
};

function displayRegister() {
    document.querySelector('#sign-in-form').style.display = 'none';
    document.querySelector('#register-form').style.display = 'block';
}

function displayLogin() {
    document.querySelector('#register-form').style.display = 'none';
    document.querySelector('#sign-in-form').style.display = 'block';
}