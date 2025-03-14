import { useEffect, useState } from "react";
import { getAllClasses, deleteClass } from "../services/classService";
import { Button, Table } from "react-bootstrap";

interface Class {
  id: number;
  class_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  teacher_id?: number;
}

export default function ClassTable({ onEdit }: { onEdit: (classData: Class) => void }) {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const data = await getAllClasses();
    setClasses(data);
  };

  const handleDelete = async (id: number) => {
    await deleteClass(id);
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Clase</th>
          <th>Día</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((clase) => (
          <tr key={clase.id}>
            <td>{clase.class_name}</td>
            <td>{["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][clase.day_of_week]}</td>
            <td>{clase.start_time}</td>
            <td>{clase.end_time}</td>
            <td>
              <Button variant="warning" onClick={() => onEdit(clase)}>Editar</Button>
              <Button variant="danger" className="ms-2" onClick={() => handleDelete(clase.id)}>Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
