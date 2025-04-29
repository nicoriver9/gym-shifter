// src/components/admin/TeacherPaymentReport.tsx
import { useEffect, useState } from "react";

const TeacherPaymentReport = () => {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        fetchTeacherReport();
    }, []);

    const fetchTeacherReport = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/teacher-report`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setReportData(processReportData(data));
        } catch (error) {
            console.error("Error fetching teacher report:", error);
        } finally {
            setLoading(false);
        }
    };

    const processReportData = (payments: any[]) => {
        return payments.flatMap((payment) => {
            // Filtrar solo reservas confirmadas
            const confirmedReservations = payment.user.reservations.filter(
                (res: any) => res.status === "confirmed"
            );

            // Calcular valor por clase (50% del valor unitario)
            const classValue = payment.pack.classes_included > 0 
                ? (payment.pack.price / payment.pack.classes_included) * 0.5
                : 0;

            return confirmedReservations.map((reservation: any) => ({
                paymentId: payment.id,
                paymentDate: payment.createdAt,
                userName: `${payment.user.firstName} ${payment.user.lastName}`,
                packName: payment.pack.name,
                packPrice: payment.pack.price,
                classDate: reservation.created_at,
                className: reservation.classSchedule.classType.name,
                teacherName: reservation.classSchedule.teacher.name,
                classValue,
                paid: false // Inicialmente marcado como no pagado
            }));
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleMarkAsPaid = (index: number) => {
        const newData = [...reportData];
        newData[index].paid = true;
        setReportData(newData);
        
        // Aquí podrías agregar una llamada API para persistir el cambio
    };

    if (loading) {
        return <div className="text-white text-center py-4">Cargando reporte...</div>;
    }

    // Calcular totales
    const totalPending = reportData
        .filter(item => !item.paid)
        .reduce((sum, item) => sum + item.classValue, 0);

    const totalPaid = reportData
        .filter(item => item.paid)
        .reduce((sum, item) => sum + item.classValue, 0);

    const totalGeneral = reportData
        .reduce((sum, item) => sum + item.classValue, 0);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-white mb-6">
                Reporte de Pagos a Profesores
            </h2>

            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Profesor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Clase
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Alumno
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Pack
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Fecha Clase
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Valor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {reportData.length > 0 ? (
                            reportData.map((item, index) => (
                                <tr key={`${item.paymentId}-${index}`} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {item.teacherName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {item.className}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {item.userName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {item.packName} (${item.packPrice})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white">
                                        {formatDate(item.classDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">
                                        ${item.classValue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {!item.paid && (
                                            <button
                                                onClick={() => handleMarkAsPaid(index)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Marcar como pagado
                                            </button>
                                        )}
                                        {item.paid && (
                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                Pagado
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                                    No hay datos de pagos a profesores
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {reportData.length > 0 && (
                <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Resumen</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-700 p-3 rounded">
                            <p className="text-gray-400">Total Pendiente</p>
                            <p className="text-xl font-bold text-yellow-400">
                                ${totalPending.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                            <p className="text-gray-400">Total Pagado</p>
                            <p className="text-xl font-bold text-green-400">
                                ${totalPaid.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                            <p className="text-gray-400">Total General</p>
                            <p className="text-xl font-bold text-white">
                                ${totalGeneral.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherPaymentReport;