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

function oi() {
    console.log("olaaaaaaaa")
}