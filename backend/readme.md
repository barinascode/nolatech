# API de Evaluación de Desempeño

Esta API está construida con Node.js y Express.js, y proporciona funcionalidades para gestionar evaluaciones de desempeño de empleados, incluyendo autenticación, manejo de usuarios, evaluaciones, feedback y reportes.

## Funcionalidades Principales

* **Autenticación y Autorización:** La API implementa autenticación basada en JWT y un sistema de roles para controlar el acceso a los recursos.
* **Gestión de Empleados:** Permite obtener una lista de empleados.
* **Gestión de Evaluaciones:** Permite crear, obtener, actualizar y obtener evaluaciones por empleado.
* **Feedback de Evaluación:** Permite enviar feedback para una evaluación.
* **Reportes de Evaluación:** Permite generar reportes de evaluación para un empleado.
* **Manejo de Errores y Validación:** La API incluye middleware para manejar errores y validar los datos de entrada.

## Endpoints de la API

La siguiente tabla describe los endpoints de la API:

| Ruta                               | Verbo   | Descripción                                                                 | Roles Requeridos       |
| :--------------------------------- | :------ | :-------------------------------------------------------------------------- | :--------------------- |
| `/api/auth/register`               | POST    | Registra un nuevo usuario.                                                   | Ninguno                |
| `/api/auth/login`                  | POST    | Inicia sesión de un usuario y devuelve un JWT.                               | Ninguno                |
| `/api/employees`                   | GET     | Obtiene una lista de todos los empleados.                                    | Admin, Manager         |
| `/api/evaluations`                   | POST    | Crea una nueva evaluación.                                                    | Admin, Manager, Employee         |
| `/api/evaluations/:id`             | GET     | Obtiene los detalles de una evaluación específica.                            | Admin, Manager, Employee         |
| `/api/evaluations/:id`             | PUT     | Actualiza una evaluación existente.                                          | Admin, Manager         |
| `/api/evaluations/employee/:id`    | GET     | Obtiene todas las evaluaciones de un empleado específico.                       | Admin, Manager, Employee         |
| `/api/feedback`                      | POST    | Envía feedback para una evaluación.                                           | Admin, Manager, Employee         |
| `/api/reports/employee/:id`        | GET     | Genera un reporte de evaluación para un empleado específico.                    | Admin, Manager         |

## Autenticación y Autorización

* **Autenticación:** La API utiliza JSON Web Tokens (JWT) para la autenticación. Cuando un usuario inicia sesión, se le asigna un JWT que debe incluirse en el encabezado de autorización de las solicitudes posteriores.
* **Autorización:** La API implementa un sistema de roles con tres roles:
    * **Admin:** Tiene acceso a todas las funcionalidades.
    * **Manager:** Tiene acceso a la mayoría de las funcionalidades, incluyendo la gestión de evaluaciones y empleados.
    * **Employee:** Tiene acceso a ver sus propias evaluaciones y dar feedback.
* **Manejo de Roles:** El rol del usuario se incluye en el JWT y se utiliza en el middleware de autorización para determinar si el usuario tiene permiso para acceder a una ruta específica.

## Manejo de Errores

La API incluye un middleware de manejo de errores que captura los errores que ocurren durante el procesamiento de una solicitud y devuelve una respuesta JSON con un código de estado HTTP apropiado y un mensaje de error descriptivo.

## Validación de Datos

La API utiliza middleware para validar los datos de entrada de las solicitudes. Esto asegura que los datos recibidos por la API cumplan con los requisitos esperados y ayuda a prevenir errores y problemas de seguridad.

## Modelos de Datos

La API utiliza los siguientes modelos de datos:

* **Usuario:** Representa a un usuario del sistema (nombre, email, contraseña, rol).
* **Empleado:** Representa a un empleado de la organización (nombre, apellido, departamento, etc.).
* **Evaluación:** Representa una evaluación de desempeño de un empleado (empleadoId, evaluadorId, fecha, resultados, etc.).
* **Feedback:** Representa el feedback proporcionado para una evaluación (evaluacionId, usuarioId, comentarios, fecha).

## Lógica para Calcular Resultados de Evaluaciones

La API implementa lógica para calcular los resultados de las evaluaciones, que puede incluir el cálculo de promedios, ponderaciones y otras métricas. Esta lógica se encuentra en los servicios o en los modelos, dependiendo de la arquitectura del proyecto.
