const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const canvas = document.getElementById('canvas');
const infoBody = document.getElementById('infoBody');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function processImage(dataUrl) {
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        canvas.style.display = 'block';

        // Perform OCR using Tesseract.js
        Tesseract.recognize(
            canvas,
            'eng',
            {
                logger: info => console.log(info) // Optional logger
            }
        ).then(({ data: { text } }) => {
            console.log("OCR processing complete: ", text); // Debugging log
            extractInfo(text);
        }).catch(err => {
            console.error("Error during OCR processing: ", err);
            alert("Could not process the image. Please try again.");
        });
    };
    img.src = dataUrl;
}

// Extract information using regex
function extractInfo(text) {
    console.log("Extracted text: ", text); // Debugging log
    const nameMatch = text.match(/Name:\s*(.*)/);
    const vornameMatch = text.match(/Vorname:\s*(.*)/);
    const dobMatch = text.match(/Date of Birth:\s*(.*)/);

    const name = nameMatch ? nameMatch[1] : 'Not found';
    const vorname = vornameMatch ? vornameMatch[1] : 'Not found';
    const dob = dobMatch ? dobMatch[1] : 'Not found';

    // Update the table
    infoBody.innerHTML = `
        <tr>
            <td>${name}</td>
            <td>${vorname}</td>
            <td>${dob}</td>
        </tr>
    `;
}