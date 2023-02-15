let CSV_TEXT = undefined;

function is_valid_date(date) {
    return date instanceof Date && !isNaN(date);
}

function get_hours_from_date_string(date_string) {
    let date = new Date(date_string);

    if (is_valid_date(date)) {
        return Number.parseFloat(date.getHours().toString()) + (date.getMinutes() / 60) + (date.getSeconds() / 3600);
    }

    let [hours, minutes, seconds] = date_string.split(":");
    return Number.parseFloat(hours) + Number.parseFloat(minutes) / 60 + Number.parseFloat(seconds) / 3600;
}

function format_hour_value(value) {
    let hours = Math.trunc(value);
    let fractional_part = Number.parseInt(value.toString().split(".")[1]);
    let minutes = Math.trunc(fractional_part * 6 / 10);

    let formated_string;
    if (hours == 1) {
        formated_string = "1 hora e";
    } else formated_string = `${hours} horas e`;

    if (minutes == 1) {
        formated_string = formated_string.concat(formated_string, " 1 minuto");
    } else formated_string = formated_string.concat(formated_string, ` ${minutes} minutos`);
}

function format_date_string(date_string) {
    let date = new Date(date_string);
    if (is_valid_date(date)) {
        let [hours, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
        if (hours < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;
        return `${hours}:${minutes}:${seconds}`;
    }
    return date_string;
}

function format_all_dates_of_the_study_plan(study_plan) {
    study_plan.forEach((classes) => {
        classes.forEach((class_) => {
            class_.duration = format_date_string(class_.duration);
        });
    });
}

async function get_hours_of_study(csv_path, min_relevance) {
    await read_file(csv_path);
    let file_content = CSV_TEXT.split("\n");
    let total_hours = 0;

    file_content.forEach((line) => {
        let class_ = construct_class(line); 
        if (!is_class(class_) || class_[RELEVANCE_INDEX] < min_relevance) return;
        let duration =  get_hours_from_date_string(class_[DURATION_INDEX]);
        total_hours += duration;
    });

    return total_hours;
}

async function read_file(url) {
    if(CSV_TEXT !== undefined) return CSV_TEXT;
    const text = await fetch(url)
        .then(response => response.text());

    CSV_TEXT = text;
}
