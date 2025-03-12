export interface ClassEvent {
    id: number;
    class_name: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    teacher_id?: number;
  }