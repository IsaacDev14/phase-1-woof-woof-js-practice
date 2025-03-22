document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterBtn = document.getElementById("good-dog-filter");
  let filterOn = false;
  let allDogs = []; 
  let currentDog = null; // Track the currently displayed dog

  fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(dogs => {
      console.log("Fetched Dogs:", dogs);
      allDogs = dogs;
      renderDogs(dogs);

      if (dogs.length > 0) {
        showDogInfo(dogs[0]); // Load first dog by default
      }
    });

  function renderDogs(dogs) {
    dogBar.innerHTML = ""; 
    dogs.forEach(dog => {
      if (!filterOn || dog.isGoodDog) { 
        const span = document.createElement("span");
        span.textContent = dog.name;
        span.addEventListener("click", () => showDogInfo(dog));
        dogBar.appendChild(span);
      }
    });
  }

  function showDogInfo(dog) {
    currentDog = dog; // Store the currently displayed dog
    dogInfo.innerHTML = `
      <img src="${dog.image}" alt="${dog.name}">
      <h2>${dog.name}</h2>
      <button id="toggle-btn">${dog.isGoodDog ? "Good Dog" : "Bad Dog"}</button>
    `;

    const toggleBtn = document.getElementById("toggle-btn");
    toggleBtn.addEventListener("click", () => toggleGoodness(dog));
  }

  function toggleGoodness(dog) {
    const newStatus = !dog.isGoodDog;

    fetch(`http://localhost:3000/pups/${dog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isGoodDog: newStatus })
    })
    .then(response => response.json())
    .then(updatedDog => {
      allDogs = allDogs.map(d => d.id === updatedDog.id ? updatedDog : d);

      // Update the current dog only, without resetting the page
      showDogInfo(updatedDog);
      renderDogs(allDogs); // Re-render the dog bar to reflect the change
    });
  }

  filterBtn.addEventListener("click", () => {
    filterOn = !filterOn;
    filterBtn.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
    renderDogs(allDogs); 
  });

});
