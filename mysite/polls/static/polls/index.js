let counter = 0;
const quantity = 10;

document.addEventListener('DOMContentLoaded', load_questions);

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

function add_question(question) {
    console.log(question);
};