class Module {
    constructor() {
        this.classes = [];
    }

    add_class(class_) {
        this.classes.push(class_);
    }

    peek_weekly_classes(workload) {
        if (workload <= 0) return [];
        let weekly_classes = [];
        let hours_of_study = 0.0;
        let last_index = this.classes.length - 1;
        while (true) {
            if (this.classes.length == 0) return weekly_classes;
            let duration_in_hours = get_hours_from_date_string(this.classes[last_index].duration);

            hours_of_study += duration_in_hours;

            if (hours_of_study > workload && weekly_classes.length > 0) {
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
            if (a.relevance > b.relevance) return 1;
            if (a.relevance < b.relevance) return -1;
            if (a.number < b.number) return 1;
            if (a.number > b.number) return -1;
            return 0;
        });
    }
}