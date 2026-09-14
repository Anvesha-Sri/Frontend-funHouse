const seedListings = [
  {id:"seed-psychology",title:"The Psychology of Money",author:"Morgan Housel",courseCode:"ECON 210",price:18,condition:"Good",contact:"maya@campusmail.edu",coverUrl:"https://covers.openlibrary.org/b/id/10524468-M.jpg"},
  {id:"seed-calculus",title:"Calculus: Early Transcendentals",author:"James Stewart",courseCode:"MATH 121",price:42,condition:"Fair",contact:"noah@campusmail.edu",coverUrl:"https://covers.openlibrary.org/b/id/8231856-M.jpg"},
  {id:"seed-atomic",title:"Atomic Habits",author:"James Clear",courseCode:"PSYC 101",price:15,condition:"New",contact:"rhea@campusmail.edu",coverUrl:"https://covers.openlibrary.org/b/id/10523503-M.jpg"},
  {id:"seed-biochemistry",title:"Lehninger Principles of Biochemistry",author:"David L. Nelson",courseCode:"BIOC 301",price:36,condition:"Good",contact:"arjun@campusmail.edu",coverUrl:"https://covers.openlibrary.org/b/id/12644351-M.jpg"},
  {id:"seed-design",title:"The Design of Everyday Things",author:"Don Norman",courseCode:"DES 205",price:12,condition:"Fair",contact:"zoe@campusmail.edu",coverUrl:"https://covers.openlibrary.org/b/id/8235316-M.jpg"}
];

let listings = JSON.parse(localStorage.getItem("campusSwapListings") || "null") || seedListings;
let state = { search:"", condition:"All", maxPrice:"Any price" };

const grid = document.getElementById("listingGrid");
const count = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const clearFilters = document.getElementById("clearFilters");
const emptyState = document.getElementById("emptyState");
const dialog = document.getElementById("postDialog");
const filterPanel = document.getElementById("filterPanel");
const filterScrim = document.getElementById("filterScrim");

const conditionCopy = {New:"Like new", Good:"Good shape", Fair:"Well loved"};
const gradients = ["g-yellow","g-mint","g-peach","g-blue"];

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function filtered(){
  const q = state.search.trim().toLowerCase();
  const max = state.maxPrice === "Any price" ? Infinity : Number(state.maxPrice);
  return listings.filter(book =>
    (!q || book.title.toLowerCase().includes(q) || book.courseCode.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)) &&
    (state.condition === "All" || book.condition === state.condition) &&
    book.price <= max
  );
}

function initials(title){
  return title.split(/\s+/).filter(Boolean).slice(0,3).map(w=>w[0]).join("").toUpperCase();
}

function render(){
  const data = filtered();
  grid.innerHTML = "";
  count.innerHTML = `${data.length} ${data.length === 1 ? "listing" : "listings"}${hasFilters() ? '<span class="results-filtered"> matching your search</span>' : ""}`;

  data.forEach((book,index)=>{
    const cover = book.coverUrl
      ? `<img src="${escapeHTML(book.coverUrl)}" alt="${escapeHTML(book.title)} cover" onerror="this.parentElement.innerHTML='<div class=&quot;cover-fallback ${gradients[index%4]}&quot;><span class=&quot;cover-rule&quot;></span><span class=&quot;cover-label&quot;>${escapeHTML(initials(book.title))}</span><span class=&quot;cover-mark&quot;>CS</span></div>'">`
      : `<div class="cover-fallback ${gradients[index%4]}"><span class="cover-rule"></span><span class="cover-label">${escapeHTML(initials(book.title))}</span><span class="cover-mark">CS</span></div>`;
    const card = document.createElement("article");
    card.className = "listing-card";
    card.style.animationDelay = `${index*70}ms`;
    card.innerHTML = `
      <div class="listing-cover">${cover}<span class="condition-pill">${conditionCopy[book.condition]}</span></div>
      <div class="listing-content">
        <div class="listing-main"><div><p class="course-code">${escapeHTML(book.courseCode)}</p><h3 class="listing-title">${escapeHTML(book.title)}</h3></div><p class="listing-price">$${Number(book.price).toFixed(2)}</p></div>
        <p class="listing-author">${escapeHTML(book.author)}</p>
        <div class="listing-footer"><span class="listing-meta">◈ ${conditionCopy[book.condition]}</span><a class="contact-link" href="mailto:${escapeHTML(book.contact)}">✉ Ask seller</a></div>
      </div>`;
    grid.appendChild(card);
  });

  emptyState.classList.toggle("hidden", data.length !== 0);
  grid.classList.toggle("hidden", data.length === 0);
  clearFilters.classList.toggle("hidden", !hasFilters());
  clearSearch.classList.toggle("hidden", !state.search);
}

function hasFilters(){ return Boolean(state.search) || state.condition !== "All" || state.maxPrice !== "Any price"; }

function resetFilters(){
  state = {search:"",condition:"All",maxPrice:"Any price"};
  searchInput.value = "";
  document.querySelectorAll(".filter-option").forEach(b=>b.classList.toggle("selected",b.dataset.condition==="All"));
  document.querySelectorAll(".price-option").forEach(b=>b.classList.toggle("selected",b.dataset.price==="Any price"));
  render();
}

searchInput.addEventListener("input", e=>{state.search=e.target.value;render();});
clearSearch.addEventListener("click",()=>{state.search="";searchInput.value="";render();});
document.querySelectorAll("[data-search]").forEach(b=>b.addEventListener("click",()=>{
  state.search=b.dataset.search; searchInput.value=state.search; render(); document.getElementById("browse").scrollIntoView({behavior:"smooth"});
}));

document.querySelectorAll("[data-condition]").forEach(b=>b.addEventListener("click",()=>{
  state.condition=b.dataset.condition;
  document.querySelectorAll(".filter-option").forEach(x=>x.classList.toggle("selected",x===b));
  closeFilters(); render();
}));

document.querySelectorAll("[data-price]").forEach(b=>b.addEventListener("click",()=>{
  state.maxPrice=b.dataset.price;
  document.querySelectorAll(".price-option").forEach(x=>x.classList.toggle("selected",x===b));
  closeFilters(); render();
}));

clearFilters.addEventListener("click",resetFilters);
document.getElementById("emptyClear").addEventListener("click",resetFilters);

function openPost(){dialog.classList.remove("hidden");document.body.classList.add("modal-open");setTimeout(()=>dialog.querySelector("input")?.focus(),50);}
function closePost(){dialog.classList.add("hidden");document.body.classList.remove("modal-open");document.getElementById("formError").classList.add("hidden");}
document.getElementById("openPost").addEventListener("click",openPost);
document.getElementById("emptyPost").addEventListener("click",openPost);
document.getElementById("closePost").addEventListener("click",closePost);
dialog.addEventListener("mousedown",e=>{if(e.target===dialog)closePost();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closePost();closeFilters();} if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput.focus();}});

document.getElementById("listingForm").addEventListener("submit",e=>{
  e.preventDefault();
  const form = new FormData(e.target);
  const title = String(form.get("title")).trim();
  const courseCode = String(form.get("courseCode")).trim().toUpperCase();
  const price = Number(form.get("price"));
  const condition = String(form.get("condition"));
  const contact = String(form.get("contact")).trim();
  const error = document.getElementById("formError");

  if(!title || !courseCode || !contact || !Number.isFinite(price) || price<0){
    error.textContent="Add a title, course code, price, and a way for buyers to reach you.";
    error.classList.remove("hidden"); return;
  }

  const newListing={id:"local-"+Date.now(),title,courseCode,price,condition,contact,author:"Campus student",coverUrl:null};
  listings.unshift(newListing);
  localStorage.setItem("campusSwapListings",JSON.stringify(listings));
  e.target.reset();
  closePost();
  resetFilters();
  document.getElementById("browse").scrollIntoView({behavior:"smooth"});
});

function openFilters(){filterPanel.classList.add("is-open");filterScrim.classList.remove("hidden");}
function closeFilters(){filterPanel.classList.remove("is-open");filterScrim.classList.add("hidden");}
document.getElementById("mobileFilterOpen").addEventListener("click",openFilters);
document.getElementById("mobileFilterClose").addEventListener("click",closeFilters);
filterScrim.addEventListener("click",closeFilters);

render();
