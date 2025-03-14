import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Teacher {
  id: number;
  name: string;
}

interface ClassType {
  id: number;
  name: string;
}

interface AddClassModalProps {
  show: boolean;
  handleClose: () => void;
  onSave: (newClass: any) => void;
  classTypes: ClassType[]; // 🔥 Lista de tipos de clases disponibles
}

export default function AddClassModal({
  show,
  handleClose,
  onSave,
  classTypes,
}: AddClassModalProps) {
  const [classTypeId, setClassTypeId] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  /** 🔥 Obtener la lista de profesores */
  useEffect(() => {
    fetch("http://localhost:3000/teachers")
      .then((res) => res.json())
      .then((data) => setTeachers(data));
  }, []);

  /** 🔥 Manejar selección de días */
  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  /** 🔥 Guardar clases */
  const handleSubmit = () => {
    if (!classTypeId || selectedDays.length === 0 || !teacherId) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const newClasses = selectedDays.map((day) => ({
      class_type_id: classTypeId,
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
      teacher_id: teacherId,
    }));

    onSave(newClasses);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Clase</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* 🔥 Selector de Tipo de Clase */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Clase</Form.Label>
            <Form.Select
              value={classTypeId || ""}
              onChange={(e) => setClassTypeId(Number(e.target.value))}
            >
              <option value="">Selecciona un tipo de clase</option>
              {classTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* 🔥 Selector de Días */}
          <Form.Group className="mb-3">
            <Form.Label>Días de la Semana</Form.Label>
            <div className="d-flex flex-wrap">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                (day, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedDays.includes(index) ? "primary" : "outline-secondary"
                    }
                    className="m-1"
                    onClick={() => handleDayToggle(index)}
                  >
                    {day}
                  </Button>
                )
              )}
            </div>
          </Form.Group>

          {/* 🔥 Selector de Horarios */}
          <Form.Group className="mb-3">
            <Form.Label>Hora de Inicio</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora de Fin</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>

          {/* 🔥 Selector de Profesor */}
          <Form.Group className="mb-3">
            <Form.Label>Profesor</Form.Label>
            <Form.Select
              value={teacherId || ""}
              onChange={(e) => setTeacherId(Number(e.target.value))}
            >
              <option value="">Selecciona un profesor</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Clase
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
