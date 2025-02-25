import Company from "../company/company.model.js"
import User from "../user/user.model.js"

export const emailExists = async (email = "") => {
    const existe = await User.findOne({ email })
    if (existe) {
        throw new Error(`The email ${email} is already registered`)
    }
}

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({ username })
    if (existe) {
        throw new Error(`The username ${username} is already registered`)
    }
}

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if (!existe) {
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const companyExist = async (uid = " ") => {
    const existe = await Company.findById(uid)
    if (!existe) {
        throw new Error("No existe la empresa con el ID proporcionado")
    }
}

export const nameCompanyExists = async (name = "") => {
    const existe = await Company.findOne({ name })
    if (existe) {
        throw new Error(`The name ${name} is already registered`)
    }
}