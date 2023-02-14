function doGet() {
    return HtmlService.createTemplateFromFile('Index').evaluate();
  }
  
  const GROUP_INDEX = 0;
  const MODULE_INDEX = 1;
  const CLASS_NAME_INDEX = 3;
  const DURATION_INDEX = 4;
  const RELEVANCE_INDEX = 5;
  const START_COLUMN_STUDY_PLAN = 2;
  const NUMBER_OF_COLUMNS = 6;
  
  function create_plan(subject, number_of_weeks, hours_per_week) {
    let planner_sheet = SpreadsheetApp.getActive().getSheetByName("Plano");
    let sheet;
    if(subject == "Geografia") sheet = SpreadsheetApp.getActive().getSheetByName("Geografia");
    if(subject == "História") sheet = SpreadsheetApp.getActive().getSheetByName("História");
    if(subject == "Filosofia") sheet = SpreadsheetApp.getActive().getSheetByName("Filosofia");
    if(subject == "Sociologia") sheet = SpreadsheetApp.getActive().getSheetByName("Sociologia");
  
    return generate_study_plan(sheet, number_of_weeks, hours_per_week);
  }
  
  function generate_study_plan(sheet, number_of_weeks, hours_per_week) {
    //clear_planner_sheet();
    let min_relevance = calculate_min_relevance(sheet, number_of_weeks, hours_per_week);
    let study_plan_data = get_study_plan_data(sheet, number_of_weeks, hours_per_week, min_relevance);
    format_all_dates_of_the_study_plan(study_plan_data);
    let study_plan_sheet = SpreadsheetApp.getActive().getSheetByName("Plano");
    save_study_plan_in_the_sheet(study_plan_sheet, sheet.getName(), study_plan_data, hours_per_week);
    return study_plan_data;
  }
  
  function save_study_plan_in_the_sheet(sheet, subject_name,study_plan_data, hours_per_week) {
    sheet.getRange("B6").setValue(`Disciplina ${subject_name} com ${format_hour_value(hours_per_week)} por semana.`);
    if(study_plan_data.length == 1) {
      sheet.getRange("B6").setValue(`Plano de ${1} semana.`);
    }
    else sheet.getRange("B7").setValue(`Plano de ${study_plan_data.length} semanas.`);
  
    sheet.getRange("B9").setValue("Frente");
    sheet.getRange("C9").setValue("Módulo");
    sheet.getRange("D9").setValue("Aula");
    sheet.getRange("E9").setValue("Tema");
    sheet.getRange("F9").setValue("Duração");
    sheet.getRange("G9").setValue("Relevância");
  
    format_all_dates_of_the_study_plan(study_plan_data);
  
    let current_line_of_the_sheet = 10;
    study_plan_data.forEach((classes, week) => {
        if(classes.length == 0) return;
        sheet.getRange(current_line_of_the_sheet, START_COLUMN_STUDY_PLAN, 1).setValue(`Semana ${week + 1}`);
        current_line_of_the_sheet++;
        sheet.getRange(current_line_of_the_sheet, START_COLUMN_STUDY_PLAN, classes.length, NUMBER_OF_COLUMNS).setValues(classes);
        current_line_of_the_sheet += classes.length + 1;
    });
  }
  
  
  function get_study_plan_data(sheet, number_of_weeks, hours_per_week, min_relevance) {
    let study_plan = []
    let groups = read_data_of_sheet(sheet, min_relevance);
  
    // It is hardcoded for the geography sheet
    let number_of_groups = 3;
    let hours_per_group = hours_per_week / 3;
  
    for(let i = 0; i < number_of_weeks; i++) {
      let weekly_classes = [];
      groups.forEach((group) => {
        if(group.is_concluded()) return;
        let classes = group.peek_weekly_classes(hours_per_group);
        classes.forEach((class_) => weekly_classes.push(class_));
      });
  
      study_plan.push(weekly_classes);
    }
  
    return study_plan;
  }
  
  
  function calculate_min_relevance(sheet, number_of_weeks, hours_per_week) {
    let hours_of_study = number_of_weeks * hours_per_week;
  
    if(hours_of_study > get_hours_of_study(sheet, 0)) return 0;
    if(hours_of_study > get_hours_of_study(sheet, 1)) return 1;
    if(hours_of_study > get_hours_of_study(sheet, 2)) return 2;
    if(hours_of_study > get_hours_of_study(sheet, 3)) return 3;
    if(hours_of_study > get_hours_of_study(sheet, 4)) return 4;
    if(hours_of_study > get_hours_of_study(sheet, 5)) return 5;
  
    // TODO -> Levantar quando chegar excecao aqui;
  }
  
  function read_data_of_sheet(sheet, min_relevance) {
    let groups = new Map();
    let number_of_rows = get_number_of_rows_of_a_sheet(sheet);
    let data_of_the_sheet = sheet.getRange(3, 1, number_of_rows, NUMBER_OF_COLUMNS).getValues();
  
    data_of_the_sheet.forEach((sheet_line) => {
      if(sheet_line[RELEVANCE_INDEX] < min_relevance || is_empty_line(sheet_line)) return;
      let group = sheet_line[GROUP_INDEX]; 
      if(!groups.has(group)) {
        groups.set(group, new Group());
      }
      groups.get(group).add_class(sheet_line);
    });
  
    groups.forEach((group) => {
      group.sort_classes_of_the_modules_by_relevance();
      group.init_modules_sorted_list();
    })
  
    return groups;
  }
  
  function call_generate_plan() {
    create_plan("Sociologia", 3, 1);
  }