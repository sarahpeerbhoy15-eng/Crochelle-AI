const generatorCard = document.getElementById("generator-card");
const returnHome = document.getElementById("return-home");
const homeWorkspace = document.getElementById("home-workspace");
const generatorWorkspace = document.getElementById("generator-workspace");

const homePanel = document.getElementById("home-panel");
const generatorPanel = document.getElementById("generator-panel");

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