// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentFavorite = [];
let checkFavorite = 0;

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanLastReleased = document.querySelector('#spanLastReleased');
const selectBrand = document.querySelector('#brand-select');
const selectPrice = document.querySelector('#filter-price');
const selectRelease = document.querySelector('#filter-release');
const selectFavorite = document.querySelector('#favorite-select');
const selectSort = document.querySelector('#sort-select');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => { 
  currentProducts = result;
  currentPagination = meta;
  //currentBrand = brand ;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    //const response2 = await fetch(
    ///  `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    //);

    const response= await fetch(
      `https://server-two-chi.vercel.app/products?page=${page}&size=${size}`
    );

    /*const response = await fetch(
      `http://localhost:8092/products?page=6&size=12`)
    );*/

    /*const response =  await fetch(`https://server-2jko38mwz-aymar35.vercel.app/`);*/

    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      if(currentFavorite.includes(product)==true)
      {
  			return `
      	<div class="product" id=${product.uuid}>
            <input name="favorite"product type="checkbox" id='${product.name}' checked>
        		<span>${product.brand}</span>
        		<a href="${product.link}">${product.name}</a>
        		<span>${product.price}</span>
      	</div>
      `;
      }
      else
      {
                return `
        <div class="product" id=${product.uuid}>
            <input name="favorite"product type="checkbox" id='${product.name}'>
            <span>${product.brand}</span>
            <a href="${product.link}">${product.name}</a>
            <span>${product.price}</span>
        </div>
      `;
      }
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
 
const renderIndicators = (products, pagination) => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  spanLastReleased.innerHTML = lastRelease(products);
};




const ListBrand = products => {
  const brands = [];
  for(var i = 0; i< products.length; i++)
  {
    if(brands.includes(products[i]["brand"])==false)
    {
      brands.push(products[i]["brand"]);
    }
  }
  return brands;
}


const renderBrands = brands => {
  const options = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`
  ).join('');

  selectBrand.innerHTML = options;
};



const filterBrand = (products, brand) => {
  const filteredList = [];
  for(var i = 0; i<products.length; i++)
  {
    if(products[i]["brand"] == brand)
    {
      filteredList.push(products[i]);
    }
  }
  renderProducts(filteredList);
}

const filterPrice = (products) => {
    const filteredList = [];
  for(var i = 0; i<products.length; i++)
  {
    if(products[i]["price"] <= 50)
    {
      filteredList.push(products[i]);
    }
  }
  renderProducts(filteredList);
};


Date.prototype.minusDays= function(days){this.setDate(this.getDate() - parseInt(days)); return this; };

const filterRelease = (products) => {
  const filteredList = [];

  for(var i = 0; i<products.length; i++)
  {
    if(products[i]["released"].minusDays <= 14)
    {
      filteredList.push(products[i]);
    }
  }
  renderProducts(filteredList);
};

const lastRelease  = (products) => {
  const sortedProducts = products.sort((a, b) => (a.released < b.released ? 1 : -1));
  return (sortedProducts[0].released);
}

const sortProducts = (products, type) => {
  var sort_price =[];
  if(type == "price-asc")
  {
    sort_price = products.sort((a, b) => (a.price > b.price ? 1 : -1));
  }
  if(type == "price-desc")
  {
    sort_price = products.sort((a, b) => (a.price < b.price ? 1 : -1));
  }
  if(type == "date-asc")
  {
    sort_price = products.sort((a, b) => (a.released > b.released ? 1 : -1));
  }
  if(type == "date-desc")
  {
    sort_price = products.sort((a, b) => (a.released < b.released ? 1 : -1));
  }

  renderProducts(sort_price);
}


const addfavorite = (product) => {
  if(currentFavorite.includes(product) == false)
  {
    currentFavorite.push(product)
  }
  else if(currentFavorite.includes(product) == true)
  {
    for(var i = 0; i < currentFavorite.length; i++)
    {
      if(currentFavorite[i] == product)
      {
        currentFavorite.splice(i,1);
      }
    }
  }
}

const renderFavorite =() => {
  if(checkFavorite == 0)
  {
    checkFavorite = 1;
    renderProducts(currentFavorite);
  }
  else
  {
    checkFavorite = 0;
    renderProducts(currentProducts);
  }
}


const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(products, pagination);
  const brands = ListBrand(currentProducts);
  renderBrands(brands);
};

/**
 * Declaration of all Listeners
 */

/** Feature 0
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

//Feature 1 - Browse pages
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

//Feature 2 - Filter by brands
selectBrand.addEventListener('change', event => {
  filterBrand(currentProducts, event.target.value)
});

//Feature 3 - Filter by recent products
selectRelease.addEventListener('click', event => {
  filterRelease(currentProducts)
});

//Feature 4 - Filter by reasonable price
selectPrice.addEventListener('click', event => {
  filterPrice(currentProducts)
});

//Feature 5 & 6 - Sort by price & date
selectSort.addEventListener('change', event => {
  sortProducts(currentProducts,event.target.value);
});


sectionProducts.addEventListener('change', event => {
  for(var i = 0; i < currentProducts.length; i++)
  {
    if(currentProducts[i].name == event.target.id)
    {
      addfavorite(currentProducts[i]);
    }
  }
});

selectFavorite.addEventListener('click', event => {
  renderFavorite();
});


document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);