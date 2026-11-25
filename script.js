
// ==========================================
// BEATRENT - JAVASCRIPT
// ==========================================

// EQUIPMENT DATA

const equipment = [
    { id: 1, name: "Professional PA Set", price: 1500 },
    { id: 2, name: "Wireless Microphone Set", price: 600 },
    { id: 3, name: "4-Channel Audio Mixer", price: 1000 },
    { id: 4, name: "LED Spotlight Pair", price: 800 },
    { id: 5, name: "Audio Cable Kit", price: 250 }
];

let selectedEquipment = [];

// HELPER FUNCTION

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

// ==========================================
// 1. EQUIPMENT CATEGORY FILTER
// ==========================================

const filterButtons = document.querySelectorAll(".filter-btn");
const equipmentCards = document.querySelectorAll(".equipment-card");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        const category = this.dataset.category;

        equipmentCards.forEach(card => {

            if (
                category === "all" ||
                card.dataset.category === category
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});

// ==========================================
// 2. ADD EQUIPMENT TO BOOKING
// ==========================================

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {

    button.addEventListener("click", function () {

        const id = Number(this.dataset.id);

        const item = equipment.find(product => product.id === id);

        const existingItem = selectedEquipment.find(
            product => product.id === id
        );

        if (existingItem) {

            alert("This equipment is already added!");

        } else {

            selectedEquipment.push(item);

            this.textContent = "Added ✓";

            this.style.background = "#83d89a";

        }

        updateCalculator();

    });

});

// ==========================================
// 3. RENTAL COST CALCULATOR
// ==========================================

const durationSelect = document.getElementById("duration");

function updateCalculator() {

    const duration = Number(durationSelect.value);

    let dailyAmount = 0;

    selectedEquipment.forEach(item => {
        dailyAmount += item.price;
    });

    const rentalAmount = dailyAmount * duration;

    const deposit = rentalAmount * 0.20;

    const totalAmount = rentalAmount + deposit;

    document.getElementById("selected-count").textContent =
        selectedEquipment.length + " items";

    document.getElementById("rental-amount").textContent =
        formatPrice(rentalAmount);

    document.getElementById("deposit-amount").textContent =
        formatPrice(deposit);

    document.getElementById("total-amount").textContent =
        formatPrice(totalAmount);

    // Update booking summary

    const summary = document.getElementById("booking-summary");

    if (selectedEquipment.length === 0) {

        summary.textContent = "No equipment selected yet.";

    } else {

        summary.innerHTML = selectedEquipment.map(item => {
            return `<p>${item.name} - ${formatPrice(item.price)}/day</p>`;
        }).join("");

    }

    document.getElementById("booking-total").textContent =
        formatPrice(totalAmount);

}

durationSelect.addEventListener("change", updateCalculator);

// ==========================================
// 4. BOOKING FORM
// ==========================================

const bookingForm = document.getElementById("booking-form");

const eventDate = document.getElementById("event-date");

// Prevent past dates

const today = new Date();

const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

eventDate.min = localDate;

bookingForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("customer-name").value;

    const date = eventDate.value;

    const venue = document.getElementById("venue").value;

    const technician = document.getElementById("technician").checked;

    const message = document.getElementById("message").value;

    const duration = Number(durationSelect.value);

    if (selectedEquipment.length === 0) {

        alert("Please select at least one equipment item.");

        return;

    }

    const dailyAmount = selectedEquipment.reduce(
        (sum, item) => sum + item.price, 0
    );

    const rentalAmount = dailyAmount * duration;

    const deposit = rentalAmount * 0.20;

    const totalAmount = rentalAmount + deposit;

    // Display booking confirmation

    const confirmation = `
        Booking Request Created!

        Name: ${name}
        Event Date: ${date}
        Venue: ${venue}
        Duration: ${duration} day(s)

        Equipment: ${selectedEquipment.map(item => item.name).join(", ")}

        Sound Technician: ${technician ? "Required" : "Not Required"}

        Rental Amount: ${formatPrice(rentalAmount)}
        Security Deposit: ${formatPrice(deposit)}
        Total Amount: ${formatPrice(totalAmount)}

        Additional Requirements: ${message || "None"}

        Note: This is a demo booking. No actual reservation or payment has been made.
    `;

    document.getElementById("booking-message").textContent =
        "Your demo booking request has been created successfully!";

    alert(confirmation);

    bookingForm.reset();

});

// ==========================================
// 5. RETURN CHECKLIST PROGRESS
// ==========================================

const returnChecks = document.querySelectorAll(".return-check");

const progressFill = document.getElementById("progress-fill");

const progressText = document.getElementById("progress-text");

function updateProgress() {

    const totalItems = returnChecks.length;

    let checkedItems = 0;

    returnChecks.forEach(check => {

        if (check.checked) {
            checkedItems++;
        }

    });

    const percentage = Math.round(
        (checkedItems / totalItems) * 100
    );

    progressFill.style.width = percentage + "%";

    progressText.textContent = percentage + "% Completed";

}

returnChecks.forEach(check => {

    check.addEventListener("change", updateProgress);

});

// ==========================================
// 6. GENERATE RETURN REPORT
// ==========================================

const generateButton = document.getElementById("generate-checklist");

generateButton.addEventListener("click", function () {

    const totalItems = returnChecks.length;

    let checkedItems = 0;

    returnChecks.forEach(check => {

        if (check.checked) {
            checkedItems++;
        }

    });

    const result = document.getElementById("checklist-result");

    if (checkedItems === totalItems) {

        result.innerHTML = `
            <div class="report-details">
                <h3>Return Report Generated</h3>
                <p>All ${totalItems} inspection checks are completed.</p>
                <p>Status: All checklist items marked as verified.</p>
                <p>Inspection: ${new Date().toLocaleString("en-IN")}</p>
            </div>
        `;

    } else {

        result.innerHTML = `
            <div class="report-details">
                <h3>Inspection Incomplete</h3>
                <p>${checkedItems} out of ${totalItems} checks completed.</p>
                <p>Please inspect and verify the remaining items.</p>
            </div>
        `;

    }

});
