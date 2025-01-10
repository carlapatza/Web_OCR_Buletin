const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const extractedTextDiv = document.getElementById('extractedText');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function processImage(dataUrl) {
    const img = new Image();
    img.onload = () => {
        // Perform OCR using Tesseract.js
        Tesseract.recognize(dataUrl, 'eng', {
            logger: info => console.log(info) // Optional logger
        })
        .then(({ data: { text } }) => {
            console.log("OCR processing complete: ", text); // Debugging log
            extractedTextDiv.textContent = text;
        })
        .catch(err => {
            console.error("Error during OCR processing: ", err);
            alert("Could not process the image. Please try again.");
        });
    };
    img.src = dataUrl;
}