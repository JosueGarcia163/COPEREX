import { Schema, model } from "mongoose";

const companySchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    levelImpact: {
        type: String,
        enum: ["Alto", "Medio", "Bajo"],
        required: true
    },
    yearsOfExperience: {
        type: Number,
        default: 0,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    yearOfFoundation: {
        type: Number,
        required: true
    }
},
    {
        versionKey: false,
        timestamps: true
    })

companySchema.pre("save", function (next) {
    const currentYear = new Date().getFullYear();
    if (this.yearOfFoundation) {
        this.yearsOfExperience = currentYear - this.yearOfFoundation;
    }
    next();
});
/*
//Se ejecuta si se utiliza find o findOne y el resultado de la consulta se guarda en docs
const updateYearsOfExperience = function (docs) {
    //const currentYear = new Date().getFullYear();
    const currentYear = 2026
    if (Array.isArray(docs)) {
        docs.forEach(doc => {
            if (doc.yearOfFoundation) {
                doc.yearsOfExperience = currentYear - doc.yearOfFoundation;
            }
        });
    } else if (docs && docs.yearOfFoundation) {
        docs.yearsOfExperience = currentYear - docs.yearOfFoundation;
    }
};

companySchema.post("find", function (docs) {
    updateYearsOfExperience(docs);
});

companySchema.post("findOne", function (doc) {
    updateYearsOfExperience(doc);
});
*/


export default model("Company", companySchema)