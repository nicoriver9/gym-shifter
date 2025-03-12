import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { EditClassModalProps, Teacher } from "../../../interfaces/IEditClassModal";

export default function EditClassModal({
  show,
  handleClose,
  classData,
  onSave,
  confirmDeleteClass,
}: EditClassModalProps) {
  const [classId, setClassId] = useState(classData?.id || null);  
  const [classTypeId, setClassTypeId] = useState(classData?.class_type_id || "");
  const [startTime, setStartTime] = useState(classData?.start_time || "00:00");
  const [endTime, setEndTime] = useState(classData?.end_time || "00:00");
  const [teacherId, setTeacherId] = useState(classData?.teacher_id || null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classTypes, setClassTypes] = useState<Array<{ id: number, name: string }>>([]);

  // Cargar lista de profesores
  useEffect(() => {
    fetch(`http://localhost:3000/teachers/${classData?.teacher_id || ""}`)
      .then((res) => res.json())
      .then((data) => setTeachers(data));
  }, []);

  // Actualizar valores cuando cambia la clase seleccionada
  useEffect(() => {
    if (classData) {
      setClassId(classData.id);
      setClassTypeId(classData.class_type_id);
      setStartTime(classData.start_time);
      setEndTime(classData.end_time);
      setTeacherId(classData.teacher_id || null);
    }
  }, [classData]);

  // Cargar lista de tipos de clase
  useEffect(() => {
    fetch('http://localhost:3000/class-types')
      .then((res) => res.json())
      .then((data) => setClassTypes(data));
  }, []);

  const handleSubmit = () => {
    if (!onSave || !classData) return;
    onSave({
      ...classData,
      id: classId,
      class_type_id: classTypeId,
      start_time: startTime,
      end_time: endTime,
      teacher_id: teacherId,
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Clase</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Clase</Form.Label>            
            <Form.Select
              value={classTypeId}
              onChange={(e) => setClassTypeId(e.target.value)}
            >
              <option value="">Selecciona un tipo de clase</option>
              {classTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

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

          {/* <Form.Group className="mb-3">
            <Form.Label>Tipo de Clase</Form.Label>
            <Form.Select
              value={classTypeId}
              onChange={(e) => setClassTypeId(e.target.value)}
            >
              <option value="">Selecciona un tipo de clase</option>
              {classTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="danger" 
          onClick={() => confirmDeleteClass && classData && confirmDeleteClass(classData)}
        >
          Eliminar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
