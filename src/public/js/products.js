const socket = io()
const form = document.getElementById('form');
const addButton = document.querySelectorAll('.addButton')
const deleteButton = document.querySelectorAll('.deleteButton');
const pag = document.getElementById('pag');
const contenido = document.getElementById('contenido');

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const data = Object.fromEntries(new FormData(evt.target));
  
    try {
      let result = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  async function handleButtonClick(e){
    const target = e.target
    const id = target.parentElement.id
    if(target.className === "deleteButton"){
      const result = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
    }
    if(target.className === "addButton"){
      try {
        const resultCart = await fetch(`/api/carts`, {
          method: "POST",
          body: "",
          headers: {
            "Content-Type" : "application/json"
          }
        })
        const { payload } = await resultCart.json()
        const cartId = payload["_id"]
        const result = await fetch(`/api/carts/${cartId}/products/${id}`, {
          method: "POST",
          body: "",
          headers: {
            "Content-Type" : "application/json"
          }
        });
        const data = await result.json()
        if(data.status === "error"){
          console.error(data.message)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  }
  

deleteButton.forEach((boton) => {
    boton.addEventListener("click", handleButtonClick)
})

addButton.forEach((boton) => {
    boton.addEventListener("click", handleButtonClick)
})

socket.on("refreshProducts", (data) => {
    contenido.innerHTML = ``;
    data.forEach((product) => {
        contenido.innerHTML += `
      <section id=${product._id}>
      <div>
        <h3>title: ${product.title}</h3>
        <p>code: ${product.code}</p>
        <p>description: ${product.description}</p>
        <a href="/products/${product._id}"</a>
      </div>
      <button class="deleteButton">Eliminar</button>
      <button class="addButton">Agregar carrito</button>
    </section>
      `;
    });
});

