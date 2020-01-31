# Nodepop (avanzado)

Nodepop es una API de demostración de un servicio de venta de artículos de segunda mano. Está especialmente diseñada para desarrolladores de iOS o Android.

El servicio mantiene anuncios de compra o venta de artículos y permite el filtrado por varios criterios.

## Novedades de la versión avanzada
* Nodepop avanzado ahora usa el protocolo seguro https. 

* Nodepop avanzado se actualiza incorporando la plantilla de bootstrap 'Business Casual'. Además, se ha customizado ligeramente para adaptarla a las necesidades del proyecto. En cualquier caso, el diseño no es la clave en esta aplicación.

* Nodepop avanzado hace uso de un fichero .env para almacenar los password y en general información privada que no se actualiza en el repositorio.

Al copiar el repositorio por primera vez se debe copiar el .env_example y actualizar los password. Para facilitar la tarea en la corrección de la práctica se indican a continuación 3 password necesarios:

JWT_SECRET = '"VTLSUM9Fgamktc+&w5w$A-Tay629~kBn}y7E[^^ZC"s!h7WE`/hrX}Zt_@_k@jv';

PASSWORD_ADMIN = '1234'

PASSWORD_PABLO = '1234'

* Nodepop avanzado permite el cambio de idioma mediante banderas en el menu principal.
Esta funcionalidad hace efecto en las todas las vistas de la aplicación así como en las respuestas de la API. 

* Nodepop avanzado incorpora usuarios que usa en logueo del tipo JWT y del tipo Sesión.
Se reaprovecha el script de incialización de base de datos para crear dos usuarios por defecto.
```bash
 npm run db
```

* Nodepop avanzado cuenta con logueo JWT para la API. 

Se puede conseguir un token desde la siguiente URL:

https://localhost:3002/apiv1/login

con el usuario:

user: admin@example.com

pass: 1234

Lo natural es realizar peticiones desde postman o algún sw similar, introduciendo el token ya sea por queryparams o en el propio body. No obstante, se ha habilitado en la vista un formulario sencillo para introducir el token y poder acceder desde la propia vista principal a la API.

* Nodepop avanzado cuenta con logueo de sesión para consumir las peticiones desde la vista. Usa el mismo usuario que en el caso anterior.

Se puede hacer login/logout desde el menu principal, así como acceder a una vista de test sencilla (Front Anuncios). Esta última sólo está disponible si el logueo se ha producido.

* Nodepop avanzado cuenta con subida de fotos para los anuncios.

Ahora las peticiones POST de Postman deben realizarse de tipo 'form-data' y cambiar el tipo de archivo de foto. Pasa de ser un string (donde se introducía a mano la url) a ser un fichero seleccionable desde el propio Postman.

ATENCIÓN: Tal cual está programado, la subida de fichero no está securizada. Es decir, al hacer la petición POST, primero se sube la foto, después se comprueba el token, y a continuación se crea el anuncio si el token es válido. Este bug queda pendiente de mejora.

* Nodepop avanzado usa microservicios para la generación de thumbnail de cada foto que se sube.

Se han creado un Cliente y un Servidor. 

El Cliente lanza la petición de generar un thumbnail con la url de una imagen recien subida al servidor. Es decir, arranca inerentemente con la propia aplicación.

El Servidor recibe la petición, genera el thumbnail de la imagen, la guarda en la misma carpeta y responde con la url de la imagen. Para arrancarlo:

Ir a /lib/microservices y ejecutar:

```bash
node thumbnailService.js
```

Nota 1: El Cliente se lanza justo antes de guardar el anuncio en base de datos. De esta manera está asegurado que la foto ya está subida y no hay problemas.

Nota 2: Cliente y Servidor están instalados en el mismo repositorio por comodidad. Lo ideal sería tener instalado el Servidor en otro repositorio, e incluso en otra máquina.  


## Instalando Nodepop Avanzado
Nodepop está subida en el repositorio público de GitLab:
https://gitlab.keepcoding.io/pablesite/practica-backend-avanzado.js

Como con cualquier repositorio, se puede clonar, en el directorio en el que estemos posicionados, con:

