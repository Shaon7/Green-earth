let cart = [];
let allPlants = [];


const loadTrees = ()=> {
  fetch("https://openapi.programming-hero.com/api/categories")
  .then(res => res.json())
  .then(json => displayTree(json.categories));

  fetch("https://openapi.programming-hero.com/api/plants")
  .then(res => res.json())
  .then(json => displayCategoryLeaf(json.plants));
};

const manageSpinner=(status)=>{
  if(status==true){
    document.getElementById("spinner").classList.remove("hidden")
    document.getElementById("tree-container").classList.add("hidden")

  }else{
     document.getElementById("tree-container").classList.remove("hidden")
    document.getElementById("spinner").classList.add("hidden")


  }
}

const removeActive = () => {
  const buttons = document.querySelectorAll(".tree-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
};

const loadCategoryLeaf = (id) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then(res => res.json())
    .then(json => {
      removeActive();
      document.getElementById(`tree-btn-${id}`).classList.add("active");
      displayCategoryLeaf(json.plants);
    });
};


const displayCategoryLeaf = (leafs) => {
  allPlants = leafs;
  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = "";

  leafs.forEach(leaf => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="card bg-base-100 w-78 shadow-sm mt-3">
        <figure>
          <img class="p-2 rounded-xl w-[311px] h-[186px] object-cover" src="${leaf.image}" alt="${leaf.name}" />
        </figure>
        <div class="card-body">
          <h2 class="card-title cursor-pointer">${leaf.name}</h2>
          <p>${leaf.description}...</p>
          <div class="card-actions justify-between">
            <div class="badge badge-outline bg-[#DCFCE7] text-green-500 rounded-2xl mt-5">${leaf.category}</div>
            <div class="font-bold mt-5">৳${leaf.price}</div>
          </div>
          <button class="btn btn-wide text-white bg-[#15803D] rounded-2xl mt-4 add-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;

    card.querySelector(".add-cart-btn").addEventListener("click", () => addToCart(leaf));

    card.querySelector(".card-title").addEventListener("click", () => openModal(leaf));

    treeContainer.append(card);
  });
  manageSpinner(false);
};


const displayTree = (trees) => {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  trees.forEach(tree => {
    const div = document.createElement("div");
    div.innerHTML = `
      <button id="tree-btn-${tree.id}" onclick="loadCategoryLeaf(${tree.id})"
        class="btn btn-wide hover:bg-[#15803D] justify-start font-medium border-none bg-[#F0FDF4] tree-btn">
        ${tree.category_name}
      </button>
    `;
    container.append(div);
  });
};


const addToCart = (leaf) => {
  const existing = cart.find(item => item.id === leaf.id);

  if (existing) {
    existing.quantity += 1;
    alert(`${leaf.name} quantity updated in your cart`);
  } else {
    cart.push({ id: leaf.id, name: leaf.name, price: leaf.price, quantity: 1 });
    alert(`${leaf.name} has been added to your cart`);
  }

  displayCart();
};


const displayCart = () => {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("flex", "justify-between", "items-center", "border-b", "pb-2");
    div.innerHTML = `
      <div>
        <p class="font-medium">${item.name}</p>
        <p class="text-sm text-gray-500">৳${item.price} x ${item.quantity}</p>
      </div>
      <button class="text-red-500 font-bold">✕</button>
    `;
    div.querySelector("button").addEventListener("click", () => removeFromCart(item.id));
    container.append(div);
    total += item.price * item.quantity;
  });

  document.getElementById("cart-total").innerText = "৳" + total;
};


const removeFromCart = (id) => {
  cart = cart.filter(item => item.id !== id);
  displayCart();
};


const openModal = (leaf) => {
  document.getElementById("modal-name").innerText =  leaf.name;
  document.getElementById("modal-image").src = leaf.image;
  document.getElementById("modal-category").innerText ="Category: " + leaf.category;
  document.getElementById("modal-price").innerText = "Price: " + leaf.price;
  document.getElementById("modal-description").innerText ="Description: " + leaf.description;


  document.getElementById("plant-modal").checked = true;
};


loadTrees();
