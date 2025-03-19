export interface Reservation {
    id: number;
    user: {
      id: number;
      firstName: string;
      lastName: string;
    };
    classSchedule: {
      id: number;
      classType: {
        name: string;
      };
      day_of_week: string;
      start_time: string;
      end_time: string;
      teacherName: string;
    };
    status: string;
  }