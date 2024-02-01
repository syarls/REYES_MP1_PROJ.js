let count = 0;

const decrementButton = document.getElementById("decrement");
const incrementButton = document.getElementById("increment");
const countDisplay = document.getElementById("count");

decrementButton.addEventListener("click", () => {
    if(count <= 1){
        count == 0;
    }
    else{
  count--;
  countDisplay.textContent = count;
    }
});

incrementButton.addEventListener("click", () => {
    if(count >= 99){
        count == 99;
    }
    else{
  count++;
  countDisplay.textContent = count;
}
});