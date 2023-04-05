const form = document.querySelector('form');
const spinner = document.querySelector('.spinner');
const button = document.querySelector('[type="submit"]');
const template = document.querySelector('#keyword-template');
const keywordsContainer = document.querySelector('.keywords-container');
document
    .querySelector('.keywords > button')
    .addEventListener('click', () => addKeywordInput());
const now = new Date();
const nextMonth = new Date();
nextMonth.setDate(nextMonth.getDate() + 30);

document.querySelector('#timestamp').min = `${
    now.toISOString().split('T')[0]
}T${now.toLocaleTimeString().slice(0, -3)}`;

document.querySelector('#timestamp').max = `${
    nextMonth.toISOString().split('T')[0]
}T${nextMonth.toLocaleTimeString().slice(0, -3)}`;

function handleOnKeyPress(e) {
    if (e.code === 'Enter') {
        e.preventDefault();
        addKeywordInput(document.querySelector(`#${e.target.dataset.id}`));
    }
}

function removeKeywordInputGroup(container) {
    if (keywordsContainer.children.length > 1) {
        container.previousElementSibling?.querySelector('input').focus();
        container.remove();
    } else {
        container.querySelector('input').focus();
    }
}

function handleOnKeyDown(e) {
    const id = e.target.dataset.id;
    const container = document.querySelector(`#${id}`);
    switch (e.keyCode) {
        case 8: // Backspace
            if (e.target.value.length === 0) {
                removeKeywordInputGroup(container);
            }
            break;
        case 38: // Up arrow
            container.previousElementSibling?.querySelector('input').focus();
            break;
        case 40: // Down arrow
            container.nextElementSibling?.querySelector('input').focus();
            break;
    }
}

function handlePaste(e) {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData.getData('text');
    pastedText.split('\n').forEach(line => {
        addKeywordInput(undefined, line);
    });
    removeKeywordInputGroup(document.querySelector(`#${e.target.dataset.id}`));
}

function addKeywordInput(element, text = '') {
    const keyword = template.cloneNode(true).content;
    const id = `a${crypto.randomUUID()}`;

    keyword.querySelector('div').id = id;

    const input = keyword.querySelector('input');
    input.addEventListener('keypress', handleOnKeyPress);
    input.addEventListener('keydown', handleOnKeyDown);
    input.addEventListener('paste', handlePaste);
    input.dataset.id = id;
    input.value = text;

    keyword.querySelector('button').addEventListener('click', () => {
        removeKeywordInputGroup(document.querySelector(`#${id}`));
    });

    if (element) element.after(keyword);
    else keywordsContainer.appendChild(keyword);
    input.focus();
}

function getKeywords() {
    const inputs = [...document.querySelectorAll('.keywords-container input')];
    const filteredInputs = inputs.filter(input => input.value.length > 0);
    if (filteredInputs.length === 0) return false;

    return filteredInputs.map(input => input.value);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data.keywords = getKeywords();
    if (!data.keywords) return alert('Type at least one keyword');
    data.unix_timestamp = +new Date(data.timestamp);

    spinner.classList.remove('hide');
    button.classList.add('hide');
    document
        .querySelectorAll('select, input, button')
        .forEach(element => (element.disabled = true));
    fetch('/confirmation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.text())
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        });
});

addKeywordInput();
