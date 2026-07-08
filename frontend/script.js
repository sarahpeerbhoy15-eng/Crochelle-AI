const generatorCard = document.getElementById("generator-card");
const returnHome = document.getElementById("return-home");
const homeWorkspace = document.getElementById("home-workspace");
const generatorWorkspace = document.getElementById("generator-workspace");
const willowMessage = document.getElementById("willow-message");
const homePanel = document.getElementById("home-panel");
const generatorPanel = document.getElementById("generator-panel");
const patternResult = document.getElementById("pattern-result");
const generatorWindow = document.querySelector(".generator-window");
const welcomeSection = document.querySelector(".welcome");

generatorCard.addEventListener("click", () => {

    homeWorkspace.style.display = "none";
    homePanel.style.display = "none";

    generatorWorkspace.style.display = "block";
    generatorPanel.style.display = "block";

    generatorWorkspace.classList.add("fade-in");
    generatorPanel.classList.add("fade-in");

});

returnHome.addEventListener("click", () => {

    generatorWorkspace.style.display = "none";
    generatorPanel.style.display = "none";

    homeWorkspace.style.display = "grid";
    homePanel.style.display = "block";

});

const ideaChips = document.querySelectorAll(".idea-chip");
const patternPrompt = document.getElementById("pattern-prompt");

ideaChips.forEach((chip) => {

    chip.addEventListener("click", () => {

        const idea = chip.textContent.trim();

        patternPrompt.value = `Create a cute crochet ${idea} pattern.`;

        patternPrompt.focus();

    });

});

const imageButton = document.getElementById("image-button");
const referenceImage = document.getElementById("reference-image");

imageButton.addEventListener("click", () => {

    referenceImage.click();

});

const imagePreviewContainer = document.getElementById("image-preview-container");
const imagePreview = document.getElementById("image-preview");
const removeImage = document.getElementById("remove-image");

referenceImage.addEventListener("change", () => {

    const file = referenceImage.files[0];

    if(file){

        imagePreview.src = URL.createObjectURL(file);

        imagePreviewContainer.style.display = "block";

    }

});

removeImage.addEventListener("click", () => {

    referenceImage.value = "";

    imagePreview.src = "";

    imagePreviewContainer.style.display = "none";

});

const generateButton = document.getElementById("generate-button");

generateButton.addEventListener("click", async () => {

    const prompt = patternPrompt.value.trim();

    if(prompt === ""){

        alert("Tell Willow what you'd like to crochet first!");
        return;

    }

    generateButton.textContent = "✦ Willow is drafting...";
    generateButton.disabled = true;

    willowMessage.innerHTML = `
        Counting stitches...<br><br>
        Give me a moment while I draft your pattern.
        <span class="willow-signature">— Willow 🌿</span>
    `;

    try{

        const response = await fetch("http://127.0.0.1:5000/generate", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                prompt:prompt
            })

        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.error);
        }

        generatorWindow.style.display = "none";
        welcomeSection.style.display = "none";

        patternResult.style.display = "block";
        patternResult.classList.add("fade-in");

        document.getElementById("result-content").textContent = data.pattern;

        willowMessage.innerHTML = `
            Your pattern is ready!<br><br>
            I hope you love making it.
            <span class="willow-signature">— Willow 🌿</span>
        `;

    }

    catch(error){

        console.error(error);

        generateButton.textContent = "Generate Pattern →";
        generateButton.disabled = false;

        willowMessage.innerHTML = `
            I got a little tangled up...<br><br>
            Could we try that again?
            <span class="willow-signature">— Willow 🌿</span>
        `;

    }

});