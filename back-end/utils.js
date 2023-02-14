import { createRequire } from "module";
const require = createRequire(import.meta.url);
import {is_class} from "./class_.js";

export const GROUP_INDEX = 0;
export const MODULE_INDEX = 1;
export const NUMBER_INDEX = 2;
export const CLASS_NAME_INDEX = 3;
export const DURATION_INDEX = 4;
export const RELEVANCE_INDEX = 5;
export const START_COLUMN_STUDY_PLAN = 2;
export const NUMBER_OF_COLUMNS = 6;

export function sort_weekly_classes(weekly_classes_list) {
  weekly_classes_list.sort((a, b) => {
    let [a_group, b_group] = [a[GROUP_INDEX], b[GROUP_INDEX]]; 
  })
}

export function is_valid_date(date) {
  return date instanceof Date && !isNaN(date);
}

export function get_hours_from_date_string(date_string) {
  let date = new Date(date_string);

  if(is_valid_date(date)) {
      return Number.parseFloat(date.getHours().toString()) + (date.getMinutes() / 60) + (date.getSeconds() / 3600);
  }

  let [hours, minutes, seconds] = date_string.split(":");
  return Number.parseFloat(hours) + Number.parseFloat(minutes) / 60 + Number.parseFloat(seconds) / 3600;
}

export function format_hour_value(value) {
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

export function format_date_string(date_string) {
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

export function format_all_dates_of_the_study_plan(study_plan) {
  study_plan.forEach((classes) => {
    classes.forEach((class_) => {
      class_[DURATION_INDEX] = format_date_string(class_[DURATION_INDEX]);
    });
  });
}

export function get_hours_of_study(csv_path, min_relevance) {
  let file_content = read_file(csv_path).split("\n");

  let total_hours = 0;
  
  file_content.forEach((class_) => {
    if(!is_class(class_) || class_[RELEVANCE_INDEX] < min_relevance) return;
    total_hours += get_hours_from_date_string(class_[DURATION_INDEX]);
  });

  return total_hours;
}

export function read_file(path) {
  const fs = require("fs");
  return fs.readFileSync(path, "utf-8");
}
