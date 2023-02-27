const CSS_TEXT_FOR_TABLE_HEADER = "color:gold; font-size: 18px; font-family:montserrat, sans-serif";
const CSS_TEXT_FOR_TABLE_DATA = "color:white; font-size: 18px; font-family:montserrat, sans-serif";

function fill_table_title(subject) {
    let title = document.getElementById("table-title");
    title.innerHTML = `Plano de estudos de ${subject}`;
}

function put_week_row_in_table(table, week_number) {
    let week_data = document.createElement("tr");
    week_data.style.cssText = CSS_TEXT_FOR_TABLE_HEADER;
    week_data.innerHTML = `\t\t\t\t\t\t\t\t\tSemana ${week_number + 1}`;
    table.appendChild(week_data);
    table.appendChild(document.createElement("tr"));
}

function put_value_in_table_row(table_row, value) {
    let table_data = document.createElement("td");
    table_data.style.cssText = CSS_TEXT_FOR_TABLE_DATA;
    table_data.innerHTML = value;
    table_row.appendChild(table_data);
}

function save_study_plan_data(study_plan_data) {
    if(study_plan_data == undefined) {
        clear_study_plan();
        clear_inputs();
        return;
    }

    console.log(study_plan_data);
    let study_plan_table = document.getElementById("table-body");

    study_plan_data.forEach((classes, week) => {
        if(classes.length != 0) put_week_row_in_table(study_plan_table, week);
        classes.forEach((class_) => {
            let table_row = document.createElement("tr");
            table_row.appendChild(document.createElement("td"));
            put_value_in_table_row(table_row, class_.group); 
            put_value_in_table_row(table_row, class_.module); 
            put_value_in_table_row(table_row, class_.name); 
            put_value_in_table_row(table_row, class_.duration); 
            study_plan_table.appendChild(table_row);
        });
    });
}

function get_selected_subject() {
    if (document.getElementById("gridRadios1").checked) {
        return "Geografia";
    }
    if (document.getElementById("gridRadios2").checked) {
        return "História";
    } 
    if (document.getElementById("gridRadios3").checked) {
        return "Sociologia";
    } 
    if (document.getElementById("gridRadios4").checked) {
        return "Filosofia";
    }
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

function fill_table() {
    clear_study_plan();
    let subject = get_selected_subject();
    if(subject == undefined) {
        alert("Escolha uma disciplina.");
    }
    let number_of_weeks = get_number_of_weeks();
    let hours_per_week = get_number_of_hours_per_week();
    let study_plan_table = document.getElementById("table-body");
    if (!number_of_weeks || !hours_per_week || !subject) return;
    clear_study_plan();
    fill_table_title(subject);
    create_plan(subject, number_of_weeks, hours_per_week)
        .then(study_plan => save_study_plan_data(study_plan));
}

function clear_inputs() {
    document.getElementById("semanas").value = "";
    document.getElementById("horas").value = "";
}

function clear_study_plan() {
    let table_title = document.getElementById("table-title");
    table_title.innerHTML = "";

    let study_plan_table = document.getElementById("table-body");
    while (study_plan_table.childNodes.length > 1) {
        study_plan_table.removeChild(study_plan_table.lastElementChild);
    }
}

function clear_() {
    clear_study_plan(); 
    clear_inputs();
}





