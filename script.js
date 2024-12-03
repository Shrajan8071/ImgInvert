document.addEventListener('DOMContentLoaded', () => {
    const usageLimit = 10;
    const usageKey = 'imageInverterUsage';
    const usageCountElement = document.getElementById('usage-count');
    const modal = document.getElementById('payment-modal');
    const paymentDetailsModal = document.getElementById('payment-details-modal');
    const donePaymentButton = document.getElementById('done-payment');
    const noPaymentButton = document.getElementById('no-payment');
    const paymentForm = document.getElementById('payment-form');

    // Replace this URL with your Google Apps Script Web App URL
    const googleSheetsURL = 'https://script.google.com/macros/s/AKfycbzi6nOpr4aIz9ZYEgvXAsD0v09XcEi9Jzo-Dt8tN9NvGQbAhfR33WvNe78MefRGbxKy/exec';

    // Variables to store payment details
    let paymentDetails = {
        name: '',
        amount: '',
        mode: ''
    };

    let usageCount = parseInt(localStorage.getItem(usageKey)) || 0;
    updateUsageDisplay();

    if (usageCount >= usageLimit) {
        showModal();
    }

    document.addEventListener('paste', (event) => {
        if (usageCount >= usageLimit) {
            showModal();
            return;
        }

        usageCount++;
        localStorage.setItem(usageKey, usageCount);
        updateUsageDisplay();
        processImage(event);
        setTimeout(() => {
            location.reload();
        }, 500);
    });

    function processImage(event) {
        const clipboardItems = event.clipboardData.items;
        for (let i = 0; i < clipboardItems.length; i++) {
            if (clipboardItems[i].type.indexOf('image') !== -1) {
                const blob = clipboardItems[i].getAsFile();
                const img = new Image();
                img.src = URL.createObjectURL(blob);

                img.onload = async () => {
                    const canvas = document.getElementById('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    for (let j = 0; j < data.length; j += 4) {
                        data[j] = 255 - data[j];
                        data[j + 1] = 255 - data[j + 1];
                        data[j + 2] = 255 - data[j + 2];
                        data[j] = Math.min(255, data[j] * 1.5);
                        data[j + 1] = Math.min(255, data[j + 1] * 1.5);
                        data[j + 2] = Math.min(255, data[j + 2] * 1.5);
                    }

                    ctx.putImageData(imageData, 0, 0);
                    canvas.toBlob((blob) => {
                        const item = new ClipboardItem({ 'image/png': blob });
                        navigator.clipboard.write([item]).then(() => {
                            const statusElement = document.getElementById('status');
                            statusElement.textContent = 'Inverted and brightened image copied to clipboard!';
                            statusElement.style.visibility = 'visible';
                            setTimeout(() => {
                                statusElement.style.visibility = 'hidden';
                            }, 3000);
                        }).catch((err) => {
                            console.error('Could not copy image: ', err);
                        });
                    });
                };
            }
        }
    }

    function updateUsageDisplay() {
        const remainingUses = Math.max(0, usageLimit - usageCount);
        usageCountElement.textContent = remainingUses;
    }

    function showModal() {
        modal.classList.remove('hidden');
    }

    function showPaymentDetailsModal() {
        modal.classList.add('hidden');
        paymentDetailsModal.classList.remove('hidden');
    }

    donePaymentButton.addEventListener('click', () => {
        showPaymentDetailsModal();
    });

    noPaymentButton.addEventListener('click', () => {
        alert('Please complete the payment to continue using the site.');
        modal.classList.remove('hidden');
    });

    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        paymentDetails.name = document.getElementById('name').value;
        paymentDetails.amount = document.getElementById('amount').value;
        paymentDetails.mode = document.getElementById('payment-mode').value;

        await sendDataToGoogleSheets(paymentDetails);

        usageCount = 0;
        localStorage.setItem(usageKey, usageCount);
        updateUsageDisplay();
        paymentDetailsModal.classList.add('hidden');
        alert('Thank you for your support! You can now use the service again.');
    });

    async function sendDataToGoogleSheets(details) {
        try {
            const response = await fetch(googleSheetsURL, {
                method: 'POST',
                body: JSON.stringify(details),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'  // Bypass CORS
            });
            

            const result = await response.json();
            if (result.status === 'success') {
                console.log('Data successfully sent to Google Sheets.');
            }
        } catch (error) {
            console.error('Error sending data to Google Sheets:', error);
        }
    }
});

// document.addEventListener('paste', async (event) => {
//     const clipboardItems = event.clipboardData.items;
//     for (let i = 0; i < clipboardItems.length; i++) {
//         if (clipboardItems[i].type.indexOf('image') !== -1) {
//             const blob = clipboardItems[i].getAsFile();
//             const img = new Image();
//             img.src = URL.createObjectURL(blob);

//             img.onload = async () => {
//                 const canvas = document.getElementById('canvas');
//                 const ctx = canvas.getContext('2d');
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 ctx.drawImage(img, 0, 0);

//                 const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//                 const data = imageData.data;

//                 for (let j = 0; j < data.length; j += 4) {
//                     // Invert colors
//                     data[j] = 255 - data[j];       // Red
//                     data[j + 1] = 255 - data[j + 1]; // Green
//                     data[j + 2] = 255 - data[j + 2]; // Blue

//                     // Increase brightness to 100%
//                     data[j] = Math.min(255, data[j] * 1.5);       // Red
//                     data[j + 1] = Math.min(255, data[j + 1] * 1.5); // Green
//                     data[j + 2] = Math.min(255, data[j + 2] * 1.5); // Blue
//                 }

//                 ctx.putImageData(imageData, 0, 0);
//                 canvas.toBlob((blob) => {
//                     const item = new ClipboardItem({ 'image/png': blob });
//                     navigator.clipboard.write([item]).then(() => {
//                         const statusElement = document.getElementById('status');
//                         statusElement.textContent = 'Inverted and brightened image copied to clipboard!';
//                         statusElement.style.visibility = 'visible';
//                         setTimeout(() => {
//                             statusElement.style.visibility = 'hidden';
//                         }, 5000);
//                     }).catch((err) => {
//                         console.error('Could not copy image: ', err);
//                     });
//                 });
//             };
//         }
//     }
// });
