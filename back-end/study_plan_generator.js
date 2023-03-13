async function create_plan(subject, number_of_weeks, hours_per_week) {
    let csv_path;
    if (subject === "Geografia") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Geografia.csv";
    if (subject === "História") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Historia.csv";
    if (subject === "Filosofia") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Filosofia.csv";
    if (subject === "Sociologia") csv_path = "https://raw.githubusercontent.com/RosaUlisses/Freela/main/back-end/Csvs/Sociologia.csv";

    return await generate_study_plan(csv_path, number_of_weeks, hours_per_week);
}

async function generate_study_plan(csv_path, number_of_weeks, hours_per_week) {
    let study_plan_data = await get_study_plan_data(csv_path, number_of_weeks, hours_per_week);
    if(study_plan_data == undefined) return undefined;
    format_all_dates_of_the_study_plan(study_plan_data);
    console.log(study_plan_data);
    return study_plan_data;
}

async function get_study_plan_data(csv_path, number_of_weeks, hours_per_week) {
    let study_plan = []
    CSV_TEXT = undefined;
    let min_relevance = await calculate_min_relevance(csv_path, number_of_weeks, hours_per_week);
    if(min_relevance == undefined) return undefined;
    let [regular_groups, revision_groups] = await read_data_of_csv_file(csv_path, min_relevance);

    let initial_number_of_groups = regular_groups.size;
    let initial_hours_per_group = hours_per_week / initial_number_of_groups;

    let number_of_groups = initial_number_of_groups;
    let hours_per_group = initial_hours_per_group;


    let i = 0;
    for (i; i < number_of_weeks; i++) {
        let weekly_classes = [];

        regular_groups.forEach((group, key) => {
            if(group.is_concluded()) {
                regular_groups.delete(key);
                number_of_groups--;
                hours_per_group = hours_per_week / number_of_groups;
            }
        });

        regular_groups.forEach((group) => {
            let classes = group.peek_weekly_classes(hours_per_group);
            classes.forEach((class_) => weekly_classes.push(class_));
        });

        if(weekly_classes.length == 0) break;
         
        weekly_classes.sort((a, b) => {
            if (a.group > b.group) return 1;
            if (a.group < b.group) return -1;
            if (a.module > b.module) return 1;
            if (a.module < b.module) return -1;
            if (a.relevance < b.relevance) return 1;
            if (a.relevance > b.relevance) return -1;
            return 0;
        });
        study_plan.push(weekly_classes);
    }

    number_of_groups = initial_number_of_groups;
    hours_per_group = initial_hours_per_group;

    for (i; i < number_of_weeks; i++) {
        let weekly_classes = [];

        revision_groups.forEach((group, key) => {
            if(group.is_concluded()) {
                regular_groups.delete(key);
                number_of_groups--;
                hours_per_group = hours_per_week / number_of_groups;
            }
        });

        revision_groups.forEach((group) => {
            let classes = group.peek_weekly_classes(hours_per_group);
            classes.forEach((class_) => weekly_classes.push(class_));
        });

        weekly_classes.sort((a, b) => {
            if(a.group > b.group) return 1;
            if(a.group < b.group) return -1;
            if (a.relevance > b.relevance) return 1;
            if (a.relevance < b.relevance) return -1;
            if (a.number < b.number) return 1;
            if (a.number > b.number) return -1;
            return 0;
        });
        study_plan.push(weekly_classes);
    }

    return study_plan;
}


async function calculate_min_relevance(sheet, number_of_weeks, hours_per_week) {
    let hours_of_study = number_of_weeks * hours_per_week;

    let total = await get_hours_of_study(sheet, 0);
    if (hours_of_study > total) return 0;

    total = await get_hours_of_study(sheet, 1);
    if (hours_of_study > total) return 1;

    total = await get_hours_of_study(sheet, 2);
    if (hours_of_study > total) return 2;

    total = await get_hours_of_study(sheet, 3);
    if (hours_of_study > total) return 3;

    total = await get_hours_of_study(sheet, 4);
    if (hours_of_study > total) return 4;

    total = await get_hours_of_study(sheet, 5);
    if (hours_of_study > total) return 5;

    alert("INPUTS INVÁLIDOS, INSIRA MAIS HORAS DE ESTUDO OU MAIS SEMANAS !!!");
}

async function read_data_of_csv_file(path, min_relevance) {
    await read_file(path);
    let file_content = CSV_TEXT.split("\n");
    let regular_groups = new Map();
    let revision_groups = new Map();

    file_content.forEach((line) => {
        line = construct_class(line); 
        if (!is_class(line)) return;
        if (line[RELEVANCE_INDEX] < min_relevance) {
            let class_ = new Class(line[GROUP_INDEX], line[MODULE_INDEX], 
                line[NUMBER_INDEX], line[CLASS_NAME_INDEX], line[DURATION_INDEX], line[RELEVANCE_INDEX]);
            let group = class_.group;
            if (!revision_groups.has(group)) {
                revision_groups.set(group, new Group());
            }
            revision_groups.get(group).add_class(class_);
            return;
        } 

        let class_ = new Class(line[GROUP_INDEX], line[MODULE_INDEX], 
            line[NUMBER_INDEX], line[CLASS_NAME_INDEX], line[DURATION_INDEX], line[RELEVANCE_INDEX]);
        let group = class_.group;
        if (!regular_groups.has(group)) {
            regular_groups.set(group, new Group());
        }
        regular_groups.get(group).add_class(class_);
    });

    regular_groups.forEach((group) => {
        group.sort_classes_of_the_modules_by_relevance();
        group.init_modules_sorted_list();
    });

    revision_groups.forEach((group) => {
        group.sort_classes_of_the_modules_by_relevance();
        group.init_modules_sorted_list();
    });

    return [regular_groups, revision_groups];
}