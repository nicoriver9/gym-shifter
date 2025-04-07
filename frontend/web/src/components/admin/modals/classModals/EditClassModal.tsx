import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { EditClassModalProps, Teacher } from "../../../../interfaces/admin/IEditClassModal";

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
    const fetchTeachers = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No hay token de acceso');
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/teachers/${classData?.teacher_id || ""}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener los profesores');
        }
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      }
    };

    fetchTeachers();
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
    const fetchClassTypes = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No hay token de acceso');
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/class-types`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener los tipos de clase');
        }
        const data = await response.json();
        setClassTypes(data);
      } catch (error) {
        console.error('Error al obtener los tipos de clase:', error);
      }
    };

    fetchClassTypes();
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
