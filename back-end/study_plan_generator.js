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
    console.log(study_plan_data);
    return study_plan_data;
}

async function get_study_plan_data(csv_path, number_of_weeks, hours_per_week) {
    let study_plan = []
    CSV_TEXT = undefined;
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

    console.log(study_plan);

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

    file_content.forEach((line) => {
        line = construct_class(line); 
        if (!is_class(line) || line[RELEVANCE_INDEX] < min_relevance) return;
        let class_ = new Class(line[GROUP_INDEX], line[MODULE_INDEX], 
            line[NUMBER_INDEX], line[CLASS_NAME_INDEX], line[DURATION_INDEX], line[RELEVANCE_INDEX]);
        let group = class_.group;
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