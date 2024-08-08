let counter = 0;
const quantity = 10;

document.addEventListener('DOMContentLoaded', () => {
    load_questions();
    const polls = document.querySelector('.polls');
    polls.onscroll = () => {
        // Check if we're at the bottom
        if (polls.scrollTop + polls.clientHeight >= polls.scrollHeight) {
            load_questions();
        }
    }
});

function load_questions() {
    const start = counter;
    const end = start + quantity;
    counter = end + 1;

    fetch(`/questions?start=${start}&end=${end}`) 
    .then(response => response.json())
    .then(data => {
        data.questions.forEach(add_question);
    })
};

function add_question(data) {
    const poll = document.createElement('div');
    poll.className = 'poll';

    const question = document.createElement('div');
    question.className = 'question';
    
    const question_text = document.createElement('h3');
    question_text.className = 'question-text';
    question_text.innerHTML = data.question_text
    question.append(question_text);

    const question_pub_date = document.createElement('h5');
    question_pub_date.className = 'question-pub-date';
    question_pub_date.innerHTML = data.pub_date;
    question.append(question_pub_date);

    const question_category = document.createElement('h4');
    question_category.className = 'question-category';
    question_category.innerHTML = data.category;
    question.append(question_category);

    poll.append(question);

    document.querySelector('.polls').append(poll);
};