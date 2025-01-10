const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const infoBody = document.getElementById('infoBody');

// Access the camera
// Access the camera
navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } }
})
    .then(stream => {
        video.srcObject = stream;
        console.log("Camera stream successfully loaded"); // Debugging log
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err.name, err.message);
        alert(`Could not access the camera: ${err.name}. Please check your permissions and ensure your browser is using HTTPS.`);
    });
// Funktion zur Verbesserung der Bildqualität
function enhanceImage(context, canvas) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Erhöhe den Kontrast
    const contrast = 40; // Erhöhe den Kontrast um 40%
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;     // Rot
        data[i+1] = factor * (data[i+1] - 128) + 128; // Grün
        data[i+2] = factor * (data[i+2] - 128) + 128; // Blau
    }

    context.putImageData(imageData, 0, 0);
}

// Capture image and process it
captureButton.addEventListener('click', () => {
    console.log("Capture button clicked"); // Debugging log
    if (video.srcObject) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        console.log("Image captured"); // Debugging log

        // Verbesserung der Bildqualität
        enhanceImage(context, canvas);

        // Make the canvas visible
        canvas.style.display = 'block';

        // Convert canvas to data URL and log it
        const dataURL = canvas.toDataURL();
        console.log("Canvas Data URL: ", dataURL); // Debugging log

        // Perform OCR
        Tesseract.recognize(
            dataURL,
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
    } else {
        alert("Video stream is not available. Please check your camera.");
    }
});

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