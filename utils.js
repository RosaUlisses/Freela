function sort_weekly_classes(weekly_classes_list) {
  weekly_classes_list.sort((a, b) => {
    let [a_group, b_group] = [a[GROUP_INDEX], b[GROUP_INDEX]]; 
  })
}

function is_empty_line(line) {
  // If the name of the class is empty, certainly, this is a empty line.
  return line[CLASS_NAME_INDEX] == "";
}

function is_valid_date(date) {
  return date instanceof Date && !isNaN(date);
}

function get_hours_from_date_string(date_string) {
  let date = new Date(date_string);

  if(is_valid_date(date)) {
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
  if(hours == 1) {
    formated_string = "1 hora e";
  }
  else formated_string = `${hours} horas e`;

  if(minutes == 1) {
    formated_string = formated_string.concat(formated_string, " 1 minuto");
  }
  else formated_string = formated_string.concat(formated_string, ` ${minutes} minutos`);
}

function format_date_string(date_string) {
  let date = new Date(date_string);
  if(is_valid_date(date)){
    let [hours, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if(hours < 10) hours = `0${hours}`;
    if(minutes < 10) minutes = `0${minutes}`;
    if(seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  }
  return date_string;
}

function format_all_dates_of_the_study_plan(study_plan) {
  study_plan.forEach((classes) => {
    classes.forEach((class_) => {
      class_[DURATION_INDEX] = format_date_string(class_[DURATION_INDEX]);
    });
  });
}

function get_number_of_rows_of_a_sheet(sheet) {
  let number_of_rows = 0;
  while(true) {
    let [current_line, next_line] = sheet.getRange(number_of_rows + 1, 1, 2, NUMBER_OF_COLUMNS).getValues();
    if(current_line[GROUP_INDEX] == "" && next_line[GROUP_INDEX] == "") break;
    number_of_rows++;
  }
  return number_of_rows;
}

function clear_planner_sheet() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Plano');
  sheet.getRange(6, 1, 1000, 7).setValue("");
}

function get_hours_of_study(sheet, min_relevance) {
  let number_of_rows = get_number_of_rows_of_a_sheet(sheet);
  let data_of_the_sheet = sheet.getRange(3, 1, number_of_rows, NUMBER_OF_COLUMNS).getValues();

  let total_hours = 0;
  
  data_of_the_sheet.forEach((sheet_line) => {
    if(is_empty_line(sheet_line)) {
      return;
    }
    if(sheet_line[RELEVANCE_INDEX] > min_relevance) {
      total_hours += get_hours_from_date_string(sheet_line[DURATION_INDEX]);
    }
  });

  return total_hours;
}