const CSS_TEXT_FOR_TABLE_HEADER = "color:gold; font-size: 18px; font-family:montserrat, sans-serif";
const CSS_TEXT_FOR_TABLE_DATA = "color:white; font-size: 18px; font-family:montserrat, sans-serif";

function clear_outputs() {
    document.getElementById("semanas").value = "";
    document.getElementById("horas").value = "";
}

function save_study_plan_data(study_plan_data) {
    let study_plan_table = document.getElementById("table");

    study_plan_data.forEach((classes, week) => {
        let week_data = document.createElement("tr");
        week_data.style.cssText = CSS_TEXT_FOR_TABLE_HEADER;
        week_data.innerHTML = `Semana ${week + 1}`;
        study_plan_table.appendChild(week_data);
        study_plan_table.appendChild(document.createElement("tr"));

        classes.forEach((class_) => {
            let table_row = document.createElement("tr");
            class_.forEach((value, index) => {
                if(index > 5) return;
                let table_data = document.createElement("td");
                table_data.style.cssText = CSS_TEXT_FOR_TABLE_DATA;
                table_data.innerHTML = value;
                table_row.appendChild(table_data);
            });
            study_plan_table.appendChild(table_row);
        });
    });
}

function get_selected_subject() {
    if (document.getElementById("gridRadios1").checked) return "Geografia";
    if (document.getElementById("gridRadios2").checked) return "História";
    if (document.getElementById("gridRadios1").checked) return "Filosofia";
    return "Sociologia";
}

function get_number_of_weeks() {
    let string_value = document.getElementById("semanas").value;
    let number = Number.parseInt(string_value);
    if (isNaN(number)) {
        alert("ERRO. O INPUT DE NÚMERO DE SEMANAS DEVE SER PREENCHIDO COM UM NÚMERO !!!!");
        document.getElementById("semanas").value = "";
    }
    if (number == 0) {
        alert("INPUT INVALIDO !!!!");
        document.getElementById("semanas").value = "";
    }
    return number;
}

function get_number_of_hours_per_week() {
    let string_value = document.getElementById("horas").value;
    let number = Number.parseFloat(string_value);
    if (isNaN(number)) {
        alert("ERRO. O INPUT DE NÚMERO DE HORAS DEVE SER PREENCHIDO COM UM NÚMERO !!!!");
        document.getElementById("horas").value = "";
    }
    if (number == 0) {
        alert("INPUT INVALIDO !!!!");
        document.getElementById("semanas").value = "";
    }
    return number;
}

async function fill_table() {
    let subject = get_selected_subject();
    let number_of_weeks = get_number_of_weeks();
    let hours_per_week = get_number_of_hours_per_week();
    let study_plan_table = document.getElementById("table");
    if (number_of_weeks == undefined || number_of_weeks == 0 || hours_per_week == undefined || hours_per_week == 0) return;
    let study_plan = await create_plan(subject, number_of_weeks, hours_per_week);
    save_study_plan_data(study_plan);
}

function clear_table() {
    let study_plan_table = document.getElementById("table");
    while (study_plan_table.childNodes.length > 2) {
        study_plan_table.removeChild(study_plan_table.lastElementChild);
    }
    clear_outputs();
}

