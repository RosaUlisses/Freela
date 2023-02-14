
import {read_data_of_csv_file, generate_study_plan} from "./back-end/study_plan_generator.js"

read_data_of_csv_file("C:\\Programação\\Freela\\back-end\\Csvs\\Filosofia.csv", 0);
let sp = generate_study_plan("C:\\Programação\\Freela\\back-end\\Csvs\\Filosofia.csv", 10, 1);
console.log("vampiro");