```bash
git clone https://gitlab.keepcoding.io/pablesite/practica-backend-avanzado.js
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
Es recomendable inicializar la base de datos la primera vez que se empieza a usar la API. Para esto, se ha preparado un fichero llamado 'archivos.json' con 6 anuncios predefinidos. No es recomendable modificarlo, aunque si se quieren añadir o editar anuncios que se carguen en la inicialización, este es el sitio.

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
   2. Filtros por tipo de anuncio (venta o búsqueda)
   3. Filtros por rango de precio (precio min. y precio max.)
   4. Filtros por nombre de artículo

* Lista de tags existentes

* Creación, edición y borrado de un anuncio.

### Listado de anuncios con filtros

Para filtrar anuncios, dirígete a la URL:

```bash
https://localhost:3002/apiv1/anuncios
```
Esta URL devuelve el listado de todos los anuncios que hay en base de datos. 
Podemos filtrar:
1. Por tag: 
```bash
?tag='nombre_tag1'&tag='nombre_tag2'
```
   Devuelve los anuncios que contienen los tags indicados. 
   Si se pasan más tags a la URL, hará una función OR y devolverá   los anuncios que contengan al menos una de las tags indicadas.
2. Por tipo de anuncio:
```bash
?venta='boolean'
```
   Devuelve los anuncios que son de tipo venta si es true. 
   Con un false devolvería los de tipo 'Se busca'

3. Por rango de precio (precio min. y precio max.):
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

4. Por nombre:
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
https://localhost:3002/apiv1/tags
```
Esta URL devuelve el listado de las tags disponibles en los anuncios, sin repetirlas. Como máximo, se pueden listar las 4 tags disponibles.
* work
* mobile
* motor
* lifestyle

### Creación, edición y borrado de un anuncio 
ATENCIÓN: Revisar las novedades en el primer apartado de la documentación
La API tiene disponible la creación, edición y borrado de un anuncio.
Para ello habrá que usar un software de peticiones tipo Postman. El uso de este tipo de software queda fuera del alcance de esta documentación.
Sí que cabe comentar los tipos de peticiones de cada función:
* Creación de anuncio 
Petición POST a la URL https://localhost:3002/apiv1/
* Actualización de un anuncio
Petición PUT a la URL https://localhost:3002/apiv1/:id
* Borrado de un anuncio
Petición DELETE a la URL https://localhost:3002/apiv1/:id

Si se quieren probar estas funciones, se deberá conocer el modelo a la hora de introducir el body de la petición (Nuevo: Ahora peticiones de tipo 'form-data'):
    - nombre: String
    - venta: Boolean
    - precio: Number
    - foto: String --> NUEVO: foto: File
    - tag: [String]
## Uso de la Página Web
Además de la funcionalidad de la API como tal, se ha preparado una página web muy sencilla con el único objetivo de mostrar la potencia de la API. 
La web se ha creado con el motor de vistas ejs.
Se puede acceder con la siguiente url:
```bash
https://localhost:3002/anuncios
```
Esta web permite visualizar los anuncios ligeramente maquetados. Además tiene un par de funcionalidades extras.
* Buscar
Permite introducir una cadena de búsqueda y devuelve los anuncios que empiecen por esa cadena de búsqueda.
* Paginación
Permite paginar el listado de anuncios de 3 en 3. Dado que es un ejemplo muy básico, el nº de anuncios por página se ha escogido estáticamente. 
Sin embargo, si la lista de anuncios crece, la paginación crece dinámicamente.
Notar por otra parte, que en la carga inicial de la web, esta no pagina. La funcionalidad se puede probar bajando al final de la web y pinchando en los números de página.

## Test de código con la herramienta Eslint
Como último punto de la documentación, cade destacar el uso de la herramienta Eslint para la revisión de estilo de código y de los posibles bugs.
Se han probado tan sólo unos pocos filtros y se ha comprobado la potencia de la misma. En futuras versiones de la API se pueden introducir más "rules" y obtener así el máximo partido que la herramienta proporciona.
No obstante, para testear los filtros implementados, se puede ejecutar directamente desde consola de la siguiente forma:

* Testear app.js:
```bash
 npm run testapp
```

* Testear /routes:
```bash
npm run testroutes
```

* Testear /models:
```bash
npm run testmodels
```

* Testear /lib:
```bash
npm run testlib
```
* Testear /public:
```bash
npm run testpublic
```

## Licencia
[Pablo Ruiz Molina] Repositorio público para el Bootcamp de Desarrollo Web de Keepcoding.