function extractInfo(text) {
    console.log("Extracted text: ", text); // Debugging log
    const numeleMatch = text.match(/Numele:\s*(.*)/);
    const prenumeleMatch = text.match(/Prenumele:\s*(.*)/);
    const dobMatch = text.match(/Date of Birth:\s*(.*)/);

    const numele = numeleMatch ? numeleMatch[1] : 'Not found';
    const prenumele = prenumeleMatch ? prenumeleMatch[1] : 'Not found';
    const dob = dobMatch ? dobMatch[1] : 'Not found';

    // Update the table
    infoBody.innerHTML = `
        <tr>
            <td>${numele}</td>
            <td>${prenumele}</td>
            <td>${dob}</td>
        </tr>
    `;
}