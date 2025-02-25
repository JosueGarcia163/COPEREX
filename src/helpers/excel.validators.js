import ExcelJS from "exceljs"


export const generateExcel = async (companies) => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Empresas");

    //Programamos como se vera dentro del documento excel.
    worksheet.columns = [

        { header: "Nombre", key: "name", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Teléfono", key: "phone", width: 15 },
        { header: "Nivel de Impacto", key: "levelImpact", width: 20 },
        { header: "Años de Experiencia", key: "yearsOfExperience", width: 20 },
        { header: "Categoría", key: "category", width: 20 },
        { header: "Estado", key: "status", width: 10 }
    
    ];
     
        companies.forEach(company => {
            worksheet.addRow({
                name: company.name,
                email: company.email,
                phone: company.phone,
                levelImpact: company.levelImpact,
                yearOfExperience: company.yearOfExperience,
                category: company.category,
                status: company.status ? "Activo" : "Inactivo"
            });
        });

        // Se convierte el archivo a un buffer para poder enviarlo como respuesta.
        return await workbook.xlsx.writeBuffer();
}