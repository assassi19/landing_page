const UPI_ID = "uzairhassan778-3@okicici";
const UPI_NAME = "UZAIR_HASAN";

const tabs = document.querySelectorAll(".tab");

const panels = {
    india: document.getElementById("india-panel"),
    pakistan: document.getElementById("pakistan-panel")
};


// -----------------------------
// INDIA / PAKISTAN TAB SWITCHING
// -----------------------------

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const selected = tab.dataset.tab;

        tabs.forEach((item) => {
            const isActive = item.dataset.tab === selected;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-selected", String(isActive));
        });

        Object.entries(panels).forEach(([name, panel]) => {
            panel.classList.toggle("hidden", name !== selected);
        });
    });
});


// -----------------------------
// CREATE UPI PAYMENT URL
// -----------------------------

function makeUpiUrl(amount, purpose) {
    const cleanPurpose = purpose
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

    const params = new URLSearchParams({
        pa: UPI_ID,
        pn: UPI_NAME,
        am: amount,
        cu: "INR",
        tn: `For_${cleanPurpose}`
    });

    return `upi://pay?${params.toString()}`;
}


// -----------------------------
// DONATE BUTTONS
// -----------------------------

document.querySelectorAll(".donate-btn").forEach((button) => {

    button.addEventListener("click", () => {

        const card = button.closest(".donation-card");
        const input = card.querySelector("input");

        const purpose = button.dataset.purpose;
        const amount = Number(input.value);

        // Make sure amount was entered
        if (!amount || amount <= 0) {

            input.focus();

            input.setCustomValidity(
                "Please enter a donation amount."
            );

            input.reportValidity();

            return;
        }

        input.setCustomValidity("");

        // Create the UPI payment intent
        const upiUrl = makeUpiUrl(
            amount.toFixed(2),
            purpose
        );

        // Launch UPI app
        window.location.href = upiUrl;
    });

});


// -----------------------------
// CLEAR VALIDATION ERROR
// -----------------------------

document
    .querySelectorAll(".amount-input input")
    .forEach((input) => {

        input.addEventListener("input", () => {
            input.setCustomValidity("");
        });


        // Allow pressing Enter to donate
        input.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                const card = input.closest(".donation-card");

                card
                    .querySelector(".donate-btn")
                    .click();
            }

        });

    });


// -----------------------------
// COPY UPI ID
// -----------------------------

const copyButton = document.getElementById("copy-upi");

copyButton.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(UPI_ID);

        copyButton.textContent = "Copied";

        setTimeout(() => {
            copyButton.textContent = "Copy UPI ID";
        }, 1800);

    } catch {

        // Fallback for older browsers

        const temporaryInput =
            document.createElement("input");

        temporaryInput.value = UPI_ID;

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        document.execCommand("copy");

        temporaryInput.remove();

        copyButton.textContent = "Copied";

        setTimeout(() => {
            copyButton.textContent = "Copy UPI ID";
        }, 1800);
    }

});


// -----------------------------
// DOWNLOAD PAKISTAN QR
// -----------------------------

document
    .getElementById("download-qr")
    .addEventListener("click", () => {

        const qr =
            document.getElementById("pakistan-qr");

        const link =
            document.createElement("a");

        link.href = qr.src;

        link.download =
            "pakistan-donation-qr.png";

        document.body.appendChild(link);

        link.click();

        link.remove();
    });