// import {construct_class, is_class} from "./class_.js";
// import {Group} from "./group.js";
// import {read_file, get_hours_of_study} from "./utils.js";
// import {format_all_dates_of_the_study_plan} from "./utils.js";
const GROUP_INDEX = 0;
const MODULE_INDEX = 1;
const NUMBER_INDEX = 2;
const CLASS_NAME_INDEX = 3;
const DURATION_INDEX = 4;
const RELEVANCE_INDEX = 5;
const START_COLUMN_STUDY_PLAN = 2;
const NUMBER_OF_COLUMNS = 6;

async function create_plan(subject, number_of_weeks, hours_per_week) {
    let csv_path;
    if (subject === "Geografia") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Geografia.csv";
    if (subject === "História") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Historia.csv";
    if (subject === "Filosofia") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Sociologia.csv";
    if (subject === "Sociologia") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Filosofia.csv";

    return await generate_study_plan(csv_path, number_of_weeks, hours_per_week);
}

async function generate_study_plan(csv_path, number_of_weeks, hours_per_week) {
    let study_plan_data = await get_study_plan_data(csv_path, number_of_weeks, hours_per_week);
    format_all_dates_of_the_study_plan(study_plan_data);
    return study_plan_data;
}

async function get_study_plan_data(csv_path, number_of_weeks, hours_per_week) {
    let study_plan = []
    let min_relevance = await calculate_min_relevance(csv_path, number_of_weeks, hours_per_week);
    let groups = await read_data_of_csv_file(csv_path, min_relevance);

    let number_of_groups = groups.size;
    let hours_per_group = hours_per_week / number_of_groups;

    for (let i = 0; i < number_of_weeks; i++) {
        let weekly_classes = [];
        groups.forEach((group) => {
            if (group.is_concluded()) return;
            let classes = group.peek_weekly_classes(hours_per_group);
            classes.forEach((class_) => weekly_classes.push(class_));
        });

        study_plan.push(weekly_classes);
    }

    return study_plan;
}


async function calculate_min_relevance(sheet, number_of_weeks, hours_per_week) {
    let hours_of_study = number_of_weeks * hours_per_week;

    if (hours_of_study > await get_hours_of_study(sheet, 0)) return 0;
    if (hours_of_study > await get_hours_of_study(sheet, 1)) return 1;
    if (hours_of_study > await get_hours_of_study(sheet, 2)) return 2;
    if (hours_of_study > await get_hours_of_study(sheet, 3)) return 3;
    if (hours_of_study > await get_hours_of_study(sheet, 4)) return 4;
    if (hours_of_study > await get_hours_of_study(sheet, 5)) return 5;
}

async function read_data_of_csv_file(path, min_relevance) {
    await read_file(path);
    let file_content = CSV_TEXT.split("\n");
    let groups = new Map();
    let number_of_rows = file_content.length;

    file_content.forEach((line) => {
        let class_ = construct_class(line);
        if (!is_class(class_) || class_[RELEVANCE_INDEX] < min_relevance) return;
        let group = line[GROUP_INDEX];
        if (!groups.has(group)) {
            groups.set(group, new Group());
        }
        groups.get(group).add_class(class_);
    });

    groups.forEach((group) => {
        group.sort_classes_of_the_modules_by_relevance();
        group.init_modules_sorted_list();
    })

    return groups;
}