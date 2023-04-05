const publishBtn = document.querySelector('#publish-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const spinner = document.querySelector('.spinner');
const time = document.querySelector('#time');
const relativeTime = document.querySelector('#relative-time');
const unixTimestamp = +localStorage.getItem('unix_timestamp');
const confirmationContainer = document.querySelector('.confirmation');

function getRelativeTime(unixTimestamp) {
    const now = Date.now();
    const diff = now - unixTimestamp;

    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const seconds = Math.abs(Math.round(diff / 1000));
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (diff > 0) {
        // Timestamp is in the past
        if (seconds < 60) {
            return rtf.format(-seconds, 'second');
        } else if (minutes < 60) {
            return rtf.format(-minutes, 'minute');
        } else if (hours < 24) {
            return rtf.format(-hours, 'hour');
        } else {
            return rtf.format(-days, 'day');
        }
    } else {
        // Timestamp is in the future
        if (seconds < 60) {
            return rtf.format(seconds, 'second');
        } else if (minutes < 60) {
            return rtf.format(minutes, 'minute');
        } else if (hours < 24) {
            return rtf.format(hours, 'hour');
        } else {
            return rtf.format(days, 'day');
        }
    }
}

time.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}).format(new Date(unixTimestamp));
relativeTime.textContent = getRelativeTime(unixTimestamp);

publishBtn.addEventListener('click', e => {
    publishBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    spinner.classList.remove('hide');
    const data = {
        tweet: localStorage.getItem('tweet'),
        unix_timestamp: localStorage.getItem('unix_timestamp'),
    };
    fetch('/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(() => {
            alert('Success');
        })
        .finally(() => {
            spinner.classList.add('hide');
            confirmationContainer.classList.add('hide');
            location.reload();
        });
});

cancelBtn.addEventListener('click', () => location.reload());
