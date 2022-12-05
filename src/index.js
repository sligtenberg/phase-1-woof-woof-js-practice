document.addEventListener('DOMContentLoaded', () => {
    getPups();
    filterListener();
})

// this function will clear the dog bar
function resetDogBar () {
    const oldBar = document.getElementById('dog-bar')
    while (oldBar.firstChild) {
        oldBar.removeChild(oldBar.firstChild);
    }

}

// adds the pups to the top bar
function getPups () {
    resetDogBar();
    fetch('http://localhost:3000/pups')
    .then((response) => response.json())
    .then((allDogs) => {
        const filter = document.getElementById('good-dog-filter').textContent;
        for (let dog of allDogs) {
            if (filter === 'Filter good dogs: OFF') {
                addToBar(dog);
            }
            else {
                if (dog.isGoodDog) {
                    addToBar(dog);
                }
            }
        }
    })
}

// this function takes a dog and adds it to the dog bar
function addToBar (dog) {
    //console.log(dog);
    const newDog = document.createElement('span');
    newDog.addEventListener('click', (event) => getMoreInfo(dog))
    newDog.textContent = dog.name;
    document.getElementById('dog-bar').appendChild(newDog);
}

// displays the details for a dog in the main part of the page
function getMoreInfo(dog) {
    let dogBehavior = 'Bad Dog!';
    if (dog.isGoodDog) dogBehavior = 'Good Dog!';
    document.getElementById('dog-info').innerHTML = `
        <img src="${dog.image}"/>
        <h2>${dog.name}</h2>
        <button id="good-dog-bad-dog">${dogBehavior}</button>
    `
    const dogBehaviorBtn = document.getElementById('good-dog-bad-dog');
    dogBehaviorBtn.addEventListener('click', () => {
        switch (dog.isGoodDog) {
            case true:
                dog.isGoodDog = false;
                break;
            case false:
                dog.isGoodDog = true;
                break;
        }
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dog)
        })
        getPups();
        getMoreInfo(dog);
    })
} 

// listens for user to toggle the filter by good doggo button
function filterListener () {
    const filter = document.getElementById('good-dog-filter')
    filter.addEventListener('click', () => {
        switch (filter.textContent) {
            case 'Filter good dogs: OFF':
                filter.textContent = 'Filter good dogs: ON';
                break;
            case 'Filter good dogs: ON':
                filter.textContent = 'Filter good dogs: OFF';
                break;
        }
        getPups();
    })
}