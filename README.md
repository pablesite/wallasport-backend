
# Wallasport Backend V 1.0

Backend desarrollado en Node con express en el contexto de la práctica final del bootcamp de Desarrollo de Aplicaciones Web de Keepcoding. Año 2019/2020. --> [wsbackend.codinglab.es](https://wsbackend.codinglab.es/)

Wallasport es una plataforma que permite la compra y venta de productos de segunda mano relacionados con el deporte.


**Table de Contenidos**

[TOCM]

[TOC]

## Detalles del desarrollo
### Consideraciones generales
* La arquitectura seleccionada es de tipo API/REST, donde el [frontal](https://wsfrontend.codinglab.es/) está desarrollado con React y la parte de [backend](https://wsbackend.codinglab.es/) está desarrollada con express en node, y usa una base de datos basada en MongoDB.
* Todo el sistema está alojado en una instancia EC2 de Amazon Web Service bajo el dominio codinglab.es.
* Wallasport tiene integrados dos idiomas, inglés y español. Está perfectamente preparada preparada para añadir cuantos idiomas sean necesarios en el futuro.

### Detalles técnicos a destacar
#### Relativos a la arquitectura
* Se ha llevado especial atención en la securización del sistema.
	* Cambio de puerto por defecto de SSH
	* Uso de proxys inversos en nginx con el fin de no abrir puertos innecesarios al exterior.
	* El usuario que maneja las aplicaciónes no tiene posibilidad de login desde fuera.
	* Base de datos Mongo securizada a nivel administración. Además, tiene un usuario específico para manejar la conexión a la base de datos.
	* Despliegue automático de las aplicaciones con pm2.
	* Scripts de shell preparados para un despliegue semi-continuo.


#### Relativos a Express y Mongo
* Se ha usado MongoDB como base de datos con ayuda de la librería mongoose.
* Se ha usado la autenticación por JWT. Para ello se usa la librería jsonwebtoken de node.
* Se han generado dos modelos independientes para la gestión de los controladores (Usuario y Anuncio)
* Se han creado índices para aquellos parámetros de los módelos que requerían de búsquedas posteriores.
* Se ha hecho uso de referencias y búsquedas de tipo populate para:
	* Relacionar los anuncios favoritos en el modelo Usuario.
	* Relacionar el propietario de un anuncio en el modelo Anuncios
	* El controlador de usuarios se hace usando la potencia de los 'use' de express.
	* El controlador de anuncios por el contrario, se hace tipo clase para poder relacionar rutas públicas y privadas a funciones específicas.
* Se han configurado los CORS de manera que se acepten peticiones de tipo app exclusivamente desde la URL del frotal de Wallasport.
* Para la gestión de imágenes, tanto de los usuarios como de los productos, se ha usado el paquete multer que:
	* Hace que las peticiones deban ser de tipo formdata
	* Almacena los archivos en la carpeta /public/img en el propio servidor de backend.


#### Batería de tests
* Se han usado Supertests con Jest para probar las respuestas de la API a diferentes rutas


#### Otros
* La API queda preparada para paginar, aceptando para ello parámetros tales como limit o skip.
* Se hace uso de un fichero .env para almacenar las variables de entorno privadas.
* Se ha dejado preparado el controlador de Email para implementar futuras funcionalidades.
* Se ha dejado preparado el uso de microservicios para futuras funcionalidades.


### Historias de usuario completadas (backend + frontend)
#### Zona pública
1. Registro de usuario
	* Un usuario se registra indicando username, email, password y photo.
	* El usuario y el email son campos únicos. No pueden repetirse en base de datos.
	* En esta versión no hay limitación de registro de usuarios ni ningún sistema de tipo captcha. Sería importante para futuras versiones.
2. Login de usuario
	* Un usuario se loguea indicando username y password.
3. Ver listado de últimos anuncios
	* El listado de los productos se muestra en páginas de 8 anuncios cada vez. 
	* Se muestran por orden cronológico, por defecto los más recientes primero.
	* El listado es consistente con los demás listados de productos de la aplicación.
4. Buscar (y encontrar) anuncios
	* Hay un desplegable debajo del header que permite acceder a las opciones de filtrado.
	* Se puede filtrar por nombre, rango de precio y etiqueta.
	* El rango de precio se indica como: [min-max]. Para ello se ha usado una exreg que hace que en el campo precio no se pueda escribir nada que no vaya en línea con lo previsto.
	* La búsqueda por etiqueta permite sólo una a la vez. 
	* El resultado de la búsqueda de nuevo es en orden cronológico, consistente y paginado.
5. Ver deatalle de un anuncio
	* Cada producto tiene su propia URL en la que se muestran todos los detalles del mismo.
	* La URL es SEO-friendly. Se usa el slugName para identificar el producto.
	* Se permite compartir el auncio en redes sociales idependientemente del tipo de usuario.
	* Se permite interactuar (marcar como favorito, reservado, vendido) con el producto siempre y cuando el usuario sea de tipo miembro.
6. Compartir un anuncio en redes sociales
	* Desde la vista detalle de producto se permite compartir el mismo en twitter y facebook. 
7. Ver anuncios de un miembro
	* Pinchando en el nombre de un miembro (mostrado en los productos, tanto en el listado como en el detalle), se listan todos sus productos.
	* La URL del miembro es su nombre de usuario.
	* Al igual que en el resto de listados, se muestran en orden cronológico, de manera consistente y paginados.
8. Ver anuncios más antiguos o más recientes
	* En el desplegable de filtrado se ha incluido la posibilidad de escoger el orden en el que se listan los anuncios. 
		* Decreciente (por defecto)
		* Creciente

#### Zona privada
9. Baja de usuario
	* Un miembro se puede dar de baja desde la vista principal de usuario.
	* Se borra completamente de base de datos así como, por supuesto, del LS y del estado de Redux.
10. Actualización de datos de usuario
	* Un usuario puede acceder a su perfil para editar todos sus parámetros, incluida la foto y la contraseña.
	* Sin embargo, no puede cambiar ni su usario ni su email por alguno que ya esté usado en la plataforma.
11. Logout de usuario
	* Un usaurio puede hacer logout de la aplicación, elimnando así todo rastro de él mismo en el navegador y en la propia aplicación.
12. Ver listado de todos mis anuncios
	* Un usario puede acceder a un listado de todos sus productos desde el menu de usuario.
13. Crear un anuncio
	* Un usuario de tipo miembro es el único que puede crear productos, en este caso con una opción en la cabecera.
14. Editar un anuncio
	* Un usuario de tipo miembro puede editar el producto siempre y cuando lo haya creado él.
15. Borrar un anuncio
	* Un usuario de tipo miembro puede eliminar el producto siempre y cuando lo haya creado él.
	* Dado que la operación es irreversible, se advierte antes de proceder a ejecutarla.
16. Marcar/desmarcar anuncio como reservado
	* Un usuario puede marcar/desmarcar un producto como reservado siempre y cuando lo haya creado él.
17. Marcar/desmarcar anuncio como vendido
	* Un usuario puede marcar/desmarcar un producto como vendido siempre y cuando lo haya creado él.
18. Ver anuncios favoritos
	* Un usuario puede ver un listado de sus productos favoritos desde el menu de usuario.
19. Guardar anuncio como favorito
	* Un usuario de tipo miembro puede marcar/desmarcar un producto como favorito idependientemente del autor del mismo.
20. Eliminar un anuncio como favorito
	* Un usuario puede eliminar un producto siempre y cuando lo haya creado él.
	* Dado que la operación es irreversible, se advierte antes de proceder a ejecutarla.

### Limitaciones
* Aunque está preparado en la API, no se ha implementado un servicio de envío de emails por el momento. Esto implica que hay varias funcionalidades que quedan pendientes:
	* No se puede recuperar contraseña.
	* No hay notificaciones de ningún tipo. Ni para favoritos, ni para cambios de precio ni para chats)
	* No se reciben email de anuncios de interés.
* El chat se deja para una versión posterior.



## Información técnica sobre la API  

### Instalando la aplicación
WallaSport está subida en el repositorio público de GitLab:
https://gitlab.keepcoding.io/pablesite/wallasport-backend

Como con cualquier repositorio, se puede clonar, en el directorio en el que estemos posicionados, con:

```bash
git clone https://gitlab.keepcoding.io/pablesite/wallasport-backend
```
A continuación hay que instalar los módulos necesarios:

```bash
npm install
```

## Requisito - MongoDB

La instalación de MongoDB no es objeto de este README. Cada SO tiene sus particularidades. 

Una vez instalado, en Windows el servicio debe arrancar de manera predeterminada. En Linux o Mac puedes arrancar el servidor local de mongoDB con:

```bash
./bin/mongodb --dbpath ./data/db --directoryperdb
```
¡Atención a las rutas que has usado en tu instalación!

A partir de este momento, tenemos la API instalada y la base de datos preparada. Aún hay que introducir datos en la base de datos y arrancar la API.

---------------------
Make a copy of .env.example to .env and review the values.

## Inicialización de la base de datos.
Es recomendable inicializar la base de datos la primera vez que se empieza a usar la API. Para esto, se ha preparado un fichero llamado 'archivos.json' con 10 anuncios predefinidos. No es recomendable modificarlo, aunque si se quieren añadir o editar anuncios que se carguen en la inicialización, este es el sitio.

Para inicializar la base de datos hay que escribir en consola:

```bash
npm run db
```
A partir de aquí, ya hay anuncios en la base de datos.

## Arranque de la API

Para arrancar la API, hay dos posibilidades, arrancarla en modo producción o en modo desarrollo.

El modo desarrollo usa nodemon, lo cual es cómodo siempre que estés trabajando sobre una nueva funcionalidad o estés trabajando sobre una incidencia.

```bash
npm run dev
```

El modo producción es el recomendado para el uso de la API por terceros. Este hace un arranque típico con npm (run) start.

```bash
npm run prod
```

Al fin ya está todo listo. La API está preparada para recibir consultas.


## Cómo usar la API

Esta API ofrece la siguiente funcionalidad:
* Lista de anuncios con posibilidad de paginación.
   1. Filtros por tag
   2. Filtros por rango de precio (precio min. y precio max.)
   3. Filtros por nombre de artículo

* Lista de tags existentes
* Creación, edición y borrado de anuncios.
* Creación, edición y borrado de usuarios.

### Listado de anuncios con filtros

Para filtrar anuncios, dirígete a la URL:

```bash
https://wsbackend.codinglab.es/apiv1/anuncios
```
Esta URL devuelve el listado de todos los anuncios que hay en base de datos. 
Podemos filtrar:
1. Por tag: 
```bash
?tag='nombre_tag1'&tag='nombre_tag2'
```
   Devuelve los anuncios que contienen los tags indicados. 
   Si se pasan más tags a la URL, hará una función OR y devolverá   los anuncios que contengan al menos una de las tags indicadas.

2. Por rango de precio (precio min. y precio max.):
```bash
?precio='preciomin'-'preciomax'
```
Devuelve los anuncios con rango de precio entre preciomin y preciomax €.
Se usa un parámetro en la query string llamado precio que tiene una de estas combinaciones :
* 10-50 buscará anuncios con precio incluido entre estos valores { precio:
{ '$gte': '10', '$lte': '50' } }
* 10- buscará los que tengan precio mayor que 10 { precio: { '$gte':
'10' } }
* -50 buscará los que tengan precio menor de 50 { precio: { '$lte':
'50' } }
* 50 buscará los que tengan precio igual a 50 { precio: '50' }

3. Por nombre:
```bash
?nombre='iniciales_nombre'
```
Devuelve los anuncios los cuales su nombre empieza por iniciales_nombre

5. Funciones especiales (skip, limit, fields y sort)
Estos 4 parámetros también se pueden pasar a la URL de manera que el GET se complete y sea todo lo preciso que se desee.
```bash
?skip='nº'
```
Salta el número de anuncios indicado en nº.

```bash
?limit='nº'
```
Limita el número de anuncios al indicado en nº.

```bash
?fields='nombre_campo'
```
Muestra sólo el campo indicado en nombre_campo.

```bash
?sort='nombre_campo'
```
Ordena la consulta por el campo indicado en nombre_campo.


Los filtros se pueden combinar, de manera que puede quedar una consulta como la siguiente:
```bash
https://localhost:3002/apiv1/anuncios?tag=mobile&venta=false&no
mbre=ip&precio=50-&skip=3&limit=2&sort=precio
```

### Listado de tags existentes
Para devolver la lista de tags disponible en los anuncios existentes en nuestra base de datos, dirígete a la URL:

```bash
https://wsbackend.codinglab.es/apiv1/tags
```
Esta URL devuelve el listado de las tags disponibles en los anuncios, sin repetirlas. Como máximo, se pueden listar las 4 tags disponibles.
* work
* mobile
* motor
* lifestyle

### Creación, edición y borrado de un anuncio 

La API tiene disponible la creación, edición y borrado de un anuncio.
Para ello habrá que usar un software de peticiones tipo Postman. El uso de este tipo de software queda fuera del alcance de esta documentación.
Sí que cabe comentar los tipos de peticiones de cada función:
* Creación de anuncio 
Petición POST a la URL https://wsbackend.codinglab.es/apiv1/
* Actualización de un anuncio
Petición PUT a la URL https://wsbackend.codinglab.es/apiv1/:slugName
* Borrado de un anuncio
Petición DELETE a la URL https://wsbackend.codinglab.es/apiv1/:slugName

Si se quieren probar estas funciones, se deberá conocer el modelo a la hora de introducir el body de la petición (Nuevo: Ahora peticiones de tipo 'form-data'):
    - nombre: String
    - venta: Boolean
    - precio: Number
    - foto: String --> NUEVO: foto: File
    - tag: [String]
	...


## Licencia
[Pablo Ruiz Molina] Repositorio público para el Bootcamp de Desarrollo Web de Keepcoding.