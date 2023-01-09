//Dashboard Layout Helpers
homeDiv = document.getElementById('home');
statsDiv = document.getElementById('stats');
settingsDiv = document.getElementById('settings');

const showHome = () => {
    settingsDiv.style.display = 'none';
    statsDiv.style.display = 'none';
    homeDiv.style.display = 'block';
}

const showStats = () => {
    settingsDiv.style.display = 'none';
    statsDiv.style.display = 'block';
    homeDiv.style.display = 'none';
}

const showSettings = () => {
    settingsDiv.style.display = 'block';
    statsDiv.style.display = 'none';
    homeDiv.style.display = 'none';
}
document.getElementById('homeButton').addEventListener('click', showHome);
document.getElementById('settingsButton').addEventListener('click', showSettings);
document.getElementById('statsButton').addEventListener('click', showStats);
