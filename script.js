const products = [
  {id:1,name:"Ritzy Signature Tote",category:"fashion",price:85000,old:105000,rating:4.9,badge:"BEST SELLER"},
  {id:2,name:"Botanical Glow Set",category:"beauty",price:42000,old:52000,rating:4.8,badge:"NEW"},
  {id:3,name:"Sculptural Ceramic Vase",category:"home",price:38000,old:null,rating:4.7,badge:"CURATED"},
  {id:4,name:"Aura Wireless Headphones",category:"tech",price:125000,old:150000,rating:4.9,badge:"SAVE 17%"},
  {id:5,name:"Everyday Linen Set",category:"fashion",price:56000,old:null,rating:4.6,badge:"NEW"},
  {id:6,name:"Ritzy Soft Glow Lamp",category:"home",price:69000,old:78000,rating:4.8,badge:"FAVOURITE"},
  {id:7,name:"Silk Touch Beauty Kit",category:"beauty",price:47500,old:null,rating:4.7,badge:"NEW"},
  {id:8,name:"Pocket Smart Speaker",category:"tech",price:79000,old:92000,rating:4.8,badge:"POPULAR"}
];

let cart = [];
let currentFilter = "all";

const naira = n => new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);
const grid = document.getElementById("productGrid");

function renderProducts(){
  let list = products.filter(p => currentFilter==="all" || p.category===currentFilter);
  const sort = document.getElementById("sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
  grid.innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-image">
        <span class="badge">${p.badge}</span><button class="heart" aria-label="Add ${p.name} to wishlist">♡</button>
        <div class="shape">${p.category[0].toUpperCase()}</div>
      </div>
      <div class="product-info">
        <span class="category-name">${p.category}</span>
        <h3>${p.name}</h3><div class="rating">★★★★★ <span>${p.rating}</span></div>
        <div class="price">${naira(p.price)} ${p.old?`<span class="old">${naira(p.old)}</span>`:""}</div>
        <button class="quick-add" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`).join("");
  document.querySelectorAll(".quick-add").forEach(b=>b.addEventListener("click",()=>addToCart(+b.dataset.id)));
  document.querySelectorAll(".heart").forEach(b=>b.addEventListener("click",e=>{e.currentTarget.textContent=e.currentTarget.textContent==="♡"?"♥":"♡";toast("Wishlist updated");}));
}
function addToCart(id){
  const p=products.find(x=>x.id===id); const existing=cart.find(x=>x.id===id);
  if(existing) existing.qty++; else cart.push({...p,qty:1});
  renderCart(); toast(`${p.name} added to cart`);
}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById("cartTotal").textContent=naira(total);
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<p class="empty">Your cart is empty.<br>Browse products to find something you love.</p>';return;}
  box.innerHTML=cart.map(x=>`<div class="cart-item"><div class="cart-thumb">${x.category[0].toUpperCase()}</div><div><h4>${x.name}</h4><p>${naira(x.price)} × ${x.qty}</p><button class="remove-item" data-id="${x.id}">Remove</button></div><strong>${naira(x.price*x.qty)}</strong></div>`).join("");
  box.querySelectorAll(".remove-item").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.id);renderCart();});
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),1800);}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}

document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;renderProducts();});
document.getElementById("sortSelect").onchange=renderProducts;
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.querySelector(".mobile-menu-btn").onclick=()=>document.getElementById("mobileNav").classList.toggle("open");
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchPanel").classList.add("open");document.getElementById("searchInput").focus()};
document.getElementById("closeSearch").onclick=()=>document.getElementById("searchPanel").classList.remove("open");
document.getElementById("searchInput").oninput=e=>{
  const q=e.target.value.toLowerCase();
  if(!q){renderProducts();return}
  grid.innerHTML=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)).map(p=>`
  <article class="product-card"><div class="product-image"><span class="badge">${p.badge}</span><div class="shape">${p.category[0].toUpperCase()}</div></div>
  <div class="product-info"><span class="category-name">${p.category}</span><h3>${p.name}</h3><div class="rating">★★★★★ ${p.rating}</div><div class="price">${naira(p.price)}</div><button class="quick-add" data-id="${p.id}">Add to cart</button></div></article>`).join("") || '<p>No products found. Try another search.</p>';
  document.querySelectorAll(".quick-add").forEach(b=>b.onclick=()=>addToCart(+b.dataset.id));
};
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();toast("You're on the Ritzy list ✦");e.target.reset();};
renderProducts(); renderCart();
