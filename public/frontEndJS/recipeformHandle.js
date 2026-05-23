const displaysteps = document.getElementById("displaysteps");
        
// handle quill
const quill = new Quill('#editor', {
    theme: 'snow'
});

const recipeForm = document.getElementById('recipeForm');

recipeForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const steps = quill.root.innerHTML;

    const author = recipeForm.author.value;
    const title = recipeForm.title.value;

    const res = await fetch("/recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            author,
            title,
            steps
        })
    });

    const data = await res.json();

    console.log(data);
    recipeForm.reset()
    // displaysteps.innerHTML = data.recipe.steps;

});
