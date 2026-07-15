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
const generateAnotherButton = document.getElementById("generate-another");
const savePatternButton = document.getElementById("save-pattern");
const libraryCard = document.getElementById("library-card");
const libraryWorkspace = document.getElementById("library-workspace");
const returnLibraryHome = document.getElementById("return-library-home");
const libraryPatternView = document.getElementById("library-pattern-view");
const libraryPatternContent = document.getElementById("library-pattern-content");
const backToLibrary = document.getElementById("back-to-library");
const libraryPatterns = document.getElementById("library-patterns");

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

    if(prompt === "" && !referenceImage.files[0]){

    alert("Tell Willow what you'd like to crochet or add a reference image first!");
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
        const formData = new FormData();

formData.append("prompt", prompt);

if(referenceImage.files[0]){

    formData.append("image", referenceImage.files[0]);

}
        const response = await fetch("http://127.0.0.1:5000/generate", {

    method:"POST",

    body:formData

});

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.error);
        }

        generatorWindow.style.display = "none";
        welcomeSection.style.display = "none";

        patternResult.style.display = "block";
        patternResult.classList.add("fade-in");

        document.getElementById("result-content").innerHTML = marked.parse(data.pattern);
        
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

generateAnotherButton.addEventListener("click", () => {

    patternResult.style.display = "none";

    generatorWindow.style.display = "block";
    welcomeSection.style.display = "block";

    patternPrompt.value = "";

    referenceImage.value = "";
    imagePreview.src = "";
    imagePreviewContainer.style.display = "none";

    generateButton.textContent = "Generate Pattern →";
    generateButton.disabled = false;

    savePatternButton.textContent = "♡ Save to Library";
    savePatternButton.disabled = false;

    document.getElementById("result-content").innerHTML = "";

    willowMessage.innerHTML = `
        Hi Sarah,<br><br>
        Ready to make something adorable today?
        <span class="willow-signature">— Willow 🌿</span>
    `;

    generatorWorkspace.classList.add("fade-in");

});

savePatternButton.addEventListener("click", () => {

    const patternContent = document.getElementById("result-content").innerHTML;
    
    const patternTitle =
    document.querySelector("#result-content h1")?.textContent || "Untitled Pattern";
    
    const savedPatterns = JSON.parse(localStorage.getItem("savedPatterns")) || [];

    savedPatterns.push({
    title: patternTitle,
    content: patternContent
});

    localStorage.setItem("savedPatterns", JSON.stringify(savedPatterns));

    savePatternButton.textContent = "✓ Saved to Library";
    savePatternButton.disabled = true;

});

libraryCard.addEventListener("click", () => {

    homeWorkspace.style.display = "none";
    homePanel.style.display = "none";

    libraryWorkspace.style.display = "block";

    libraryWorkspace.classList.add("fade-in");

    loadLibrary();
});

returnLibraryHome.addEventListener("click", () => {

    libraryWorkspace.style.display = "none";

    homeWorkspace.style.display = "grid";
    homePanel.style.display = "block";

});

function loadLibrary(){

    const libraryPatterns = document.getElementById("library-patterns");

    const savedPatterns =
        JSON.parse(localStorage.getItem("savedPatterns")) || [];

    libraryPatterns.innerHTML = "";

    if(savedPatterns.length === 0){

        libraryPatterns.innerHTML = `
            <div class="library-empty">

                <div class="window-icon">
                    📚
                </div>

                <h2>Your library is empty</h2>

                <p>
                    Patterns you choose to save will appear here.
                </p>

            </div>
        `;

        return;
    }

    savedPatterns.forEach((pattern, index) => {

        const patternCard = document.createElement("div");

        patternCard.classList.add("library-pattern-card");

        const content =
    typeof pattern === "string"
        ? pattern
        : pattern.content;

const title =
    typeof pattern === "string"
        ? "Untitled Pattern"
        : pattern.title;

        patternCard.innerHTML = `

    <div class="library-card-icon">
            🧶
        </div>

        <h3>${title}</h3>

        <p class="library-preview">
            ${content.replace(/<[^>]*>/g,"").substring(0,90)}...
        </p>

        <span class="library-open">
            Open →
        </span>

    `;

    patternCard.addEventListener("click", () => {

    libraryPatterns.style.display = "none";

    libraryPatternView.style.display = "block";

    libraryPatternContent.innerHTML = content;

});
        libraryPatterns.appendChild(patternCard);

    });

}

backToLibrary.addEventListener("click", () => {

    libraryPatternView.style.display = "none";

    libraryPatterns.style.display = "block";

    loadLibrary();

});