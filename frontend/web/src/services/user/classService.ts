const API_URL = "http://localhost:3000/classes";

export const getAllClasses = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createClass = async (classData: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  });
  return response.json();
};

export const updateClass = async (id: number, classData: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  });
  return response.json();
};

export const deleteClass = async (id: number) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
