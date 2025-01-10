const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const infoBody = document.getElementById('infoBody');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
        alert("Could not access the camera. Please check your permissions.");
    });

// Capture image and process it
captureButton.addEventListener('click', () => {
    console.log("Capture button clicked"); // Debugging log
    if (video.srcObject) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        console.log("Image captured"); // Debugging log

        // Perform OCR
        Tesseract.recognize(
            canvas.toDataURL(),
            'eng',
            {
                logger: info => console.log(info) // Optional logger
            }
        ).then(({ data: { text } }) => {
            console.log("OCR processing complete"); // Debugging log
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