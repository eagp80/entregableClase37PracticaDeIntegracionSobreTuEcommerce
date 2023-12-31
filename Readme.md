
# CORRESPONDE  A ENTREGABLE CLASE 37 PRÁCTICA DE INTEGRACIÓN
###  RUTAS
        - Ruta de inicio, de entrada a la api (redirige al login): 
        http://localhost:8000/api/v1/

        - Para recuperar contraseña, entrar a ruta de arriba, clic en boton donde dice Ir a formulario de restauración de contraseña

        - Ruta patra crear ticket de compra (metodo POST, con postman) http://localhost:8000/api/v1/carts/:cid/purchase

        - Ruta de mocking, generando 50 productos con faker en localhost:8000/api/v1/mockingproducts.

        - Ruta de creacion de producto con postmnan mediante metodo post y raw json http://localhost:8000/api/v1/products/ .
        
        - La ruta anterior valida si las propiedades requeridas del producto a crear  son enviadas  y envia mensaje personalizado con error-handler y Http-Status-Code.

        - Ruta de usuario actual logueado (muestra usuario examinando token):
        http://localhost:8000/api/v1/session/current

        - Ruta de usuario actual logueado por id (muestra usuario examinando BD en Mongo Atlas):
        http://localhost:8000/api/v1/session/current/:uid

###  SERVIDOR DE PRODUCTOS Y CARRITOS CON EXPRESS, VISTAS CON EXPRESS-HANDLEBARS, BASE DE DATOS MANEJADA CON MONGOOSE HACIA MONGO ATLAS (PRONTO TENDRÁ WEBSOCKET PARA CHAT CON SOCKETS.IO). 
### ADEMÁS TIENE: MANEJO DE VARIABLES DE ENTORNO CON dotenv CAMBIO DE VARIABLES DE ENTORNO DURANTE EJECUCIÓN CON cross-env, SE MUESTRAN RUTAS EN TABLA EN CONSOLA LADO BACKEND CON express-routemap, (PRONTO TENDRÁ MANEJO DE ARCHIVOS CON MULTER).

### Como usar la app:
<h2>Ruta de inicio, de entrada a la api (redirige al login): http://localhost:8000/api/v1/</h2>
<h2> Para recuperar contraseña, entrar a ruta de arriba, clic en boton donde dice Ir a formulario de restauración de contraseña </h2>
<h2>Ruta patra crear ticket de compra (metodo POST, con postman) http://localhost:8000/api/v1/carts/:cid/purchase <h2>
<h2> Ruta de mocking, generando 50 productos con faker en localhost:8000/api/v1/mockingproducts </h2>

<h2> Ruta de creacion de producto con postmnan mediante metodo post y raw json http://localhost:8000/api/v1/products/</h2>
<h2>La ruta anterior valida si las propiedades requeridas del producto a crear  son enviadas  y envia mensaje personalizado con error-handler y Http-Status-Code</h2>
<h2> Ruta de inicio, de entrada a la api:   </h2>
<h4> http://localhost:8000/api/v1/  la cual redirige al login </h4>

 <h2>Ejemplos de rutas:</h2>
        Ruta de inicio, de entrada a la api (redirige al login): 
        http://localhost:8000/api/v1/

        Para recuperar contraseña, entrar a ruta de arriba, clic en boton donde dice Ir a formulario de restauración de contraseña. Se enviara un corro al email con un link que contiene un token valido por 30 min.
        
        Ruta para cambiar role de usuario de USER a PREMIUM y viceversa:
        http://localhost:8000/api/v1/users/premium/:uid

        Ruta para crear producto:
        Se debe ser PREMIUM , se loguea desde POSTMAN, se copia el token en authorization, bear token, desde POSTMAN se crea producto metodo POST a la ruta http://localhost:8000/api/v1/products/, pegando el token en authorization, bear token, y escribiendo los clave:valor de producto en el body, raw, JSON. El servidor creara el producto con la propiedad owner: email del usuario que lo creo.

        Ruta eliminar y actualizar producto solo las pueden acceder ADMIN o PREMIUM, el owner de un producto y ADMIN son quienes pueden eliminar y actualizar un producto, las rutas son:
        Desde POSTMAN metodo DELETE  http://localhost:8000/api/v1/products/:pidmetodo metodo PUT http://localhost:8000/api/v1/products/:pid, respectivamente

        Ruta para agregar producto a carrito siendo PREMIUM:
        debe loguearse desde navegador, aparece vista de productos debe  agregar un producto credao por ese usuario al carrito se vera que no deja agregarlo.

        Ruta patra crear ticket de compra (metodo POST, con postman) http://localhost:8000/api/v1/carts/:cid/purchase

        Ruta de usuario actual logueado:
        http://localhost:8000/api/v1/session/current

        Ruta de usuario actual logueado por id:
        http://localhost:8000/api/v1/session/current/:uid

        Para obtener todos los productos detalladamemnte en formato JSON (método GET)::
        http://localhost:8000/api/v1/products/

        Para ver resumen de todos los carritos (método GET):
        http://localhost:8000/api/v1/views/carts/

        Para la paginación desde mongo atlas con limit, sort y query (método GET):
        http://localhost:8000/api/v1/views/products?page=1&limit=3&sort={"code":1}&query={"description": "Desde fromulario con socket"}
