import {get_hours_from_date_string} from "./utils.js";

export const GROUP_INDEX = 0;
export const MODULE_INDEX = 1;
export const NUMBER_INDEX = 2;
export const CLASS_NAME_INDEX = 3;
export const DURATION_INDEX = 4;
export const RELEVANCE_INDEX = 5;
export const START_COLUMN_STUDY_PLAN = 2;
export const NUMBER_OF_COLUMNS = 6;

export class Module {
    constructor() {
      this.classes = [];
    }
  
    add_class(class_) {
      this.classes.push(class_);
    }
  
    peek_weekly_classes(workload) {
      if(workload <= 0) return [];
      let weekly_classes = [];
      let hours_of_study = 0.0;
      let last_index = this.classes.length - 1;
      while(true) {
        if(this.classes.length == 0) return weekly_classes;
        let duration_in_hours = get_hours_from_date_string(this.classes[last_index][DURATION_INDEX]);
  
        hours_of_study += duration_in_hours;
  
        if(hours_of_study > workload && weekly_classes.length > 0){
          return weekly_classes;
        } 
  
        weekly_classes.push(this.classes[last_index]);
        this.classes.pop()
        last_index--;
      }
    }
  
    is_concluded() {
      return this.classes.length == 0;
    }
  
    sort() {
      this.classes.sort((a, b) => {
        let [a_relevance, b_relevance] = [a[RELEVANCE_INDEX], b[RELEVANCE_INDEX]];
        if(a_relevance > b_relevance) return 1;
        if(a_relevance < b_relevance) return -1;

        let [a_number, b_number] = [a[NUMBER_INDEX, b[NUMBER_INDEX]]];
        if(a_number < b_number) return 1;
        if(a_number > b_number) return -1;

        return 0;
      });
    }
  }