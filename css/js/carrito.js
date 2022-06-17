﻿class Carrito {

    //Añade el curso al carrito
    comprarCurso(e) {
        e.preventDefault();
        //Delegation para agregar carrito
        if (e.target.classList.contains('agregar-carrito')) {
            const curso = e.target.parentElement.parentElement;

            //console.log(curso);
            //Enviamos curso seleccionado para tomar sus datos
            this.leerDatosCurso(curso);
        }
    }

    //leer datos del curso
    leerDatosCurso(curso) {
        const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h4').textContent,
            precio: curso.querySelector('.precio span').textContent,
            id: curso.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let cursosLS;
        cursosLS = this.obtenerCursosLocalStorage();
        cursosLS.forEach(function(cursoLS){
            if(cursoLS.id === infoCurso.id){
                cursosLS = cursoLS.id;
            }   
        });

        if(cursosLS === infoCurso.id){
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El producto ya está agregado',
                showConfirmButton: false,
                timer: 1000
            })     
        }
        else {
            this.insertarCarrito(infoCurso);
        }
    }

    //muestra curso seleccionado en carrito
    insertarCarrito(curso) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width=100>
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>
                <a href="index.html.html" class="borrar-curso fas fa-times-circle" data-id="${curso.id}"></a>
            </td>
        `;
        listaCursos.appendChild(row);
        this.guardarCursoLocalStorage(curso);
    }

    //Eliminar el curso del carrito en el DOM
    eliminarCurso(e) {
        e.preventDefault();
        let curso, cursoID;
        if (e.target.classList.contains('borrar-curso')) {
            e.target.parentElement.parentElement.remove();
            curso = e.target.parentElement.parentElement;
            cursoID = curso.querySelector('a').getAttribute('data-id');
        }        
        this.eliminarCursoLocalStorage(cursoID);
        this.calcularTotal();
    }

    //Almacenando en el ls
    guardarCursoLocalStorage(curso) {
        let cursos;
        //Toma valor de un arreglo con datos del LS
        cursos = this.obtenerCursosLocalStorage();
        //Agregar el curso al carrito
        cursos.push(curso);
        //Agregamos al LS
        localStorage.setItem('cursos', JSON.stringify(cursos));

    }

    //Comprueba que haya elementos en LS
    obtenerCursosLocalStorage() {
        let cursosLS;

        //Comprobados si hay algo en ls
        if (localStorage.getItem('cursos') === null) {
            cursosLS = [];
        }
        else {
            cursosLS = JSON.parse(localStorage.getItem('cursos'));
        }
        return cursosLS;
    }

    //Elimina los productos del carrito
    vaciarCarrito(e) {
        e.preventDefault();

        while (listaCursos.firstChild) {
            listaCursos.removeChild(listaCursos.firstChild);
        }

        //Vaciar LS
        this.vaciarLocalStorage();

        return false;
    }

    //Imprime los cursos de LS en el carrito
    leerLocalStorage() {
        let cursosLS;
        cursosLS = this.obtenerCursosLocalStorage();

        cursosLS.forEach(function (curso) {
            //Construir el template
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${curso.imagen}" width=100>
                </td>
                <td>${curso.titulo}</td>
                <td>${curso.precio}</td>
                <td>
                    <a href="index.html.html class="borrar-curso fas fa-times-circle" data-id="${curso.id}"></a>
                </td>
            `;
            listaCursos.appendChild(row);
        });

    }

    //Imprime los cursos de LS en el carrito
    leerLocalStorageCompra() {
        let cursosLS;
        cursosLS = this.obtenerCursosLocalStorage();
        cursosLS.forEach(function (curso) {
            //Construir el template        
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${curso.imagen}" width=100>
                </td>
                <td>${curso.titulo}</td>
                <td>${curso.precio}</td>
                
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${curso.cantidad}>
                </td>
                <td id="subtotall">${curso.precio * curso.cantidad}</td>
                <td>
                    <a href="index.html.html" class="borrar-curso fas fa-times-circle" style="font-size:30px" data-id="${curso.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    //Eliminar curso por ID del LS
    eliminarCursoLocalStorage(cursoID){
        let cursosLS;
        //Obtenemos el arreglo de cursos
        cursosLS = this.obtenerCursosLocalStorage();
        //Comparamos el id de curso borrado con LS
        cursosLS.forEach(function(cursoLS, index){
            if(cursoLS.id === cursoID){
                cursosLS.splice(index,1);
            }
        });
        //Añadimos el arreglo actual a storage
        localStorage.setItem('cursos', JSON.stringify(cursosLS));
    }

    //Elimina los cursos del LS
    vaciarLocalStorage(){
        localStorage.clear();
    }

    //Procesando compra
    procesarPedido(e){
        e.preventDefault();
        console.log();
        if(this.obtenerCursosLocalStorage().length === 0){            
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'El carrito está vacío',
                    showConfirmButton: false,
                    timer: 2000
                })
        }
        else{
            location.href="index.html.html";
        }
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, curso, cursoLS;
        console.log(e.target.classList);
        if (e.target.classList.contains('cantidad')) {
            curso = e.target.parentElement.parentElement;
            id = curso.querySelector('a').getAttribute('data-id');
            cantidad = curso.querySelector('input').value;
            let cursosLS = this.obtenerCursosLocalStorage();
            cursosLS.forEach(function (cursoLS, index) {
                if (cursoLS.id === id) {
                    cursoLS.cantidad = cantidad;
                }

            });
            localStorage.setItem('cursos', JSON.stringify(cursosLS));
        }
    }


    calcularTotal() {
        let cursosLS;
        let total = 0, igv = 0, subtotal = 0;
        cursosLS = this.obtenerCursosLocalStorage();
        for (let index = 0; index < cursosLS.length; index++) {
            let element = Number(cursosLS[index].precio * cursosLS[index].cantidad);
            total = total + element;

        }
        igv = parseFloat(total * 0.18).toFixed(2);
        subtotal = parseFloat(total - igv).toFixed(2);

        document.getElementById('subtotal').innerHTML = "S/. " + subtotal;

        document.getElementById('igv').innerHTML = "S/. " + igv;
        document.getElementById('total').innerHTML = "S/. " + total.toFixed(2);
    }

    procesarCompra(e){
        e.preventDefault();
        console.log();
        if(this.obtenerCursosLocalStorage().length === 0){            
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'No hay productos, regresa a comprar',
                showConfirmButton: false,
                timer: 2000
            })
            setTimeout(() => {
                location.href="index.html.html";    
            }, 2000);

        }
        else{
            location.href="compra.html";
        }
    }

}