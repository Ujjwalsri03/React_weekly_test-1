const passwordOutput = document.getElementById('passwordOutput');
const lengthInput = document.getElementById('lengthInput');
const uppercaseCheckbox = document.getElementById('uppercase');
const copyButton = document.getElementById('copyPassword')
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generateBtn');


// Character sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

function generatePassword(e) {
    e.preventDefault();
    let passwordLength = parseInt(lengthInput.value);
    let passwordChars = '';
    let generatedPassword = '';

    // Check which options are selected
    if (uppercaseCheckbox.checked) passwordChars += uppercaseChars;
    if (lowercaseCheckbox.checked) passwordChars += lowercaseChars;
    if (numbersCheckbox.checked) passwordChars += numberChars;
    if (symbolsCheckbox.checked) passwordChars += symbolChars;

    // Ensure at least one option is selected
    if (passwordChars === '') {
        alert('Please select at least one character type.');
        return;
    }

    
    for (let i = 0; i < passwordLength; i++) {
        generatedPassword += passwordChars.charAt(Math.floor(Math.random() * passwordChars.length));
    }

    passwordOutput.value = generatedPassword;
}

function copyToClipboard() {
    const password = passwordOutput.value;

    if (password === '') {
        alert('No password to copy! Please generate a password first.');
        return;
    }

    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy password: ', err);
    });
}

generateBtn.addEventListener('click', generatePassword);
copyButton.addEventListener('click', copyToClipboard);
