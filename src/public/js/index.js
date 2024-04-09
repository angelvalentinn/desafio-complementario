const socket = io();

const productsContainer = document.querySelector('.products');
const form = document.querySelector('#form-create-product');

const title = document.querySelector('#title');
const description = document.querySelector('#description');
const price = document.querySelector('#price');
const code = document.querySelector('#code');
const stock = document.querySelector('#stock');
const category = document.querySelector('#category');

socket.on("products", products => {
    productsContainer.innerHTML = '';
    loadingProducts(products);
})

createProduct();

function loadingProducts(products) {

    productsContainer.innerHTML = '';
    products.forEach(product => {

        const div = document.createElement('div');
        div.classList.add('product');

        div.classList.add('product');

        div.innerHTML = `
            <p><span>Title:</span> ${product.title}</p>
            <p><span>Description:</span> ${product.description}</p>
            <p><span>Price:</span> ${product.price}</p>
            <p><span>Code:</span> ${product.code}</p>
            <p><span>Category:</span >${product.category}</p>
            <p><span>Id:</span> ${product._id}</p>
        `;

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Eliminar producto';
        btnDelete.classList.add('delete-product');
        btnDelete.id = product._id;

        btnDelete.addEventListener('click', (e) => deleteProduct(e.currentTarget.id))

        div.append(btnDelete)

        productsContainer.append(div);

    });
}

function createProduct()  {
    form.addEventListener("submit", e => {
        e.preventDefault()
        socket.emit("createProduct",  {title: title.value, description: description.value, 
                                        price, price: price.value, code: code.value, category: category.value, stock: stock.value});
        title.value = ''
        description.value = ''
        price.value = ''
        category.value = ''
        code.value = ''
        stock.value = ''
    })
}

function deleteProduct(id) { 
    socket.emit("deleteProduct", id) 
}