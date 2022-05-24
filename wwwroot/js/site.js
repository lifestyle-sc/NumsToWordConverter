// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// UI variables
const UIForm = document.getElementById('form');
const UIWordCon = document.getElementById('word-convert');
const UIinput = document.getElementById('nums-input');
const UIparent = document.getElementById('parent');

// hashmap containing important variables

//single digits
const singleDigits = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
};

const doubleDigits = {
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'forteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
    18: 'eighteen',
    19: 'ninteen',
};

const tens = {
    2: 'twenty',
    3: 'thirty',
    4: 'forty',
    5: 'fifty',
    6: 'sixty',
    7: 'seventy',
    8: 'eighty',
    9: 'ninty',
};

const suffixes = {
    1: '',
    2: 'thousand',
    3: 'million',
    4: 'billion',
    5: 'trillion',
};

// other variables
const numberLimit = 1000000000000;

const convertToWords = (nums) => {
    let absNumbers = Math.abs(nums);
    let currentText = '';
    try {
        if (absNumbers > numberLimit) {
            throw "You've exceeded the numbers limit for this program, which is 1 Trillion, try a lesser number";
        }
    } catch (e) {
        let errorNode = document.createElement('span');
        errorNode.id = 'error';
        errorNode.classList.add('text-danger')
        errorNode.innerText = e;
        UIparent.insertBefore(errorNode, UIWordCon);

        setTimeout(() => {
            errorNode.remove();
        }, 3000);

        return 'AN ERROR OCCURRED';
    }

    if (nums.includes('-') && absNumbers !== 0) {
        currentText += 'negative ';
    }

    if (absNumbers in singleDigits) {
        currentText += singleDigits[absNumbers];
    } else if (absNumbers < 100) {
        currentText += twoDigitOrLessConvert(absNumbers);
    } else {
        //Split number into arrays that have a maximum length of
        //  three and get the result
        const numArray = splitNum(absNumbers.toString());

        let count = numArray.length;

        for (let i = 0; i < numArray.length; i++) {
            //  if array is not filled with 0's
            if (numArray[i] !== '000') {
                //numArray[i] represents the string value of the 3-digit-or-less block
                if (numArray[i].length === 3) {
                    currentText += threeDigitConvert(numArray[i]);
                    currentText += ' ' + suffixes[count] + ' ';
                } else {
                    currentText += twoDigitOrLessConvert(numArray[i]);
                    currentText += ' ' + suffixes[count] + ' ';
                }
                count--;
            } else {
                count--;
            }
        }
    }

    return currentText
};

const threeDigitConvert = (num) => {
    let intNum = parseInt(num);
    let currentNumText = '';

    //if number is 3 zeroes, return nothing
    if (num === '000') {
        return '';
    }

    //if number is less than 100, send it to the other converter
    if (intNum < 100) {
        currentNumText += twoDigitOrLessConvert(intNum);
        return currentNumText;
    }

    //create the place of the number
    //  e.g two hundred, five thousand, seven million
    currentNumText += singleDigits[num.charAt(0)];
    currentNumText += ' hundred ';

    //if the number ends with two zeros, don't add anything
    if (num.substr(1) !== '00') {
        //get the last two digits and convert them back to an
        //  integer
        currentNumText += 'and '
        currentNumText += twoDigitOrLessConvert(parseInt(num.toString().substr(1)));
    }

    return currentNumText;
};

const twoDigitOrLessConvert = (num) => {
    let intNum = parseInt(num);
    let currentNumText = '';

    if (intNum < 10) {
        return singleDigits[num];
    }

    //if num is in ones
    //  add its corresponding value to numText
    if (num in doubleDigits) {
        currentNumText += doubleDigits[num];
    } else {
        //use prefix to create any num 20-99
        currentNumText += tens[num.toString().charAt(0)];

        //if it does not end with 0, add the second digit
        if (num.toString().charAt(1) !== '0') {
            currentNumText += ' ' + singleDigits[num.toString().charAt(1)];
        }
    }

    return currentNumText;
};

const splitNum = (num) => {
    let numArray = [];
    let count = 0;

    let temp = '';

    let digits = num.length;

    //add these digits to array in groups of 3 or less
    for (let i = digits - 1; i >= 0; i--) {
        temp = num[i] + temp;
        count++;

        //if tempArray is filled, add it to the beginning
        //  of numArray and reset it
        if (count % 3 == 0) {
            numArray.unshift(temp);
            temp = '';
        }
    }

    //Add whatever is left ot numArray
    if (temp.length != 0) {
        numArray.unshift(temp);
    }

    //console.log(numArray)
    return numArray;
};

//event listener on form submit
UIForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let nums = UIinput.value;

    let convertedText = convertToWords(nums);
    convertedText = convertedText.toUpperCase()

    UIinput.value = '';

    UIWordCon.innerHTML = `
    <div class="card mt-3">
  <div class="card-body">
    <div class="d-flex justify-content-between">
        <h5 class="card-title">Converted Number</h5>
        <h5 id="close" class="text-danger" style="cursor: pointer">X</h5>
    </div>
    <p class="card-text">Number to be Converted: <span class="font-weight-bold"> ${nums}</span></p>
    <p class="card-text">Converted Number: <span class="font-weight-bold"> ${convertedText}</span></p>
  </div>
</div>
` + UIWordCon.innerHTML;
});

UIWordCon.addEventListener('click', (e) => {
    if (e.target.id === "close") {
        e.target.parentElement.parentElement.parentElement.remove()
    }
})

