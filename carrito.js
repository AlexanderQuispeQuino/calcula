
	class Carrito {

    //Añadir producto al carrito
    comprarProducto(e){
        e.preventDefault();
        //Delegado para agregar al carrito
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement.parentElement;
            // const producto = e.target.parentElement;
            //Enviamos el producto seleccionado para tomar sus datos
            this.leerDatosProducto(producto);
        }
    }

    // estadoCarrito(){

//         (estadoCarrito () {
//             const row = document.createElement('tr');
            
//             if (row === "") {
//             row.innerHTML = `
//             <td>
//                <p>No tienes productos en el carrito Una vez que agregues productos, los veras reflejados acá.</p>
//             </td>
//         `;
//       }
//       listaProductos.appendChild(row);
// })();


    //Leer datos del producto
    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,

            titulo: producto.querySelector('.nombre-producto').textContent,
            precio: producto.querySelector('.precio-producto span').textContent,
            puntos: producto.querySelector('.punto-producto span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
            console.log(infoProducto)
        let image = document.getElementById("image");

        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS){
            if(productoLS.id === infoProducto.id){
                productosLS = productoLS.id;
            }
        });

        if(productosLS === infoProducto.id){
            alert('El producto ya está agregado')
        }
        else {
            this.insertarCarrito(infoProducto);
        }
        
    }

    //muestra producto seleccionado en carrito
    insertarCarrito(producto){
        const row = document.createElement('tr');
             row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>${producto.puntos}</td>
            <td>
                <a href="#" class="borrar-producto fa fa-trash" data-id="${producto.id}"></a>
            </td>
        `;
        
       
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

    }

    //Eliminar el producto del carrito en el DOM
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }

    //Elimina todos los productos
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    //Almacenar en el LS
    guardarProductosLocalStorage(producto){
        let productos;
        //Toma valor de un arreglo con datos del LS
        productos = this.obtenerProductosLocalStorage();
        //Agregar el producto al carrito
        productos.push(producto);
        //Agregamos al LS
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS
    obtenerProductosLocalStorage(){
        let productoLS;

        //Comprobar si hay algo en LS
        if(localStorage.getItem('productos') === null){
            productoLS = [];
            
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }


    //Mostrar los productos guardados en el LS
    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `

                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>${producto.puntos}</td>
                <td>
                    <a href="#" class="borrar-producto fa fa-trash" data-id="${producto.id}"></a>
                </td>

            `;
            listaProductos.appendChild(row);


        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let productosLS;
        
        productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach(function (producto){
            const row = document.createElement('div');
             row.setAttribute('class', 'card-producto');
            
            row.innerHTML = `
                
                    <div class="imagen-producto">
                        <img src="${producto.imagen}" width=100>
                    </div>
                    <div class="info-producto">
                        <div class="container-nombre-producto">
                            <h3 class="nombre-producto">${producto.titulo}</h3>
                        </div>
                        <div class="container-precio-punto">
                            <span class="precio-producto">S/ <span class="precio-producto-span">${producto.precio}</span> </span>
                            <span class="punto-producto">Ptos <span class="punto-producto-span">${producto.puntos}</span></span>
                        </div>
                        <div class="container-quantity">
                          <input type="number" class="cantidad" value=${producto.cantidad}>
                         
                        </div>
                        <div class="sub-resultado-precio-punto" id='subtotales'>
                            <span class="sub-precio-producto">S/ <span class="sub-precio-producto-span">${producto.cantidad * producto.precio}</span></span>
                            <span class="sub-punto-producto">Ptos <span class="sub-punto-producto-span">${producto.cantidad * producto.puntos}</span></span>
                            
                            <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
                        </div>

                    </div>
               
                
            `;

            listaCompra.appendChild(row);
        });
    }

    //Eliminar producto por ID del LS
    eliminarProductoLocalStorage(productoID){
        let productosLS;
        //Obtenemos el arreglo de productos
        productosLS = this.obtenerProductosLocalStorage();
        //Comparar el id del producto borrado con LS
        productosLS.forEach(function(productoLS, index){
            if(productoLS.id === productoID){
                productosLS.splice(index, 1);
            }
        });

        //Añadimos el arreglo actual al LS
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Eliminar todos los datos del LS
    vaciarLocalStorage(){
        localStorage.clear();
    }

    //Procesar pedido
    procesarPedido(e){
        e.preventDefault();

        if(this.obtenerProductosLocalStorage().length === 0){
            alert('El carrito está vacío, agrega algún producto')
            // Swal.fire({
            //     type: 'error',
            //     title: 'Oops...',
            //     text: 'El carrito está vacío, agrega algún producto',
            //     showConfirmButton: false,
            //     timer: 2000
            // })
        }
        else {
            location.href = "carrito.html";
        }
    }

    // Calcular montos
    calcularTotal(){

        let total = 0, totalPuntos = 0, porcentaje = document.querySelector('.porcentaje').value, descuento=0, ganancia=0;

        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        for(let i = 0; i < productosLS.length; i++){
            let resultSubPrecio = Number(productosLS[i].precio * productosLS[i].cantidad);
            let resultSubPunto = Number(productosLS[i].puntos * productosLS[i].cantidad);
            total +=resultSubPrecio;
            totalPuntos +=resultSubPunto;
            ganancia = total * (porcentaje/100);
            descuento = total - ganancia;
            
        }

         document.querySelectorAll(".sub-precio-producto-span").innerHTML =  this.resultSubPrecio;
         document.querySelectorAll(".sub-punto-producto-span").innerHTML =  this.resultSubPunto;
                 // igv = parseFloat(total * 0.18).toFixed(2);
        document.querySelector('.total').innerHTML = "S/. " + total.toFixed(2);
        document.querySelector('.total-puntos').innerHTML =  totalPuntos;
        document.querySelector('.al-descuento').innerHTML = "S/ " + descuento.toFixed(2);
        document.querySelector('.ganancia').innerHTML = "S/ " + ganancia.toFixed(2);
  
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;

        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            
            let subPrecio= document.querySelectorAll(".sub-precio-producto-span");
            let subPunto= document.querySelectorAll(".sub-punto-producto-span");
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;                    
                    subPrecio[index].innerHTML = Number(cantidad * productosLS[index].precio);
                    subPunto[index].innerHTML = Number(cantidad * productosLS[index].puntos);
                }    
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
            
        }
        else {
            console.log("click afuera");
        }
    }



}






