class Group {
    constructor() {
        this.modules_map = new Map();
        this.modules_sorted_list = [];
    }

    add_class(class_) {
        let module = class_.module;
        if (!this.modules_map.has(module)) {
            this.modules_map.set(module, new Module());
        }
        this.modules_map.get(module).add_class(class_);
    }

    sort_classes_of_the_modules_by_relevance() {
        this.modules_map.forEach((module) => module.sort());
    }

    init_modules_sorted_list() {
        let values = [];
        this.modules_map.forEach((module, module_number) => values.push({number: module_number, value: module}));

        values.sort((module_a, module_b) => {
            let [a_number, b_number] = [module_a.number, module_b.number];
            if (a_number > b_number) return -1;
            if (a_number < b_number) return 1;
            return 0;
        });

        this.modules_sorted_list = values.map((module) => module.value);
    }


    is_concluded() {
        return this.modules_sorted_list.length == 0;
    }

    peek_weekly_classes(previewed_workload) {
        let weekly_classes = [];
        let last_index = this.modules_sorted_list.length - 1;

        if (this.modules_sorted_list[last_index].is_concluded()) {
            this.modules_sorted_list.pop();
            last_index--;
        }

        let current_workload = 0;
        while (true) {
            if (this.is_concluded()) return weekly_classes;
            let classes = this.modules_sorted_list[last_index].peek_weekly_classes(previewed_workload - current_workload);
            let previous_last_index = last_index;
            if (this.modules_sorted_list[last_index].is_concluded()) {
                    this.modules_sorted_list.pop();
                    last_index--;
            }
            if (classes.length == 0) {
                if (this.modules_sorted_list[last_index].is_concluded()) {
                    this.modules_sorted_list.pop();
                    last_index--;
                } 
                else break;
            }
            classes.forEach((class_) => {
                weekly_classes.push(class_);
                current_workload += get_hours_from_date_string(class_.duration);
            });
            if (classes.length == 1 && previous_last_index == last_index) break;
        }
        return weekly_classes;
    }
}