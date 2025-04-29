export interface ClassEvent {
    id: number;
    title: string;
    class_type_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    teacher_id?: number;
  }
  
  export interface Teacher {
    id: number;
    name: string;
  }
  
  export interface EditClassModalProps {
    show: boolean;
    handleClose: () => void;
    classData: ClassEvent | null;
    onSave?: (updatedClass: any) => void;
    confirmDeleteClass?: (classData: ClassEvent) => void;
  }