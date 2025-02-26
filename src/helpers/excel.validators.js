import ExcelJS from "exceljs"


export const generateExcel = async (companies) => {

    //Aqui se crea basicamente un libro de excel.
    const workbook = new ExcelJS.Workbook();
    //Agrego una hoja de trabajo con el nombre de worksheet dentro workbook con el nombre Empresas
    const worksheet = workbook.addWorksheet("Empresas");

    //Programamos como se vera dentro del documento excel.
    worksheet.columns = [

        /*header es el nombre como aparecera dentro del documento
        key es el identificador en otras palabras los campos y width el ancho de la columna.
        */
        { header: "Nombre", key: "name", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Teléfono", key: "phone", width: 15 },
        { header: "Nivel de Impacto", key: "levelImpact", width: 20 },
        { header: "Años de Experiencia", key: "yearsOfExperience", width: 20 },
        { header: "Categoría", key: "category", width: 20 },
        { header: "Estado", key: "status", width: 10 }

    ];

    //Creo un array que va a recorrer las empresas que hay y por cada empresa que hay se agrega una nueva fila.
    companies.forEach(company => {
        /*Digamos aca por ejemplo por cada empresa se agrega una fila con la funcion "addRow" 
        con los campos de la empresa como serian el name, email phone etc.*/
        worksheet.addRow({
            name: company.name,
            email: company.email,
            phone: company.phone,
            levelImpact: company.levelImpact,
            yearsOfExperience: company.yearsOfExperience,
            category: company.category,
            //Si es verdadero o true se coloca dentro de la hoja de excel como activo y si es false se coloca como inactivo.
            status: company.status ? "Activo" : "Inactivo"
        });
    });

    // Se convierte el archivo a un buffer para poder enviarlo como respuesta osea en otras palabras es un formato de datos en memoria.
    return await workbook.xlsx.writeBuffer();
}