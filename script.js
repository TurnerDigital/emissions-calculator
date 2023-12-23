// Get references to the input elements
const vehicleTypeInput = document.getElementById('vehicle-type');
const vehicleCountInput = document.getElementById('vehicle-count-input');
const gasInput = document.getElementById('gas-radio');
const dieselInput = document.getElementById('diesel-radio');
const milesInput = document.getElementById('annual-miles');
const yearsInput = document.getElementById('years-of-service');
const mpgInput = document.getElementById('mpg');
const co2eLbsElement = document.getElementById('co2e-lbs');
co2eLbsElement.textContent = '- -';
const co2eLbsTree = document.getElementById('co2e-lbs-trees')

// Vehicle MPG values based on type and fuel
const mpgValues = {
    gas: {
        car: 27,
        suv: 25,
        van: 15,
        pickup: 17,
        truck: 8
    },
    diesel: {
        car: 32,
        suv: 30,
        van: 20,
        pickup: 22,
        truck: 12
    }
};

// Retrieve the CH4 value based on the selected vehicle type and fuel
function getCH4Value(vehicleType, fuel) {
    const ch4Values = {
        gas: {
            car: 0.0050,
            suv: 0.0079,
            van: 0.0079,
            pickup: 0.0079,
            truck: 0.0328
        },
        diesel: {
            car: 0.0302,
            suv: 0.0290,
            van: 0.0290,
            pickup: 0.0290,
            truck: 0.0095
        }
    };
    return ch4Values[fuel][vehicleType];
}

// Retrieve the N2O value based on the selected vehicle type and fuel
function getN2OValue(vehicleType, fuel) {
    const n2oValues = {
        gas: {
            car: 0.0014,
            suv: 0.0012,
            van: 0.0012,
            pickup: 0.0012,
            truck: 0.0098
        },
        diesel: {
            car: 0.0192,
            suv: 0.0214,
            van: 0.0214,
            pickup: 0.0214,
            truck: 0.0431
        }
    };
    return n2oValues[fuel][vehicleType];
}


function calculateEmissions() {
    const vehicleType = vehicleTypeInput.value;
    const fuel = gasInput.checked ? 'gas' : dieselInput.checked ? 'diesel' : '';

    if (fuel === '') {
        return; // Early return if no fuel type is selected
    }

    let vehicleCount = parseFloat(vehicleCountInput.value) || 1;
    const annualMiles = parseFloat(milesInput.value);
    const yearsOfService = parseFloat(yearsInput.value);
    const mpg = parseFloat(mpgInput.value);

    const ch4 = getCH4Value(vehicleType, fuel);
    const n2o = getN2OValue(vehicleType, fuel);
    const co2LbsGas = fuel === 'gas' ? 19.3565866 : 22.509197;

    const milesDriven = annualMiles * yearsOfService;
    const totalGallons = milesDriven / mpg;

    const ch4Lbs = ((milesDriven * ch4) * 25) * 0.00220462;
    const n2oLbs = ((milesDriven * n2o) * 298) * 0.00220462;
    const co2Lbs = totalGallons * co2LbsGas;

    const co2eLbsBeforeCount = co2Lbs + ch4Lbs + n2oLbs;
    const co2eLbs = co2eLbsBeforeCount * vehicleCount;

    if (isNaN(co2eLbs)) {
        vehicleTypeInput.classList.add('invalid-input');
        co2eLbsElement.textContent = '- -';
        co2eLbsTree.textContent = '- -';
        return; // Early return on NaN
    }


    vehicleTypeInput.classList.remove('invalid-input');
    co2eLbsElement.textContent = Math.round(co2eLbs).toLocaleString("en-US");

    const co2eLbsTrees = co2eLbs / 48; // tree calc
    co2eLbsTree.textContent = isNaN(co2eLbsTrees) ? '- -' : Math.round(co2eLbsTrees).toLocaleString("en-US");
}

// Reset Drop Down Color
vehicleTypeInput.addEventListener("click", function () {
    let vehicle = vehicleTypeInput.value
    if (vehicle !== '') {
        this.style.color = "#393939";
    }
});

// *** Vehicle Count Increment & Decrement Button Functions and Handlers *** //
const countUpBtn = document.getElementById("vehicle-count-up-btn");
const countDownBtn = document.getElementById("vehicle-count-down-btn");

countUpBtn.addEventListener("click", function () {
    incrementCount();
    calculateEmissions();
});

countDownBtn.addEventListener("click", function () {
    decrementCount();
    calculateEmissions();
});

countUpBtn.addEventListener("mouseenter", () => (countUpBtn.style.backgroundColor = "var(--black-50)"));
countUpBtn.addEventListener("mouseleave", () => (countUpBtn.style.backgroundColor = ""));
countDownBtn.addEventListener("mouseenter", () => (countDownBtn.style.backgroundColor = "var(--black-50)"));
countDownBtn.addEventListener("mouseleave", () => (countDownBtn.style.backgroundColor = ""));

function incrementCount() {
    let currentValue = parseInt(vehicleCountInput.value, 10) || 0; // Handle empty input
    if (currentValue < 999) {
        vehicleCountInput.value = currentValue + 1;
    }
}

function decrementCount() {
    let currentValue = parseInt(vehicleCountInput.value, 10) || 0; // Handle empty input
    if (currentValue > 1) {
        vehicleCountInput.value = currentValue - 1;
    }
}

//slider Display Function
const allRanges = document.querySelectorAll(".slider-group");
allRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".slider-value");

    range.addEventListener("input", () => {
        setBubble(range, bubble);
    });
    setBubble(range, bubble);
});

function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

//Toggle output description using onclick of output buttons
function toggleInfo(e) {
    let infoBlockId = e;
    let infoBlock = document.getElementById(infoBlockId);
    let isInfoBlockVisible = infoBlock.style.display === 'block';

    // Hide all other info-blocks except the clicked info-block
    let allInfoBlocks = document.querySelectorAll('.info-block');
    allInfoBlocks.forEach(block => {
        if (block.id !== infoBlockId) {
            block.style.display = 'none';
        }
    });

    // Toggle the display property of the clicked info-block
    infoBlock.style.display = isInfoBlockVisible ? 'none' : 'block';
}


//   *** EVENT LISTENERS *** ///
// Create a common event handler for the input change events
function handleInputChange() {
    let selectedVehicleType = vehicleTypeInput.value;
    let fuel = gasInput.checked ? 'gas' : 'diesel';
    mpgInput.value = mpgValues[fuel][selectedVehicleType];
    setBubble(mpgInput, document.getElementById('mpg-value'));
    calculateEmissions();
}

// Add event listeners to the elements
vehicleTypeInput.addEventListener('change', handleInputChange);
gasInput.addEventListener('change', handleInputChange);
dieselInput.addEventListener('change', handleInputChange);
vehicleCountInput.addEventListener('input', calculateEmissions);
mpgInput.addEventListener('input', calculateEmissions);
milesInput.addEventListener('input', calculateEmissions);
yearsInput.addEventListener('input', calculateEmissions);