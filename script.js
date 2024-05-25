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
//                         document.getElementById('status').textContent = 'Inverted and brightened image copied to clipboard!';
//                     }).catch((err) => {
//                         console.error('Could not copy image: ', err);
//                     });
//                 });
//             };
//         }
//     }
// });
document.addEventListener('paste', async (event) => {
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
                    // Invert colors
                    data[j] = 255 - data[j];       // Red
                    data[j + 1] = 255 - data[j + 1]; // Green
                    data[j + 2] = 255 - data[j + 2]; // Blue

                    // Increase brightness to 100%
                    data[j] = Math.min(255, data[j] * 1.5);       // Red
                    data[j + 1] = Math.min(255, data[j + 1] * 1.5); // Green
                    data[j + 2] = Math.min(255, data[j + 2] * 1.5); // Blue
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
                        }, 5000);
                    }).catch((err) => {
                        console.error('Could not copy image: ', err);
                    });
                });
            };
        }
    }
});
