export const GROUP_INDEX = 0;
export const MODULE_INDEX = 1;
export const NUMBER_INDEX = 2;
export const CLASS_NAME_INDEX = 3;
export const DURATION_INDEX = 4;
export const RELEVANCE_INDEX = 5;
export const START_COLUMN_STUDY_PLAN = 2;
export const NUMBER_OF_COLUMNS = 6;

export function construct_class(string) {
    let values = string.split(",");
    values[NUMBER_INDEX] = Number.parseInt(values[NUMBER_INDEX]);
    values[MODULE_INDEX] = Number.parseInt(values[MODULE_INDEX]);
    values[RELEVANCE_INDEX] = Number.parseInt(values[RELEVANCE_INDEX]);
    return values;
}

export function is_class(class_) {
    if(class_.includes(NaN)) return false;
    if(class_[GROUP_INDEX] == "Frente") return false;
    return true;
}