## Consigna. Se está requiriendo lo siguiente:
- Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos.

### TESTEO:
- 


### Formato

- Link al repositorio de Github con el proyecto completo, sin la carpeta de node_modules. ((Hecho)).

### Sugerencias
- Te recomendamos testear muy bien todas las políticas de acceso. ¡Son la parte fuerte de este entregable!

### Aspectos a incluir
- Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla).
    - link del correo debe expirar después de 1 hora de enviado.
    - Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña.
    - Si el link expiró, debe redirigir a una vista que le permita generar nuevamente el correo de restablecimiento, el cual contará con una nueva duración de 1 hora.
- Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos.
- Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto.
    - Si un producto se crea sin owner, se debe colocar por defecto “admin”.
    - El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios premium).
- Modificar los permisos de modificación y eliminación de productos para que:
    - Un usuario premium sólo pueda borrar los productos que le pertenecen.
    - El admin pueda borrar cualquier producto, aún si es de un owner.
- Además, modificar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece.
- Implementar una nueva ruta en el router de api/users, la cual será /api/users/premium/:uid  la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.



## Rutas para servidor con file-system en puerto 8081 (se deshabilito, es decir, se comentó en el código):

- Carritos: (se deshabilitó, es decir, se comentó en el código):
    - /api/carts/:cid   GET_BY_CID  trae carrito cid en formato JSON.
    - /api/carts/   POST crea un carrito nuevo vacío.
    - /api/carts/:cid/product/:pid  POST agregar producto pid a carrito cid.
    - En api/carts/  No hay PUT ni DELETE.

- Productos:(se deshabilitó, es decir, se comentó en el código):
    - /api/products/:pid GET_BY_PID muestra carrito pid en formato JSON, PUT con postman body y params, DELETE con postman y params.
    - /api/products/ GET de todos los productos en formato JSON y no hay formulario, POST con postman y body.
    - /api/products?limit=NUM GET muestra los primeros NUM productos en formato JSON. Utiliza req.query.

    - Adicionalmente, en localhost:8081/index2.html se tiene un formulario html para hacer POST de product.

- Socket IO:(se deshabilitó, es decir, se comentó en el código):
    - /    GET    Tiene socket. Utiliza vista "home.handlebars" y muestra lista de todos los productos en html. No tiene formulario.
    - /realtimeproducts  GET   Tiene socket. Utiliza vista "realTimeProducts.handlebars" y Tiene formulario para hacer post de product, muestra Lista de productos, al crear un producto nuevo lo muestra resaltado en una tabla y agrega al final de la lista mostrada el nuevo producto en html.

## Rutas para servidor con Mongo-Atlas en puerto 8000:

# Rutas carritos con Mongo:

- Ver la imagen en carpeta: imagenes explicativas.

# Rutas productos con Mongo:

-  Ver la imagen carpeta: imagenes explicativas.

# Rutas de  views (carritos y productos) con Mongo: 

- Ver la iamgen en carpeta carpeta: imagenes explicativas.

# Funcionamneto del codigo:
 - Al hacer clic en boton de recuperar contraseña se produce un GET hacia la ruta localhost:8000/api/v1/recover donde renderiza  a la vista recover.handlebars, aca se muestra una casilla para introducir el correo electronico al dar click en boton enviar se realiza un POST a /api/v1/session/forgot-password aca se enviara un link de recuperacion a ese correo el link contiene un token que durara una hora.

 - El boton que se envia al correo dirige con GET a http://localhost:8000/api/v1/set-new-password/:token En este endpoint se renderiza a la vista setNewPassword.handlebars donde se tiene un formulario con dos casillas para colocar la nueva contraseña y confirmarla.

 - El fromulario reenvía con un POST a la misma ruta http://localhost:8000/api/v1/set-new-password/:token

 -  A dicho endpoint se envia el toquen por req.params y la contraseña por req.body , en dicho endpoint se verifica el token, se busca el usuario en la base de datos, se verifica que no sean iguales la contraseña hasheada en base de datos con la nueva contraseña que envia el usuario por fromulario (con isValidPasswd), se hashea la nueva contraseña, se actualiza o cambia la contraseña vieja por la nueva hasheada, se envia respuesta de contraseña cambiada a usuario. En caso de error se redirige a localhost:8000/api/v1/recover
