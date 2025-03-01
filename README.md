# COPEREX

# Si desea ver la documentacion, Utilize:

http://127.0.0.1:3001/api-docs/

# En el apartado de listar tendra estas opciones:

{
  "minYears": 1,
  "maxYears": 100,
  "categoryOrder": "asc",
  "downloadExcel": false
}

si desea descargar el archivo excel, cambie el dato  "downloadExcel": false  a true y utilize la opcion dentro de postman "Send and Download".

# Para editar el orden de la categoria:
Inicialmente tiene este dato: "categoryOrder": "asc" para ordenarlo de A - Z
pero lo puede modificar a "categoryOrder": "desc" para ordenarlo en orden de Z - A

# Si desea probar que los años de experiencia se actualizen.
Puede irse dentro del modelo a la funcion updateYearsOfExperience y alli puede modificar const currentYear = new Date().getFullYear();
y colocar en vez de la fecha actual, colocar un numero como 2026, 2027, etc. donde pueda observar que la funcion actualiza los años de
experiencia al momento de listar o actualizar.
