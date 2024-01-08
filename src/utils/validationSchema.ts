import * as yup from "yup" 
import { categories } from "./categories"

export const AudioValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing"),
    about: yup.string().required("About is missing"),
    category: yup.string().oneOf(categories, "Invalid category").required("Category is missing"),
})