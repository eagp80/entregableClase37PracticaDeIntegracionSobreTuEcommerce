const socket = io();

const form = document.getElementById('product')//formulario donde se añadira nuevo producto
const productNew = document.getElementById('productNew')//div posicion donde colocaremos producto añadido mediante una tabla
const productList = document.getElementById('productList')

form.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const thumbnails = document.getElementById("thumbnails").value;
    const productComplete = { title, description, code, price, stock, category, thumbnails}
    socket.emit('message', productComplete)
})
var productsAgregado= " ";
//cliente recibe de vuelta el mismo producto enviado para añadir y lo pone en tabla
socket.on('product', data => {
    productNew.innerHTML =`
    <table style="border: black 1px solid;">
        <tr>
            <th style="border: green 1px solid;">Producto agregado</th>
        </tr>
        <tr>
            <td>Titulo: ${data.title}</td>
        </tr>
        <tr>
            <td>Descripcion: ${data.description}</td>
        </tr>
        <tr>
            <td>Codigo: ${data.code}</td>
        </tr>
        <tr>
            <td>Precio: ${data.price}</td>
        </tr>
        <tr>
            <td>Stock: ${data.stock}</td>
        </tr>
        <tr>
            <td>Categoria: ${data.category}</td>
        </tr>
        <tr>
            <td>Imagenes: ${data.thumbnails}</td>
        </tr>
    </table>
    `;
    
    productsAgregado += `<ul> <li><p> <b> Nombre de producto (con id: ${data.id}): </b> ${data.title}. Descripción: ${data.description}. 
    Código: ${data.code}. Precio: ${data.price}. Estatus: ${data.status}.
    Stock: ${data.stock}. Categoria: ${data.category}. Thumbnails: ${data.thumbnails}.
    </p></li> </ul>`;


    productList.innerHTML = productsAgregado;

    // const productNewList = document.createElement("li");//se coloca en lista el producto creado
    // productNewList.innerText = `${data.title}: $${data.price}`;

    // productList.prepend(productNewList);
})