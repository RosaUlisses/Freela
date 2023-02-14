const GROUP_INDEX = 0;
const MODULE_INDEX = 1;
const NUMBER_INDEX = 2;
const CLASS_NAME_INDEX = 3;
const DURATION_INDEX = 4;
const RELEVANCE_INDEX = 5;
const START_COLUMN_STUDY_PLAN = 2;
const NUMBER_OF_COLUMNS = 6;

class Class {
    constructor(group, module, number, name, duration, relevance){
        this.group = group;
        this.module = Number.parseInt(module);
        this.number = Number.parseInt(number);
        this.name = name;
        this.duration = duration;
        this.relevance = Number.parseInt(relevance);
    }

    is_valid() {
        return (
            (this.group !== "Frente" && this.group !== NaN && this.group !== undefined) &&
            (this.module !== NaN && this.module !== undefined) &&
            (this.number !== NaN && this.number !== undefined) &&
            (this.name !== NaN && this.name !== undefined) &&
            (this.duration !== NaN && this.duration !== undefined) &&
            (this.relevance !== NaN && this.relevance !== undefined)
        );
    }
}

function construct_class(string) {
    let values = string.split(",");
    values[NUMBER_INDEX] = Number.parseInt(values[NUMBER_INDEX]);
    values[MODULE_INDEX] = Number.parseInt(values[MODULE_INDEX]);
    values[RELEVANCE_INDEX] = Number.parseInt(values[RELEVANCE_INDEX]);

    return values;
}

function is_class(class_) {
    if (class_.includes(NaN)) return false;
    if (class_[GROUP_INDEX] == "Frente") return false;
    return true;
}

